// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import path from 'path';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathName = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/verify', '/forget-password'];
  const isPublicPath = publicPaths.includes(pathName);

  // Protected paths that require authentication
  const protectedPaths = ['/dashboard', '/personal-info', '/order-history', '/address'];

  if (!pathName.startsWith('/api')) {
    try {
      const resSession = await fetch(process.env.NEXTAUTH_URL + '/api/auth/session', {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || '',
        },
        method: 'GET',
        cache: 'no-store',
      });
      const session = await resSession.json();
      const loggedIn = Object.keys(session).length > 0 ? true : false;

      // Redirect logic
      if (loggedIn && isPublicPath) {
        // If user is signed in and trying to access login/register page,
        // redirect them to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // For protected routes, redirect to login with callbackUrl if not logged in
      if (protectedPaths.includes(pathName) && !loggedIn) {
        // Create a login URL with the current path as the callback URL
        const loginUrl = new URL('/', process.env.NEXTAUTH_URL);
        loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);

        return NextResponse.redirect(loginUrl);
      }
      if (pathName === '/login' || pathName === '/register' || pathName === '/verify' || pathName === '/forget-password') {
        // If user is not logged in and trying to access order-success page,
        // redirect them to login page
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error: any) {
      console.error(error.stack);
      throw error;
      //return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL));
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, etc.
     */
    '/((?!api|_next|static|.*\\.|favicon.ico).*)',
  ],
};