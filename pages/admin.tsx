import * as React from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardContent, Container, Divider, FormControl, FormLabel, Input, Stack, Typography, CircularProgress, Alert, Snackbar, Modal, ModalDialog, ModalClose } from '@mui/joy';
import LogoutIcon from '@mui/icons-material/Logout';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
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
  const [deploymentStatus, setDeploymentStatus] = React.useState<{ message: string; severity: 'success' | 'danger' | 'warning' } | null>(null);
  const [isDeploying, setIsDeploying] = React.useState(false);
  const [showDeploymentModal, setShowDeploymentModal] = React.useState(false);
  // Toujours avec rebuild complet par défaut
  const skipBuild = false;

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

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStatus(null);
    
    try {
      // Récupérer le token d'authentification
      const token = localStorage.getItem('admin_auth_token');
      
      if (!token) {
        setDeploymentStatus({
          message: 'Erreur d\'authentification. Veuillez vous reconnecter.',
          severity: 'danger'
        });
        setIsDeploying(false);
        return;
      }
      
      // Appeler l'API pour déclencher le redéploiement
      const response = await fetch('/api/admin/deploy', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skipBuild })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Afficher le modal de succès au lieu d'une simple notification
        setShowDeploymentModal(true);
      } else {
        setDeploymentStatus({
          message: data.message || 'Erreur lors du déclenchement du redéploiement.',
          severity: 'danger'
        });
      }
    } catch (error) {
      console.error('Error triggering deployment:', error);
      setDeploymentStatus({
        message: 'Erreur lors du déclenchement du redéploiement.',
        severity: 'danger'
      });
    } finally {
      setIsDeploying(false);
    }
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
                  <FormLabel>Nom d&apos;utilisateur</FormLabel>
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
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            variant="solid" 
            color="primary" 
            onClick={handleDeploy}
            startDecorator={<RocketLaunchIcon />}
            loading={isDeploying}
            disabled={isDeploying}
          >
            Déployer les changements
          </Button>
          <Button 
            variant="outlined" 
            color="neutral" 
            onClick={handleLogout}
            startDecorator={<LogoutIcon />}
          >
            Déconnexion
          </Button>
        </Box>
      </Box>
      
      <Typography level="h4" sx={{ mb: 2 }}>
        Gestion des identifiants HTTP Basic Auth
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography level="h3">Authentification HTTP Basic</Typography>
          <Typography level="body-sm" sx={{ mb: 2 }}>
            Configurez les identifiants d&apos;accès à l&apos;application
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
      
      {deploymentStatus && (
        <Snackbar
          open={!!deploymentStatus}
          onClose={() => setDeploymentStatus(null)}
          autoHideDuration={6000}
          color={deploymentStatus.severity}
          variant="solid"
        >
          {deploymentStatus.message}
        </Snackbar>
      )}
      
      {/* Modal de déploiement réussi */}
      <Modal
        open={showDeploymentModal}
        onClose={() => setShowDeploymentModal(false)}
      >
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="deployment-success-modal-title"
          aria-describedby="deployment-success-modal-description"
        >
          <ModalClose onClick={() => setShowDeploymentModal(false)} />
          <Typography
            id="deployment-success-modal-title"
            level="h2"
            startDecorator={<RocketLaunchIcon />}
            sx={{ mb: 2 }}
          >
            Déploiement en cours
          </Typography>
          <Typography id="deployment-success-modal-description" textColor="text.tertiary">
            Le redéploiement avec rebuild complet a été déclenché avec succès. 
            L&apos;application sera mise à jour dans environ 5 minutes.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="solid"
              color="primary"
              onClick={() => setShowDeploymentModal(false)}
            >
              Compris
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Container>
  );
}

// Utiliser la mise en page de l'application
AdminPage.getLayout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>; 