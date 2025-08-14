// hooks/useUserInfo.ts
'use client';
import { useState, useEffect } from 'react';
import { ClientPrincipal } from '@/lib/auth';
import { trackException, trackTrace } from '@/lib/appInsights';

export function useUserInfo() {
  const [user, setUser] = useState<ClientPrincipal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SWA_BASE_URL || '';
        const authUrl = `${baseUrl}/.auth/me`;
        trackTrace('Fetching user info (client-side)', { authUrl });
        const response = await fetch(authUrl, {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          trackTrace('Client-side auth fetch failed', { status: response.status, statusText: response.statusText });
          setUser(null);
          setLoading(false);
          return;
        }
        const payload = await response.json();
        trackTrace('Client-side auth payload received', { payload: JSON.stringify(payload) });
        const { clientPrincipal } = payload;
        setUser(clientPrincipal || null);
        setLoading(false);
      } catch (error: any) {
        trackException(error, { authUrl: `${process.env.NEXT_PUBLIC_SWA_BASE_URL}/.auth/me` });
        setUser(null);
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return { user, loading };
}