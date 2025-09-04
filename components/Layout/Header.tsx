"use client";

import { useNav } from "@/hooks/useNav";
import { RectangleGroupIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon, QuestionMarkCircleIcon, BellAlertIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
	const showSidebar = useNav((state) => state.showSidebar);

	return (
		<header className="bg-[var(--wb-background-color)] text-white h-[68px] flex items-center transition-all duration-300 ease-in-out w-full">
			<Link
				href={"/"}
				className="flex items-center gap-x-4"
				style={{
					minWidth: showSidebar ? "300px" : "66px",
					justifyContent: showSidebar ? "flex-start" : "center",
				}}
			>
				<div
					className="bg-[#4E357D] size-6 rounded-full p-1 ml-6"
					style={{ display: showSidebar ? "flex" : "none" }}
				>
					<RectangleGroupIcon className="stroke-white" />
				</div>

				<div className="flex gap-x-2">
					<Image
						src="/header_logo_s.png"
						alt="Willowbridge Logo"
						width={36}
						height={36}
						className="hover:opacity-80 transition-opacity object-contain"
					/>
					<div
						className="flex-col text-sm"
						style={{ display: showSidebar ? "flex" : "none" }}
					>
						<b>Willow Bridge</b>
						<span className="text-xs">Enterprise Management System</span>
					</div>
				</div>
			</Link>

			<div className="flex items-center space-x-4 w-full justify-end pr-4">
				<BellAlertIcon className="size-5" />
				<QuestionMarkCircleIcon className="size-5" />
				<Cog6ToothIcon className="size-5" />
			</div>
		</header>
	);
};
