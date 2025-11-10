import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { authService } from '../services/authService';
import { tokenService } from '../utils/tokenService';
import { AuthResponse, User } from '../types/auth';
import { authEventBus } from './authEvents';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  setAuthenticatedSession: (payload: AuthResponse) => void;
  resetSession: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const queryClient = useQueryClient();

  useEffect(() => {
    const refreshToken = tokenService.getRefreshToken();

    if (!refreshToken) {
      setStatus('unauthenticated');
      return;
    }

    authService
      .refreshSession()
      .then((payload) => {
        tokenService.setAccessToken(payload.accessToken);
        if (payload.refreshToken) {
          tokenService.setRefreshToken(payload.refreshToken);
        }
        setUser(payload.user);
        setStatus('authenticated');
      })
      .catch(() => {
        tokenService.clear();
        setUser(null);
        setStatus('unauthenticated');
      });
  }, []);

  useEffect(() => {
    const unsubscribe = authEventBus.subscribe((event) => {
      if (event === 'logout') {
        resetSession();
      }
    });

    return () => unsubscribe();
  }, []);

  const setAuthenticatedSession = (payload: AuthResponse) => {
    tokenService.setAccessToken(payload.accessToken);
    if (payload.refreshToken) {
      tokenService.setRefreshToken(payload.refreshToken);
    }

    setUser(payload.user);
    setStatus('authenticated');
  };

  const resetSession = () => {
    tokenService.clear();
    setUser(null);
    setStatus('unauthenticated');
    queryClient.clear();
  };

  const value = useMemo(
    () => ({
      user,
      status,
      setAuthenticatedSession,
      resetSession,
    }),
    [status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
