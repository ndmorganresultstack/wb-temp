import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@/app/generated/prisma';
import { fetchModelData, getModelMetadata } from '@/lib/prisma-utils';

export async function GET(request: NextRequest) {
  const model = request.nextUrl.pathname.split('/').pop() || '';
  if (!model) {
    return NextResponse.json({ error: 'Model parameter is missing' }, { status: 400 });
  }

  try {
    const data = await fetchModelData(model);
    const metadata = await getModelMetadata(model);
    return NextResponse.json({ data, metadata });
  } catch (error) {
    console.error(`Error fetching data for ${model}:`, error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const model = request.nextUrl.pathname.split('/').pop() || '';
  if (!model) {
    return NextResponse.json({ error: 'Model parameter is missing' }, { status: 400 });
  }

  const data = await request.json();
  try {
    const modelAccessor = model.charAt(0).toLowerCase() + model.slice(1);
    if (!prisma[modelAccessor as keyof typeof prisma]) {
      throw new Error(`Model ${model} not found in Prisma client`);
    }

    const createdRecord = await prisma[modelAccessor as keyof typeof prisma].create({
      data,
    });

    return NextResponse.json(createdRecord);
  } catch (error) {
    console.error(`Error creating record for ${model}:`, error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const model = request.nextUrl.pathname.split('/').pop() || '';
  if (!model) {
    return NextResponse.json({ error: 'Model parameter is missing' }, { status: 400 });
  }

  const updates = await request.json();
  try {
    const modelAccessor = model.charAt(0).toLowerCase() + model.slice(1);
    if (!prisma[modelAccessor as keyof typeof prisma]) {
      throw new Error(`Model ${model} not found in Prisma client`);
    }

    let pkField = model.includes('Employees') ? 'EE_NO' : `${model}Id`;
    try {
      const modelSchema = Prisma.dmmf.datamodel.models.find((m) => m.name === model);
      if (modelSchema) {
        pkField = modelSchema.fields.find((f) => f.isId)?.name || pkField;
      }
    } catch (error) {
      console.error(`Falling back to default pkField for ${model} due to DMMF error:`, error);
    }

    // Handle single field update or full row update
    if (updates.field && updates.value !== undefined) {
      // Existing single field update
      await prisma[modelAccessor as keyof typeof prisma].update({
        where: { [pkField]: updates[pkField] },
        data: { [updates.field]: updates.value },
      });
    } else {
      // Full row update
      await prisma[modelAccessor as keyof typeof prisma].update({
        where: { [pkField]: updates[pkField] },
        data: updates,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error updating ${model}:`, error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}