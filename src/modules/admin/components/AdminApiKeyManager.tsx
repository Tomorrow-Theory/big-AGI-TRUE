import * as React from 'react';
import { Alert, Box, Button, CircularProgress, Divider, FormControl, FormLabel, Input, Stack, Typography } from '@mui/joy';

// Liste des clés API à gérer
const API_KEYS = [
  { key: 'OPENAI_API_KEY', label: 'OpenAI API Key', description: 'Clé API pour OpenAI', link: 'https://platform.openai.com/api-keys' },
  { key: 'ANTHROPIC_API_KEY', label: 'Anthropic API Key', description: 'Clé API pour Anthropic', link: 'https://console.anthropic.com/settings/keys' },
  { key: 'GEMINI_API_KEY', label: 'Gemini API Key', description: 'Clé API pour Google Gemini', link: 'https://aistudio.google.com/app/apikey' },
  { key: 'GROQ_API_KEY', label: 'Groq API Key', description: 'Clé API pour Groq', link: 'https://console.groq.com/keys' },
  { key: 'MISTRAL_API_KEY', label: 'Mistral API Key', description: 'Clé API pour Mistral AI', link: 'https://console.mistral.ai/' },
  { key: 'PERPLEXITY_API_KEY', label: 'Perplexity API Key', description: 'Clé API pour Perplexity', link: 'https://www.perplexity.ai/settings/api' },
  { key: 'OPENROUTER_API_KEY', label: 'OpenRouter API Key', description: 'Clé API pour OpenRouter', link: 'https://openrouter.ai/keys' },
  { key: 'TOGETHERAI_API_KEY', label: 'TogetherAI API Key', description: 'Clé API pour TogetherAI', link: 'https://api.together.xyz/settings/api-keys' },
  { key: 'XAI_API_KEY', label: 'XAI API Key', description: 'Clé API pour XAI', link: 'https://console.x.ai/' },
  { key: 'DEEPSEEK_API_KEY', label: 'Deepseek API Key', description: 'Clé API pour Deepseek', link: 'https://platform.deepseek.com/api_keys' },
  { key: 'ALIBABA_API_KEY', label: 'Alibaba API Key', description: 'Clé API pour Alibaba', link: 'https://bailian.console.alibabacloud.com/?apiKey=1#/api-key' },
  { key: 'ELEVENLABS_API_KEY', label: 'ElevenLabs API Key', description: 'Clé API pour ElevenLabs (Text-to-Speech)', link: 'https://elevenlabs.io/app/settings/api-keys' },
  { key: 'PRODIA_API_KEY', label: 'Prodia API Key', description: 'Clé API pour Prodia (Text-to-Image)', link: 'https://app.prodia.com/api' },
  { key: 'GOOGLE_CLOUD_API_KEY', label: 'Google Cloud API Key', description: 'Clé API pour Google Cloud', link: 'https://console.cloud.google.com/apis/credentials' },
  { key: 'GOOGLE_CSE_ID', label: 'Google CSE ID', description: 'ID pour Google Custom Search Engine', link: 'https://programmablesearchengine.google.com/controlpanel/all' },
];

export function AdminApiKeyManager() {
  const [apiKeys, setApiKeys] = React.useState<Record<string, string>>({});
  const [initialApiKeys, setInitialApiKeys] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasChanges, setHasChanges] = React.useState(false);

  // Vérifier s'il y a des changements
  React.useEffect(() => {
    let changed = false;
    
    // Vérifier si des clés ont été ajoutées, modifiées ou supprimées
    for (const key of API_KEYS.map(k => k.key)) {
      if (apiKeys[key] !== initialApiKeys[key]) {
        changed = true;
        break;
      }
    }
    
    setHasChanges(changed);
  }, [apiKeys, initialApiKeys]);

  // Charger les valeurs actuelles
  React.useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer le token d'authentification
        const token = localStorage.getItem('admin_auth_token');
        if (!token) {
          throw new Error('Non authentifié');
        }
        
        // Appeler l'API pour récupérer les clés API
        const response = await fetch('/api/admin/api-keys', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des clés API');
        }
        
        const result = await response.json();
        setApiKeys(result);
        setInitialApiKeys(result);
      } catch (err) {
        console.error('Error fetching API keys:', err);
        setError('Erreur lors du chargement des clés API');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setSuccess(false);
      setError(null);
      
      // Récupérer le token d'authentification
      const token = localStorage.getItem('admin_auth_token');
      if (!token) {
        throw new Error('Non authentifié');
      }
      
      // Appeler l'API pour mettre à jour les clés API
      const response = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiKeys)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des clés API');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess(true);
        // Mettre à jour les valeurs initiales après un enregistrement réussi
        setInitialApiKeys({...apiKeys});
      } else {
        // Si l'API retourne success: false, on affiche le message d'erreur
        if (result.message) {
          setError(result.message);
        } else {
          throw new Error('Erreur lors de la mise à jour des clés API');
        }
      }
    } catch (err) {
      console.error('Error updating API keys:', err);
      setError('Erreur lors de la mise à jour des clés API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {API_KEYS.map((apiKey, index) => (
          <React.Fragment key={apiKey.key}>
            {index > 0 && <Divider />}
            <FormControl>
              <FormLabel>
                {apiKey.label}
                {apiKey.link && (
                  <Typography component="span" ml={1} fontSize="sm">
                    (<a href={apiKey.link} target="_blank" rel="noopener noreferrer">Obtenir une clé</a>)
                  </Typography>
                )}
              </FormLabel>
              <Input
                value={apiKeys[apiKey.key] || ''}
                onChange={(e) => handleChange(apiKey.key, e.target.value)}
                placeholder={apiKey.description}
                type="password"
              />
              <Typography level="body-xs" mt={0.5}>
                {apiKey.description}
              </Typography>
            </FormControl>
          </React.Fragment>
        ))}
        
        {success && (
          <Alert color="success">
            Les clés API ont été mises à jour avec succès
          </Alert>
        )}
        
        {error && (
          <Alert color="danger">
            {error}
          </Alert>
        )}
        
        <Button 
          type="submit" 
          disabled={isLoading || !hasChanges}
          startDecorator={isLoading ? <CircularProgress size="sm" /> : null}
        >
          Enregistrer toutes les clés
        </Button>
      </Stack>
    </Box>
  );
} 