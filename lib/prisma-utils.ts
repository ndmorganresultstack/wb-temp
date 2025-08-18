import prisma from '@/lib/prisma';
import { Prisma } from '@/app/generated/prisma';

const defaultDisplayFieldMap = {
  BusinessTitles: 'TitleName',
  FunctionCategories: 'CategoryName',
  RoleResponsibilities: 'RoleName',
  ServiceAccounts: 'ServiceDescription',
  ExternalLabor: 'Vendor',
  SoftwareCosts: 'ProductDescription',
  Users: 'email',
  Employees: 'EE_NO',
};

export async function fetchRelationOptions(relatedModel: string, displayFields: string[] = ['name']) {
  try {
    const modelAccessor = relatedModel.charAt(0).toLowerCase() + relatedModel.slice(1);

    if (!prisma[modelAccessor as keyof typeof prisma]) {
      throw new Error(`Model ${relatedModel} not found in Prisma client`);
    }

    // Ensure displayFields is not empty
    if (displayFields.length === 0) {
      displayFields = ['name'];
    }

    // Use the default display field from the map or the first field in displayFields
    const primaryField = defaultDisplayFieldMap[relatedModel] || displayFields[0];

    // Validate all display fields
    const dmmf = Prisma.dmmf;
    let validDisplayFields = displayFields;
    if (dmmf) {
      const model = dmmf.datamodel.models.find((m) => m.name === relatedModel);
      if (model) {
        validDisplayFields = displayFields.filter((field) =>
          model.fields.some((f) => f.name === field)
        );
        if (validDisplayFields.length === 0) {
          console.warn(`No valid display fields found for ${relatedModel}, using fallback`);
          validDisplayFields = [
            model.fields.find((f) => f.type === 'String' && !f.isId)?.name || primaryField,
          ];
        }
      }
    } else {
      console.warn(`DMMF not available, using provided display fields for ${relatedModel}`);
    }

    // Build the select object for Prisma query
    const selectFields = validDisplayFields.reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      { [primaryField]: true }
    );

    const data = await prisma[modelAccessor as keyof typeof prisma].findMany({
      select: selectFields,
    });

    const options = data
      .filter((item: any) =>
        validDisplayFields.every(
          (field) =>
            item[field] != null &&
            typeof item[field] === 'string' &&
            item[field].trim() !== ''
        )
      )
      .map((item: any) => ({
        value: item[primaryField], // Use primaryField (e.g., EE_NO) as the value
        label: validDisplayFields
          .map((field) => item[field])
          .join(' '), // Concatenate fields for display, e.g., "EE123 - John Doe"
      }));

    console.log(`Fetched options for ${relatedModel}:`, options);
    return options;
  } catch (error) {
    console.error(`Error fetching options for ${relatedModel} with displayFields ${displayFields.join(', ')}:`, error);
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

export async function fetchModelData(modelName: string) {
  try {
    console.log('Prisma client keys:', Object.keys(prisma));
    const modelAccessor = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    console.log(`Fetching data for ${modelName} using prisma.${modelAccessor}`);

    if (!prisma[modelAccessor as keyof typeof prisma]) {
      throw new Error(`Model ${modelName} not found in Prisma client`);
    }

    const data = await prisma[modelAccessor as keyof typeof prisma].findMany();
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${modelName}:`, error);
    return [];
  }
}