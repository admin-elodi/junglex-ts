import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { fetchProfileByHandle, type Profile as ProfileType } from '@lib/profiles';
import { formatHandle, parseHandleParam } from '@lib/handle';
import { fetchFollowCounts, isFollowing, follow, unfollow } from '@lib/follows';
import { fetchPostsByAuthor, fetchReactionsForPosts, type Post, type Reaction } from '@lib/posts';
import PostCard from '@components/feed/PostCard';

const UserProfile = () => {
  const { handle } = useParams<{ handle: string }>();
  const handleNumber = parseHandleParam(handle);
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [posts, setPosts] = useState<Post[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [following, setFollowingState] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  const loadAll = async () => {
    if (handleNumber === null) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    try {
      const fetchedProfile = await fetchProfileByHandle(handleNumber);
      if (!fetchedProfile) {
        setNotFound(true);
        return;
      }
      setProfile(fetchedProfile);

      const [fetchedCounts, fetchedPosts] = await Promise.all([
        fetchFollowCounts(fetchedProfile.id),
        fetchPostsByAuthor(fetchedProfile.id),
      ]);
      setCounts(fetchedCounts);
      setPosts(fetchedPosts);
      setReactions(await fetchReactionsForPosts(fetchedPosts.map((p) => p.id)));

      if (user && user.id !== fetchedProfile.id) {
        setFollowingState(await isFollowing(user.id, fetchedProfile.id));
      }
    } catch (err: any) {
      setError(err.message || 'Could not load this profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle, user?.id]);

  const reactionsForPost = (postId: string) => reactions.filter((r) => r.post_id === postId);

  const handleToggleFollow = async () => {
    if (!user || !profile) return;
    setFollowBusy(true);
    try {
      if (following) {
        await unfollow(user.id, profile.id);
      } else {
        await follow(user.id, profile.id);
      }
      setFollowingState(!following);
      setCounts((c) => ({ ...c, followers: c.followers + (following ? -1 : 1) }));
    } catch (err: any) {
      setError(err.message || 'Could not update follow status');
    } finally {
      setFollowBusy(false);
    }
  };

  if (loading) {
    return <p className="text-emerald-200 text-sm">Loading profile…</p>;
  }

  if (notFound || !profile) {
    return (
      <div>
        <h1 className="text-2xl text-emerald-300 font-bold mb-2">User not found</h1>
        <Link to="/app/feed" className="text-emerald-300 underline text-sm">
          Back to Feed
        </Link>
      </div>
    );
  }

  const isSelf = user?.id === profile.id;

  return (
    <div className="max-w-2xl">
      <div className="bg-black/60 border border-emerald-500 rounded-xl p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl text-white font-bold">{profile.username}</h1>
            <p className="text-emerald-400 text-sm">{formatHandle(profile.handle_number)}</p>
            {profile.spirit_animal && (
              <p className="text-emerald-300 text-sm mt-1">Spirit animal: {profile.spirit_animal}</p>
            )}
            {profile.bio && <p className="text-white/80 text-sm mt-2">{profile.bio}</p>}
          </div>

          {!isSelf && user && (
            <button
              onClick={handleToggleFollow}
              disabled={followBusy}
              className={`text-sm font-bold px-4 py-1.5 rounded disabled:opacity-50 ${
                following
                  ? 'border border-emerald-500 text-emerald-300 hover:bg-emerald-500/10'
                  : 'bg-emerald-500 text-black hover:bg-emerald-600'
              }`}
            >
              {followBusy ? '...' : following ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        <div className="flex gap-6 mt-4 text-sm">
          <span className="text-white">
            <span className="font-bold">{counts.followers}</span> <span className="text-gray-400">Followers</span>
          </span>
          <span className="text-white">
            <span className="font-bold">{counts.following}</span> <span className="text-gray-400">Following</span>
          </span>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <h3 className="text-emerald-300 font-bold mb-3">Posts</h3>
      {posts.length === 0 ? (
        <p className="text-gray-400 text-sm">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              reactions={reactionsForPost(post.id)}
              authorUsername={profile.username}
              authorHandle={profile.handle_number}
              onChanged={loadAll}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
