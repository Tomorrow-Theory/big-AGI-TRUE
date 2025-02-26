import { useState, useEffect } from 'react';

interface AuthResponse {
  authenticated: boolean;
  token?: string;
  error?: string;
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('admin_auth_token');
        
        if (token) {
          // Vérifier si le token est valide
          try {
            const response = await fetch('/api/admin/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            
            const data = await response.json();
            
            if (!response.ok || !data.authenticated) {
              throw new Error('Token invalide');
            }
            
            setIsAuthenticated(data.authenticated);
          } catch (err) {
            console.error('Token verification error:', err);
            setIsAuthenticated(false);
            localStorage.removeItem('admin_auth_token');
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la connexion');
      }
      
      if (data.authenticated && data.token) {
        localStorage.setItem('admin_auth_token', data.token);
        setIsAuthenticated(true);
        return true;
      } else {
        setError('Identifiants invalides');
        setIsAuthenticated(false);
        return false;
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Erreur lors de la connexion');
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_auth_token');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
} 