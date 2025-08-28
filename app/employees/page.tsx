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

	console.log(sidebarMaxWidth, sidebarMinWidth);
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
					<span className="grid-page-header-path"> Employees /</span>
					<span className="grid-page-header-page"> Employee Roster</span>
				</div>
				<div
					className="grid-container"
					style={{ height: "calc(100%)", width: "calc(100%)" }}
				>
					<DynamicTable model="Employees" readOnly={false} />
				</div>
			</main>
		</>
	);
}
