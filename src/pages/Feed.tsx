import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { supabase } from '@lib/supabase';
import { createPost, fetchPosts, fetchReactionsForPosts, type Post, type Reaction } from '@lib/posts';
import { fetchFollowingIds } from '@lib/follows';
import PostCard from '@components/feed/PostCard';

type Tab = 'everyone' | 'following';

const Feed = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [tab, setTab] = useState<Tab>('everyone');
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAll = async () => {
    try {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
      const fetchedReactions = await fetchReactionsForPosts(fetchedPosts.map((p) => p.id));
      setReactions(fetchedReactions);
      if (user) {
        setFollowingIds(await fetchFollowingIds(user.id));
      }
    } catch (err: any) {
      setError(err.message || 'Could not load the feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();

    const channel = supabase
      .channel('feed-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => loadAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reactions' }, () => loadAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'follows' }, () => loadAll())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const reactionsByPost = useMemo(() => {
    const map: Record<string, Reaction[]> = {};
    for (const r of reactions) {
      if (!map[r.post_id]) map[r.post_id] = [];
      map[r.post_id].push(r);
    }
    return map;
  }, [reactions]);

  const visiblePosts = useMemo(() => {
    if (tab === 'everyone') return posts;
    // Following tab: your own posts, people you follow, and the historic post
    return posts.filter(
      (p) => p.is_historic || p.author_id === user?.id || (p.author_id && followingIds.includes(p.author_id))
    );
  }, [posts, tab, followingIds, user?.id]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || content.trim().length === 0) return;

    setError('');
    setPosting(true);
    try {
      await createPost({
        authorId: user.id,
        authorUsername: user.user_metadata?.username || user.email,
        content: content.trim(),
      });
      setContent('');
      await loadAll();
    } catch (err: any) {
      setError(err.message || 'Could not send that post');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl text-emerald-300 font-bold mb-4">Feed</h1>

      <div className="flex gap-4 mb-6 border-b border-emerald-700 text-sm">
        <button
          onClick={() => setTab('everyone')}
          className={`pb-2 px-1 ${tab === 'everyone' ? 'text-emerald-300 border-b-2 border-emerald-400' : 'text-gray-400'}`}
        >
          Everyone
        </button>
        <button
          onClick={() => setTab('following')}
          className={`pb-2 px-1 ${tab === 'following' ? 'text-emerald-300 border-b-2 border-emerald-400' : 'text-gray-400'}`}
        >
          Following
        </button>
      </div>

      <form onSubmit={handlePost} className="bg-black/60 border border-emerald-500 rounded-xl p-4 mb-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="What's moving in the jungle?"
          className="w-full bg-transparent border border-emerald-500 rounded p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-emerald-200">{content.length}/500</span>
          <button
            type="submit"
            disabled={posting || content.trim().length === 0}
            className="bg-emerald-500 text-black font-bold px-5 py-2 rounded hover:bg-emerald-600 disabled:opacity-40"
          >
            {posting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-emerald-200 text-sm">Loading the feed…</p>
      ) : visiblePosts.length === 0 ? (
        <p className="text-gray-400 text-sm">
          {tab === 'following' ? "You're not following anyone yet." : 'No posts yet.'}
        </p>
      ) : (
        <div className="space-y-4">
          {visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              reactions={reactionsByPost[post.id] ?? []}
              onChanged={loadAll}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
