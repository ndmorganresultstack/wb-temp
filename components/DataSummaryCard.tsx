import type { LucideProps } from "lucide-react";

interface DataSummaryCardProps {
	title: string;
	value: string;
	percentage: number;
	isIncrease?: boolean;
	Icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>;
}

export function DataSummaryCard({ title, value, percentage, isIncrease, Icon }: DataSummaryCardProps) {
	return (
		<div className="bg-white text-xs rounded-md w-full min-w-[200px] border border-gray-300 shadow-xs p-3 flex flex-col gap-y-2">
			<div className="flex gap-x-5 justify-between items-center">
				<span>{title}</span>
				<Icon className="size-5 bg-gray-200 rounded-xs p-0.5" />
			</div>
			<div className="flex gap-x-5 items-center">
				<b className="text-lg italic">{value}</b>
				<div
					className={`${
						isIncrease ? "bg-green-200" : "bg-red-200"
					} rounded-sm px-1 py-0.5`}
				>
					{isIncrease ? "+" : "-"}
					{percentage}%
				</div>
			</div>
		</div>
	);
}
