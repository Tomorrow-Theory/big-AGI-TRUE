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

/**
 * Déclencher un redéploiement sur Vercel
 */
export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const isAuthenticated = await verifyToken(request);
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Récupérer les données de la requête
    const data = await request.json().catch(() => ({}));
    // Toujours avec rebuild complet par défaut, sauf si explicitement demandé sans
    const skipBuild = data.skipBuild === true;
    
    // Vérifier si on est sur Vercel
    if (!process.env.VERCEL_PROJECT_ID || !process.env.VERCEL_TEAM_ID || !process.env.VERCEL_API_TOKEN) {
      // En local, on ne peut pas déclencher de redéploiement
      console.log('Tentative de redéploiement en environnement local');
      
      // Retourner un message explicite indiquant que le redéploiement n'est pas possible
      return NextResponse.json({ 
        success: false, 
        message: "En environnement local, le redéploiement n'est pas possible. Cette fonctionnalité n'est disponible qu'en production sur Vercel."
      }, { status: 200 });
    }
    
    try {
      // En production, utiliser l'API Vercel pour déclencher un redéploiement
      console.log(`Déclenchement d'un redéploiement en production via API Vercel avec rebuild complet`);
      
      // Créer un client Vercel
      const vercelClient = createVercelClient();
      
      // Déclencher le redéploiement avec l'option skipBuild
      const deployment = await vercelClient.triggerDeployment(skipBuild);
      
      return NextResponse.json({ 
        success: true,
        deploymentId: deployment.id,
        skipBuild: skipBuild,
        message: `Redéploiement avec rebuild complet déclenché avec succès. L&apos;application sera mise à jour dans environ 5 minutes.`
      });
    } catch (error) {
      console.error('Error triggering deployment:', error);
      return NextResponse.json({ 
        success: false, 
        message: "Erreur lors du déclenchement du redéploiement sur Vercel: " + (error instanceof Error ? error.message : String(error))
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in deploy API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const runtime = 'edge'; 