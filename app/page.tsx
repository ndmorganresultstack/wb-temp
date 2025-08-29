"use client";

import { useNav } from "@/hooks/useNav";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
	const isSidebarOpen = useNav((state) => state.isSidebarOpen);
	const sidebarMaxWidth = useNav((state) => state.sidebarMaxWidth);
	const sidebarMinWidth = useNav((state) => state.sidebarMinWidth);

	return (
		<>
			<SiteHeader pageTitle="Willowbridge" />
			<main
				className={`grid-page-container ${
					isSidebarOpen
						? `w-[calc(100%-${sidebarMaxWidth})]`
						: `w-[calc(100%-${sidebarMinWidth})]`
				}`}
			>
				<div className="grid-page-header"></div>
				<div className="grid-container-no-toolbar"></div>
			</main>
		</>
	);
}
