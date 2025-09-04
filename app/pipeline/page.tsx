"use client";

import { usePipeline } from "@/hooks/usePipeline";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import SearchIcon from "@/components/icons/SearchIcon";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Edit3, Percent, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import DynamicTable from "@/components/DynamicTable";
import { AttachmentsTab, CallNotesTab, PropertyListTab } from "@/components/PipelineTabs";
import { Overlay, Tab } from "@/components/Overlay";
import { OpportunityDetailCards } from "@/components/OpportunityDetailCards";
import { OverlayToggleButtons } from "@/components/OverlayToggleButtons";
import { DataSummaryCard } from "@/components/DataSummaryCard";
import { DealStage } from "@/components/DealStage";

export default function PipelinePage() {
	const showOverlay = usePipeline((state) => state.showOverlay);
	const setShowOverlay = usePipeline.getState().setShowOverlay;

	const setRow = usePipeline.getState().setRow;

	return (
		<main className="grid-page-container relative">
			<DetailsOverlay />

			<div className="grid-page-header">
				<span className="grid-page-header-path"> Client Services /</span>
				<span className="grid-page-header-page"> Sales Pipeline </span>
			</div>

			<div className=" bg-gray-200 p-2 w-full">
				<div className="flex gap-x-4 max-w-[1400px] mx-auto justify-around">
					<DataSummaryCard
						title="Total Pipeline Value"
						value="$2.4M"
						percentage={14}
						isIncrease
						Icon={TrendingUp}
					/>
					<DataSummaryCard
						title="Active Proposals"
						value="42"
						percentage={3}
						Icon={Users}
					/>
					<DataSummaryCard
						title="Avg. Probability"
						value="63%"
						percentage={14}
						isIncrease
						Icon={Percent}
					/>
					<DataSummaryCard
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

				<div className="flex gap-x-6 items-center">
					<OverlayToggleButtons
						showOverlay={showOverlay}
						setShowOverlay={setShowOverlay}
					/>

					<button className="button button-solid text-sm flex items-center gap-x-1">
						<PlusIcon className="size-3" />
						Add Prospect
					</button>
				</div>
			</div>

			<div className="grid-container-toolbar">
				<DynamicTable
					model="PipelineView"
					readOnly
					includeTotalRow={false}
					onRowClick={setRow as (row: unknown) => void}
				/>
			</div>
		</main>
	);
}

function DetailsOverlay() {
	const showOverlay = usePipeline((state) => state.showOverlay);
	const setShowOverlay = usePipeline.getState().setShowOverlay;
	const row = usePipeline((state) => state.row);
	const rowAdditionalDetails = usePipeline((state) => state.rowAdditionalDetails);
	const [tab, setTab] = useState(1);

	if (showOverlay && !!row && !!rowAdditionalDetails)
		return (
			<Overlay>
				<div className="flex flex-col gap-y-6 h-full w-full">
					<OverlayToggleButtons
						showOverlay={showOverlay}
						setShowOverlay={setShowOverlay}
					/>

					<div className="flex justify-between gap-x-10">
						<div className="flex gap-x-4 items-center">
							<h3 className="text-xl font-semibold">{row.description} Details</h3>
							<Edit3 className="size-5 bg-gray-200 px-1 rounded-xs" />
							{/* // ! Not sure what edit button does/looks like */}
						</div>

						<div className="flex gap-x-5 text-sm items-center">
							<div className="flex gap-x-2 items-center">
								<span>Opportunity Number</span>
								<span className="bg-[#4E357D66] rounded-sm min-w-[70px] py-1 px-2">
									{row.opportunityId}
								</span>
							</div>

							<div className="flex gap-x-2 items-center">
								<span>Deal Stage</span>
								<DealStage label={row.salesStage || "None"} />
								{/* // ! Not sure what dropdown options are --> Enum in DB */}
							</div>
						</div>
					</div>

					<OpportunityDetailCards
						company={row.description || "None"}
						owner="Jones Investor"
						dealStage={row.salesStage || "None"}
						dealValue={`$${Number(
							rowAdditionalDetails?.Contract[0]?.totalValue,
						).toLocaleString("en-US")}`}
						ContactInfo={
							<div className="flex flex-col">
								<span>Emma Johnson</span>
								<Link
									className="text-blue-500"
									href={`mailto:${"EJohnson@mail.com"}`}
								>
									EJohnson@mail.com
								</Link>
								<Link className="text-blue-500" href={`tel:${"(555) 555-5555"}`}>
									(555) 555-5555
								</Link>
							</div>
						}
						address={`${rowAdditionalDetails.Property?.Address?.addressLine1}, ${rowAdditionalDetails.Property?.Address?.addressLine2 ? rowAdditionalDetails.Property?.Address?.addressLine2 + "," : ""} ${rowAdditionalDetails.Property?.Address?.city}, ${rowAdditionalDetails.Property?.Address?.state} ${rowAdditionalDetails.Property?.Address?.zip}`}
						sites={16}
						unitCount={rowAdditionalDetails.Property?.unitCount || 3}
					/>

					<div className="flex items-center">
						<Tab tab={tab} setTab={setTab} text="Property List" index={0} />
						<Tab tab={tab} setTab={setTab} text="Attachments" index={1} />
						<Tab tab={tab} setTab={setTab} text="Call Notes" index={2} />
					</div>

					{tab === 0 && <PropertyListTab />}
					{tab === 1 && <AttachmentsTab />}
					{tab === 2 && <CallNotesTab />}
				</div>
			</Overlay>
		);
}
