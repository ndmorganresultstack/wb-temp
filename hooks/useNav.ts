// hooks/useUserInfo.ts
"use client";
import { create } from "zustand";

export interface navState {
	showSidebar: boolean;
	toggleSidebar: () => void;
}

export const useNav = create<navState>((set) => ({
	showSidebar: false,
	toggleSidebar: () => set((state) => ({ ...state, showSidebar: !state.showSidebar })),
}));
