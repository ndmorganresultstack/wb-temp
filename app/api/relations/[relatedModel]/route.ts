import { NextResponse, NextRequest } from 'next/server';
import { fetchRelationOptions } from '@/lib/prisma-utils';

export async function GET(request: NextRequest) {
  const relatedModel = request.nextUrl.pathname.split('/').pop() || '';
  if (!relatedModel) {
    return NextResponse.json({ error: 'Related model parameter is missing' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const displayFieldsParam = searchParams.get('displayFields');
  const displayFields = displayFieldsParam ? displayFieldsParam.split(',') : ['name'];

  try {
    const options = await fetchRelationOptions(relatedModel, displayFields);
    return NextResponse.json(options);
  } catch (error) {
    console.error(`Error fetching options for ${relatedModel}:`, error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}