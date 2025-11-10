export const FullScreenLoader = ({ message = 'Loading...' }: { message?: string }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#e2e8f0',
    }}
  >
    <div
      style={{
        padding: '1.5rem 2rem',
        borderRadius: '0.75rem',
        background: '#fff',
        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
        fontWeight: 600,
        color: '#0f172a',
      }}
    >
      {message}
    </div>
  </div>
);
