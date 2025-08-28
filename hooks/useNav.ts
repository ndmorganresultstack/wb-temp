// hooks/useUserInfo.ts
"use client";
import { useState, useEffect } from "react";
import { ClientPrincipal } from "@/lib/auth";
import { trackException, trackTrace } from "@/lib/appInsights";
import { create } from "zustand";

export interface navState {
	isSidebarOpen: boolean;
	toggleSidebar: () => void;
	sidebarMinWidth: string;
	sidebarMaxWidth: string;
}

export const useNav = create<navState>((set) => ({
	isSidebarOpen: false,
	toggleSidebar: () => set((state) => ({ ...state, isSidebarOpen: !state.isSidebarOpen })),
	sidebarMinWidth: "0px",
	sidebarMaxWidth: "0px",
}));
