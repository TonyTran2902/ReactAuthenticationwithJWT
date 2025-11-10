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

const highlights = [
  'JWT access + refresh tokens with rotation',
  'React Query cache-aware mutations',
  'React Hook Form validation & UX',
];

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
    <div className="auth-screen">
      <div className="auth-content">
        <aside className="brand-panel">
          <p className="badge">IA04 Project</p>
          <h1>Secure access, refreshed automatically.</h1>
          <p className="muted">
            Experience the complete JWT flow with live token rotation, protected data, and
            production-ready UX patterns.
          </p>
          <ul className="highlight-list">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="pulse-card">
            <p>99.99% uptime</p>
            <span>Backed by MongoDB + Express API</span>
          </div>
        </aside>

        <div className="form-panel">
          <div className="form-header">
            <h2>Sign in</h2>
            <p>Use your account or the demo credentials below.</p>
          </div>

          <div className="demo-creds" aria-live="polite">
            <span>Demo access:</span>
            <code>demo@example.com · Password123!</code>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /[^@\s]+@[^@\s]+\.[^@\s]+/,
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
              <div className="form-error" role="alert">
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
    </div>
  );
};
