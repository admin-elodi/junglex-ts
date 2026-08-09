import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-emerald-300">
        Loading...
      </div>
    );
  }

  // 🔁 Already signed in — no reason to see Login/SignUp again
  if (user) {
    return <Navigate to="/app/feed" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
