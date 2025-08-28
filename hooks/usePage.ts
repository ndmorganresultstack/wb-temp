// hooks/useUserInfo.ts
"use client";
import { useState, useEffect } from "react";
import { ClientPrincipal } from "@/lib/auth";
import { trackException, trackTrace } from "@/lib/appInsights";
import { create } from "zustand";

export interface pageState {
	record: {} | null;
	setRecord: (record: {}) => void;
}

export const usePage = create<pageState>((set) => ({
	record: null,
	setRecord: (record) => set((state) => ({ ...state, record })),
}));
