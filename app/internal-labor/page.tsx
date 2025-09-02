"use client";

import InternalLaborCalculatedGrid from "@/components/InternalLaborCalculatedGrid";
import InternalLaborPlanGrid from "@/components/InternalLaborPlanGrid";
import { useRef, useState } from "react";
import { useNav } from "@/hooks/useNav";
import { SiteHeader } from "@/components/SiteHeader";

export default function InternalLaborPage() {
	const [viewType, setViewType] = useState("CALCULATED");
	const gridRef = useRef<any>(null);

	const isSidebarOpen = useNav((state) => state.isSidebarOpen);
	const sidebarMaxWidth = useNav((state) => state.sidebarMaxWidth);
	const sidebarMinWidth = useNav((state) => state.sidebarMinWidth);

	return (
		<>
			<SiteHeader pageTitle="Internal Labor" />
			<main
				className={`grid-page-container ${
					isSidebarOpen
						? `w-[calc(100%-${sidebarMaxWidth})]`
						: `w-[calc(100%-${sidebarMinWidth})]`
				}`}
			>
				<div className="grid-page-header">
					<span className="grid-page-header-path"> Costs /</span>
					<span className="grid-page-header-page">
						{" "}
						Internal Labor ({viewType.toUpperCase()})
					</span>
				</div>
				<div className="grid-toolbar-row flex justify-between items-center">
					<div className=" flex items-center justify-end">
						{viewType == "CALCULATED" && (
							<button
								className="button-outline"
								onClick={() => gridRef?.current?.AddNewRow()}
							>
								&nbsp;+&nbsp;
							</button>
						)}
					</div>
					<div className="flex items-center justify-end">
						<div className="bg-gray-200 rounded-lg p-2 flex gap-2">
							<button
								className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
									viewType === "PLAN"
										? "bg-white text-gray-900"
										: "bg-gray-200 text-gray-900"
								}`}
								onClick={() => setViewType("PLAN")}
							>
								Plan
							</button>
							<button
								className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
									viewType === "CALCULATED"
										? "bg-white text-gray-900"
										: "bg-gray-200 text-gray-900"
								}`}
								onClick={() => setViewType("CALCULATED")}
							>
								Calculations
							</button>
						</div>
					</div>
				</div>
				<div className="grid-container-toolbar">
					{viewType == "CALCULATED" ? (
						<InternalLaborCalculatedGrid ref={gridRef} includeTotalRow={true} />
					) : (
						<InternalLaborPlanGrid includeTotalRow={true} />
					)}
				</div>
			</main>
		</>
	);
}
