"use client";

import DynamicTable from "@/components/DynamicTable";
import "../../app/globals.css";
import { useEffect } from "react";
import { useNav } from "@/hooks/useNav";
import { SiteHeader } from "@/components/SiteHeader";

export default function EmployeesPage() {
	const isSidebarOpen = useNav((state) => state.isSidebarOpen);
	const sidebarMaxWidth = useNav((state) => state.sidebarMaxWidth);
	const sidebarMinWidth = useNav((state) => state.sidebarMinWidth);

	return (
		<>
			<SiteHeader pageTitle="Software Costs" />
			<main
				className={`grid-page-container ${
					isSidebarOpen
						? `w-[calc(100%-${sidebarMaxWidth})]`
						: `w-[calc(100%-${sidebarMinWidth})]`
				}`}
			>
				<div className="grid-page-header">
					<span className="grid-page-header-path"> Costs /</span>
					<span className="grid-page-header-page"> Software Costs</span>
				</div>
				<div className="grid-container-no-toolbar">
					<DynamicTable model="SoftwareCosts" readOnly={false} />
				</div>
			</main>
		</>
	);
}
