/**
 * Client pour interagir avec l'API Vercel
 * Documentation: https://vercel.com/docs/rest-api
 */

export interface VercelEnvVar {
  id: string;
  key: string;
  value: string;
  target: string[];
  type: string;
  configurationId?: string;
  createdAt?: number;
  updatedAt?: number;
  gitBranch?: string;
  system?: boolean;
}

interface VercelClient {
  getEnvironmentVariables: () => Promise<VercelEnvVar[]>;
  updateEnvironmentVariable: (key: string, value: string) => Promise<void>;
  triggerDeployment: (skipBuild?: boolean) => Promise<{ id: string }>;
}

export function createVercelClient(): VercelClient {
  const apiToken = process.env.VERCEL_API_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!apiToken || !teamId || !projectId) {
    throw new Error('Missing Vercel API credentials');
  }

  const baseUrl = 'https://api.vercel.com';

  /**
   * Récupérer toutes les variables d'environnement du projet
   */
  const getEnvironmentVariables = async (): Promise<VercelEnvVar[]> => {
    try {
      const url = `${baseUrl}/v9/projects/${projectId}/env?teamId=${teamId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get environment variables: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data.envs || [];
    } catch (error) {
      console.error('Error fetching environment variables:', error);
      throw error;
    }
  };

  /**
   * Mettre à jour une variable d'environnement
   * Si la variable existe déjà, elle sera mise à jour, sinon elle sera créée
   */
  const updateEnvironmentVariable = async (key: string, value: string): Promise<void> => {
    try {
      // Récupérer les variables existantes pour vérifier si la variable existe déjà
      const envVars = await getEnvironmentVariables();
      const existingVar = envVars.find(v => v.key === key);

      // URL de l'API
      const url = existingVar
        ? `${baseUrl}/v9/projects/${projectId}/env/${existingVar.id}?teamId=${teamId}`
        : `${baseUrl}/v9/projects/${projectId}/env?teamId=${teamId}`;

      // Méthode HTTP
      const method = existingVar ? 'PATCH' : 'POST';

      // Corps de la requête
      const body: any = {
        value,
        target: ['production', 'preview', 'development'],
        type: 'plain',
      };

      // Si on crée une nouvelle variable, on ajoute la clé
      if (!existingVar) {
        body.key = key;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update environment variable: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error(`Error updating environment variable ${key}:`, error);
      throw error;
    }
  };


  /**
   * Déclencher un déploiement via l'API Vercel
   * Utilise l'endpoint de création de déploiement avec les paramètres minimaux requis
   */
  const triggerDeployment = async (skipBuild = false): Promise<{ id: string }> => {
    try {
      // 1. Récupérer le dernier déploiement pour obtenir des informations importantes
      const deploymentsUrl = `${baseUrl}/v6/deployments?teamId=${teamId}&projectId=${projectId}&limit=1&state=READY`;
      const deploymentsResponse = await fetch(deploymentsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!deploymentsResponse.ok) {
        throw new Error(`Failed to get deployments: ${deploymentsResponse.status}`);
      }
      
      const deploymentsData = await deploymentsResponse.json();
      const lastDeployment = deploymentsData.deployments?.[0];
      
      if (!lastDeployment) {
        throw new Error('No previous deployment found');
      }
      
      // 2. Utiliser l'endpoint de redéploiement, qui est le plus fiable pour redéployer un projet existant
      const redeployUrl = `${baseUrl}/v13/deployments/${lastDeployment.uid}/redeploy?teamId=${teamId}`;
      
      const redeployResponse = await fetch(redeployUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        // Corps vide, toutes les configurations sont reprises du déploiement existant
        body: JSON.stringify({}),
      });
      
      if (!redeployResponse.ok) {
        // Si le redéploiement échoue, essayer l'approche de création manuelle
        console.warn('Redeploy failed, trying manual deployment creation');
        
        // 3. Récupérer les informations du projet
        const projectUrl = `${baseUrl}/v9/projects/${projectId}?teamId=${teamId}`;
        const projectResponse = await fetch(projectUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!projectResponse.ok) {
          throw new Error(`Failed to get project info: ${projectResponse.status}`);
        }
        
        const projectData = await projectResponse.json();
        
        // 4. Créer un déploiement manuellement avec les informations minimales requises
        const createUrl = `${baseUrl}/v13/deployments?teamId=${teamId}&forceNew=1`;
        
        const createResponse = await fetch(createUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: projectData.name,
            project: projectId,
            target: 'production',
            // Utiliser les informations git du projet
            gitSource: {
              type: projectData.link?.type || 'github',
              repoId: projectData.link?.repoId,
              ref: projectData.link?.ref || projectData.link?.productionBranch || 'main',
            },
          }),
        });
        
        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          throw new Error(`Failed to create deployment: ${createResponse.status} ${errorText}`);
        }
        
        const createData = await createResponse.json();
        return { id: createData.id };
      }
      
      const redeployData = await redeployResponse.json();
      return { id: redeployData.id };
    } catch (error) {
      console.error('Error triggering deployment:', error);
      throw error;
    }
  };
  
  return {
    getEnvironmentVariables,
    updateEnvironmentVariable,
    triggerDeployment,
  };
}