import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Vérifier l'authentification HTTP Basic si configurée
  if (process.env.HTTP_BASIC_AUTH_USERNAME && process.env.HTTP_BASIC_AUTH_PASSWORD) {
    const { pathname } = request.nextUrl;
    
    // Skip authentication for the admin page and admin API routes
    if (pathname === '/admin' || 
        pathname.startsWith('/api/edge') || 
        pathname.startsWith('/api/admin/')) {
      return NextResponse.next();
    }

    // Request client authentication if no credentials are provided
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Basic '))
      return new NextResponse('Unauthorized', { status: 401, headers: { 'WWW-Authenticate': 'Basic' } });

    // Request authentication if credentials are invalid
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    if (
      !username || !password ||
      username !== process.env.HTTP_BASIC_AUTH_USERNAME ||
      password !== process.env.HTTP_BASIC_AUTH_PASSWORD
    )
      return new NextResponse('Unauthorized', { status: 401, headers: { 'WWW-Authenticate': 'Basic' } });
  }

  return NextResponse.next();
} 