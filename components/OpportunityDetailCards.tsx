import {
	Building,
	Building2,
	CircleFadingArrowUp,
	DollarSign,
	MapPin,
	UserCheck,
	UserPlus,
	type LucideProps,
} from "lucide-react";
import { DealStage } from "@/components/DealStage";

function OpportunityDetailCard({
	items,
}: {
	items: {
		Icon: React.ForwardRefExoticComponent<
			Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
		>;
		label: string;
		content: string | React.ReactNode;
	}[];
}) {
	return (
		<div
			className="px-6 py-4 w-full flex gap-x-5 text-sm border rounded-sm border-gray-200 shadow-sm items-center"
			style={{ justifyContent: items.length > 1 ? "space-around" : undefined }}
		>
			{items.map(({ Icon, label, content }, key) => (
				<div className="flex gap-x-2 items-start" key={key}>
					<Icon className="size-5" />
					<div className="flex flex-col">
						<span className="text-gray-600">{label}</span>
						{content}
					</div>
				</div>
			))}
		</div>
	);
}

export function OpportunityDetailCards({
	company,
	owner,
	dealStage,
	dealValue,
	ContactInfo,
	address,
	sites,
	unitCount,
}: {
	company: string;
	owner: string;
	dealStage: string;
	dealValue: string;
	ContactInfo: React.ReactNode;
	address: string;
	sites: number;
	unitCount: number;
}) {
	return (
		<div className="flex flex-col gap-y-3">
			<div className="grid grid-cols-4 gap-x-2">
				<OpportunityDetailCard
					items={[
						{
							Icon: Building,
							label: "Company",
							content: company,
						},
					]}
				/>

				<OpportunityDetailCard
					items={[
						{
							Icon: UserCheck,
							label: "Owner",
							content: owner,
						},
					]}
				/>

				<OpportunityDetailCard
					items={[
						{
							Icon: CircleFadingArrowUp,
							label: "Deal Stage",
							content: <DealStage label={dealStage} />,
						},
					]}
				/>

				<OpportunityDetailCard
					items={[
						{
							Icon: DollarSign,
							label: "Deal Value",
							content: dealValue,
						},
					]}
				/>
			</div>

			<div className="grid grid-cols-3 gap-x-2 -mt-3">
				<OpportunityDetailCard
					items={[
						{
							Icon: UserPlus,
							label: "Main Contact",
							content: ContactInfo,
						},
					]}
				/>

				<OpportunityDetailCard
					items={[
						{
							Icon: MapPin,
							label: "Address",
							content: address,
						},
					]}
				/>

				<OpportunityDetailCard
					items={[
						{
							Icon: Building2,
							label: "Sites",
							content: sites,
						},
						{
							Icon: Building2,
							label: "Units",
							content: unitCount,
						},
					]}
				/>
			</div>
		</div>
	);
}
