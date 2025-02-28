/**
 * Middleware to protect `big-AGI` with HTTP Basic Authentication
 *
 * For more information on how to deploy with HTTP Basic Authentication, see:
 *  - [deploy-authentication.md](docs/deploy-authentication.md)
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Response to send when authentication is required
const unauthResponse: ResponseInit = {
  status: 401,
  headers: {
    'WWW-Authenticate': 'Basic realm="Secure big-AGI"',
  },
};

// noinspection JSUnusedGlobalSymbols
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip authentication for the admin page and admin API routes
  if (pathname === '/admin' || 
      pathname.startsWith('/api/edge') || 
      pathname.startsWith('/api/admin/')) {
    console.log('Skipping auth for admin route:', pathname);
    return NextResponse.next();
  }

  // Request client authentication if no credentials are provided
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Basic '))
    return new Response('Unauthorized', unauthResponse);

  // Decode credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  
  if (!username || !password)
    return new Response('Unauthorized', unauthResponse);

  try {
    // Construire l'URL absolue pour la vérification
    const protocol = request.nextUrl.protocol;
    const host = request.headers.get('host');
    const verifyUrl = `${protocol}//${host}/api/admin/auth/verify`;

    // Vérifier les identifiants via l'API
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      console.error('Verify API returned status:', response.status);
      return new Response('Unauthorized', unauthResponse);
    }

    const { isValid } = await response.json();
    console.log('Auth verification result:', { username, isValid });

    if (!isValid) {
      return new Response('Unauthorized', unauthResponse);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export const config = {
  matcher: [
    // Include root
    '/',
    // Include pages
    '/(call|index|news|personas|link)(.*)',
    // Include API routes
    '/api(.*)',
    // Note: this excludes _next, /images etc..
  ],
};