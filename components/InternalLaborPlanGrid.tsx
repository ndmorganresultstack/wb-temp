"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { roundToTwoDecimals, wbTheme } from "@/lib/helper";
import { SelectOption } from "@/types/prisma";

ModuleRegistry.registerModules([AllCommunityModule]);

interface InternalLaborPlanGridProps {
	includeTotalRow: boolean;
}

const InternalLaborPlanGrid = ({ includeTotalRow = false }: InternalLaborPlanGridProps) => {
	const [rowData, setRowData] = useState<any[]>([]);
	const [stableMetadata, setStableMetadata] = useState<any>();
	const [employeeOptions, setEmployeeOptions] = useState<SelectOption[]>([]);
	const [serviceAccountOptions, setServiceAccountOptions] = useState<SelectOption[]>([]);
	const gridRef = useRef<AgGridReact>(null);

	const pinnedTotalRow = useMemo(() => {
		if (!includeTotalRow || !rowData?.length || !stableMetadata) {
			return [];
		}

		const totals: Record<string, any> = { id: "Totals" };
		const numbericFields = stableMetadata.fields.filter(
			(f: any) => f.type == "Int" || f.type == "Decimal"
		);

		numbericFields.forEach((f: any) => {
			const sum = rowData.reduce((acc: number, row: any) => {
				const fv = parseFloat(row[f.name]);
				return isNaN(fv) ? acc : acc + fv;
			}, 0);
			totals[f.name] = f.type === "Decimal" ? roundToTwoDecimals(sum) : sum;
		});
		return [totals];
	}, [rowData, stableMetadata, includeTotalRow]);

	useEffect(() => {
		// Fetch employee options
		fetch("/api/relations/Employee?displayFields=employeeId,firstName,lastName")
			.then((res) => res.json())
			.then(setEmployeeOptions)
			.catch((error) => console.error("Error fetching employee options:", error));

		// Fetch service account options
		fetch("/api/relations/ServiceAccount?displayFields=serviceDescription")
			.then((res) => res.json())
			.then(setServiceAccountOptions)
			.catch((error) => console.error("Error fetching service account options:", error));

		// Fetch InternalLabor data
		fetch("/api/db/InternalLabor")
			.then((res) => res.json())
			.then((response) => {
				setRowData(response.data);
				setStableMetadata(response.metadata);
			})
			.catch((error) => console.error("Error fetching InternalLabor data:", error));
	}, []);

	const calculateRow = (row: any) => {
		const base = parseFloat(row.baseAnnualSalary) || 0;
		const incPct = parseFloat(row.salaryIncreasePct) || 0;
		const bonusPct = parseFloat(row.bonusPct) || 0;
		const eesrePct = parseFloat(row.EESREPct) || 0;
		const adminPct = parseFloat(row.adminSharePct) || 0;

		row.janSalaryAnnual = base;
		row.aprSalaryAnnual = base + roundToTwoDecimals(base * (incPct / 100));

		const monthlyPre = roundToTwoDecimals(base / 12);
		const monthlyPost = roundToTwoDecimals(row.aprSalaryAnnual / 12);

		row.jan = monthlyPre;
		row.feb = monthlyPre; // Treating Feb as number despite schema type
		row.mar = monthlyPre;
		row.apr = monthlyPost;
		row.may = monthlyPost;
		row.jun = monthlyPost;
		row.jul = monthlyPost;
		row.aug = monthlyPost;
		row.sep = monthlyPost;
		row.oct = monthlyPost;
		row.nov = monthlyPost;
		row.dec = monthlyPost;

		const months = [
			"jan",
			"feb",
			"mar",
			"apr",
			"may",
			"jun",
			"jul",
			"aug",
			"sep",
			"oct",
			"nov",
			"dec",
		];
		row.FYAnnualSalary = roundToTwoDecimals(
			months.reduce((sum, m) => sum + (parseFloat(row[m]) || 0), 0)
		);

		row.bonusAnnual = roundToTwoDecimals(row.baseAnnualSalary * (bonusPct / 100));
		row.FYBonus = row.bonusAnnual;

		row.EESRE = roundToTwoDecimals(row.FYAnnualSalary * (eesrePct / 100));

		row.FYTotal = roundToTwoDecimals(row.FYAnnualSalary + row.FYBonus + row.EESRE);

		row.adminMgtAnnual = roundToTwoDecimals(row.FYTotal * (adminPct / 100));
		row.propMgtAnnual = roundToTwoDecimals(row.FYTotal - row.adminMgtAnnual);

		return row;
	};

	const addNewRow = async () => {
		const newRow = {
			internalLaborId: Math.max(...rowData.map((r: any) => r.internalLaborId), 0) + 1, // Temporary ID
			fiscalYear: new Date().getFullYear(),
			employee: employeeOptions[0]?.value || "",
			serviceAccount: serviceAccountOptions[0]?.value || "",
			baseAnnualSalary: 100000,
			salaryIncreasePct: 3,
			bonusPct: 25,
			EESREPct: 26,
			adminSharePct: 25,
		};

		const calculatedRow = calculateRow({ ...newRow });

		try {
			const response = await fetch("/api/db/InternalLabor", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(calculatedRow),
			});

			if (!response.ok) {
				throw new Error("Failed to create new row");
			}

			const savedRow = await response.json();
			setRowData([...rowData, savedRow]);
			gridRef.current?.api.applyTransaction({ add: [savedRow] });
		} catch (error) {
			console.error("Error saving new row:", error);
		}
	};

	const handleCellValueChanged = async (params: any) => {
		const field = params.colDef.field;
		const editableFields = [
			"baseAnnualSalary",
			"salaryIncreasePct",
			"bonusPct",
			"EESREPct",
			"adminSharePct",
			"fiscalYear",
			"employee",
			"serviceAccount",
		];

		if (editableFields.includes(field)) {
			const updatedRow = { ...params.data };
			calculateRow(updatedRow);

			// Update the local row data
			const newRowData = rowData.map((row: any) =>
				row.internalLaborId === updatedRow.internalLaborId ? updatedRow : row
			);
			setRowData(newRowData);

			try {
				const response = await fetch("/api/db/InternalLabor", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedRow),
				});

				if (!response.ok) {
					throw new Error("Failed to update row");
				}

				params.api.refreshCells({ rowNodes: [params.node], force: true });
			} catch (error) {
				console.error("Error updating row:", error);
			}
		}
	};

	const colDefs = useMemo(
		() => [
			{ field: "internalLaborId", headerName: "ID", editable: false, width: 5, height: 1 },
			{ field: "fiscalYear", headerName: "FY", editable: false, width: 60, height: 1 },
			{
				field: "employee",
				headerName: "Employee",
				editable: false,
				cellEditor: "agSelectCellEditor",
				cellEditorParams: {
					values: employeeOptions.map((o: any) => o.label),
				},
				width: 150,
				height: 1,
			},
			{
				field: "serviceAccount",
				headerName: "Service Account",
				editable: false,
				cellEditor: "agSelectCellEditor",
				cellEditorParams: { values: serviceAccountOptions.map((o: any) => o.value) },
				width: 120,
				height: 1,
			},
			{
				field: "FYAnnualSalary",
				headerName: "FY Annual Salary",
				editable: false,
				width: 150,
				height: 1,
			},
			{ field: "FYBonus", headerName: "FY Bonus", editable: false, width: 150, height: 1 },
			{ field: "EESRE", headerName: "EESRE", editable: false, width: 150, height: 1 },
			{ field: "FYTotal", headerName: "FY Total", editable: false, width: 150, height: 1 },
			{
				field: "adminSharePct",
				headerName: "Admin Share Pct",
				editable: true,
				width: 150,
				height: 1,
				cellStyle: { color: "var(--edit-cell-color)" },
			},
			{
				field: "adminMgtAnnual",
				headerName: "Admin Mgt Annual",
				editable: false,
				width: 150,
				height: 1,
			},
			{
				field: "propMgtAnnual",
				headerName: "Prop Mgt Annual",
				editable: false,
				width: 150,
				height: 1,
			},
		],
		[employeeOptions, serviceAccountOptions]
	);

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
			onCellValueChanged={handleCellValueChanged}
			pagination={pagination}
			paginationPageSize={paginationPageSize}
			paginationPageSizeSelector={paginationPageSizeSelector}
			pinnedBottomRowData={pinnedTotalRow}
		/>
	);
};

export default InternalLaborPlanGrid;
