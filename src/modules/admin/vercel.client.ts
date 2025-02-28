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
  triggerDeployment: () => Promise<{ id: string }>;
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
   * Déclencher un redéploiement du projet sur Vercel
   * Documentation: https://vercel.com/docs/rest-api#endpoints/deployments
   */
  const triggerDeployment = async (): Promise<{ id: string }> => {
    try {
      // Approche 1: Essayer d'abord l'API de redéploiement
      try {
        const redeployUrl = `${baseUrl}/v13/deployments/${projectId}/redeploy?teamId=${teamId}`;
        
        const redeployResponse = await fetch(redeployUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (redeployResponse.ok) {
          const data = await redeployResponse.json();
          return { id: data.id || 'redeployment-triggered' };
        }
      } catch (redeployError) {
        console.warn('Redeploy method failed, trying alternative approach:', redeployError);
      }
      
      // Approche 2: Utiliser l'API de déploiement avec l'option forceNew
      try {
        const forceNewUrl = `${baseUrl}/v13/projects/${projectId}/deployments?teamId=${teamId}&forceNew=1`;
        
        const forceNewResponse = await fetch(forceNewUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (forceNewResponse.ok) {
          const data = await forceNewResponse.json();
          return { id: data.id || 'force-new-deployment-triggered' };
        }
      } catch (forceNewError) {
        console.warn('Force new deployment method failed, trying final approach:', forceNewError);
      }
      
      // Approche 3: Si les approches précédentes échouent, récupérer les informations du projet
      const projectUrl = `${baseUrl}/v9/projects/${projectId}?teamId=${teamId}`;
      
      const projectResponse = await fetch(projectUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!projectResponse.ok) {
        const errorText = await projectResponse.text();
        throw new Error(`Failed to get project info: ${projectResponse.status} ${errorText}`);
      }
      
      const projectData = await projectResponse.json();
      
      // Créer un nouveau déploiement avec les informations du projet
      const deployUrl = `${baseUrl}/v13/deployments?teamId=${teamId}`;
      
      const deployResponse = await fetch(deployUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectId,
          project: projectId,
          target: 'production',
          // Utiliser les informations du projet pour le gitSource
          gitSource: {
            type: projectData.link?.type || 'github',
            repoId: projectData.link?.repoId || projectData.id,
            ref: projectData.link?.ref || 'main',
          },
        }),
      });
      
      if (!deployResponse.ok) {
        const errorText = await deployResponse.text();
        throw new Error(`Failed to trigger deployment: ${deployResponse.status} ${errorText}`);
      }
      
      const deployData = await deployResponse.json();
      return { id: deployData.id };
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