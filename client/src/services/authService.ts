import api from '../api/axiosClient';
import { tokenService } from '../utils/tokenService';
import { AuthResponse } from '../types/auth';

export const authService = {
  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },
  refreshSession: async () => {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Refresh token missing');
    }

    const { data } = await api.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });

    return data;
  },
  logout: async () => {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      return;
    }

    await api.post('/auth/logout', { refreshToken });
  },
  profile: async () => {
    const { data } = await api.get('/protected/profile');
    return data as {
      user: AuthResponse['user'];
      stats: {
        lastLogin: string;
        projects: number;
        notifications: number;
      };
    };
  },
};
