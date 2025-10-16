'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AuthUser } from '@/types';
import { AuthUserSchema } from '@/schemas/AuthUserSchema';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: (_user: AuthUser) => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = (): void => {
      try {
        const storedUser = localStorage.getItem('tokeniko_user');
        console.log('storedUser', storedUser);

        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          console.log('parsed', parsed);

          const result = AuthUserSchema.safeParse(parsed);
          if (result.success) {
            setUser(parsed);
          } else {
            localStorage.removeItem('tokeniko_user');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);

        localStorage.removeItem('tokeniko_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback((authUser: AuthUser): void => {
    setUser(authUser);

    localStorage.setItem('tokeniko_user', JSON.stringify(authUser));
  }, []);

  const logout = useCallback((): void => {
    setUser(null);

    localStorage.removeItem('tokeniko_user');
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  return context;
};
