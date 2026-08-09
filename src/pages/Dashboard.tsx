import { useAuth } from '@context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl">
        Welcome to JungleX - The world's first Africanfuturist social media platform {user?.email}
      </h1>
    </div>
  );
};

export default Dashboard;