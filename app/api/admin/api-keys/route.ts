import { NextResponse } from 'next/server';
import * as jose from 'jose';
import { createVercelClient } from '../../../../src/modules/admin/vercel.client';

// Liste des clés API à gérer
const API_KEYS = [
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'GEMINI_API_KEY',
  'GROQ_API_KEY',
  'MISTRAL_API_KEY',
  'PERPLEXITY_API_KEY',
  'ELEVENLABS_API_KEY',
  'PRODIA_API_KEY',
  'GOOGLE_CLOUD_API_KEY',
  'GOOGLE_CSE_ID',
];

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

// Récupérer les clés API
export async function GET(request: Request) {
  try {
    // Vérifier l'authentification
    const isAuthenticated = await verifyToken(request);
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Récupérer les clés API
    const apiKeys: Record<string, string> = {};
    
    // En local, on récupère les valeurs du .env
    for (const key of API_KEYS) {
      apiKeys[key] = process.env[key] || '';
    }
    
    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error('Error getting API keys:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Mettre à jour les clés API
export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const isAuthenticated = await verifyToken(request);
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Récupérer les nouvelles clés API
    const apiKeys: Record<string, string> = await request.json();
    
    // Vérifier si on est sur Vercel
    if (!process.env.VERCEL_PROJECT_ID || !process.env.VERCEL_TEAM_ID || !process.env.VERCEL_API_TOKEN) {
      // En local, on ne peut pas mettre à jour les variables d'environnement
      console.log('Tentative de mise à jour des clés API en environnement local');
      
      // Retourner un message explicite indiquant que la mise à jour n'est pas possible
      return NextResponse.json({ 
        success: false, 
        message: "En environnement local, les mises à jour des variables d'environnement ne sont pas possibles. Cette fonctionnalité n'est disponible qu'en production sur Vercel."
      }, { status: 200 });
    }
    
    try {
      // En production, utiliser l'API Vercel pour mettre à jour les variables
      console.log('Mise à jour des clés API en production via API Vercel');
      
      // Créer un client Vercel
      const vercelClient = createVercelClient();
      
      // Mettre à jour les variables d'environnement
      for (const [key, value] of Object.entries(apiKeys)) {
        if (API_KEYS.includes(key) && value) {
          await vercelClient.updateEnvironmentVariable(key, value);
        }
      }
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error updating environment variables:', error);
      return NextResponse.json({ 
        success: false, 
        message: "Erreur lors de la mise à jour des variables d'environnement sur Vercel: " + (error instanceof Error ? error.message : String(error))
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating API keys:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge'; 