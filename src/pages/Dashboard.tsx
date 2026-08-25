import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { fetchProfileById, type Profile } from '@lib/profiles';
import { formatHandle } from '@lib/handle';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchProfileById(user.id).then(setProfile).catch(() => {});
  }, [user?.id]);

  return (
    <div>
      <h1 className="text-2xl">
        Welcome to JungleX - The world's first Africanfuturist social media platform
      </h1>

      {profile && (
        <p className="text-emerald-300 mt-2">
          {profile.username} <span className="text-emerald-400">{formatHandle(profile.handle_number)}</span>
        </p>
      )}

      <div className="mt-6 bg-black/60 border border-emerald-500 rounded-xl p-6 max-w-md">
        <p className="text-emerald-300 font-bold mb-2">Ready to post?</p>
        <p className="text-gray-400 text-sm mb-4">
          Head to the Feed to share your first post and see what the tribe is saying.
        </p>
        <Link
          to="/app/feed"
          className="inline-block bg-emerald-500 text-black font-bold px-5 py-2 rounded hover:bg-emerald-600"
        >
          Go to Feed
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
