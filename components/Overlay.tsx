export function Overlay({ children }: { children: React.ReactNode }) {
	return (
		<div className="z-50 bg-white absolute left-0 top-0 right-0 bottom-0 border-l border-l-gray-200 px-10 py-12">
			{children}
		</div>
	);
}

export function Tab({
	text,
	index,
	tab,
	setTab,
}: {
	text: string;
	index: number;
	tab: number;
	setTab: (index: number) => void;
}) {
	return (
		<button
			onClick={() => setTab(index)}
			className={`p-4 text-sm border-b-2 font-semibold ${tab === index ? "bg-gray-200 border-b-gray-500" : "text-gray-400 border-b-gray-200 hover:bg-gray-100"}`}
		>
			{text}
		</button>
	);
}

export function Table({
	headerRow,
	bodyRows,
}: {
	headerRow: string[];
	bodyRows: string[][] | React.ReactNode[][];
}) {
	const lastHeader = headerRow.length - 1;
	return (
		<table className="text-xs overflow-x-scroll">
			<thead className="bg-gray-200 text-nowrap">
				<tr className="">
					{headerRow.map((i, key) => (
						<th
							className={`text-start py-2 ${key === 0 ? "pl-2" : key === lastHeader ? "pr-2" : "px-1"}`}
							key={key}
						>
							{i}
						</th>
					))}
				</tr>
			</thead>

			<tbody>
				{bodyRows.map((row, key) => (
					<tr key={key} className="border-t border-t-gray-200 text-[11px]">
						{row.map((item, key) => (
							<td
								key={key}
								className={`${key === 0 ? "pl-2 pr-1" : key === lastHeader ? "pr-2 pl-1" : "px-1"} py-1.5`}
							>
								{item}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
