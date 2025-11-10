import { useMutation } from '@tanstack/react-query';

import { authService } from '../services/authService';
import { useAuthContext } from '../context/AuthProvider';

export const useLoginMutation = () => {
  const { setAuthenticatedSession } = useAuthContext();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (payload) => {
      setAuthenticatedSession(payload);
    },
  });
};

export const useLogoutMutation = () => {
  const { resetSession } = useAuthContext();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      resetSession();
    },
  });
};
