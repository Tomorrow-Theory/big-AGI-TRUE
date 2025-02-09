// pages/api/admin/env-vars.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface VercelEnvVar {
  type: string;
  key: string;
  value: string;
  target: string[];
  id: string;
  createdAt: number;
  updatedAt: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
  const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
  const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

  if (!VERCEL_API_TOKEN || !VERCEL_PROJECT_ID || !VERCEL_TEAM_ID) {
    return res.status(500).json({ error: 'Missing Vercel configuration' });
  }

  // GET - Fetch environment variables
  if (req.method === 'GET') {
    try {
      const response = await fetch(
        `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}`,
        {
          headers: {
            'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
            'Accept': '*/*'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Vercel API error: ${errorData.error?.message || response.status}`);
      }

      const data = await response.json();
      
      if (!data || !Array.isArray(data.envs)) {
        throw new Error('Invalid response format from Vercel API');
      }

      // Filter out sensitive variables and format response
      const filteredEnvVars = data.envs
        .filter((env: VercelEnvVar) => 
          !['HTTP_ADMIN_AUTH_PASSWORD', 'HTTP_ADMIN_AUTH_USERNAME'].includes(env.key)
        )
        .map((env: VercelEnvVar) => ({
          key: env.key,
          value: env.value,
          type: env.type,
          target: env.target || [],
          id: env.id
        }));

      return res.status(200).json({ envVars: filteredEnvVars });
    } catch (error) {
      console.error('Error fetching env vars:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch env vars',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // PUT - Update environment variables (single or bulk)
  if (req.method === 'PUT') {
    try {
      // Check if it's a bulk update
      if (req.body.updates) {
        const updates = req.body.updates;
        const results = [];
        const errors = [];

        // Process each update sequentially
        for (const [key, value] of Object.entries(updates)) {
          try {
            const response = await fetch(
              `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env/${key}?teamId=${VERCEL_TEAM_ID}`,
              {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
                  'Content-Type': 'application/json',
                  'Accept': '*/*'
                },
                body: JSON.stringify({
                  value,
                  type: 'encrypted',
                  target: ['production', 'preview', 'development']
                })
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`Failed to update ${key}: ${errorData.error?.message || response.status}`);
            }

            const data = await response.json();
            results.push({ key, success: true, data });
          } catch (error) {
            errors.push({ key, error: error instanceof Error ? error.message : String(error) });
          }
        }

        // Return combined results
        return res.status(errors.length ? 207 : 200).json({
          success: errors.length === 0,
          results,
          errors
        });
      } else {
        // Single update (existing code)
        const { key, value } = req.body;
        try {
          const response = await fetch(
            `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env/${key}?teamId=${VERCEL_TEAM_ID}`,
            {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': '*/*'
              },
              body: JSON.stringify({
                value,
                type: 'encrypted',
                target: ['production', 'preview', 'development']
              })
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Vercel API error: ${errorData.error?.message || response.status}`);
          }

          const data = await response.json();
          return res.status(200).json(data);
        } catch (error) {
          console.error('Error updating env var:', error);
          return res.status(500).json({ 
            error: 'Failed to update env var',
            details: error instanceof Error ? error.message : String(error)
          });
        }
      }
    } catch (error) {
      console.error('Error updating env vars:', error);
      return res.status(500).json({ 
        error: 'Failed to update env vars',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
