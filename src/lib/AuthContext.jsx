import React, { createContext, useState, useContext, useEffect } from 'react';
import db from '@/api/base44Client';

const AuthContext = createContext();
const BASE_URL = import.meta.env.BASE_URL || '/';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    // For static site, skip authentication checks
    setIsLoadingAuth(false);
    setIsLoadingPublicSettings(false);
    setIsAuthenticated(false);
  }, []);

  const checkAppState = async () => {
    // No-op for static site
    setIsLoadingPublicSettings(false);
    setIsLoadingAuth(false);
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    // For static site, just clear local state
    if (shouldRedirect && window.location.pathname !== BASE_URL) {
      window.location.href = BASE_URL;
    }
  };

  const navigateToLogin = () => {
    // For static site, redirect to home
    window.location.href = BASE_URL;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
