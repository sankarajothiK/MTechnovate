import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => authService.getCurrentAdmin());
  const [token, setToken] = useState(() => authService.getAuthToken());
  const [loading, setLoading] = useState(() => !authService.getCurrentAdmin());

  useEffect(() => {
    // Listen to Firebase Auth & local master admin state
    const unsubscribe = authService.subscribeAuthState((user) => {
      if (user) {
        setAdmin(user);
        setToken(authService.getAuthToken());
      } else {
        const localAdmin = authService.getCurrentAdmin();
        if (localAdmin) {
          setAdmin(localAdmin);
          setToken(authService.getAuthToken());
        } else {
          setAdmin(null);
          setToken(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await api.adminLogin({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('m_tech_admin_token', res.token);
      setToken(res.token);
      setAdmin(res.admin);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = async () => {
    try {
      await authService.signOut();
    } catch {
      // fallback
    }
    localStorage.removeItem('m_tech_admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, isAuthenticated: !!admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
