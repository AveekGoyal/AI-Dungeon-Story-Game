import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Story } from '@/models/Story';
import { StoryContext } from '@/types/story-context';
import { connectToDatabase } from '@/lib/mongodb';

// GET /api/stories/[storyId]/context
export async function GET(
  req: Request,
  { params }: { params: { storyId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const story = await Story.findOne({
      _id: params.storyId,
      userId: session.user.id
    }).select('context');

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json({ context: story.context || null });
  } catch (error) {
    console.error('Error fetching story context:', error);
    return NextResponse.json(
      { error: 'Failed to fetch story context' },
      { status: 500 }
    );
  }
}

// PUT /api/stories/[storyId]/context
export async function PUT(
  req: Request,
  { params }: { params: { storyId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const context: StoryContext = await req.json();

    await connectToDatabase();

    const story = await Story.findOneAndUpdate(
      {
        _id: params.storyId,
        userId: session.user.id
      },
      { $set: { context } },
      { new: true }
    ).select('context');

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json({ context: story.context });
  } catch (error) {
    console.error('Error updating story context:', error);
    return NextResponse.json(
      { error: 'Failed to update story context' },
      { status: 500 }
    );
  }
}
