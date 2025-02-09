import { Box, Button, Table, Sheet, Typography, CircularProgress, Alert, Snackbar, Tooltip } from '@mui/joy';
import React, { useEffect, useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';

// Enhanced types for environment variables
interface EnvVar {
  key: string;
  value: string;
  configured: boolean;
  description: string;
  required?: boolean;
  type: string;
  target: string[];
  id: string;
  isDirty?: boolean; // Track if the value has been modified
  originalValue?: string; // Keep track of original value
}

interface EnvVarSpec {
  key: string;
  description: string;
  required?: boolean;
  category: 'Authentication' | 'LLMs';
  isSecret?: boolean;
}

// Complete list of environment variables with descriptions
const ENV_SPECS: EnvVarSpec[] = [
    // Backend
    { key: 'HTTP_BASIC_AUTH_USERNAME', description: 'Username for HTTP Basic Authentication', required: true, category: 'Authentication', isSecret: true },
    { key: 'HTTP_BASIC_AUTH_PASSWORD', description: 'Password for HTTP Basic Authentication', required: true, category: 'Authentication', isSecret: true },

    // LLMs
    { key: 'OPENAI_API_KEY', description: 'API key for OpenAI', category: 'LLMs', isSecret: true },
    { key: 'OPENAI_API_HOST', description: 'Custom host for OpenAI (e.g., Helicone, CloudFlare)', category: 'LLMs' },
    { key: 'OPENAI_API_ORG_ID', description: 'OpenAI Organization ID', category: 'LLMs' },
    { key: 'AZURE_OPENAI_API_ENDPOINT', description: 'Azure OpenAI endpoint URL', category: 'LLMs' },
    { key: 'AZURE_OPENAI_API_KEY', description: 'Azure OpenAI API key', category: 'LLMs', isSecret: true },
    { key: 'ANTHROPIC_API_KEY', description: 'Anthropic API key', category: 'LLMs', isSecret: true },
    { key: 'ANTHROPIC_API_HOST', description: 'Custom host for Anthropic', category: 'LLMs' },
    { key: 'DEEPSEEK_API_KEY', description: 'API key for Deepseek AI', category: 'LLMs', isSecret: true },
    { key: 'GEMINI_API_KEY', description: 'API key for Google AI\'s Gemini', category: 'LLMs', isSecret: true },
    { key: 'GROQ_API_KEY', description: 'API key for Groq Cloud', category: 'LLMs', isSecret: true },
    { key: 'LOCALAI_API_HOST', description: 'URL of the LocalAI server', category: 'LLMs' },
    { key: 'LOCALAI_API_KEY', description: 'API key for LocalAI', category: 'LLMs', isSecret: true },
    { key: 'MISTRAL_API_KEY', description: 'API key for Mistral', category: 'LLMs', isSecret: true },
    { key: 'OLLAMA_API_HOST', description: 'Host for the Ollama vendor', category: 'LLMs' },
    { key: 'OPENPIPE_API_KEY', description: 'API key for OpenPipe', category: 'LLMs', isSecret: true },
    { key: 'OPENROUTER_API_KEY', description: 'API key for OpenRouter', category: 'LLMs', isSecret: true },
    { key: 'PERPLEXITY_API_KEY', description: 'API key for Perplexity', category: 'LLMs', isSecret: true },
    { key: 'TOGETHERAI_API_KEY', description: 'API key for Together AI', category: 'LLMs', isSecret: true },
    { key: 'XAI_API_KEY', description: 'API key for xAI', category: 'LLMs', isSecret: true },

];

const AdminPage = () => {
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});

  const fetchEnvVars = async () => {
    try {
      const response = await fetch('/api/admin/env-vars');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      // Combine configured variables with all possible variables
      const configuredKeys = new Set(data.envVars.map((env: EnvVar) => env.key));
      const allVars = ENV_SPECS.map(spec => {
        const configured = data.envVars.find((env: EnvVar) => env.key === spec.key);
        return {
          ...spec,
          value: configured?.value || '',
          originalValue: configured?.value || '',
          configured: configuredKeys.has(spec.key),
          id: spec.key,
          type: spec.isSecret ? 'password' : 'text',
          target: ['server'],
          isDirty: false,
        };
      });
      setEnvVars(allVars);
      setPendingChanges({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch environment variables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvVars();
  }, []);

  const handleUpdateEnvVar = async (key: string, value: string) => {
    try {
      const response = await fetch('/api/admin/env-vars', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update');
      }
      
      await fetchEnvVars();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update environment variable');
    }
  };

  // New handler for input changes
  const handleInputChange = (key: string, value: string) => {
    const originalValue = envVars.find(env => env.key === key)?.originalValue || '';
    if (value !== originalValue) {
      setPendingChanges(prev => ({ ...prev, [key]: value }));
    } else {
      setPendingChanges(prev => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  // New bulk update handler
  const handleBulkUpdate = async () => {
    if (!Object.keys(pendingChanges).length) return;

    try {
      const response = await fetch('/api/admin/env-vars', { // Changed from /api/admin/env-vars/bulk
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: pendingChanges }),
      });
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          if (error.errors?.length) {
            throw new Error(`Some updates failed: ${error.errors.map((e: any) => e.key).join(', ')}`);
          }
          throw new Error(error.error || 'Failed to update');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }
      
      await fetchEnvVars();
      setSuccess(true);
      setPendingChanges({});
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update environment variables');
    }
  };

  const renderEnvVarsByCategory = (category: EnvVarSpec['category']) => {
    const categoryVars = envVars.filter(env => ENV_SPECS.find(spec => spec.key === env.key)?.category === category);
    
    return categoryVars.length > 0 && (
      <>
        <Typography level="h3" sx={{ mt: 4, mb: 2 }}>{category}</Typography>
        <Sheet variant="outlined">
          <Table>
            <thead>
              <tr>
                <th>Variable</th>
                <th>Description</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {categoryVars.map((env) => (
                <tr key={env.id} style={{ opacity: env.configured ? 1 : 0.6 }}>
                  <td>
                    {env.key}
                    {env.required && (
                      <Tooltip title="Required">
                        <InfoIcon color="warning" sx={{ ml: 1, width: 16, height: 16 }} />
                      </Tooltip>
                    )}
                  </td>
                  <td>{env.description}</td>
                  <td>
                    <input
                      value={pendingChanges[env.key] ?? env.value}
                      onChange={(e) => handleInputChange(env.key, e.target.value)}
                      type={env.type}
                      style={{ 
                        width: '100%', 
                        padding: '8px',
                        backgroundColor: pendingChanges[env.key] ? 'var(--joy-palette-warning-50)' : undefined,
                        color: pendingChanges[env.key] ? 'var(--joy-palette-neutral-900)' : 'inherit',
                        border: '1px solid var(--joy-palette-neutral-300)',
                        borderRadius: '4px'
                      }}
                      placeholder={env.type === 'password' ? '••••••••' : 'Not configured'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
      </>
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      {loading && <CircularProgress />}
      {error && <Typography color="danger">{error}</Typography>}
      {!loading && !error && (
        <>
          <Typography level="h2">Environment Variables Management</Typography>
          <Alert sx={{ mt: 2, mb: 4 }} variant="soft" color="neutral">
            Configure your environment variables. Modified fields are highlighted.
          </Alert>
          
          {['Authentication', 'LLMs'].map(category => 
            renderEnvVarsByCategory(category as EnvVarSpec['category'])
          )}

          {/* Bulk Update Button */}
          {Object.keys(pendingChanges).length > 0 && (
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined" 
                color="neutral"
                onClick={() => {
                  setPendingChanges({});
                  fetchEnvVars();
                }}
              >
                Reset Changes
              </Button>
              <Button
                variant="solid"
                color="primary"
                onClick={handleBulkUpdate}
                endDecorator={`(${Object.keys(pendingChanges).length})`}
              >
                Update All Changes
              </Button>
            </Box>
          )}
        </>
      )}
      
      <Snackbar
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        open={success}
        color="success"
        size="lg"
      >
        <Alert variant="solid" color="success">
          Environment variables updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPage;