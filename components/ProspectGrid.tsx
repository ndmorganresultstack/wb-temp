"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { roundToTwoDecimals, wbTheme } from "@/lib/helper";
import { SelectOption } from "@/types/prisma";

ModuleRegistry.registerModules([AllCommunityModule]);

const ProspectGrid = () => {
	const [rowData, setRowData] = useState<any[]>([]);
	const gridRef = useRef<AgGridReact>(null);

	useEffect(() => {
		// Fetch InternalLabor data
		fetch("/api/Opportunity")
			.then((res) => res.json())
			.then((response) => setRowData(response.data))
			.catch((error) => console.error("Error fetching Opportunity data:", error));
	}, []);

	const colDefs = useMemo(
		() => [
			{ field: "opportunityId", headerName: "ID", editable: false, width: 1, height: 1 },
			{ field: "description", headerName: "Name", editable: false, width: 100, height: 1 },
		],
		[]
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
			pagination={pagination}
			paginationPageSize={paginationPageSize}
			paginationPageSizeSelector={paginationPageSizeSelector}
		/>
	);
};

export default ProspectGrid;
