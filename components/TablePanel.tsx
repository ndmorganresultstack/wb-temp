// RightPanel component to display on the right half of the page
export interface TablePanelProps {
	children?: React.ReactNode; // Allow adding content later
}

export function TablePanel({ children }: TablePanelProps) {
	return (
		<div className="fixed top-40 right-0 w-1/2 h-[calc(100vh-200px)] bg-white rounded-l-lg p-4 overflow-y-auto z-10 shadow-lg">
			{children ? children : <div className="text-gray-500 text-sm"></div>}
		</div>
	);
}
