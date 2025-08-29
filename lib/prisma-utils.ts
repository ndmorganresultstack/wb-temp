import prisma from "@/lib/prisma";
import { Prisma, PrismaClient } from "@/app/generated/prisma";

export type RelatedModel = keyof typeof defaultDisplayFieldMap;

export const defaultDisplayFieldMap = {
	BusinessTitle: "titleName",
	FunctionCategory: "categoryName",
	RoleResponsibility: "roleName",
	ServiceAccount: "serviceDescription",
	ExternalLabor: "vendor",
	SoftwareCost: "productDescription",
	User: "email",
	Employee: "employeeId",
};

type PrismaModelNames = (typeof Prisma.dmmf.datamodel.models)[number]["name"];

type PrismaModelDelegate = {
	create: (...args: any[]) => any;
	findMany: (...args: any[]) => any;
	findUnique: (...args: any[]) => any;
};

type PrismaModelKeys = {
	[K in keyof typeof prisma]: (typeof prisma)[K] extends { create: (...args: any[]) => any }
		? K
		: never;
}[keyof typeof prisma];

export interface KeyValuePair {
	key: string;
	value: any;
}

function getPrismaModel<T extends PrismaModelNames>(modelName: T): PrismaModelDelegate {
	const modelAccessor = (modelName.charAt(0).toLowerCase() +
		modelName.slice(1)) as PrismaModelKeys;
	const model = prisma[modelAccessor];

	if (!model || typeof model.create !== "function") {
		throw new Error(
			`Model ${modelName} not found or does not support create operation in Prisma client`
		);
	}

	return model as PrismaModelDelegate;
}

export async function fetchRelationOptions(
	relatedModel: RelatedModel,
	displayFields: string[] = ["name"]
) {
	try {
		const validModels = Prisma.dmmf.datamodel.models.map((m) => m.name) as string[];
		if (!validModels.includes(relatedModel)) {
			throw new Error(`Model ${relatedModel} not found in Prisma client`);
		}

		const prismaModel = getPrismaModel(relatedModel as PrismaModelNames);

		const primaryField = defaultDisplayFieldMap[relatedModel] || displayFields[0];

		let validDisplayFields = displayFields;
		const dmmf = Prisma.dmmf;
		if (dmmf) {
			const model = dmmf.datamodel.models.find((m) => m.name === relatedModel);
			if (model) {
				validDisplayFields = displayFields.filter((field) =>
					model.fields.some((f) => f.name === field)
				);
				if (validDisplayFields.length === 0) {
					console.warn(
						`No valid display fields found for ${relatedModel}, using fallback`
					);
					validDisplayFields = [
						model.fields.find((f) => f.type === "String" && !f.isId)?.name ||
							primaryField,
					];
				}
			}
		} else {
			console.warn(`DMMF not available, using provided display fields for ${relatedModel}`);
			validDisplayFields = [primaryField];
		}

		const selectFields = validDisplayFields.reduce(
			(acc, field) => ({ ...acc, [field]: true }),
			{ [primaryField]: true }
		);

		const data = await prismaModel.findMany({
			select: selectFields,
		});

		const options = data
			.filter((item: any) =>
				validDisplayFields.every(
					(field) =>
						item[field] != null &&
						typeof item[field] === "string" &&
						item[field].trim() !== ""
				)
			)
			.map((item: any) => ({
				value: item[primaryField],
				label: validDisplayFields.map((field) => item[field]).join(" "),
			}));

		return options;
	} catch (error) {
		console.error(
			`Error fetching options for ${relatedModel} with displayFields ${displayFields.join(
				", "
			)}:`,
			error
		);
		return [];
	}
}

export async function getModelMetadata(modelName: string) {
	try {
		const dmmf = Prisma.dmmf;
		if (!dmmf) {
			console.error(`DMMF not available on prisma client for ${modelName}`);
			return { model: { name: modelName, fields: [] }, fields: [] };
		}

		const model = dmmf.datamodel.models.find((m) => m.name === modelName);
		if (!model) {
			console.error(`Model ${modelName} not found in DMMF`);
			return { model: { name: modelName, fields: [] }, fields: [] };
		}

		const fields = model.fields.map((field) => ({
			name: field.name,
			type: field.type,
			kind: field.kind,
			isList: field.isList,
			isRequired: field.isRequired,
			relationName: field.relationName,
			relationFromFields: field.relationFromFields,
			relationToFields: field.relationToFields,
			relatedModel: field.type,
			isId: field.isId,
		}));

		return { model, fields };
	} catch (error) {
		console.error(`Error fetching metadata for ${modelName}:`, error);
		return { model: { name: modelName, fields: [] }, fields: [] };
	}
}

export async function fetchModelData(modelName: string, keyValuePair: KeyValuePair | null = null) {
	try {
		const validModels = Prisma.dmmf.datamodel.models.map((m) => m.name) as string[];
		if (!validModels.includes(modelName)) {
			throw new Error(`Model ${modelName} not found in Prisma client`);
		}

		const prismaModel = getPrismaModel(modelName as PrismaModelNames);

		if (keyValuePair && keyValuePair.value !== null) {
			const data = await prismaModel.findUnique({
				where: { [keyValuePair.key]: keyValuePair.value },
				select: undefined,
			});
			return data ? [data] : [];
		} else {
			const data = await prismaModel.findMany({
				select: undefined,
			});
			return data;
		}
	} catch (error) {
		console.error(`Error fetching data for ${modelName}:`, error);
		return [];
	}
}
