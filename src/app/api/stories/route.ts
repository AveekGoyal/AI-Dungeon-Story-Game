import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

// GET /api/stories - Get all stories for a user
export async function GET() {
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

    const stories = await db.collection('stories')
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ updatedAt: -1 })
      .toArray();

    const formattedStories = stories.map(story => ({
      id: story._id.toString(),
      title: story.title,
      description: story.description,
      genre: story.genre,
      character: story.character
    }));

    return NextResponse.json({ stories: formattedStories });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}

// POST /api/stories - Create a new story
export async function POST(req: Request) {
  try {
    console.log('POST /api/stories - Starting story creation...')
    
    const session = await getServerSession(authOptions);
    console.log('Session user:', session?.user?.email)
    
    if (!session?.user) {
      console.log('Unauthorized - No session user')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('Request body:', {
      title: body.title,
      genre: body.genre?.name,
      characterName: body.character?.name
    })

    const { title, description, genre, character } = body;

    if (!title || !genre || !character) {
      console.log('Missing required fields:', { title, genre, character })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const storyDoc = {
      userId: new ObjectId(session.user.id),
      title,
      description,
      genre,
      character: {
        name: character.name,
        class: character.class || character.name,
        stats: {
          strength: character.strength,
          intelligence: character.intelligence,
          healthPoints: character.healthPoints,
          agility: character.agility,
          magicPoints: character.magicPoints,
          specialAttacks: character.specialAttacks
        }
      },
      currentChapter: 1,
      totalChapters: 1,
      gameState: {
        currentLocation: 'Starting Area',
        availableChoices: [],
        lastChoice: null,
        questStatus: 'not_started'
      },
      navigationHistory: [],
      choiceHistory: [],
      status: 'in_progress',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastPlayedAt: new Date()
    };

    console.log('Inserting story document...')
    const result = await db.collection('stories').insertOne({
      ...storyDoc,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    if (!result.insertedId) {
      console.error('Failed to insert story - no insertedId returned')
      throw new Error('Failed to create story')
    }

    console.log('Story created successfully:', {
      id: result.insertedId.toString(),
      title: storyDoc.title
    })

    return NextResponse.json({
      id: result.insertedId.toString(),
      title: storyDoc.title,
      description: storyDoc.description,
      genre: storyDoc.genre,
      character: storyDoc.character
    });
  } catch (error) {
    console.error('Error in POST /api/stories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/stories - Remove all stories
export async function DELETE(req: Request) {
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

    // Delete all stories for the current user
    const result = await db.collection('stories').deleteMany({
      userId: new ObjectId(session.user.id)
    });

    return NextResponse.json({
      message: `Successfully deleted ${result.deletedCount} stories`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting stories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
