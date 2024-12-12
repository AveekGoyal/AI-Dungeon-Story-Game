import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';
import { openai } from '@/lib/openai';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log('GET /api/stories/[id] - Fetching story:', params.id)
    
    const session = await getServerSession(authOptions);
    console.log('Session user:', session?.user?.email)
    
    if (!session?.user) {
      console.log('Unauthorized - No session user')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    console.log('Looking up story with:', {
      _id: params.id,
      userId: session.user.id
    })

    const story = await db.collection('stories').findOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(session.user.id)
    });

    if (!story) {
      console.log('Story not found')
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    console.log('Story found:', {
      id: story._id.toString(),
      title: story.title
    })

    // Format story with all necessary details for the story page
    const formattedStory = {
      id: story._id.toString(),
      title: story.title,
      description: story.description,
      genre: story.genre,
      character: {
        name: story.character?.name,
        class: story.character?.class,
        stats: story.character?.stats || {},
        inventory: story.character?.inventory || [],
        status: story.character?.status || 'active',
        experience: story.character?.experience || 0,
        level: story.character?.level || 1
      },
      progress: {
        currentChapter: story.currentChapter || 1,
        totalChapters: story.totalChapters || 1,
        percentage: Math.round(((story.currentChapter || 1) / (story.totalChapters || 1)) * 100)
      },
      gameState: {
        currentLocation: story.gameState?.currentLocation || 'start',
        availableChoices: story.gameState?.availableChoices || [],
        lastChoice: story.gameState?.lastChoice || null,
        questStatus: story.gameState?.questStatus || {},
        currentScene: story.gameState?.currentScene || {},
        inventory: story.gameState?.inventory || [],
        achievements: story.gameState?.achievements || []
      },
      navigationHistory: story.navigationHistory || [],
      choiceHistory: story.choiceHistory || [],
      status: story.status || 'in_progress',
      lastPlayedAt: story.lastPlayedAt || story.updatedAt,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt
    };

    return NextResponse.json({ story: formattedStory });
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log('PUT /api/stories/[id] - Starting story update');
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      console.log('PUT /api/stories/[id] - Unauthorized: No session user');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { action, currentState, updates: initialUpdates } = await req.json();
    console.log('PUT /api/stories/[id] - Request data:', { action, currentState });
    
    let generatedContent: string | undefined;
    let updatesToApply = { ...initialUpdates };
    
    const client = await clientPromise;
    const db = client.db();

    // Get the current story
    const story = await db.collection('stories').findOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(session.user.id)
    });

    if (!story) {
      console.log('PUT /api/stories/[id] - Story not found');
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    console.log('PUT /api/stories/[id] - Story found:', {
      id: story._id.toString(),
      title: story.title,
      action,
      currentState
    });

    // If this is a story generation request
    if (action && currentState) {
      const context = {
        genre: story.genre,
        character: story.character,
        currentChapter: story.currentChapter,
        currentLocation: story.gameState?.currentLocation,
        previousChoices: story.choiceHistory || [],
        lastChoice: story.gameState?.lastChoice,
        questStatus: story.gameState?.questStatus || {}
      };

      console.log('PUT /api/stories/[id] - Generating story with context:', context);

      try {
        // Generate next story segment
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a creative story generator for a ${context.genre} adventure game. 
                       The player's character is a ${context.character.class} named ${context.character.name}.
                       Current chapter: ${context.currentChapter}
                       Current location: ${context.currentLocation}`
            },
            {
              role: "user",
              content: `Given the current state: ${JSON.stringify(currentState)}
                       And the player's action: ${action}
                       Generate the next story segment and available choices.
                       Include: description, consequences, and 2-4 possible next actions.`
            }
          ],
          temperature: 0.8,
          max_tokens: 500
        });

        console.log('PUT /api/stories/[id] - OpenAI response:', {
          status: 'success',
          content: completion.choices[0]?.message?.content?.substring(0, 100) + '...'
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
          console.log('PUT /api/stories/[id] - No content generated from OpenAI');
          return NextResponse.json(
            { error: 'Failed to generate story content' },
            { status: 500 }
          );
        }
        generatedContent = content;

      } catch (openaiError) {
        console.error('PUT /api/stories/[id] - OpenAI API error:', openaiError);
        return NextResponse.json(
          { error: 'Failed to generate story content: ' + (openaiError instanceof Error ? openaiError.message : 'Unknown error') },
          { status: 500 }
        );
      }

      // Update story with generated content
      updatesToApply = {
        ...updatesToApply,
        'gameState.currentScene': {
          description: generatedContent,
          timestamp: new Date()
        },
        'gameState.currentLocation': currentState.location,
        'gameState.lastChoice': action,
        $push: {
          choiceHistory: {
            action,
            timestamp: new Date(),
            location: currentState.location,
            consequences: generatedContent
          }
        }
      };
    }

    console.log('PUT /api/stories/[id] - Applying updates:', updatesToApply);

    // Handle regular updates
    const allowedUpdates = [
      'title', 'description', 'character', 'gameState',
      'currentChapter', 'status', 'navigationHistory', 'choiceHistory'
    ];

    // Filter out non-allowed updates
    const filteredUpdates = {
      ...(updatesToApply ? Object.keys(updatesToApply)
        .filter(key => allowedUpdates.includes(key))
        .reduce((obj, key) => {
          obj[key] = updatesToApply[key];
          return obj;
        }, {} as any) : {}),
      lastPlayedAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('stories').findOneAndUpdate(
      {
        _id: new ObjectId(params.id),
        userId: new ObjectId(session.user.id)
      },
      {
        $set: filteredUpdates
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      console.log('PUT /api/stories/[id] - Failed to update story in database');
      return NextResponse.json(
        { error: 'Failed to update story' },
        { status: 500 }
      );
    }

    console.log('PUT /api/stories/[id] - Story updated successfully');

    // Format the response
    const formattedResponse = {
      id: result._id.toString(),
      currentScene: result.gameState.currentScene,
      currentLocation: result.gameState.currentLocation,
      lastChoice: result.gameState.lastChoice,
      choiceHistory: result.choiceHistory,
      character: result.character,
      progress: {
        currentChapter: result.currentChapter,
        totalChapters: result.totalChapters,
        percentage: Math.round((result.currentChapter / result.totalChapters) * 100)
      }
    };

    return NextResponse.json({ 
      story: formattedResponse,
      generated: generatedContent
    });
  } catch (error) {
    console.error('PUT /api/stories/[id] - Unhandled error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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
      _id: new ObjectId(params.id),
      userId: new ObjectId(session.user.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Story deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
