import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

// GET /api/dashboard - Get user's dashboard data
export async function GET(req: Request) {
  try {
    // Get and verify auth session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()

    // Get user's stories with essential dashboard data
    const stories = await db.collection('stories')
      .find({ userId: new ObjectId(session.user.id) })
      .project({
        title: 1,
        genre: 1,
        character: 1,
        currentChapter: 1,
        totalChapters: 1,
        lastPlayedAt: 1,
        status: 1,
        progress: 1,
        createdAt: 1,
        updatedAt: 1
      })
      .sort({ lastPlayedAt: -1 })
      .toArray()

    // Format stories for dashboard view
    const formattedStories = stories.map(story => ({
      id: story._id.toString(),
      title: story.title,
      genre: story.genre,
      characterName: story.character?.name || 'Unknown Hero',
      progress: {
        currentChapter: story.currentChapter || 1,
        totalChapters: story.totalChapters || 1,
        percentage: Math.round(((story.currentChapter || 1) / (story.totalChapters || 1)) * 100)
      },
      status: story.status || 'in_progress',
      lastPlayedAt: story.lastPlayedAt || story.updatedAt,
      createdAt: story.createdAt
    }))

    // Return only what's needed for the dashboard
    return NextResponse.json({
      stories: formattedStories,
      totalStories: formattedStories.length,
      activeStories: formattedStories.filter(s => s.status === 'in_progress').length,
      user: {
        username: session.user.username
      }
    }, { status: 200 })

  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
