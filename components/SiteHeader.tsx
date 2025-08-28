"use client";

import { useNav } from "@/hooks/useNav";
import { Cog6ToothIcon, QuestionMarkCircleIcon, BellAlertIcon } from "@heroicons/react/24/solid";

export const SiteHeader = ({ pageTitle }: { pageTitle: string }) => {
	const isSidebarOpen = useNav((state) => state.isSidebarOpen);
	const toggleSidebar = useNav.getState().toggleSidebar;

	return (
		<header
			className={`bg-[var(--wb-background-color)] text-white p-2 flex min-h-[56px]  justify-between items-center transition-all duration-300 ease-in-out border-b border-gray-200 ${
				isSidebarOpen ? "ml-0" : "ml-16px"
			}`}
		>
			<span className="sitePageTitle">{pageTitle}</span>
			<div className="flex items-center space-x-4">
				<BellAlertIcon className="w-5 h-5 flex-shrink-0 text-white-600" />
				<QuestionMarkCircleIcon className="w-5 h-4 flex-shrink-0 text-white-600" />
				<Cog6ToothIcon className="w-5 h-5 flex-shrink-0 text-white-600" />
			</div>
		</header>
	);
};
