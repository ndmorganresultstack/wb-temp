// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  
   const response = await fetch('/.auth/me');
  const payload = await response.json();
  const { clientPrincipal } = payload;

  return NextResponse.json(clientPrincipal);


}