'use client';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function ForceLogoutTrigger() {
  const { data: session } = useSession();
console.log('session', session);
  
 useEffect(() => {
    async function logoutUser() {
      await signOut({ redirect: false }); // Clear session on client
      await fetch('/api/clear-cookie');   // Clear cookies on server
    }

    logoutUser();
  }, []);
  return null;
}
