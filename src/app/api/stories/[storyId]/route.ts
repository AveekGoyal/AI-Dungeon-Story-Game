import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';
import { openai } from '@/lib/openai';

// GET /api/stories/[storyId] - Get a specific story
export async function GET(
  req: Request,
  { params }: { params: { storyId: string } }
) {
  try {
    console.log('GET /api/stories/[storyId] - Fetching story:', params.storyId);

    const session = await getServerSession(authOptions);
    console.log('Session user:', session?.user?.email);

    if (!session?.user) {
      console.log('Unauthorized - No session user');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const story = await db.collection('stories').findOne({
      _id: new ObjectId(params.storyId),
      userId: session.user.email
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/stories/[storyId] - Update a story's content
export async function PUT(
  req: Request,
  { params }: { params: { storyId: string } }
) {
  try {
    console.log('PUT /api/stories/[storyId] - Starting story update');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('PUT /api/stories/[storyId] - Unauthorized: No session user');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { action, currentState } = await req.json();
    console.log('PUT /api/stories/[storyId] - Request data:', { action, currentState });

    const client = await clientPromise;
    const db = client.db();

    // Fetch the story
    const story = await db.collection('stories').findOne({
      _id: new ObjectId(params.storyId),
      userId: session.user.email
    });

    if (!story) {
      console.log('PUT /api/stories/[storyId] - Story not found');
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    console.log('PUT /api/stories/[storyId] - Story found:', {
      id: story._id,
      title: story.title
    });

    let updatesToApply: any = {};
    let generatedContent = null;

    // If we need to generate new content
    if (action === 'generate') {
      const context = {
        title: story.title,
        genre: story.genre,
        character: story.character,
        currentChapter: currentState.currentChapter,
        currentPage: currentState.currentPage,
        previousChoice: currentState.previousChoice
      };

      console.log('PUT /api/stories/[storyId] - Generating story with context:', context);

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a creative storyteller crafting an interactive story. 
              The story should be engaging and allow for meaningful choices.
              
              Format your response in JSON with these sections:
              {
                "chapter": "Chapter title",
                "narrative": ["paragraph1", "paragraph2", ...],
                "choices": ["choice1", "choice2", "choice3", "choice4"]
              }`
            },
            {
              role: "user",
              content: JSON.stringify(context)
            }
          ],
          temperature: 1,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        });

        console.log('PUT /api/stories/[storyId] - OpenAI response:', {
          usage: completion.usage,
          model: completion.model
        });

        if (!completion.choices[0]?.message?.content) {
          console.log('PUT /api/stories/[storyId] - No content generated from OpenAI');
          return NextResponse.json(
            { error: 'Failed to generate story content' },
            { status: 500 }
          );
        }

        generatedContent = JSON.parse(completion.choices[0].message.content);
      } catch (openaiError) {
        console.error('PUT /api/stories/[storyId] - OpenAI API error:', openaiError);
        return NextResponse.json(
          { error: 'Failed to generate story content' },
          { status: 500 }
        );
      }

      // Update the story content in the database
      updatesToApply = {
        [`chapters.${currentState.currentChapter}.pages.${currentState.currentPage}`]: {
          content: generatedContent,
          choices: generatedContent.choices,
          timestamp: new Date()
        },
        lastUpdated: new Date()
      };
    }

    console.log('PUT /api/stories/[storyId] - Applying updates:', updatesToApply);

    // Apply the updates
    const result = await db.collection('stories').updateOne(
      {
        _id: new ObjectId(params.storyId),
        userId: session.user.email
      },
      {
        $set: updatesToApply
      }
    );

    if (!result.modifiedCount) {
      console.log('PUT /api/stories/[storyId] - Failed to update story in database');
      return NextResponse.json(
        { error: 'Failed to update story' },
        { status: 500 }
      );
    }

    console.log('PUT /api/stories/[storyId] - Story updated successfully');
    return NextResponse.json({
      success: true,
      content: generatedContent
    });

  } catch (error) {
    console.error('PUT /api/stories/[storyId] - Unhandled error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/stories/[storyId] - Delete a specific story
export async function DELETE(
  req: Request,
  { params }: { params: { storyId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('stories').deleteOne({
      _id: new ObjectId(params.storyId),
      userId: session.user.email
    });

    if (!result.deletedCount) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
