// app/api/employees/route.ts (API route for server-side data fetch)
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const businessTitles = await prisma.businessTitles.findMany({});
    return NextResponse.json(businessTitles);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch business titles' }, { status: 500 });
  }
}