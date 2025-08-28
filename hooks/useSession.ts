// hooks/useUserInfo.ts
"use client";
import { useState, useEffect } from "react";
import { ClientPrincipal } from "@/lib/auth";
import { trackException, trackTrace } from "@/lib/appInsights";
import { create } from "zustand";

export interface sessionState {
	session: ClientPrincipal | null;
	setSession: (session: ClientPrincipal) => void;
}

export const useSession = create<sessionState>((set) => ({
	session: null,
	setSession: (session: ClientPrincipal) => set((state) => ({ ...state, session })),
}));

export function SetSession() {
	const setSession = useSession.getState().setSession;
	useEffect(() => {
		async function fetchUser() {
			try {
				const baseUrl = process.env.NEXT_PUBLIC_SWA_BASE_URL || "";
				const authUrl = `${baseUrl}/.auth/me`;
				trackTrace("Fetching user info (client-side)", { authUrl });
				const response = await fetch(authUrl, {
					headers: {
						Accept: "application/json",
					},
				});
				if (!response.ok) {
					trackTrace("Client-side auth fetch failed", {
						status: response.status,
						statusText: response.statusText,
					});
					return;
				}
				const payload = await response.json();
				trackTrace("Client-side auth payload received", {
					payload: JSON.stringify(payload),
				});
				const { clientPrincipal } = payload;
				setSession(clientPrincipal || null);
			} catch (error: any) {
				trackException(error, {
					authUrl: `${process.env.NEXT_PUBLIC_SWA_BASE_URL}/.auth/me`,
				});
			}
		}

		fetchUser();
	}, [setSession]);
	return null;
}
