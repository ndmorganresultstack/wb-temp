import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

const GetProspect = async (id: number) => {
	return await prisma.opportunity.findUnique({
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
					Contact: {
						include: {
							Client: true,
							Address: true,
						},
					},
				},
			},
		},
	});
};

export type ProspectOpportunityData = Awaited<ReturnType<typeof GetProspect>>;

export async function GET(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;
	const key = searchParams.get("key");
	const id = parseInt(searchParams.get("id") || "");

	const results = await GetProspect(id);

	return NextResponse.json({ data: results });
}
