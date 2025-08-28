"use client";

import Link from "next/link";
import Image from "next/image";
import {
	BellAlertIcon,
	Cog6ToothIcon,
	QuestionMarkCircleIcon,
	DocumentIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import {
	CircleStackIcon,
	ClipboardDocumentIcon,
	Cog8ToothIcon,
	ComputerDesktopIcon,
	CurrencyDollarIcon,
	DocumentTextIcon,
	HomeIcon,
	HomeModernIcon,
	ListBulletIcon,
	MagnifyingGlassCircleIcon,
	MagnifyingGlassIcon,
	UserIcon,
} from "@heroicons/react/24/solid";
import { ClientPrincipal } from "@/lib/auth";
import { ComponentType, createContext, SVGProps, useContext, useEffect, useState } from "react";
import { initializeAppInsights, trackTrace, reactPlugin } from "@/lib/appInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import "../app/globals.css";
import { Roboto_Condensed, Roboto_Mono, Roboto_Serif } from "next/font/google";
import { useSession } from "@/hooks/useSession";
import { useNav } from "@/hooks/useNav";

export interface MenuItem {
	name: string;
	icon?: ComponentType<SVGProps<SVGSVGElement>>;
	href?: string;
	subItems?: MenuItem[];
}

// Define the prop interface for SidebarManager
export interface SideNavManagerProps {
	isSidebarOpen: boolean;
	toggleSidebar: () => void;
	expandedItem: string | null;
	expandedSubItem: string | null;
	menuItem: string | null;
	setExpandedItem: React.Dispatch<React.SetStateAction<string | null>>;
	setExpandedSubItem: React.Dispatch<React.SetStateAction<string | null>>;
	setMenuItem: React.Dispatch<React.SetStateAction<string | null>>;
	sidebarMinWidth: string | null;
	sidebarMaxWidth: string | null;
	pageTitle: string | null;
	setPageTitle: React.Dispatch<React.SetStateAction<string>>;
	searchQuery: string | null;
	setSearchQuery: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SideNavManager = () => {
	const session = useSession((state) => state.session);
	const isSidebarOpen = useNav((state) => state.isSidebarOpen);
	const toggleSidebar = useNav.getState().toggleSidebar;
	const [expandedItem, setExpandedItem] = useState<string | null>();
	const [expandedSubItem, setExpandedSubItem] = useState<string | null>();
	const [menuItem, setMenuItem] = useState<string | null>();
	const sidebarMinWidth = useNav((state) => state.sidebarMinWidth);
	const sidebarMaxWidth = useNav((state) => state.sidebarMinWidth);

	const toggleAccordion = (itemName: string) => {
		setExpandedItem(expandedItem === itemName ? null : itemName);
	};

	const toggleSubAccordion = (subItemName: string) => {
		setExpandedSubItem(expandedSubItem === subItemName ? null : subItemName);
	};

	const menuItems: MenuItem[] = [
		{
			name: "Dashboard",
			icon: HomeIcon,
			href: "/dashboard",
		},
		{
			name: "User Access",
			icon: UserIcon,
			href: "/user-access",
		},
		{
			name: "Master Data",
			icon: CircleStackIcon,
			href: "/master-data",
			subItems: [
				{ name: "Locations", href: "/locations" },
				{ name: "Chart of Accounts", href: "/pipeline" },
				{ name: "Employee Directory", href: "/portfolio" },
			],
		},
		{
			name: "",
		},
		{
			name: "Client Services",
			icon: Cog8ToothIcon,
			subItems: [
				{ name: "Prospects", href: "/prospects" },
				{ name: "Opportunity Pipeline", href: "/pipeline" },
				{ name: "Client Portfolio", href: "/portfolio" },
				{ name: "Gifting", href: "/gifting" },
				{ name: "Events", href: "/events" },
			],
		},
		{
			name: "Cost of Services",
			icon: ListBulletIcon,
		},
		{
			name: "Reports",
			icon: DocumentTextIcon,
		},
		{
			name: "Property Budget",
			icon: ClipboardDocumentIcon,
		},
		{
			name: "IT Budgeting",
			icon: ComputerDesktopIcon,
			subItems: [
				{
					name: "Costs",
					icon: CurrencyDollarIcon,
					subItems: [
						{ name: "Internal Labor", href: "/internal-labor" },
						{ name: "External Labor", href: "/external-labor" },
						{ name: "Software Costs", href: "/software-costs" },
					],
				},
				{
					name: "Employees",
					icon: UserIcon,
					subItems: [{ name: "Employee Roster", href: "/employees" }],
				},
			],
		},
	];

	return (
		<div
			className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 ease-in-out 
				${isSidebarOpen ? "w-[300px] translate-x-0" : "w-[66px] -translate-x-0"} 
				lg:${isSidebarOpen ? "w-[300px]" : "w-[71px]"} static`}
		>
			<div className="flex h-14 items-center px-2 bg-[var(--wb-background-color)] border-b border-gray-200">
				<button
					onClick={toggleSidebar}
					className={`text-white hover:text-white focus:outline-none ${
						isSidebarOpen ? "mx-[15.5px]" : "mx-auto"
					}`}
				>
					{isSidebarOpen ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="3"
							stroke="currentColor"
							className="size-6 border border-white p-1 rounded "
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.75 19.5 8.25 12l7.5-7.5"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="3"
							stroke="currentColor"
							className="size-6 border border-white p-1 rounded "
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m8.25 4.5 7.5 7.5-7.5 7.5"
							/>
						</svg>
					)}
				</button>
				{isSidebarOpen && (
					<Link href={"/"}>
						<Image
							src="/header_logo_w.png"
							alt="Willowbridge Logo"
							width={80}
							height={10}
							className="hover:opacity-80 transition-opacity mx-[45px]"
						/>
					</Link>
				)}
			</div>
			<nav className="mt-4 mx-[15.5px]">
				<ul>
					{menuItems.map((item: MenuItem) => (
						<li
							key={item.name}
							className={`relative ${
								expandedItem === item.name && !isSidebarOpen
									? "bg-gray-100 rounded-md"
									: ""
							} ${item.name == "" ? "border-b-1 border-gray-200" : ""}`}
						>
							<button
								onClick={() => {
									if (!isSidebarOpen) {
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
								{isSidebarOpen && (
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
							{isSidebarOpen &&
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
																subItem.href ?? subItem.name
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
												{isSidebarOpen &&
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
																				subSubItem.name
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
						isSidebarOpen ? "border-1" : ""
					} rounded p-1 my-10 flex items-center`}
				>
					<MagnifyingGlassIcon className="w-5 h-5 flex-shrink-0 text-gray-600 mr-2 ml-0.5" />
					{isSidebarOpen && (
						<input
							type="text"
							placeholder="Global Search..."
							aria-label="Global Search..."
							className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
						/>
					)}
				</div>
				<div></div>
			</nav>
		</div>
	);
};
