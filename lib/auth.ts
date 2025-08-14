// lib/auth.ts
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
    console.log('Skipping auth fetch during Next.js build');
    return null;
  }

  try {
    // Use SWA_BASE_URL for local or production, fallback to relative URL
    const baseUrl = process.env.SWA_BASE_URL || '';
    const authUrl = `${baseUrl}/.auth/me`;
    console.log('Fetching user info from:', authUrl); // Debug log
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
    console.log('Auth payload:', payload); // Debug log
    const { clientPrincipal } = payload;
    return clientPrincipal || null;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}