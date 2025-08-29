"use client";

import type { PipelineOpportunityData } from "@/app/api/opportunities/route";
import type { ProspectOpportunityData } from "@/app/api/prospects/route";

import { create } from "zustand";

type TableRecords = {
	prospectOpportunity: ProspectOpportunityData | null;
	pipelineOpportunity: PipelineOpportunityData | null;
};

export interface TableRecordState {
	tableRecord: TableRecords;
	setTableRecord: (tableRecord: TableRecords) => void;
}

export const useTableRecord = create<TableRecordState>((set) => ({
	tableRecord: { prospectOpportunity: null, pipelineOpportunity: null },
	setTableRecord: (tableRecord: TableRecords) => set((state) => ({ ...state, tableRecord })),
}));
