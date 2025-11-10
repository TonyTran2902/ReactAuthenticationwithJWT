export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken?: string;
};
