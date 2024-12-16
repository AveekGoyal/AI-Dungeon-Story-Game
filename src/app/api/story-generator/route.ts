import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import OpenAI from 'openai';
import { StoryResponse } from '@/types/story';
import { StoryContext } from '@/types/story-context';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateStoryPrompt = (
  currentChapter: number,
  currentPage: number,
  context: StoryContext | null,
  previousChoice: string | null
) => {
  let prompt = `You are a fantasy story generator. Generate the story content following these exact formatting rules:

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
   - Format: "Chapter [Number]: [Epic Chapter Name]."
   - Example: "Chapter 1: The Dark Forest Awakens."
   - IMPORTANT: Always end chapter title with a period
   - Make chapter names epic and memorable (at least 3-4 words)
   - Must include both number and descriptive name
   - Keep chapter name consistent within same chapter

   NARRATIVE:
   - Exactly 5 paragraphs
   - Each paragraph 3-4 lines long
   - Rich descriptive fantasy content
   - Maintain consistent narrative voice
   - Include character dialogue within paragraphs
   - Format: Clear paragraph breaks with \\n\\n between paragraphs

   CHOICES:
   - Exactly 4 choices in JSON array format
   - Each choice should be meaningful and affect the story
   - Format: ["choice1", "choice2", "choice3", "choice4"]`;

  // Add story context if available
  if (context) {
    prompt += `\n\n3. Story Context:
   CHAPTER CONTEXT:
   - Current Chapter: ${context.currentChapterContext.chapterNumber}
   - Chapter Theme: ${context.currentChapterContext.theme}
   - Key Events: ${context.currentChapterContext.keyEvents.join(', ')}
   - Chapter Summary: ${context.currentChapterContext.summary}

   NARRATIVE CONTEXT:
   - Main Plot Points: ${context.narrativeContext.mainPlotPoints.join(', ')}
   - Character Development: ${context.narrativeContext.characterDevelopment.join(', ')}
   - Current Theme: ${context.narrativeContext.currentTheme}

   PREVIOUS CHOICES:
   ${context.previousChoices
     .slice(-3) // Only use last 3 choices for context
     .map(choice => `- Chapter ${choice.chapterNumber}, Page ${choice.pageNumber}: ${choice.choiceText}`)
     .join('\n   ')}`;
  }

  // Add previous choice if available
  if (previousChoice) {
    prompt += `\n\nPrevious Choice: "${previousChoice}"
   IMPORTANT: Continue the story based on this choice.`;
  }

  return prompt;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentChapter, currentPage, context, previousChoice } = await req.json();

    const prompt = generateStoryPrompt(currentChapter, currentPage, context, previousChoice);

    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a creative story writer.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true
    });

    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      }
    });

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}