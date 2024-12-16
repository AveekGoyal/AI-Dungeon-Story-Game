import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { genre, character } = await req.json();

    const prompt = `You are a creative story writer. Create a story title and description for a fantasy RPG story.
Genre: ${genre.name} - ${genre.description}
Character: ${character.name} (${character.class})

IMPORTANT: Respond with ONLY raw JSON. Do not include markdown formatting, code blocks, or any other text.
The response must be a valid JSON object with exactly these fields:
{
  "title": "The story title",
  "description": "A compelling 2-3 sentence description of the story"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are a creative story writer. Always respond with valid JSON only, no markdown or explanations.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Clean the content - remove any markdown or code block indicators
    const cleanContent = content
      .replace(/^```json\s*/, '')  // Remove opening ```json
      .replace(/^```\s*/, '')      // Remove opening ```
      .replace(/\s*```$/, '')      // Remove closing ```
      .trim();
    
    try {
      const parsedContent = JSON.parse(cleanContent);
      
      // Validate the required fields
      if (!parsedContent.title || !parsedContent.description) {
        throw new Error('Missing required fields in response');
      }
      
      return NextResponse.json(parsedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', cleanContent);
      throw new Error('Invalid JSON response from OpenAI');
    }
  } catch (error) {
    console.error('Story initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize story' },
      { status: 500 }
    );
  }
}
