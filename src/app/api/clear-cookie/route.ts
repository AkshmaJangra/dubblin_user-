// /app/api/clear-cookies/route.ts (if using App Router)
import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.json({ message: 'Cookies cleared' });

    const cookieNamesToClear = [
        '_Secure-next-auth.session-token',
        '_Secure-next-auth.callback-url',
        'next-auth.csrf-token',
        'next-auth.callback-url',
        'next-auth.session-token',
    ];
    console.log('apiiiiiiiiiiiiii')
    cookieNamesToClear.forEach((name) => {
        response.cookies.set(name, '', {
            path: '/',
            expires: new Date(0),
        });
    });
    console.log('response', response);
    return response;
}
