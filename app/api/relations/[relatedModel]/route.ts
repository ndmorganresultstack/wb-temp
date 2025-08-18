import { NextResponse, NextRequest } from 'next/server';
import { fetchRelationOptions } from '@/lib/prisma-utils';

// Import the RelatedModel type from prisma-utils.ts
import { RelatedModel } from '@/lib/prisma-utils';

// Type guard to check if relatedModel is a valid RelatedModel
function isValidRelatedModel(model: string): model is RelatedModel {
  const validModels = new Set<keyof typeof import('@/lib/prisma-utils').defaultDisplayFieldMap>([
    'BusinessTitles',
    'FunctionCategories',
    'RoleResponsibilities',
    'ServiceAccounts',
    'ExternalLabor',
    'SoftwareCosts',
    'Users',
    'Employees',
  ]);
  return validModels.has(model as keyof typeof import('@/lib/prisma-utils').defaultDisplayFieldMap);
}

export async function GET(request: NextRequest) {
  const relatedModel = request.nextUrl.pathname.split('/').pop() || '';
  if (!relatedModel) {
    return NextResponse.json({ error: 'Related model parameter is missing' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const displayFieldsParam = searchParams.get('displayFields');
  const displayFields = displayFieldsParam ? displayFieldsParam.split(',') : ['name'];

  try {
    if (!isValidRelatedModel(relatedModel)) {
      return NextResponse.json({ error: `Invalid related model: ${relatedModel}` }, { status: 400 });
    }
    const options = await fetchRelationOptions(relatedModel, displayFields);
    return NextResponse.json(options);
  } catch (error) {
    console.error(`Error fetching options for ${relatedModel}:`, error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}