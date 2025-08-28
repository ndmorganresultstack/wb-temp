import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";
import { fetchModelData, getModelMetadata } from "@/lib/prisma-utils";

export async function GET(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;
	const key = searchParams.get("key");
	const id = parseInt(searchParams.get("id") || "");

	const results = await prisma["opportunity"].findUnique({
		where: { opportunityId: id },
		include: {
			Contract: true,
			clientServicesLeadEmployeeIdToEmployee: true,
			operationsVPEmployeeIdToEmployee: true,
			opportunityOwnerEmployeeIdToEmployee: true,
			OpportunityAction: true,
			Property: true,
			OpportunityContact: {
				include: {
					Contact: true,
				},
			},
		},
	});

	return NextResponse.json({ data: results });
}
