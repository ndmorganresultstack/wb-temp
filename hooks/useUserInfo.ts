// hooks/useUserInfo.ts
'use client';
import { useState, useEffect } from 'react';
import { ClientPrincipal, getUserInfo } from '@/lib/auth';

export function useUserInfo() {
  const [user, setUser] = useState<ClientPrincipal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const userInfo = await getUserInfo();
      setUser(userInfo);
      setLoading(false);
    }
    fetchUser();
  }, []);

  return { user, loading };
}