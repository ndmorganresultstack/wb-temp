"use client";

import ProspectGrid from "@/components/ProspectGrid";
import "../../app/globals.css";
import { useEffect, useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import DynamicTable from "@/components/DynamicTable";
import { TablePanel } from "@/components/TablePanel";
import { useNav } from "@/hooks/useNav";
import { SiteHeader } from "@/components/SiteHeader";

export default function ProspectsPage() {
	const isSidebarOpen = useNav((state) => state.isSidebarOpen);
	const sidebarMaxWidth = useNav((state) => state.sidebarMaxWidth);
	const sidebarMinWidth = useNav((state) => state.sidebarMinWidth);

	const [rightPanelShowing, setRightPanelShowing] = useState<boolean>(false);

	return (
		<>
			<SiteHeader pageTitle="Prospects" />
			<main
				className={`grid-page-container ${
					isSidebarOpen
						? `w-[calc(100%-${sidebarMaxWidth})]`
						: `w-[calc(100%-${sidebarMinWidth})]`
				}`}
			>
				<div className="grid-page-header">
					<span className="grid-page-header-path"> Client Services /</span>
					<span className="grid-page-header-page"> Prospects</span>
				</div>
				<div className="grid-toolbar-row flex justify-between items-center">
					<div className=" flex items-center justify-end"></div>
					<div className="flex items-center justify-end">
						<div className="rounded-lg p-1 flex gap-1">
							<button
								className="button-solid items-center flex"
								onClick={() => setRightPanelShowing(!rightPanelShowing)}
							>
								<UserPlusIcon className={"w-8 h-6 p-1"} />
								<span className="p-1 text-sm">Add New Prospect</span>
							</button>
						</div>
					</div>
				</div>
				<div
					className={`grid-container-toolbar  ${
						rightPanelShowing ? "flex-1 flex gap-4" : ""
					} `}
				>
					<DynamicTable model="OpportunityWithFirstContact" readOnly={true} />
					<TablePanel></TablePanel>
				</div>
			</main>
		</>
	);
}
