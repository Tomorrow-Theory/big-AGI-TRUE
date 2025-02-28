import { NextResponse } from 'next/server';
import * as jose from 'jose';
import { getEnvironmentVariables, updateEnvironmentVariable } from '../../../../src/modules/admin/env.service';

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
    
    // Récupérer toutes les variables d'environnement depuis MongoDB
    const envVars = await getEnvironmentVariables();
    
    // Filtrer pour ne garder que les clés API
    const apiKeys: Record<string, string> = {};
    for (const key of API_KEYS) {
      apiKeys[key] = envVars[key] || '';
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
    
    try {
      // Mettre à jour les variables dans MongoDB
      for (const [key, value] of Object.entries(apiKeys)) {
        if (API_KEYS.includes(key) && value) {
          await updateEnvironmentVariable(key, value);
          // Mettre à jour process.env
          process.env[key] = value;
        }
      }
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error updating environment variables:', error);
      return NextResponse.json({ 
        success: false, 
        message: "Erreur lors de la mise à jour des variables d'environnement: " + (error instanceof Error ? error.message : String(error))
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

export const runtime = 'node'; 