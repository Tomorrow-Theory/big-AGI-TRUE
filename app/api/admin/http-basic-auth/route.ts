import { NextResponse } from 'next/server';
import * as jose from 'jose';

// Vérifier le token JWT
async function verifyToken(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Clé secrète pour vérifier les tokens JWT
    const secret = new TextEncoder().encode(
      process.env.HTTP_ADMIN_AUTH_PASSWORD || 'admin-secret-key'
    );
    
    // Vérifier le token JWT
    await jose.jwtVerify(token, secret);
    
    return true;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

// Récupérer les identifiants HTTP Basic Auth
export async function GET(request: Request) {
  try {
    // Vérifier l'authentification
    const isAuthenticated = await verifyToken(request);
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Récupérer les identifiants
    return NextResponse.json({
      username: process.env.HTTP_BASIC_AUTH_USERNAME || '',
      password: process.env.HTTP_BASIC_AUTH_PASSWORD || '',
    });
  } catch (error) {
    console.error('Error getting HTTP Basic Auth:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Mettre à jour les identifiants HTTP Basic Auth
export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const isAuthenticated = await verifyToken(request);
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Récupérer les nouveaux identifiants
    const { username, password } = await request.json();
    
    // En local, on ne peut pas mettre à jour les variables d'environnement
    // Cette API est principalement pour la démonstration
    // Dans un environnement de production, il faudrait utiliser l'API Vercel
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating HTTP Basic Auth:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge'; 