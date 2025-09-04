"use client";

import Link from "next/link";
import { ComponentType, SVGProps, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { useNav } from "@/hooks/useNav";
import {
	CircleStackIcon,
	Cog8ToothIcon,
	HomeIcon,
	MagnifyingGlassIcon,
	BanknotesIcon,
	ChatBubbleLeftRightIcon,
	DocumentChartBarIcon,
	DocumentCurrencyDollarIcon,
	KeyIcon,
	TagIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export interface MenuItem {
	name: string;
	icon?: ComponentType<SVGProps<SVGSVGElement>>;
	href?: string;
	subItems?: MenuItem[];
}

export const Sidebar = () => {
	const session = useSession((state) => state.session);
	const showSidebar = useNav((state) => state.showSidebar);
	const toggleSidebar = useNav.getState().toggleSidebar;
	const [expandedItem, setExpandedItem] = useState<string | null>();
	const [expandedSubItem, setExpandedSubItem] = useState<string | null>();
	const [menuItem, setMenuItem] = useState<string | null>();

	const toggleAccordion = (itemName: string) => {
		setExpandedItem(expandedItem === itemName ? null : itemName);
	};

	const toggleSubAccordion = (subItemName: string) => {
		setExpandedSubItem(expandedSubItem === subItemName ? null : subItemName);
	};

	const menuItems: MenuItem[] = [
		{
			name: "",
		},
		{
			name: "Home",
			icon: HomeIcon,
			href: "/",
		},
		{
			name: "User Access",
			icon: KeyIcon,
			subItems: [
				{ name: "Users", href: "/users" },
				{ name: "Roles", href: "/roles" },
			],
		},
		{
			name: "",
		},
		{
			name: "Master Data",
			icon: CircleStackIcon,
			href: "/master-data",
			subItems: [
				{ name: "Chart of Accounts", href: "/chartofaccounts" },
				{ name: "Business Units", href: "/business-units" },
				{ name: "Departments", href: "/departments" },
				{ name: "Vendors", href: "/vendors" },
				{ name: "Software Portfolio", href: "/software-portfolio" },
				{ name: "Cost Managements", href: "/cost-management" },
				{ name: "Operations Statistics", href: "/operation-statistics" },
			],
		},
		{
			name: "Client Services",
			icon: Cog8ToothIcon,
			subItems: [
				{ name: "Prospects", href: "/prospects" },
				{ name: "Opportunity Pipeline", href: "/pipeline" },
				{ name: "Client Portfolio", href: "/client-portfolio" },
				{ name: "Gifting", href: "/gifting" },
				{ name: "Events", href: "/events" },
			],
		},
		{
			name: "Cost of Services",
			icon: TagIcon,
			subItems: [
				{ name: "Service List", href: "/service-list" },
				{ name: "Cost Of Service", href: "/cost-of-service" },
				{ name: "Service Catalog", href: "/service-catalog" },
				{ name: "Property Rate Cards", href: "/property-rate-cards" },
				{ name: "Services Chart of Accounts", href: "/services-chart-of-accounts" },
			],
		},
		{
			name: "Budget & Forecast",
			icon: BanknotesIcon,
		},
		{
			name: "Billing",
			icon: DocumentCurrencyDollarIcon,
		},
		{ name: "" },
		{
			name: "Reports",
			icon: DocumentChartBarIcon,
		},
		{
			name: "Support",
			icon: ChatBubbleLeftRightIcon,
		},
	];

	return (
		<div
			className={`flex flex-col fixed h-[calc(100vh - 68px)] inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 ease-in-out
				${showSidebar ? "w-[300px] translate-x-0" : "w-[66px] -translate-x-0"} 
				 static`}
			style={{ minWidth: showSidebar ? "300px" : "66px" }}
		>
			<nav className="mt-4 mx-[15.5px]">
				<button
					onClick={toggleSidebar}
					className={`border p-0.5 rounded-sm flex ${showSidebar ? "mx-2" : "mx-auto"}`}
				>
					<ChevronRightIcon
						className="size-4"
						style={{
							rotate: showSidebar ? "180deg" : undefined,
						}}
					/>
				</button>

				<ul>
					{menuItems.map((item: MenuItem, key) => (
						<li
							key={key}
							className={`relative ${
								expandedItem === item.name && !showSidebar
									? "bg-gray-100 rounded-md"
									: ""
							} ${item.name == "" ? "border-b-1 border-gray-200" : ""}`}
						>
							<button
								onClick={() => {
									if (!showSidebar) {
										toggleSidebar();
									}
									toggleAccordion(item.name);
								}}
								className="w-full p-2 rounded hover:bg-gray-100 flex items-center focus:outline-none"
							>
								{item.icon && (
									<item.icon
										className={`w-[16px] h-[16px] flex-shrink-0 text-gray-600`}
									/>
								)}
								{showSidebar && (
									<>
										<span className="text-sm ml-2 text-gray-700">
											{item.name}
										</span>
										{item.subItems && (
											<svg
												className={`w-4 h-4 ml-auto transform transition-transform ${
													expandedItem === item.name ? "rotate-180" : ""
												}`}
												fill="none"
												stroke="rgb(23, 23, 23)"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										)}
									</>
								)}
							</button>
							{showSidebar &&
								item.subItems &&
								item.subItems.length > 0 &&
								expandedItem === item.name && (
									<div className="pl-6 mt-1 space-y-1">
										{item.subItems.map((subItem) => (
											<div key={subItem.name}>
												{subItem.href ? (
													<Link
														key={subItem.name}
														href={subItem.href ?? subItem.name}
														className={`block text-xs text-gray-600 py-2 px-2 hover:bg-gray-100 rounded w-[80%] flex items-center
                                ${
									menuItem === subItem.href
										? "font-bold bg-gray-100 border-l-4"
										: ""
								}`}
														onClick={() =>
															setMenuItem(
																subItem.href ?? subItem.name,
															)
														}
													>
														{subItem.icon && (
															<subItem.icon className="w-4 h-4 flex-shrink-0 text-gray-600 mr-2" />
														)}
														{subItem.name}
													</Link>
												) : (
													<button
														onClick={() =>
															toggleSubAccordion(subItem.name)
														}
														className={`block text-sm text-gray-700 py-2 px-2 hover:bg-gray-100 rounded w-[80%] flex items-center
                                ${
									expandedSubItem === subItem.name && subItem.href == menuItem
										? "font-bold bg-gray-100 border-l-4"
										: ""
								}`}
													>
														{subItem.icon && (
															<subItem.icon className="w-5 h-5 flex-shrink-0 text-gray-600 mr-2" />
														)}
														<span className="flex-1 text-left">
															{subItem.name}
														</span>
														{subItem.subItems &&
															subItem.subItems?.length > 0 && (
																<svg
																	className={`w-3 h-3 ml-2 transform transition-transform ${
																		expandedSubItem ===
																		subItem.name
																			? "rotate-180"
																			: ""
																	}`}
																	fill="none"
																	stroke="rgb(23, 23, 23)"
																	viewBox="0 0 24 24"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth="2"
																		d="M19 9l-7 7-7-7"
																	/>
																</svg>
															)}
													</button>
												)}
												{showSidebar &&
													subItem.subItems &&
													subItem.subItems.length > 0 &&
													expandedSubItem === subItem.name && (
														<div className="pl-8 mt-1 space-y-1">
															{subItem.subItems.map((subSubItem) => (
																<Link
																	key={subSubItem.name}
																	href={
																		subSubItem.href ??
																		subSubItem.name
																	}
																	className={`block text-xs text-gray-600 py-2 px-2 hover:bg-gray-100 rounded w-[80%] flex items-center
                                  ${
										menuItem === subSubItem.href
											? "font-bold bg-gray-100 border-l-4"
											: ""
									}`}
																	onClick={() =>
																		setMenuItem(
																			subSubItem.href ??
																				subSubItem.name,
																		)
																	}
																>
																	{subSubItem.icon && (
																		<subSubItem.icon className="w-4 h-4 flex-shrink-0 text-gray-600 mr-2" />
																	)}
																	{subSubItem.name}
																</Link>
															))}
														</div>
													)}
											</div>
										))}
									</div>
								)}
						</li>
					))}
				</ul>
				<div
					className={` ${
						showSidebar ? "border-1" : ""
					} rounded p-1 my-10 flex items-center`}
				>
					<MagnifyingGlassIcon className="w-5 h-5 flex-shrink-0 text-gray-600 mr-2 ml-0.5" />
					{showSidebar && (
						<input
							type="text"
							placeholder="Global Search..."
							aria-label="Global Search..."
							className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
						/>
					)}
				</div>
			</nav>

			{!!!session?.user.id && (
				<Link
					href={"/"}
					className="justify-between items-center mx-[15.5px] mt-auto mb-12 hidden hover:bg-gray-100 p-2 rounded"
					style={{ display: showSidebar ? "flex" : undefined }}
				>
					<div className="flex flex-col">
						<b className="text-sm">{session?.user.name || "User"}</b>
						<span className="text-xs">Account Settings</span>
					</div>

					<ChevronRightIcon className="size-4" />
				</Link>
			)}
		</div>
	);
};
