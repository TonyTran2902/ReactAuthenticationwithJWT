import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { Location, useLocation, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthProvider';
import { useLoginMutation } from '../hooks/useAuthMutations';

type LoginFormFields = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useAuthContext();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    defaultValues: {
      email: 'demo@example.com',
      password: 'Password123!',
    },
  });

  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  const onSubmit = (values: LoginFormFields) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        const redirectPath = (location.state as { from?: Location } | null)?.from?.pathname || '/';
        navigate(redirectPath, { replace: true });
      },
    });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div>
          <h1>Welcome Back</h1>
          <p>Use the demo credentials or your own user to continue.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /[^@\s]+@[^@\s]+\.[^@\s]+/, // basic email shape
                message: 'Enter a valid email',
              },
            })}
          />
          {errors.email && <span className="field-error">{errors.email.message}</span>}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          {errors.password && <span className="field-error">{errors.password.message}</span>}

          {loginMutation.isError && (
            <div className="form-error">
              {(
                loginMutation.error as AxiosError<{ message?: string }>
              )?.response?.data?.message || 'Login failed. Check your credentials.'}
            </div>
          )}

          <button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
