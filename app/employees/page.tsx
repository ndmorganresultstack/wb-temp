"use client";

import DynamicTable from "@/components/DynamicTable";

export default function EmployeesPage() {
	return (
		<main className="grid-page-container">
			<div className="grid-page-header">
				<span className="grid-page-header-path"> Employees /</span>
				<span className="grid-page-header-page"> Employee Roster</span>
			</div>
			<div className="grid-toolbar-row flex justify-between items-center"></div>
			<div className="grid-container-toolbar">
				<DynamicTable
					model="Employee"
					readOnly={false}
					includeTotalRow={false}
					onRowClick={() => {}}
				/>
			</div>
		</main>
	);
}
