// components/GetUserClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { trackTrace, trackException } from '@/lib/appInsights';
import { useUser } from '@/components/rootLayoutClient';
import { ClientPrincipal } from '@/lib/auth';

export default function GetUserClient() {
  const { setUser } = useUser(); // Assuming useUser provides a setter for the context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getUserInfo() {
    try {
      trackTrace('Client-side getUserInfo called', { component: 'GetUserClient' });
      const response = await fetch('/.auth/me', {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Auth fetch failed: ${response.status} ${response.statusText}`);
      }
      const payload = await response.json();
      const { clientPrincipal } = payload;
      if (!clientPrincipal) {
        return null;
      }
      trackTrace('Client-side user info retrieved', {
        userId: clientPrincipal.userId || 'unknown',
        identityProvider: clientPrincipal.identityProvider || 'unknown',
      });
      setUser(clientPrincipal); // Update UserContext
      return clientPrincipal;
    } catch (error: any) {
      trackException(error, { component: 'GetUserClient', endpoint: '/.auth/me' });
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading) return <div>Loading user info...</div>;
  if (error) return <div>Error: {error}</div>;
  return null; // Or render user info as needed
}