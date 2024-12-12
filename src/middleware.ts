import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/(auth)');
    const isLandingPage = req.nextUrl.pathname === '/';
    const isProtectedRoute = 
      req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/story') ||
      req.nextUrl.pathname.startsWith('/new-game');
    
    // Store the original URL for redirect after auth
    const returnUrl = req.url;

    // Handle API routes differently
    if (req.nextUrl.pathname.startsWith('/api/')) {
      if (!isAuth) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      return NextResponse.next();
    }

    // Redirect authenticated users away from auth pages and landing page
    if (isAuth && (isAuthPage || isLandingPage)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Allow access to protected routes if authenticated
    if (isAuth && isProtectedRoute) {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to sign-in
    if (!isAuth && isProtectedRoute) {
      const signInUrl = new URL('/(auth)/sign-in', req.url);
      // Preserve the return URL for redirect after sign-in
      signInUrl.searchParams.set('callbackUrl', returnUrl);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // We'll handle authorization in the middleware function
    },
  }
);

// Protect all routes under /dashboard and /story
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/story/:path*',
    '/new-game/:path*',
    '/(auth)/:path*',
    '/api/:path*',
  ],
};
