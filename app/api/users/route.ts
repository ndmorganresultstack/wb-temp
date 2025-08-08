// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Extract email from query params (e.g., /api/users?email=example@company.com)
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email query parameter is required' }, { status: 400 });
    }

    // Query Prisma for user (adjust model name if it's 'User' instead of 'users')
    const userFound = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });

    // Return boolean as JSON (true if user exists, false otherwise)
    return NextResponse.json(!!userFound, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to query for user' }, { status: 500 });
  }
}