import * as React from 'react';
import { Alert, Box, Button, CircularProgress, FormControl, FormLabel, Input, Stack } from '@mui/joy';

export function AdminAuthManager() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Charger les valeurs actuelles
  React.useEffect(() => {
    const fetchCurrentValues = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer le token d'authentification
        const token = localStorage.getItem('admin_auth_token');
        if (!token) {
          throw new Error('Non authentifié');
        }
        
        // Appeler l'API pour récupérer les identifiants
        const response = await fetch('/api/admin/http-basic-auth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des identifiants');
        }
        
        const result = await response.json();
        
        setUsername(result.username || '');
        setPassword(result.password || '');
      } catch (err) {
        console.error('Error fetching HTTP Basic Auth values:', err);
        setError('Erreur lors du chargement des identifiants');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentValues();
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
      
      // Appeler l'API pour mettre à jour les identifiants
      const response = await fetch('/api/admin/http-basic-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          password,
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des identifiants');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess(true);
      } else {
        throw new Error('Erreur lors de la mise à jour des identifiants');
      }
    } catch (err) {
      console.error('Error updating HTTP Basic Auth:', err);
      setError('Erreur lors de la mise à jour des identifiants');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <FormControl>
          <FormLabel>Nom d'utilisateur</FormLabel>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur pour l'accès à l'application"
            required
          />
        </FormControl>
        
        <FormControl>
          <FormLabel>Mot de passe</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe pour l'accès à l'application"
            required
          />
        </FormControl>
        
        {success && (
          <Alert color="success">
            Les identifiants ont été mis à jour avec succès
          </Alert>
        )}
        
        {error && (
          <Alert color="danger">
            {error}
          </Alert>
        )}
        
        <Button 
          type="submit" 
          disabled={isLoading}
          startDecorator={isLoading ? <CircularProgress size="sm" /> : null}
        >
          Enregistrer
        </Button>
      </Stack>
    </Box>
  );
} 