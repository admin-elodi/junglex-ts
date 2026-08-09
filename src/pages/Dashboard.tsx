import { useAuth } from '@context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-copper mb-2">
        Dashboard
      </p>
      <h1 className="font-display text-3xl font-semibold text-ivory">
        Welcome to JungleX{user?.user_metadata?.username ? `, ${user.user_metadata.username}` : ''}
      </h1>
      <p className="text-tan mt-2">
        The world's first Africanfuturist social media platform.
      </p>
    </div>
  );
};

export default Dashboard;
