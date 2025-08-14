// lib/auth.ts
import { trackException, trackTrace } from './appInsights';

export interface ClientPrincipal {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
  claims?: Array<{ typ: string; val: string }>;
}

export async function getUserInfo(): Promise<ClientPrincipal | null> {
  // Skip fetch during Next.js build
  if (process.env.NEXT_BUILD === 'true') {
    trackTrace('Skipping auth fetch during Next.js build', { environment: process.env.NODE_ENV });
    return null;
  }

  try {
    const baseUrl = process.env.SWA_BASE_URL || '';
    const authUrl = `${baseUrl}/.auth/me`;
    trackTrace('Fetching user info', { authUrl });
    const response = await fetch(authUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      trackTrace('Auth fetch failed', { status: response.status, statusText: response.statusText });
      return null;
    }
    const payload = await response.json();
    trackTrace('Auth payload received', { payload: JSON.stringify(payload) });
    const { clientPrincipal } = payload;
    return clientPrincipal || null;
  } catch (error: any) {
    trackException(error, { authUrl: `${process.env.SWA_BASE_URL}/.auth/me` });
    return null;
  }
}