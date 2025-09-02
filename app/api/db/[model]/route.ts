import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";
import { fetchModelData, getModelMetadata } from "@/lib/prisma-utils";

// Type definitions
type PrismaModelNames = (typeof Prisma.dmmf.datamodel.models)[number]["name"];
type PrismaModelDelegate = {
	create: (...args: any[]) => any;
	update: (...args: any[]) => any;
};
type PrismaModelKeys = {
	[K in keyof typeof db]: (typeof db)[K] extends { create: (...args: any[]) => any } ? K : never;
}[keyof typeof db];

function getPrismaModel<T extends PrismaModelNames>(modelName: T): PrismaModelDelegate {
	const modelAccessor = (modelName.charAt(0).toLowerCase() +
		modelName.slice(1)) as PrismaModelKeys;
	const model = db[modelAccessor];

	if (!model || typeof model.create !== "function") {
		throw new Error(
			`Model ${modelName} not found or does not support create operation in Prisma client`
		);
	}

	return model as PrismaModelDelegate;
}

export async function GET(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;

	const model = pathname.split("/").filter(Boolean).pop() || null;
	const key = searchParams.get("key");
	const id = (() => {
		return searchParams.get("id")?.at(0) == "0"
			? searchParams.get("id")
			: parseInt(searchParams.get("id") ?? "0");
	})();

	if (!model) {
		return NextResponse.json({ error: "Model parameter is missing" }, { status: 400 });
	}

	console.log(model, key, id);

	try {
		const data = await fetchModelData(model, key && id ? { key: key, value: id } : null);
		const metadata = await getModelMetadata(model);
		return NextResponse.json({ data, metadata });
	} catch (error) {
		console.error(`Error fetching data for ${model}:`, error);
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;
	const model = pathname.split("/").filter(Boolean).pop() || null;
	if (!model) {
		return NextResponse.json({ error: "Model parameter is missing" }, { status: 400 });
	}

	const validModels = Prisma.dmmf.datamodel.models.map((m) => m.name) as string[];
	if (!validModels.includes(model)) {
		return NextResponse.json({ error: `Invalid model name: ${model}` }, { status: 400 });
	}

	const data = await request.json();
	try {
		const prismaModel = getPrismaModel(model as PrismaModelNames);

		// Validate required fields
		const modelSchema = Prisma.dmmf.datamodel.models.find((m) => m.name === model);
		const requiredFields =
			modelSchema?.fields
				.filter((f) => f.isRequired && !f.isId && f.default === undefined)
				.map((f) => f.name) || [];

		for (const field of requiredFields) {
			if (!(field in data)) {
				return NextResponse.json(
					{ error: `Missing required field: ${field}` },
					{ status: 400 }
				);
			}
		}

		const createdRecord = await prismaModel.create({
			data,
		});

		return NextResponse.json(createdRecord);
	} catch (error) {
		console.error(`Error creating record for ${model}:`, {
			error: (error as Error).message,
			stack: (error as Error).stack,
			model,
			data,
		});
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	const model = request.nextUrl.pathname.split("/").pop() || "";
	if (!model) {
		return NextResponse.json({ error: "Model parameter is missing" }, { status: 400 });
	}

	const validModels = Prisma.dmmf.datamodel.models.map((m) => m.name) as string[];
	if (!validModels.includes(model)) {
		return NextResponse.json({ error: `Invalid model name: ${model}` }, { status: 400 });
	}

	const updates = await request.json();
	try {
		const prismaModel = getPrismaModel(model as PrismaModelNames);

		let pkField = `${model}Id`;
		try {
			const modelSchema = Prisma.dmmf.datamodel.models.find((m) => m.name === model);
			if (modelSchema) {
				pkField = modelSchema.fields.find((f) => f.isId)?.name || pkField;
			}
		} catch (error) {
			console.error(`Falling back to default pkField for ${model} due to DMMF error:`, error);
		}

		if (updates.field && updates.value !== undefined) {
			await prismaModel.update({
				where: { [pkField]: updates[pkField] },
				data: { [updates.field]: updates.value },
			});
		} else {
			await prismaModel.update({
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
