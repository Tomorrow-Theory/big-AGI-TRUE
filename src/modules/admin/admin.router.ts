import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/trpc/trpc.server';
import { env } from '~/server/env.mjs';
import jwt from 'jsonwebtoken';
import { createVercelClient, VercelEnvVar } from './vercel.client';

// Clé secrète pour signer les tokens JWT
const JWT_SECRET = process.env.HTTP_ADMIN_AUTH_PASSWORD || 'admin-secret-key';

// Durée de validité du token (24 heures)
const TOKEN_EXPIRATION = '24h';

/**
 * Router pour les fonctionnalités d'administration
 */
export const adminRouter = createTRPCRouter({
  
  // Authentification admin
  login: publicProcedure
    .input(z.object({
      username: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Vérifier les identifiants
      const isValid = 
        input.username === process.env.HTTP_ADMIN_AUTH_USERNAME && 
        input.password === process.env.HTTP_ADMIN_AUTH_PASSWORD;
      
      if (!isValid) {
        return { authenticated: false };
      }
      
      // Générer un token JWT
      const token = jwt.sign(
        { username: input.username },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
      );
      
      return { 
        authenticated: true,
        token,
      };
    }),
  
  // Vérifier l'authentification
  verifyAuth: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        // Vérifier le token JWT
        jwt.verify(input.token, JWT_SECRET);
        return { authenticated: true };
      } catch (err) {
        return { authenticated: false };
      }
    }),
  
  // Récupérer les identifiants HTTP Basic Auth
  getHttpBasicAuth: publicProcedure
    .query(async () => {
      try {
        // Vérifier si on est sur Vercel
        if (!process.env.VERCEL_PROJECT_ID || !process.env.VERCEL_TEAM_ID || !process.env.VERCEL_API_TOKEN) {
          // En local, on retourne les valeurs du .env
          return {
            username: process.env.HTTP_BASIC_AUTH_USERNAME || '',
            password: process.env.HTTP_BASIC_AUTH_PASSWORD || '',
          };
        }
        
        // Créer un client Vercel
        const vercelClient = createVercelClient();
        
        // Récupérer les variables d'environnement
        const envVars = await vercelClient.getEnvironmentVariables();
        
        return {
          username: envVars.find((v: VercelEnvVar) => v.key === 'HTTP_BASIC_AUTH_USERNAME')?.value || '',
          password: envVars.find((v: VercelEnvVar) => v.key === 'HTTP_BASIC_AUTH_PASSWORD')?.value || '',
        };
      } catch (err) {
        console.error('Error getting HTTP Basic Auth:', err);
        throw new Error('Failed to get HTTP Basic Auth credentials');
      }
    }),
  
  // Mettre à jour les identifiants HTTP Basic Auth
  updateHttpBasicAuth: publicProcedure
    .input(z.object({
      username: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Vérifier si on est sur Vercel
        if (!process.env.VERCEL_PROJECT_ID || !process.env.VERCEL_TEAM_ID || !process.env.VERCEL_API_TOKEN) {
          // En local, on ne peut pas mettre à jour les variables d'environnement
          throw new Error('Cannot update environment variables in local development');
        }
        
        // Créer un client Vercel
        const vercelClient = createVercelClient();
        
        // Mettre à jour les variables d'environnement
        await vercelClient.updateEnvironmentVariable('HTTP_BASIC_AUTH_USERNAME', input.username);
        await vercelClient.updateEnvironmentVariable('HTTP_BASIC_AUTH_PASSWORD', input.password);
        
        return { success: true };
      } catch (err) {
        console.error('Error updating HTTP Basic Auth:', err);
        throw new Error('Failed to update HTTP Basic Auth credentials');
      }
    }),
  
  // Récupérer les clés API
  getApiKeys: publicProcedure
    .query(async () => {
      try {
        // Vérifier si on est sur Vercel
        if (!process.env.VERCEL_PROJECT_ID || !process.env.VERCEL_TEAM_ID || !process.env.VERCEL_API_TOKEN) {
          // En local, on retourne les valeurs du .env
          const apiKeys: Record<string, string> = {};
          
          // Liste des clés API à récupérer
          const apiKeyNames = [
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
          
          // Récupérer les valeurs du .env
          for (const key of apiKeyNames) {
            apiKeys[key] = process.env[key] || '';
          }
          
          return apiKeys;
        }
        
        // Créer un client Vercel
        const vercelClient = createVercelClient();
        
        // Récupérer les variables d'environnement
        const envVars = await vercelClient.getEnvironmentVariables();
        
        // Filtrer les clés API
        const apiKeys: Record<string, string> = {};
        
        // Liste des clés API à récupérer
        const apiKeyNames = [
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
        
        // Récupérer les valeurs
        for (const key of apiKeyNames) {
          const envVar = envVars.find((v: VercelEnvVar) => v.key === key);
          apiKeys[key] = envVar?.value || '';
        }
        
        return apiKeys;
      } catch (err) {
        console.error('Error getting API keys:', err);
        throw new Error('Failed to get API keys');
      }
    }),
  
  // Mettre à jour les clés API
  updateApiKeys: publicProcedure
    .input(z.record(z.string(), z.string()))
    .mutation(async ({ input }) => {
      try {
        // Vérifier si on est sur Vercel
        if (!process.env.VERCEL_PROJECT_ID || !process.env.VERCEL_TEAM_ID || !process.env.VERCEL_API_TOKEN) {
          // En local, on ne peut pas mettre à jour les variables d'environnement
          throw new Error('Cannot update environment variables in local development');
        }
        
        // Créer un client Vercel
        const vercelClient = createVercelClient();
        
        // Mettre à jour les variables d'environnement
        for (const [key, value] of Object.entries(input)) {
          if (value) {
            await vercelClient.updateEnvironmentVariable(key, value);
          }
        }
        
        return { success: true };
      } catch (err) {
        console.error('Error updating API keys:', err);
        throw new Error('Failed to update API keys');
      }
    }),
}); 