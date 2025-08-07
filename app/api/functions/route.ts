// app/api/employees/route.ts (API route for server-side data fetch)
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const functions = await prisma.functionCategories.findMany({});
    return NextResponse.json(functions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch functions' }, { status: 500 });
  }
}