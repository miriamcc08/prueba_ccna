import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthUser, api } from '../services/api';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'ccna_token';
const USER_KEY = 'ccna_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize and check token validity
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        try {
          const res = await api.getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem(USER_KEY, JSON.stringify(res.data));
          } else {
            // Token invalid or expired
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setToken(null);
            setUser(null);
          }
        } catch {
          // If offline or server error, retain cached user if available
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.login(email, password);
      if (res.success && res.data) {
        const { token: receivedToken, user: receivedUser } = res.data;
        api.setToken(receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem(USER_KEY, JSON.stringify(receivedUser));
        setIsLoading(false);
        return true;
      } else {
        setError(res.error || 'Failed to sign in. Check your credentials.');
        setIsLoading(false);
        return false;
      }
    } catch (e: any) {
      setError(e.message || 'Network error during sign in');
      setIsLoading(false);
      return false;
    }
  }, []);

  const register = useCallback(async (email: string, username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.register(email, username, password);
      if (res.success && res.data) {
        const { token: receivedToken, user: receivedUser } = res.data;
        api.setToken(receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem(USER_KEY, JSON.stringify(receivedUser));
        setIsLoading(false);
        return true;
      } else {
        setError(res.error || 'Registration failed. Email or username might already exist.');
        setIsLoading(false);
        return false;
      }
    } catch (e: any) {
      setError(e.message || 'Network error during registration');
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    api.setToken(null);
    setToken(null);
    setUser(null);
    setError(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
