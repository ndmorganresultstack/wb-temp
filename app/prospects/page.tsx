"use client";

import ProspectGrid from "@/components/ProspectGrid";
import "../../app/globals.css";
import { useEffect, useMemo, useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import DynamicTable from "@/components/DynamicTable";
import { TablePanel } from "@/components/TablePanel";
import { useNav } from "@/hooks/useNav";
import { SiteHeader } from "@/components/SiteHeader";
import { usePage } from "@/hooks/usePage";
import {
	Contract,
	Employees,
	Opportunity,
	opportunityActions,
	opportunityContacts,
	OpportunityWithFirstContact,
	Property,
} from "../generated/prisma";

interface OpportunityData {
	opportunityId: number;
	pitchStatus: string | null;
	description: string | null;
	probability: number | null;
	opportunityYear: number | null;
	allocation: number | null;
	durationDays: number | null;
	propertyId: number | null;
	salesStage: string | null;
	expectedCloseDate: string | null; // ISO date string
	expectedTakeoverDate: string | null; // ISO date string
	opportunityType: string | null;
	clientKeyObjective: string | null;
	underwritingStage: string | null;
	opportunityOwnerEmployeeId: string | null;
	clientServicesLeadEmployeeId: string | null;
	operationsVPEmployeeId: string | null;
	newAddition: boolean | null;
	annualFeeAmount: string | null; // Could be parsed to number if needed
	perUnitFee: string | null; // Could be parsed to number if needed
	managementFee: number | null;
	weightedForecast: string | null;
	createdAt: string | null; // ISO date string
	updatedAt: string | null; // ISO date string
	deleted: boolean | null;

	Contract: Contract;
	Employees_Opportunity_clientServicesLeadEmployeeIdToEmployees: Employees | null;
	Employees_Opportunity_operationsVPEmployeeIdToEmployees: Employees | null;
	Employees_Opportunity_opportunityOwnerEmployeeIdToEmployees: Employees | null;
	Property: Property | null;
	opportunityActions: any;
	opportunityContacts: any;
}

export default function ProspectsPage() {
	const isSidebarOpen = useNav((state) => state.isSidebarOpen);
	const sidebarMaxWidth = useNav((state) => state.sidebarMaxWidth);
	const sidebarMinWidth = useNav((state) => state.sidebarMinWidth);
	const selectedRecord = usePage((state) => state.record) as OpportunityWithFirstContact | null;
	const [rightPanelShowing, setRightPanelShowing] = useState<boolean>(false);
	const [opportunity, setOpportunity] = useState<OpportunityData>();

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
			<SiteHeader pageTitle="Prospects" />
			<main className={`grid-page-container`}>
				<div className="grid-page-header">
					<span className="grid-page-header-path"> Client Services /</span>
					<span className="grid-page-header-page"> Prospects</span>
				</div>
				<div className="grid-toolbar-row flex justify-between items-center">
					<div className=" flex items-center justify-end"></div>
					<div className="flex items-center justify-end">
						<div className="rounded-lg p-1 flex gap-1">
							{!rightPanelShowing && (
								<button
									className="button-solid items-center flex"
									onClick={() => setRightPanelShowing(!rightPanelShowing)}
								>
									<UserPlusIcon className={"w-8 h-6 p-1"} />
									<span className="p-1 text-sm">Add New Prospect</span>
								</button>
							)}
						</div>
					</div>
				</div>
				<div className={`grid-container-toolbar`}>
					<DynamicTable model="OpportunityWithFirstContact" readOnly={true} />
					{rightPanelShowing && opportunity && (
						<TablePanel>
							{/* Header */}
							<div className="flex justify-between items-center border-b pb-2 mb-4">
								<h2 className="text-lg font-semibold text-gray-800">
									Prospect Details
								</h2>
								<button
									onClick={() => setRightPanelShowing(false)}
									className="text-gray-500 hover:text-gray-700 font-bold text-xl"
								>
									×
								</button>
							</div>

							{/* Property Details */}
							<div className="mb-4">
								<div className="flex flex-wrap gap-4 text-sm text-gray-600">
									<div>
										<span className="font-medium">Company</span>
										<div>{opportunity.opportunityContacts}</div>
									</div>
									<div>
										<span className="font-medium">Property Count</span>
										<div>{opportunity.Property?.unitCount || "N/A"}</div>
									</div>
									<div>
										<span className="font-medium">Unit Count</span>
										<div>{opportunity.Property?.unitCount || "N/A"}</div>
									</div>
									<div>
										<span className="font-medium">Owner Investors</span>
										<div>
											<span className="font-medium">
												{
													opportunity
														.Employees_Opportunity_opportunityOwnerEmployeeIdToEmployees
														?.FirstName
												}{" "}
												{
													opportunity
														.Employees_Opportunity_opportunityOwnerEmployeeIdToEmployees
														?.LastName
												}
											</span>
											<div className="flex items-center gap-1">
												<span>
													{opportunity.opportunityContacts?.[0]?.Contact
														?.phone || "N/A"}
												</span>
												<span className="text-blue-500">📞</span>
												<span className="text-blue-500">✉️</span>
											</div>
										</div>
									</div>
									<div>
										<span className="font-medium">Deal Stage</span>
										<div>{opportunity.salesStage || "N/A"}</div>
									</div>
									<div>
										<span className="font-medium">Probability</span>
										<div>{opportunity.probability}%</div>
									</div>
								</div>
							</div>

							{/* Notes Section */}
							<div className="mb-4">
								<div className="flex justify-between items-center mb-2">
									<h3 className="text-sm font-medium text-gray-700">
										Notes ({opportunity.opportunityActions?.length || 0})
									</h3>
									<button className="text-sm text-blue-500 hover:text-blue-700">
										+ Add Note
									</button>
								</div>
								<div className="space-y-2">
									{opportunity.opportunityActions?.map(
										(action: any, index: number) => (
											<div key={index} className="text-sm text-gray-600">
												<span className="font-medium">
													{
														opportunity
															.Employees_Opportunity_opportunityOwnerEmployeeIdToEmployees
															?.FirstName
													}{" "}
													{
														opportunity
															.Employees_Opportunity_opportunityOwnerEmployeeIdToEmployees
															?.LastName
													}
												</span>{" "}
												• {new Date(action.createdAt).toLocaleString()}
												<p className="mt-1">
													{action.actionNotes || "No notes"}
												</p>
											</div>
										)
									)}
								</div>
							</div>

							{/* Additional Contacts Section */}
							<div className="mb-4">
								<div className="flex justify-between items-center mb-2">
									<h3 className="text-sm font-medium text-gray-700">
										Additional Contacts (
										{opportunity.opportunityContacts?.length || 0})
									</h3>
									<button className="text-sm text-blue-500 hover:text-blue-700">
										+ Add Contact
									</button>
								</div>
								<div className="overflow-x-auto">
									<table className="w-full text-sm text-gray-600">
										<thead>
											<tr className="bg-gray-100">
												<th className="p-2 text-left">Name</th>
												<th className="p-2 text-left">Role</th>
												<th className="p-2 text-left">Email</th>
												<th className="p-2 text-left">Phone</th>
												<th className="p-2 text-left">Location</th>
											</tr>
										</thead>
										<tbody>
											{opportunity.opportunityContacts?.map(
												(contact: any, index: number) => (
													<tr key={index}>
														<td className="p-2">
															{contact.Contact?.firstName}{" "}
															{contact.Contact?.lastName}
														</td>
														<td className="p-2">
															{contact.Contact?.jobTitle || "N/A"}
														</td>
														<td className="p-2">
															{contact.Contact?.email || "N/A"}
														</td>
														<td className="p-2">
															{contact.Contact?.phone || "N/A"}
														</td>
														<td className="p-2">
															{contact.Contact?.Address?.state ||
																"N/A"}
														</td>
													</tr>
												)
											)}
										</tbody>
									</table>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex justify-between mt-4">
								<button className="text-red-500 hover:text-red-700 text-sm">
									Delete Prospect
								</button>
								<button
									onClick={() => setRightPanelShowing(false)}
									className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
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
