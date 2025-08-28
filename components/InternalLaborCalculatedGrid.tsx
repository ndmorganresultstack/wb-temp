"use client";

import { useState, useMemo, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { roundToTwoDecimals, wbTheme } from "@/lib/helper";
import { SelectOption } from "@/types/prisma";
import "../app/globals.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const InternalLaborCalculatedGrid = forwardRef((props, ref) => {
	const [rowData, setRowData] = useState<any[]>([]);
	const [employeeOptions, setEmployeeOptions] = useState<SelectOption[]>([]);
	const [serviceAccountOptions, setServiceAccountOptions] = useState<SelectOption[]>([]);
	const gridRef = useRef<AgGridReact>(null);

	useImperativeHandle(ref, () => ({
		AddNewRow: () => addNewRow(),
	}));

	useEffect(() => {
		// Fetch employee options
		fetch("/api/relations/Employees?displayFields=EE_NO,FirstName,LastName")
			.then((res) => res.json())
			.then(setEmployeeOptions)
			.catch((error) => console.error("Error fetching employee options:", error));

		// Fetch service account options
		fetch("/api/relations/ServiceAccounts?displayFields=ServiceDescription")
			.then((res) => res.json())
			.then(setServiceAccountOptions)
			.catch((error) => console.error("Error fetching service account options:", error));

		// Fetch InternalLabor data
		fetch("/api/db/InternalLabor")
			.then((res) => res.json())
			.then((response) => setRowData(response.data))
			.catch((error) => console.error("Error fetching InternalLabor data:", error));
	}, []);

	const calculateRow = (row: any) => {
		const base = parseFloat(row.BaseAnnualSalary) || 0;
		const incPct = parseFloat(row.SalaryIncreasePct) || 0;
		const bonusPct = parseFloat(row.BonusPct) || 0;
		const eesrePct = parseFloat(row.EESREPct) || 0;
		const adminPct = parseFloat(row.AdminSharePct) || 0;

		row.JanSalaryAnnual = base;
		row.AprSalaryAnnual = base + roundToTwoDecimals(base * (incPct / 100));

		const monthlyPre = roundToTwoDecimals(base / 12);
		const monthlyPost = roundToTwoDecimals(row.AprSalaryAnnual / 12);

		row.Jan = monthlyPre;
		row.Feb = monthlyPre; // Treating Feb as number despite schema type
		row.Mar = monthlyPre;
		row.Apr = monthlyPost;
		row.May = monthlyPost;
		row.Jun = monthlyPost;
		row.Jul = monthlyPost;
		row.Aug = monthlyPost;
		row.Sep = monthlyPost;
		row.Oct = monthlyPost;
		row.Nov = monthlyPost;
		row.Dec = monthlyPost;

		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		row.FYAnnualSalary = roundToTwoDecimals(
			months.reduce((sum, m) => sum + (parseFloat(row[m]) || 0), 0)
		);

		row.BonusAnnual = roundToTwoDecimals(row.BaseAnnualSalary * (bonusPct / 100));
		row.FYBonus = row.BonusAnnual;

		row.EESRE = roundToTwoDecimals(row.FYAnnualSalary * (eesrePct / 100));

		row.FYTotal = roundToTwoDecimals(row.FYAnnualSalary + row.FYBonus + row.EESRE);

		row.AdminMgtAnnual = roundToTwoDecimals(row.FYTotal * (adminPct / 100));
		row.PropMgtAnnual = roundToTwoDecimals(row.FYTotal - row.AdminMgtAnnual);

		return row;
	};

	const addNewRow = async () => {
		const newRow = {
			InternalLaborId: Math.max(...rowData.map((r: any) => r.InternalLaborId), 0) + 1, // Temporary ID
			FiscalYear: new Date().getFullYear(),
			Employee: employeeOptions[0]?.value || "",
			ServiceAccount: serviceAccountOptions[0]?.value || "",
			BaseAnnualSalary: 100000,
			SalaryIncreasePct: 3,
			BonusPct: 25,
			EESREPct: 26,
			AdminSharePct: 25,
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
			"BaseAnnualSalary",
			"SalaryIncreasePct",
			"BonusPct",
			"EESREPct",
			"AdminSharePct",
			"FiscalYear",
			"Employee",
			"ServiceAccount",
		];

		if (editableFields.includes(field)) {
			const updatedRow = { ...params.data };
			calculateRow(updatedRow);

			// Update the local row data
			const newRowData = rowData.map((row: any) =>
				row.InternalLaborId === updatedRow.InternalLaborId ? updatedRow : row
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

				// Refresh the grid
				params.api.refreshCells({ rowNodes: [params.node], force: true });
			} catch (error) {
				console.error("Error updating row:", error);
				// Optionally revert changes or notify user
			}
		}
	};

	const colDefs = useMemo(
		() => [
			{ field: "InternalLaborId", headerName: "ID", editable: false, width: 5, height: 1 },
			{
				field: "FiscalYear",
				headerName: "FY",
				editable: true,
				width: 60,
				height: 1,
				cellStyle: { color: "var(--edit-cell-color)" },
			},
			{
				field: "Employee",
				headerName: "Employee",
				editable: true,
				cellEditor: "agSelectCellEditor",
				cellEditorParams: {
					values: employeeOptions.map((o: any) => o.label),
				},
				width: 150,
				height: 1,
				cellStyle: { color: "var(--edit-cell-color)" },
			},
			{
				field: "ServiceAccount",
				headerName: "Service Account",
				editable: true,
				cellEditor: "agSelectCellEditor",
				cellEditorParams: { values: serviceAccountOptions.map((o: any) => o.value) },
				width: 120,
				height: 1,
				cellStyle: { color: "var(--edit-cell-color)" },
			},
			{
				field: "BaseAnnualSalary",
				headerName: "Base Annual Salary",
				editable: true,
				width: 100,
				height: 1,
				cellStyle: { color: "var(--edit-cell-color)" },
			},
			{
				field: "AprSalaryAnnual",
				headerName: "Apr Annual",
				editable: false,
				width: 100,
				height: 1,
			},
			{
				field: "JanSalaryAnnual",
				headerName: "Jan Annual",
				editable: false,
				width: 100,
				height: 1,
			},
			{
				field: "SalaryIncreasePct",
				headerName: "Salary Increase Pct",
				editable: true,
				width: 100,
				height: 1,
				cellStyle: { color: "var(--edit-cell-color)" },
			},
			{
				field: "BonusAnnual",
				headerName: "Bonus Annual",
				editable: false,
				width: 100,
				height: 1,
			},
			{
				field: "BonusPct",
				headerName: "Bonus Pct",
				editable: true,
				width: 100,
				height: 1,
				cellStyle: { color: "var(--edit-cell-color)" },
			},
			{
				field: "FYAnnualSalary",
				headerName: "FY Annual Salary",
				editable: false,
				width: 100,
				height: 1,
			},
			{ field: "FYBonus", headerName: "FY Bonus", editable: false, width: 100, height: 1 },
			{ field: "EESRE", headerName: "EESRE", editable: false, width: 100, height: 1 },
			{
				field: "EESREPct",
				headerName: "EESRE Pct",
				editable: true,
				width: 100,
				height: 1,
				cellStyle: { color: "var(--edit-cell-color)" },
			},
			{ field: "FYTotal", headerName: "FY Total", editable: false, width: 100, height: 1 },
			{
				field: "AdminSharePct",
				headerName: "Admin Share Pct",
				editable: true,
				width: 100,
				height: 1,
				cellStyle: { color: "var(--edit-cell-color)" },
			},
			{
				field: "AdminMgtAnnual",
				headerName: "Admin Mgt Annual",
				editable: false,
				width: 100,
				height: 1,
			},
			{
				field: "PropMgtAnnual",
				headerName: "Prop Mgt Annual",
				editable: false,
				width: 100,
				height: 1,
			},
			{ field: "Jan", headerName: "Jan", editable: false, width: 100, height: 1 },
			{ field: "Feb", headerName: "Feb", editable: false, width: 100, height: 1 },
			{ field: "Mar", headerName: "Mar", editable: false, width: 100, height: 1 },
			{ field: "Apr", headerName: "Apr", editable: false, width: 100, height: 1 },
			{ field: "May", headerName: "May", editable: false, width: 100, height: 1 },
			{ field: "Jun", headerName: "Jun", editable: false, width: 100, height: 1 },
			{ field: "Jul", headerName: "Jul", editable: false, width: 100, height: 1 },
			{ field: "Aug", headerName: "Aug", editable: false, width: 100, height: 1 },
			{ field: "Sep", headerName: "Sep", editable: false, width: 100, height: 1 },
			{ field: "Oct", headerName: "Oct", editable: false, width: 100, height: 1 },
			{ field: "Nov", headerName: "Nov", editable: false, width: 100, height: 1 },
			{ field: "Dec", headerName: "Dec", editable: false, width: 100, height: 1 },
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
		/>
	);
});

export default InternalLaborCalculatedGrid;
