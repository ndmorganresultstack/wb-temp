"use client";

import { useNav } from "@/hooks/useNav";
import { SiteHeader } from "@/components/SiteHeader";
import { TablePanel } from "@/components/TablePanel";
import { useEffect, useState } from "react";
import { useTableRecord } from "@/hooks/useTableRecord";
import { PipelineOpportunityData } from "@/app/api/opportunities/route";
import PipelineGrid from "@/components/PipelineGrid";

export default function PipelinePage() {
	const isSidebarOpen = useNav((state) => state.isSidebarOpen);
	const sidebarMaxWidth = useNav((state) => state.sidebarMaxWidth);
	const sidebarMinWidth = useNav((state) => state.sidebarMinWidth);
	const selectedRecord = useTableRecord((state) => state.tableRecord?.pipelineOpportunity);
	const [rightPanelShowing, setRightPanelShowing] = useState<boolean>(false);
	const [opportunity, setOpportunity] = useState<PipelineOpportunityData>();
	const [tab, setTab] = useState<
		"Deal Details" | "Property List" | "Services" | "Attachments" | "Call Notes"
	>("Deal Details");

	useEffect(() => {
		if (selectedRecord?.opportunityId) {
			fetch(`/api/opportunities?key=opportunityId&id=${selectedRecord.opportunityId}`).then(
				(value) => {
					value.json().then((j) => {
						console.log(j);
						setOpportunity(j);
						setRightPanelShowing(true);
					});
				}
			);
		}
	}, [selectedRecord]);

	return (
		<>
			<SiteHeader pageTitle="Opportunity Pipeline" />

			<main
				className={`grid-page-container ${
					isSidebarOpen
						? `w-[calc(100%-${sidebarMaxWidth})]`
						: `w-[calc(100%-${sidebarMinWidth})]`
				}`}
			>
				<div className="grid-page-header">
					<span className="grid-page-header-path"> Client Services /</span>
					<span className="grid-page-header-page"> Sales Pipeline </span>
				</div>
				<div className="grid-container-toolbar">
					<PipelineGrid />

					{rightPanelShowing && !!opportunity && (
						<TablePanel>
							<div className="flex flex-col gap-y-3 h-full w-full">
								<div className="flex gap-x-1 gap-y-2 flex-wrap justify-center items-center">
									<button
										onClick={() => setTab("Deal Details")}
										className={`button text-sm font-semibold ${
											tab === "Deal Details"
												? "button-solid"
												: "bg-gray-200 text-gray-500"
										}`}
									>
										Deal Details
									</button>
									<button
										onClick={() => setTab("Property List")}
										className={`button text-sm font-semibold ${
											tab === "Property List"
												? "button-solid"
												: "bg-gray-200 text-gray-500"
										}`}
									>
										Property List
									</button>
									<button
										onClick={() => setTab("Services")}
										className={`button text-sm font-semibold ${
											tab === "Services"
												? "button-solid"
												: "bg-gray-200 text-gray-500"
										}`}
									>
										Services
									</button>
									<button
										onClick={() => setTab("Attachments")}
										className={`button text-sm font-semibold ${
											tab === "Attachments"
												? "button-solid"
												: "bg-gray-200 text-gray-500"
										}`}
									>
										Attachments
									</button>
									<button
										onClick={() => setTab("Call Notes")}
										className={`button text-sm font-semibold ${
											tab === "Call Notes"
												? "button-solid"
												: "bg-gray-200 text-gray-500"
										}`}
									>
										Call Notes
									</button>
								</div>

								<hr className="-mx-4 text-gray-300" />

								<div></div>

								<button
									onClick={() => setRightPanelShowing(false)}
									className="button button-solid ml-auto mt-auto"
								>
									Close
								</button>
							</div>
						</TablePanel>
					)}
				</div>
			</main>
		</>
	);
}
