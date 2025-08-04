// app/api/employees/route.ts (API route for server-side data fetch)
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employees.findMany({
      include: {
        BusinessTitles: true,
        FunctionCategories: true,
        RoleResponsibilities: true,
      },
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}