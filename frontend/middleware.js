// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('Middleware is running for:', request.nextUrl.pathname);
  const token = request.cookies.get('token');

  console.log('Token in Middleware:', token); // Log to see if token exists

  if (!token) {
    console.log('No token found, redirecting...');
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Optional: specify which routes should use this middleware
export const config = {
  matcher: ['/dashboard/:path*', '/dashboard'], // Only protect certain routes
};
