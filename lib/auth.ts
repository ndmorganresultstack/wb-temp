export interface ClientPrincipal {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
  claims?: Array<{ typ: string; val: string }>;
}

export async function getUserInfo(): Promise<ClientPrincipal | null> {
  try {
    const response = await fetch('/.auth/me');
    if (!response.ok) {
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