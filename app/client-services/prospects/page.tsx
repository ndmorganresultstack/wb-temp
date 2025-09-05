"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import SearchIcon from "@/components/icons/SearchIcon";
import { Edit3 } from "lucide-react";
import Link from "next/link";
import DynamicTable from "@/components/DynamicTable";
import { AttachmentsTab, CallNotesTab, PropertyListTab } from "@/components/PipelineTabs";
import { Overlay, Tab } from "@/components/Overlay";
import { OpportunityDetailCards } from "@/components/OpportunityDetailCards";
import { OverlayToggleButtons } from "@/components/OverlayToggleButtons";
import { useProspects } from "@/hooks/useProspects";

export default function ProspectsPage() {
	const showOverlay = useProspects((state) => state.showOverlay);
	const setShowOverlay = useProspects.getState().setShowOverlay;

	const setRow = useProspects.getState().setRow;

	return (
		<main className="grid-page-container relative">
			<DetailsOverlay />

			<div className="grid-page-header">
				<span className="grid-page-header-path"> Client Services /</span>
				<span className="grid-page-header-page"> Prospect List </span>
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

					<select className="border border-gray-200 text-gray-400 rounded-xs min-w-[150px] py-1 text-sm px-2">
						<option>Sort By:</option>
					</select>
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
					model="ProspectView"
					readOnly
					includeTotalRow={false}
					onRowClick={setRow as (row: unknown) => void}
				/>
			</div>
		</main>
	);
}

function DetailsOverlay() {
	const showOverlay = useProspects((state) => state.showOverlay);
	const setShowOverlay = useProspects.getState().setShowOverlay;
	const row = useProspects((state) => state.row);
	const rowAdditionalDetails = useProspects((state) => state.rowAdditionalDetails);
	const [tab, setTab] = useState(0);

	if (showOverlay && !!row && !!rowAdditionalDetails) {
		const opportunityContact = rowAdditionalDetails.OpportunityContact.at(0)?.Contact;
		const contactName = opportunityContact
			? `${opportunityContact.firstName} ${opportunityContact.lastName}`
			: "None";
		const contactEmail = opportunityContact?.email;
		const contactPhone = opportunityContact?.phone;
		const opportunityName = row.description || "None";
		const owner = opportunityContact?.Client?.clientName || "None";
		const dealStage = rowAdditionalDetails.salesStage || "None";
		const dealValue = rowAdditionalDetails?.Contract[0]
			? `$${Number(rowAdditionalDetails?.Contract[0]?.totalValue).toLocaleString("en-US")}`
			: "None";
		const unitCount = rowAdditionalDetails.Property?.unitCount || 0;
		const siteCount = 0;
		const address = `${rowAdditionalDetails.Property?.Address?.addressLine1}, ${
			rowAdditionalDetails.Property?.Address?.addressLine2
				? rowAdditionalDetails.Property?.Address?.addressLine2 + ","
				: ""
		} ${rowAdditionalDetails.Property?.Address?.city}, ${
			rowAdditionalDetails.Property?.Address?.state
		} ${rowAdditionalDetails.Property?.Address?.zip}`;

		return (
			<Overlay>
				<div className="flex flex-col gap-y-6 h-full w-full">
					<OverlayToggleButtons
						showOverlay={showOverlay}
						setShowOverlay={setShowOverlay}
					/>

					<div className="flex justify-between gap-x-10">
						<div className="flex gap-x-4 items-center">
							<h3 className="text-xl font-semibold">{opportunityName} Details</h3>
							<Edit3 className="size-5 bg-gray-200 px-1 rounded-xs" />
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
								<select defaultValue={dealStage}>
									<option>Negotiation</option>
									<option>Proposal</option>
								</select>
							</div>
						</div>
					</div>

					<OpportunityDetailCards
						opportunityName={opportunityName}
						owner={owner}
						dealStage={dealStage}
						dealValue={dealValue}
						ContactInfo={
							<div className="flex flex-col">
								<span>{contactName}</span>
								<Link className="text-blue-500" href={`mailto:${contactEmail}`}>
									{contactEmail}
								</Link>
								<Link className="text-blue-500" href={`tel:${contactPhone}`}>
									{contactPhone}
								</Link>
							</div>
						}
						address={address}
						sites={siteCount}
						unitCount={unitCount}
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
}
