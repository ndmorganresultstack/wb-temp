
"use client";

import { create } from "zustand";

export interface NavState {
	isSidebarOpen: boolean;
	toggleSidebar: () => void;
	sidebarMinWidth: string;
	sidebarMaxWidth: string;
}

export const useNav = create<NavState>((set) => ({
	isSidebarOpen: false,
	toggleSidebar: () => set((state) => ({ ...state, isSidebarOpen: !state.isSidebarOpen })),
	sidebarMinWidth: "0px",
	sidebarMaxWidth: "0px",
}));
