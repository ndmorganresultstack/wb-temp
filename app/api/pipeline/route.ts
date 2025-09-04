import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma";

const getOpportunity = async (id: number) => {
	return await db.opportunity.findUnique({
		where: { opportunityId: id },
		select: {
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
		},
	});
};

export type PipelineOpportunityData = Awaited<ReturnType<typeof getOpportunity>>;

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const id = parseInt(searchParams.get("opportunityId") || "");

	const results = await getOpportunity(id);

	return NextResponse.json({ data: results });
}
