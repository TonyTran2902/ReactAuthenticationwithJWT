import { useQuery } from '@tanstack/react-query';

import { authService } from '../services/authService';
import { useAuthContext } from '../context/AuthProvider';

export const useProfileQuery = () => {
  const { status } = useAuthContext();

  return useQuery({
    queryKey: ['profile'],
    queryFn: authService.profile,
    enabled: status === 'authenticated',
  });
};
