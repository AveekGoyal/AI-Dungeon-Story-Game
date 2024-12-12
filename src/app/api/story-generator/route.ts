import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import OpenAI from 'openai';
import { StoryResponse } from '@/types/story';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const STORY_PROMPT = `You are a fantasy story generator. Generate the story content following these exact formatting rules:

1. Required Section Markers (use in exact order):
   ###TITLE### (Story title, only for Chapter 1, Page 1)
   ###CHAPTER### (Chapter title)
   ###NARRATIVE### (Story content)
   ###CHOICES### (Available choices)

2. Content Requirements:
   TITLE (only for first page):
   - Epic fantasy story title
   - Single line
   - No quotes or special characters

   CHAPTER:
   - Single line containing chapter number (1-5) and name
   - Format: "Chapter X: [Chapter Name]"

   NARRATIVE:
   - Exactly 5 paragraphs
   - Each paragraph 3-4 lines long
   - Rich descriptive fantasy content
   - Maintain consistent narrative voice
   - Include character dialogue within paragraphs
   - Format: Clear paragraph breaks with \n\n between paragraphs

   CHOICES:
   - Exactly 4 choices in JSON array format
   - Each choice should be meaningful and affect the story
   - No game mechanics (HP/MP)
   - Format: ["choice1", "choice2", "choice3", "choice4"]

3. Story Context Requirements:
   - Total 5 chapters
   - 5 pages per chapter
   - Maintain story continuity
   - Adapt to previous choices
   - Build coherent narrative arcs`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chapterNumber, pageNumber, previousChoice } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: STORY_PROMPT
        },
        {
          role: "user",
          content: `Generate a story page with:
          Chapter: ${chapterNumber || 1}
          Page: ${pageNumber || 1}
          ${previousChoice ? `Previous Choice: ${previousChoice}` : 'Start a new story'}`
        }
      ],
      stream: true,
      temperature: 0.8,
      max_tokens: 1000,
    });

    // Create a stream with controlled chunk sizes and delays
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let buffer = '';
        const CHUNK_SIZE = 3; // Send 3 characters at a time
        const DELAY_MS = 30; // 30ms delay between chunks

        try {
          for await (const chunk of response) {
            if (chunk.choices[0]?.delta?.content) {
              const text = chunk.choices[0].delta.content;
              buffer += text;
              
              // Process buffer in chunks
              while (buffer.length >= CHUNK_SIZE) {
                const chunk = buffer.slice(0, CHUNK_SIZE);
                buffer = buffer.slice(CHUNK_SIZE);
                controller.enqueue(encoder.encode(chunk));
                // Add delay after section markers for dramatic effect
                if (chunk.includes('###')) {
                  await new Promise(resolve => setTimeout(resolve, 200));
                } else {
                  await new Promise(resolve => setTimeout(resolve, DELAY_MS));
                }
              }
            }
          }
          
          // Send any remaining buffer content
          if (buffer.length > 0) {
            controller.enqueue(encoder.encode(buffer));
          }
          
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}