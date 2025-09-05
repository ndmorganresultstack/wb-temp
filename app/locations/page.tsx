"use client";

import DynamicTable from "@/components/DynamicTable";

export default function EmployeesPage() {
	return (
		<main className="grid-page-container">
			<div className="grid-page-header">
				<span className="grid-page-header-path"> Master Data /</span>
				<span className="grid-page-header-page"> Locations</span>
			</div>
			<div className="grid-toolbar-row flex justify-between items-center"></div>
			<div className="grid-container-toolbar">
				<DynamicTable model="LocationsView" readOnly={true} includeTotalRow={false} onRowClick={() => {}} />
			</div>
		</main>
	);
}
