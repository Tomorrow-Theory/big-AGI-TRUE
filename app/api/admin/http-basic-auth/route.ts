import { NextResponse } from 'next/server';
import * as jose from 'jose';
import { createVercelClient } from '../../../../src/modules/admin/vercel.client';

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
    
    // Vérifier si on est sur Vercel
    if (!process.env.VERCEL_PROJECT_ID || !process.env.VERCEL_TEAM_ID || !process.env.VERCEL_API_TOKEN) {
      // En local, on ne peut pas mettre à jour les variables d'environnement
      console.log('Tentative de mise à jour des identifiants en environnement local');
      
      // Retourner un message explicite indiquant que la mise à jour n'est pas possible
      return NextResponse.json({ 
        success: false, 
        message: "En environnement local, les mises à jour des variables d'environnement ne sont pas possibles. Cette fonctionnalité n'est disponible qu'en production sur Vercel."
      }, { status: 200 });
    }
    
    try {
      // En production, utiliser l'API Vercel pour mettre à jour les variables
      console.log('Mise à jour des identifiants en production via API Vercel');
      
      // Créer un client Vercel
      const vercelClient = createVercelClient();
      
      // Mettre à jour les variables d'environnement
      await vercelClient.updateEnvironmentVariable('HTTP_BASIC_AUTH_USERNAME', username);
      await vercelClient.updateEnvironmentVariable('HTTP_BASIC_AUTH_PASSWORD', password);
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error updating environment variables:', error);
      return NextResponse.json({ 
        success: false, 
        message: "Erreur lors de la mise à jour des variables d'environnement sur Vercel: " + (error instanceof Error ? error.message : String(error))
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

export const runtime = 'edge'; 