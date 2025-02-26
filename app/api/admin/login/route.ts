import { NextResponse } from 'next/server';
import * as jose from 'jose';

// Durée de validité du token (24 heures)
const TOKEN_EXPIRATION = '24h';

export async function POST(request: Request) {
  try {
    // Récupérer les identifiants
    const { username, password } = await request.json();
    
    // Vérifier les identifiants
    const isValid = 
      username === process.env.HTTP_ADMIN_AUTH_USERNAME && 
      password === process.env.HTTP_ADMIN_AUTH_PASSWORD;
    
    if (!isValid) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    // Clé secrète pour signer les tokens JWT
    const secret = new TextEncoder().encode(
      process.env.HTTP_ADMIN_AUTH_PASSWORD || 'admin-secret-key'
    );
    
    // Générer un token JWT
    const token = await new jose.SignJWT({ username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRATION)
      .sign(secret);
    
    return NextResponse.json({ 
      authenticated: true,
      token,
    });
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge'; 