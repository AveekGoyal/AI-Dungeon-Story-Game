import { NextResponse } from 'next/server';
import { hashPassword, sanitizeUser } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { signIn } from 'next-auth/react';

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();

    // Validate input
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      username,
      createdAt: new Date(),
    });

    // Return sanitized user object
    const newUser = {
      id: result.insertedId.toString(),
      email,
      username,
    };

    return NextResponse.json(
      { user: sanitizeUser(newUser) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
