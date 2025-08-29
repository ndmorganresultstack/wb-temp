"use client";

import { useNav } from "@/hooks/useNav";
import { SiteHeader } from "@/components/SiteHeader";
import { TablePanel } from "@/components/TablePanel";
import { useEffect, useState } from "react";
import { useTableRecord } from "@/hooks/useTableRecord";
import { PipelineOpportunityData } from "@/app/api/opportunities/route";
import PipelineGrid from "@/components/PipelineGrid";
import { PlusIcon } from "@heroicons/react/24/solid";
import SearchIcon from "@/components/icons/SearchIcon";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Percent, TrendingUp, Users } from "lucide-react";
import { TableSummaryCard } from "@/components/TableSummaryCard";

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
				},
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

				<div className=" bg-gray-200 p-8 w-full">
					<div className="flex gap-x-4 max-w-[1400px] mx-auto justify-around">
						<TableSummaryCard
							title="Total Pipeline Value"
							value="$2.4M"
							percentage={14}
							isIncrease
							Icon={TrendingUp}
						/>
						<TableSummaryCard
							title="Active Proposals"
							value="42"
							percentage={3}
							Icon={Users}
						/>
						<TableSummaryCard
							title="Avg. Probability"
							value="63%"
							percentage={14}
							isIncrease
							Icon={Percent}
						/>
						<TableSummaryCard
							title="Total Units"
							value="12,000"
							percentage={14}
							isIncrease
							Icon={Users}
						/>
					</div>
				</div>

				<div className="flex gap-x-10 py-2 items-center px-4 w-full justify-between">
					<div className="flex gap-x-4">
						<label className="relative flex items-center">
							<SearchIcon className="absolute left-2 size-4" />
							<input
								placeholder="Search"
								className="border  border-gray-200 rounded-xs py-1 pl-7 pr-2"
							/>
						</label>

						<select className="border border-gray-200  rounded-xs min-w-[150px] py-1 text-sm px-2">
							<option>All Stages</option>
						</select>

						<button className="button button-outline text-sm flex gap-x-2 items-center">
							Clear Filters <FunnelIcon className="size-4" />
						</button>
					</div>

					<button className="button button-solid text-sm flex items-center gap-x-1">
						<PlusIcon className="size-3" />
						Add Prospect
					</button>
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
