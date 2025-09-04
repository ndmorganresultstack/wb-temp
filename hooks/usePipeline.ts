"use client";

import type { PipelineOpportunityData } from "@/app/api/pipeline/route";
import type { PipelineView } from "@/app/generated/prisma";

import { create } from "zustand";

export interface UsePipelineState {
	showOverlay: boolean;
	setShowOverlay: (showOverlay: boolean) => void;
	row: PipelineView | null;
	setRow: (row: PipelineView) => void;
	rowAdditionalDetails: PipelineOpportunityData | null;
}

export const usePipeline = create<UsePipelineState>((set, get) => ({
	showOverlay: false,
	setShowOverlay: (showOverlay: boolean) => set((state) => ({ ...state, showOverlay })),
	row: null,
	setRow: async (row: PipelineView) => {
		const isDifferentRow = get().row?.opportunityId !== row.opportunityId;
		if (isDifferentRow) {
			const setShowOverlay = get().setShowOverlay;

			// Get Additional Details
			const additionalDetailsRes = await fetch(
				`/api/pipeline?opportunityId=${row.opportunityId}`,
			);
			const { data: additionalDetails }: { data: PipelineOpportunityData } =
				await additionalDetailsRes.json();

			// Set Details, Toggle Panel, and Set Row
			set((state) => ({ ...state, rowAdditionalDetails: additionalDetails }));
			setShowOverlay(true);
			return set((state) => ({ ...state, row }));
		}
	},
	rowAdditionalDetails: null,
}));
