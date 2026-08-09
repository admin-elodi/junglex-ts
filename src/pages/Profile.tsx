import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { fetchProfileById, updateProfile, type Profile as ProfileType } from '@lib/profiles';
import { fetchFollowCounts } from '@lib/follows';
import { fetchPostsByAuthor, fetchReactionsForPosts, type Post, type Reaction } from '@lib/posts';
import PostCard from '@components/feed/PostCard';
import SpiritAnimalModal from '@components/auth/SpiritAnimalModal';

const Profile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [posts, setPosts] = useState<Post[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadAll = async () => {
    if (!user) return;
    try {
      const [fetchedProfile, fetchedCounts, fetchedPosts] = await Promise.all([
        fetchProfileById(user.id),
        fetchFollowCounts(user.id),
        fetchPostsByAuthor(user.id),
      ]);
      setProfile(fetchedProfile);
      setCounts(fetchedCounts);
      setPosts(fetchedPosts);
      setUsernameInput(fetchedProfile?.username ?? '');
      setBioInput(fetchedProfile?.bio ?? '');
      setReactions(await fetchReactionsForPosts(fetchedPosts.map((p) => p.id)));
    } catch (err: any) {
      setError(err.message || 'Could not load your profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const reactionsForPost = (postId: string) => reactions.filter((r) => r.post_id === postId);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    try {
      await updateProfile(user.id, { username: usernameInput.trim(), bio: bioInput.trim() });
      setIsEditing(false);
      await loadAll();
    } catch (err: any) {
      setError(err.message || 'Could not save your profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAnimal = async (animal: string) => {
    if (!user) return;
    try {
      await updateProfile(user.id, { spirit_animal: animal });
      setIsAnimalModalOpen(false);
      await loadAll();
    } catch (err: any) {
      setError(err.message || 'Could not update your spirit animal');
    }
  };

  if (loading) {
    return <p className="text-emerald-200 text-sm">Loading your profile…</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl text-emerald-300 font-bold mb-6">Profile</h1>

      <div className="bg-black/60 border border-emerald-500 rounded-xl p-6 mb-8">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-emerald-200 block mb-1">Username</label>
              <input
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full p-2 rounded border-2 border-emerald-500 bg-black/30 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="text-sm text-emerald-200 block mb-1">Bio</label>
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows={3}
                maxLength={280}
                placeholder="Tell the jungle about yourself"
                className="w-full p-2 rounded border-2 border-emerald-500 bg-black/30 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-emerald-500 text-black font-bold px-4 py-2 rounded hover:bg-emerald-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setIsEditing(false)} className="text-sm text-gray-400 px-4 py-2">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl text-white font-bold">{profile?.username ?? user?.email}</h2>
                {profile?.spirit_animal && (
                  <p className="text-emerald-300 text-sm mt-1">Spirit animal: {profile.spirit_animal}</p>
                )}
                {profile?.bio && <p className="text-white/80 text-sm mt-2">{profile.bio}</p>}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-emerald-300 hover:text-emerald-100 border border-emerald-500 rounded px-3 py-1.5"
              >
                Edit Profile
              </button>
            </div>

            <div className="flex gap-6 mt-4 text-sm">
              <span className="text-white">
                <span className="font-bold">{counts.followers}</span>{' '}
                <span className="text-gray-400">Followers</span>
              </span>
              <span className="text-white">
                <span className="font-bold">{counts.following}</span>{' '}
                <span className="text-gray-400">Following</span>
              </span>
            </div>

            <button
              onClick={() => setIsAnimalModalOpen(true)}
              className="mt-4 text-xs text-emerald-300 hover:text-emerald-100 underline"
            >
              Change spirit animal
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <h3 className="text-emerald-300 font-bold mb-3">Your posts</h3>
      {posts.length === 0 ? (
        <p className="text-gray-400 text-sm">You haven't posted yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} reactions={reactionsForPost(post.id)} onChanged={loadAll} />
          ))}
        </div>
      )}

      <SpiritAnimalModal
        isOpen={isAnimalModalOpen}
        onClose={() => setIsAnimalModalOpen(false)}
        selectedAnimal={profile?.spirit_animal ?? ''}
        onSelect={handleSelectAnimal}
      />
    </div>
  );
};

export default Profile;
