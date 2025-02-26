import * as React from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardContent, Container, Divider, FormControl, FormLabel, Input, Stack, Typography, CircularProgress, Alert } from '@mui/joy';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAdminAuth } from '../src/modules/admin/hooks/useAdminAuth';
import { Brand } from '../src/common/app.config';
import { AppLayout } from '../src/common/layouts/AppLayout';
import { AdminApiKeyManager } from '../src/modules/admin/components/AdminApiKeyManager';
import { AdminAuthManager } from '../src/modules/admin/components/AdminAuthManager';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, error, login, logout } = useAdminAuth();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loginError, setLoginError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (error) {
      setLoginError(error);
    }
  }, [error]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const success = await login(username, password);
      if (!success) {
        setLoginError('Échec de la connexion. Vérifiez vos identifiants.');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setLoginError('Erreur lors de la connexion');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card>
          <CardContent>
            <Typography level="h4" textAlign="center">Administration {Brand.Title.Base}</Typography>
            <Divider sx={{ my: 2 }} />
            <Box component="form" onSubmit={handleLogin}>
              <Stack spacing={2}>
                {loginError && <Alert color="danger" sx={{ mb: 2 }}>{loginError}</Alert>}
                <FormControl>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <Input
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Mot de passe</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormControl>
                <Button type="submit" fullWidth>
                  Se connecter
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography level="h2">Administration {Brand.Title.Base}</Typography>
        <Button 
          variant="outlined" 
          color="neutral" 
          onClick={handleLogout}
          startDecorator={<LogoutIcon />}
        >
          Déconnexion
        </Button>
      </Box>
      
      <Typography level="h4" sx={{ mb: 2 }}>
        Gestion des identifiants HTTP Basic Auth
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography level="h3">Authentification HTTP Basic</Typography>
          <Typography level="body-sm" sx={{ mb: 2 }}>
            Configurez les identifiants d'accès à l'application
          </Typography>
          <AdminAuthManager />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography level="h3">Clés API</Typography>
          <Typography level="body-sm" sx={{ mb: 2 }}>
            Configurez les clés API pour les différents services
          </Typography>
          <AdminApiKeyManager />
        </CardContent>
      </Card>
    </Container>
  );
}

// Utiliser la mise en page de l'application
AdminPage.getLayout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>; 