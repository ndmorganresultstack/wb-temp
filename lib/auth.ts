// lib/auth.ts
'use server';

export interface ClientPrincipal {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
  claims?: Array<{ typ: string; val: string }>;
}

export async function getUserInfo(): Promise<ClientPrincipal | null> {
  // Skip fetch during build if no base URL is available
  if (process.env.NEXT_BUILD === 'true') {
    console.log('Skipping auth fetch during Next.js build');
    return null;
  }

  try {
    // Use SWA_BASE_URL for local or production, fallback to relative URL
    const baseUrl = process.env.SWA_BASE_URL || '';
    const authUrl = `${baseUrl}/.auth/me`;
    const response = await fetch(authUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      console.log(`Auth fetch failed: ${response.status} ${response.statusText}`);
      return null;
    }
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal || null;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}