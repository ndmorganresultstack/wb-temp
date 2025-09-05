"use client";

import DynamicTable from "@/components/DynamicTable";

export default function EmployeesPage() {
	return (
		<main className="grid-page-container">
			<div className="grid-page-header">
				<span className="grid-page-header-path"> Costs /</span>
				<span className="grid-page-header-page"> Software Costs</span>
			</div>
			<div className="grid-container-no-toolbar">
				<DynamicTable
					model="SoftwareCosts"
					readOnly={false}
					includeTotalRow={true}
					onRowClick={() => {}}
				/>
			</div>
		</main>
	);
}
