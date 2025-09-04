"use client";


import type { ProspectOpportunityData } from "@/app/api/prospects/route";
import type { ProspectView } from "@/app/generated/prisma";

import { create } from "zustand";

export interface UseClientsState {
	showOverlay: boolean;
	setShowOverlay: (showOverlay: boolean) => void;
	row: ProspectView | null;
	setRow: (row: ProspectView) => void;
	rowAdditionalDetails: ProspectOpportunityData | null;
}

export const useClients = create<UseClientsState>((set, get) => ({
	showOverlay: false,
	setShowOverlay: (showOverlay: boolean) => set((state) => ({ ...state, showOverlay })),
	row: null,
	setRow: async (row: ProspectView) => {
		const isDifferentRow = get().row?.opportunityId !== row.opportunityId;
		if (isDifferentRow) {
			const setShowOverlay = get().setShowOverlay;

			// Get Additional Details
			const additionalDetailsRes = await fetch(
				`/api/prospects?opportunityId=${row.opportunityId}`,
			);
			const { data: additionalDetails }: { data: ProspectOpportunityData } =
				await additionalDetailsRes.json();

			// Set Details, Toggle Panel, and Set Row
			set((state) => ({ ...state, rowAdditionalDetails: additionalDetails }));
			setShowOverlay(true);
			return set((state) => ({ ...state, row }));
		}
	},
	rowAdditionalDetails: null,
}));
