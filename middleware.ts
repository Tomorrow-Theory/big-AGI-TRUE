/**
 * Middleware to protect `big-AGI` with HTTP Basic Authentication
 *
 * For more information on how to deploy with HTTP Basic Authentication, see:
 *  - [deploy-authentication.md](docs/deploy-authentication.md)
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';


// noinspection JSUnusedGlobalSymbols
export function middleware(request: NextRequest) {
  // Check if it's an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Basic ')) {
      return new Response('Admin Unauthorized', adminUnauthResponse);
    }
    
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    if (username === process.env.HTTP_ADMIN_AUTH_USERNAME && 
        password === process.env.HTTP_ADMIN_AUTH_PASSWORD) {
      return NextResponse.next();
    }
    return new Response('Admin Unauthorized', adminUnauthResponse);
  }

  // Only check non-admin routes from here
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    if (!process.env.HTTP_BASIC_AUTH_USERNAME || !process.env.HTTP_BASIC_AUTH_PASSWORD) {
      console.warn('HTTP Basic Authentication is enabled but not configured');
      return new Response('Unauthorized/Unconfigured', userUnauthResponse);
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Basic '))
      return new Response('Unauthorized', userUnauthResponse);

    const base64Credentials = authHeader.split(' ')[1]; 
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    if (username === process.env.HTTP_BASIC_AUTH_USERNAME && 
        password === process.env.HTTP_BASIC_AUTH_PASSWORD) {
      return NextResponse.next();
    }
    return new Response('Unauthorized', userUnauthResponse);
  }

  return NextResponse.next();
}

// Separate responses for admin and user authentication
const adminUnauthResponse: ResponseInit = {
  status: 401,
  headers: {
    'WWW-Authenticate': 'Basic realm="Admin Access"',
  },
};

const userUnauthResponse: ResponseInit = {
  status: 401,
  headers: {
    'WWW-Authenticate': 'Basic realm="User Access"',
  },
};

export const config = {
  matcher: [
    // Include root
    '/',
    // Include admin
    '/admin(.*)',
    // Include pages
    '/(call|index|news|personas|link)(.*)',
    // Include API routes
    '/api(.*)',
    // Note: this excludes _next, /images etc..
  ],
};