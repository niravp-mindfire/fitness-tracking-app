import { NextRequest, NextResponse } from 'next/server';

// Middleware authentication function
export function middleware(req: NextRequest) {
  // Define the protected paths
  const protectedPaths = ['/dashboard'];
  const pathIsProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  if (pathIsProtected) {
    const token = req.cookies.get('authToken');
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

// Specify the config for the middleware, including the paths it should run on
export const config = {
  matcher: ['/dashboard/:path*'],
};
