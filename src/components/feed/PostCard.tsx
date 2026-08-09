import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import {
  toggleReaction,
  updatePost,
  deletePost,
  REACTION_TYPES,
  type Post,
  type Reaction,
} from '@lib/posts';

const timeAgo = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

type Props = {
  post: Post;
  reactions: Reaction[];
  onChanged: () => void; // called after react/edit/delete so the parent can refetch
};

const PostCard = ({ post, reactions, onChanged }: Props) => {
  const { user } = useAuth();
  const isOwn = !!user && user.id === post.author_id;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  const handleReact = async (type: (typeof REACTION_TYPES)[number]['type']) => {
    if (!user) return;
    try {
      await toggleReaction({ postId: post.id, userId: user.id, type });
      onChanged();
    } catch (err: any) {
      setError(err.message || 'Could not react to that post');
    }
  };

  const handleSaveEdit = async () => {
    if (editContent.trim().length === 0) return;
    setSaving(true);
    setError('');
    try {
      await updatePost(post.id, editContent.trim());
      setIsEditing(false);
      onChanged();
    } catch (err: any) {
      setError(err.message || 'Could not save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await deletePost(post.id);
      onChanged();
    } catch (err: any) {
      setError(err.message || 'Could not delete that post');
      setDeleting(false);
    }
  };

  return (
    <article
      className={`rounded-xl p-5 bg-black/60 border ${
        post.is_historic ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'border-emerald-500'
      }`}
    >
      {post.is_historic && (
        <p className="text-[10px] uppercase tracking-widest text-emerald-400 mb-2">● Historic first post</p>
      )}

      <div className="flex items-center justify-between mb-2">
        {post.author_id ? (
          <Link
            to={isOwn ? '/app/profile' : `/app/u/${post.author_username}`}
            className="text-white font-bold hover:text-emerald-300"
          >
            {post.author_username}
          </Link>
        ) : (
          <p className="text-white font-bold">{post.author_username}</p>
        )}
        <p className="text-[11px] text-emerald-200">
          {timeAgo(post.created_at)}
          {post.edited_at && ' · edited'}
        </p>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={500}
            rows={3}
            className="w-full bg-transparent border border-emerald-500 rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="bg-emerald-500 text-black text-xs font-bold px-3 py-1.5 rounded hover:bg-emerald-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(post.content);
              }}
              className="text-xs text-gray-400 px-3 py-1.5"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{post.content}</p>
      )}

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      <div className="flex items-center gap-2 mt-4">
        {REACTION_TYPES.map(({ type, label, emoji }) => {
          const count = reactions.filter((r) => r.type === type).length;
          const reactedByMe = user ? reactions.some((r) => r.type === type && r.user_id === user.id) : false;

          return (
            <button
              key={type}
              onClick={() => handleReact(type)}
              title={label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border ${
                reactedByMe ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300' : 'border-gray-600 text-gray-400'
              }`}
            >
              <span>{emoji}</span>
              <span className="text-xs">{count}</span>
            </button>
          );
        })}

        {isOwn && !isEditing && !post.is_historic && (
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => setIsEditing(true)} className="text-xs text-emerald-300 hover:text-emerald-100">
              Edit
            </button>
            {confirmDelete ? (
              <span className="text-xs text-gray-400 flex items-center gap-2">
                Delete this post?
                <button onClick={handleDelete} disabled={deleting} className="text-red-400 hover:text-red-300">
                  {deleting ? 'Deleting...' : 'Yes'}
                </button>
                <button onClick={() => setConfirmDelete(false)} className="hover:text-white">
                  No
                </button>
              </span>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="text-xs text-red-400 hover:text-red-300">
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
