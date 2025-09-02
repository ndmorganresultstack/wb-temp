"use client";

import DynamicTable from "@/components/DynamicTable";
import { useRef } from "react";
import { useNav } from "@/hooks/useNav";
import { SiteHeader } from "@/components/SiteHeader";

export default function EmployeesPage() {
	const isSidebarOpen = useNav((state) => state.isSidebarOpen);
	const sidebarMaxWidth = useNav((state) => state.sidebarMaxWidth);
	const sidebarMinWidth = useNav((state) => state.sidebarMinWidth);
	const gridRef = useRef<any>(null);

	return (
		<>
			<SiteHeader pageTitle="Locations" />
			<main
				className={`grid-page-container ${
					isSidebarOpen
						? `w-[calc(100%-${sidebarMaxWidth})]`
						: `w-[calc(100%-${sidebarMinWidth})]`
				}`}
			>
				<div className="grid-page-header">
					<span className="grid-page-header-path"> Master Data /</span>
					<span className="grid-page-header-page"> Locations</span>
				</div>
				<div className="grid-toolbar-row flex justify-between items-center"></div>
				<div className="grid-container-toolbar">
					<DynamicTable model="LocationsView" readOnly={true} includeTotalRow={false} />
				</div>
			</main>
		</>
	);
}
