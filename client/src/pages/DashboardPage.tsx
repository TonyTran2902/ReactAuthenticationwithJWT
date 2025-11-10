import { useLogoutMutation } from '../hooks/useAuthMutations';
import { useProfileQuery } from '../hooks/useProfileQuery';
import { useAuthContext } from '../context/AuthProvider';

export const DashboardPage = () => {
  const { user } = useAuthContext();
  const profileQuery = useProfileQuery();
  const logoutMutation = useLogoutMutation();

  return (
    <div className="dashboard">
      <header>
        <div>
          <p className="eyebrow">Signed in as</p>
          <h2>{user?.name}</h2>
          <p className="muted">{user?.email}</p>
        </div>
        <button onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
          {logoutMutation.isPending ? 'Signing out…' : 'Logout'}
        </button>
      </header>

      <section className="panel">
        {profileQuery.isLoading && <p>Loading your dashboard…</p>}
        {profileQuery.isError && (
          <p className="form-error">Unable to load profile. Please refresh.</p>
        )}
        {profileQuery.data && (
          <div className="stats">
            <div>
              <p className="eyebrow">Last login</p>
              <p>{new Date(profileQuery.data.stats.lastLogin).toLocaleString()}</p>
            </div>
            <div>
              <p className="eyebrow">Projects</p>
              <p className="stat-value">{profileQuery.data.stats.projects}</p>
            </div>
            <div>
              <p className="eyebrow">Notifications</p>
              <p className="stat-value">{profileQuery.data.stats.notifications}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
