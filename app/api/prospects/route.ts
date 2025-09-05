import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma";

const getProspect = async (id: number) => {
	return await db.opportunity.findUnique({
		where: { opportunityId: id },
		select: {
			OpportunityContact: {
				select: {
					Contact: {
						select: {
							firstName: true,
							lastName: true,
							phone: true,
							email: true,
							Client: {
								select: {
									clientName: true,
								},
							},
						},
					},
				},
			},
			Contract: {
				select: {
					totalValue: true,
				},
			},
			Property: {
				select: {
					assetType: true,
					unitCount: true,
					Address: {
						select: {
							addressLine1: true,
							city: true,
							state: true,
							zip: true,
							addressLine2: true,
						},
					},
				},
			},
			salesStage: true,
		},
	});
};

export type ProspectOpportunityData = Awaited<ReturnType<typeof getProspect>>;

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const id = parseInt(searchParams.get("opportunityId") || "");

	const results = await getProspect(id);

	return NextResponse.json({ data: results });
}
