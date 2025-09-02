import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;
	const key = searchParams.get("key");
	const id = parseInt(searchParams.get("id") || "");

	const results = await db["opportunity"].findUnique({
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
