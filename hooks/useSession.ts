"use client";

import type { Session } from "next-auth";

import { create } from "zustand";
import { useEffect } from "react";

interface SessionState {
	session: Session | null;
	// Set
	setSession: (session: Session) => void;
}

export const useSession = create<SessionState>((set) => ({
	session: null,
	// Set
	setSession: async (session: Session) => set((state) => ({ ...state, session })),
}));

export function SetSession({ session }: { session: Session | null }) {
	const setSession = useSession.getState().setSession;

	useEffect(() => {
		if (session) setSession(session);
	}, [session, setSession]);

	return null;
}
