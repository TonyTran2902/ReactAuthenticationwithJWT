export type AuthEvent = 'logout';

const listeners = new Set<(event: AuthEvent) => void>();

export const authEventBus = {
  subscribe: (listener: (event: AuthEvent) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  emit: (event: AuthEvent) => {
    listeners.forEach((listener) => listener(event));
  },
};
