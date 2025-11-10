const REFRESH_TOKEN_KEY = 'ia04_refresh_token';

let accessToken: string | null = null;

const isBrowser = () => typeof window !== 'undefined';

export const tokenService = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string | null | undefined) => {
    accessToken = token ?? null;
  },
  getRefreshToken: () => {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken: (token: string | null | undefined) => {
    if (!isBrowser()) return;
    if (token) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
  clear: () => {
    accessToken = null;
    if (isBrowser()) {
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
};
