import { NextResponse } from 'next/server';
import * as jose from 'jose';
import { getEnvironmentVariable, updateEnvironmentVariable } from '../../../../src/modules/admin/env.service';

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
    
    // Récupérer les identifiants depuis MongoDB
    const username = await getEnvironmentVariable('HTTP_BASIC_AUTH_USERNAME') || '';
    const password = await getEnvironmentVariable('HTTP_BASIC_AUTH_PASSWORD') || '';
    
    return NextResponse.json({ username, password });
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
    
    try {
      // Mettre à jour les variables dans MongoDB
      await updateEnvironmentVariable('HTTP_BASIC_AUTH_USERNAME', username);
      await updateEnvironmentVariable('HTTP_BASIC_AUTH_PASSWORD', password);
      
      // Mettre à jour process.env
      process.env.HTTP_BASIC_AUTH_USERNAME = username;
      process.env.HTTP_BASIC_AUTH_PASSWORD = password;
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error updating environment variables:', error);
      return NextResponse.json({ 
        success: false, 
        message: "Erreur lors de la mise à jour des variables d'environnement: " + (error instanceof Error ? error.message : String(error))
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating HTTP Basic Auth:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const runtime = 'node'; 