"use client";

import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule, ColDef } from "ag-grid-community";
import { wbTheme } from "@/lib/helper";
import { PipelineOpportunitiesData } from "@/app/api/opportunities/route";

ModuleRegistry.registerModules([AllCommunityModule]);

const PipelineGrid = () => {
	const [rowData, setRowData] = useState<PipelineOpportunitiesData>([]);
	const gridRef = useRef<AgGridReact>(null);

	useEffect(() => {
		// Fetch InternalLabor data
		fetch("/api/opportunities")
			.then((res) => res.json())
			.then((response) => setRowData(response.data))
			.catch((error) => console.error("Error fetching InternalLabor data:", error));
	}, []);

	// const calculateRow = (row: any) => {
	// 	const base = parseFloat(row.BaseAnnualSalary) || 0;
	// 	const incPct = parseFloat(row.SalaryIncreasePct) || 0;
	// 	const bonusPct = parseFloat(row.BonusPct) || 0;
	// 	const eesrePct = parseFloat(row.EESREPct) || 0;
	// 	const adminPct = parseFloat(row.AdminSharePct) || 0;

	// 	row.JanSalaryAnnual = base;
	// 	row.AprSalaryAnnual = base + roundToTwoDecimals(base * (incPct / 100));

	// 	const monthlyPre = roundToTwoDecimals(base / 12);
	// 	const monthlyPost = roundToTwoDecimals(row.AprSalaryAnnual / 12);

	// 	row.Jan = monthlyPre;
	// 	row.Feb = monthlyPre; // Treating Feb as number despite schema type
	// 	row.Mar = monthlyPre;
	// 	row.Apr = monthlyPost;
	// 	row.May = monthlyPost;
	// 	row.Jun = monthlyPost;
	// 	row.Jul = monthlyPost;
	// 	row.Aug = monthlyPost;
	// 	row.Sep = monthlyPost;
	// 	row.Oct = monthlyPost;
	// 	row.Nov = monthlyPost;
	// 	row.Dec = monthlyPost;

	// 	const months = [
	// 		"Jan",
	// 		"Feb",
	// 		"Mar",
	// 		"Apr",
	// 		"May",
	// 		"Jun",
	// 		"Jul",
	// 		"Aug",
	// 		"Sep",
	// 		"Oct",
	// 		"Nov",
	// 		"Dec",
	// 	];
	// 	row.FYAnnualSalary = roundToTwoDecimals(
	// 		months.reduce((sum, m) => sum + (parseFloat(row[m]) || 0), 0)
	// 	);

	// 	row.BonusAnnual = roundToTwoDecimals(row.BaseAnnualSalary * (bonusPct / 100));
	// 	row.FYBonus = row.BonusAnnual;

	// 	row.EESRE = roundToTwoDecimals(row.FYAnnualSalary * (eesrePct / 100));

	// 	row.FYTotal = roundToTwoDecimals(row.FYAnnualSalary + row.FYBonus + row.EESRE);

	// 	row.AdminMgtAnnual = roundToTwoDecimals(row.FYTotal * (adminPct / 100));
	// 	row.PropMgtAnnual = roundToTwoDecimals(row.FYTotal - row.AdminMgtAnnual);

	// 	return row;
	// };

	// const handleCellValueChanged = async (params: any) => {
	// 	const field = params.colDef.field;
	// 	const editableFields = [
	// 		"baseAnnualSalary",
	// 		"salaryIncreasePct",
	// 		"bonusPct",
	// 		"EESREPct",
	// 		"adminSharePct",
	// 		"fiscalYear",
	// 		"employee",
	// 		"serviceAccount",
	// 	];

	// 	if (editableFields.includes(field)) {
	// 		const updatedRow = { ...params.data };
	// 		calculateRow(updatedRow);

	// 		// Update the local row data
	// 		const newRowData = rowData.map((row: any) =>
	// 			row.InternalLaborId === updatedRow.InternalLaborId ? updatedRow : row
	// 		);
	// 		setRowData(newRowData);

	// 		try {
	// 			const response = await fetch("/api/db/InternalLabor", {
	// 				method: "PUT",
	// 				headers: { "Content-Type": "application/json" },
	// 				body: JSON.stringify(updatedRow),
	// 			});

	// 			if (!response.ok) {
	// 				throw new Error("Failed to update row");
	// 			}

	// 			params.api.refreshCells({ rowNodes: [params.node], force: true });
	// 		} catch (error) {
	// 			console.error("Error updating row:", error);
	// 		}
	// 	}
	// };

	const colDefs: ColDef[] = [
		{ field: "opportunityId", headerName: "ID", editable: false, width: 5 },
		{
			field: "description",
			headerName: "Opportunity Name",
			editable: false,
			width: 120,
		},
		{
			valueGetter: ({ data }: { data: PipelineOpportunitiesData[0] }) =>
				`${data.OpportunityContact?.at(0)?.Contact?.firstName} ${
					data.OpportunityContact?.at(0)?.Contact?.lastName
				}`,
			headerName: "Contact Name",
			editable: false,
			width: 120,
		},
		{
			valueGetter: ({ data }: { data: PipelineOpportunitiesData[0] }) =>
				data.OpportunityContact.at(0)?.Contact?.jobTitle,
			headerName: "Title",
			editable: false,
			width: 150,
		},
		{
			valueGetter: ({ data }: { data: PipelineOpportunitiesData[0] }) =>
				data.OpportunityContact.at(0)?.Contact?.email,
			headerName: "Email",
			editable: false,
			width: 150,
		},

		{
			valueGetter: ({ data }: { data: PipelineOpportunitiesData[0] }) =>
				data.OpportunityContact.at(0)?.Contact?.phone,
			headerName: "Phone",
			editable: false,
			width: 150,
		},
	];

	const pagination = true;
	const paginationPageSize = 35;
	const paginationPageSizeSelector = [20, 35, 50, 100];

	return (
		<AgGridReact
			theme={wbTheme}
			ref={gridRef}
			rowData={rowData}
			columnDefs={colDefs}
			defaultColDef={{ resizable: true, sortable: true, filter: true }}
			// onCellValueChanged={handleCellValueChanged}
			pagination={pagination}
			paginationPageSize={paginationPageSize}
			paginationPageSizeSelector={paginationPageSizeSelector}
		/>
	);
};

export default PipelineGrid;
