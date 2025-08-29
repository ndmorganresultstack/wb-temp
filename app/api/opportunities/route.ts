import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

const getOpportunity = async (id: number) => {
	return await prisma.opportunity.findUnique({
		where: { opportunityId: id },
	});
};
const getOpportunities = async () => {
	return await prisma.opportunity.findMany({
		where: { NOT: { salesStage: "Prospect" } },
		select: {
			opportunityId: true,
			description: true,
			OpportunityContact: {
				select: {
					Contact: {
						select: {
							firstName: true,
							lastName: true,
							jobTitle: true,
							email: true,
							phone: true,

						},
					},
				},
			},
		},
	});
};

export type PipelineOpportunityData = Awaited<ReturnType<typeof getOpportunity>>;
export type PipelineOpportunitiesData = Awaited<ReturnType<typeof getOpportunities>>;

export async function GET(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;
	const key = searchParams.get("key");
	const id = parseInt(searchParams.get("id") || "");

	const results = !!id ? await getOpportunity(id) : await getOpportunities();

	return NextResponse.json({ data: results });
}
