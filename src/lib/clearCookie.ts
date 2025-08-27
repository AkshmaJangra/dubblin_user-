

import { cookies } from 'next/headers';

export async function clearAuthCookies() {
  const cookieStore = cookies();

  const cookieNamesToClear = [
    '_Secure-next-auth.session-token',
    '_Secure-next-auth.callback-url',
    'next-auth.csrf-token',
    'next-auth.callback-url',
  ];

  cookieNamesToClear.forEach((name) => {
    cookieStore.set(name, '', {
      path: '/',
      expires: new Date(0),
    });
  });
}
