import { useEffect, useState } from 'react';
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
import { fetchCommentCount, fetchComments, createComment, deleteComment, type Comment } from '@lib/comments';
import { fetchProfilesByIds, type Profile } from '@lib/profiles';

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
  authorUsername?: string; // current profile username, if known — falls back to the post's stored snapshot
  onChanged: () => void; // called after react/edit/delete so the parent can refetch
};

const PostCard = ({ post, reactions, authorUsername, onChanged }: Props) => {
  const { user } = useAuth();
  const isOwn = !!user && user.id === post.author_id;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentAuthorProfiles, setCommentAuthorProfiles] = useState<Record<string, Profile>>({});
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    fetchCommentCount(post.id).then(setCommentCount).catch(() => {});
  }, [post.id]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const fetchedComments = await fetchComments(post.id);
      setComments(fetchedComments);
      const authorIds = [...new Set(fetchedComments.map((c) => c.author_id))];
      setCommentAuthorProfiles(await fetchProfilesByIds(authorIds));
    } catch (err: any) {
      setError(err.message || 'Could not load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next && comments.length === 0) loadComments();
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || newComment.trim().length === 0) return;
    setPostingComment(true);
    setError('');
    try {
      await createComment({
        postId: post.id,
        authorId: user.id,
        authorUsername: user.user_metadata?.username || user.email,
        content: newComment.trim(),
      });
      setNewComment('');
      await loadComments();
      setCommentCount((c) => c + 1);
    } catch (err: any) {
      setError(err.message || 'Could not post that comment');
    } finally {
      setPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      await loadComments();
      setCommentCount((c) => Math.max(0, c - 1));
    } catch (err: any) {
      setError(err.message || 'Could not delete that comment');
    }
  };

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
        <p className="text-sm uppercase tracking-widest text-emerald-400 mb-2">● Historic first post</p>
      )}

      <div className="flex items-center justify-between mb-2">
        {post.author_id ? (
          <Link
            to={isOwn ? '/app/profile' : `/app/u/${authorUsername ?? post.author_username}`}
            className="text-white font-bold hover:text-emerald-300"
          >
            {authorUsername ?? post.author_username}
          </Link>
        ) : (
          <p className="text-white font-bold">{post.author_username}</p>
        )}
        <p className="text-sm text-emerald-200">
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
              className="bg-emerald-500 text-black text-sm font-bold px-3 py-1.5 rounded hover:bg-emerald-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(post.content);
              }}
              className="text-sm text-gray-400 px-3 py-1.5"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{post.content}</p>
      )}

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

      <div className="flex items-center gap-2 mt-4 flex-wrap">
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
              <span className="text-sm">{count}</span>
            </button>
          );
        })}

        <button
          onClick={handleToggleComments}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-gray-600 text-gray-400 hover:border-emerald-500 hover:text-emerald-300"
        >
          <span>💬</span>
          <span className="text-sm">{commentCount}</span>
        </button>
      </div>

      {isOwn && !isEditing && !post.is_historic && (
        <div className="flex items-center justify-end gap-3 mt-2">
          <button onClick={() => setIsEditing(true)} className="text-sm text-emerald-300 hover:text-emerald-100">
            Edit
          </button>
          {confirmDelete ? (
            <span className="text-sm text-gray-400 flex items-center gap-2">
              Delete this post?
              <button onClick={handleDelete} disabled={deleting} className="text-red-400 hover:text-red-300">
                {deleting ? 'Deleting...' : 'Yes'}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="hover:text-white">
                No
              </button>
            </span>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="text-sm text-red-400 hover:text-red-300">
              Delete
            </button>
          )}
        </div>
      )}

      {showComments && (
        <div className="mt-4 pt-4 border-t border-emerald-700/50 space-y-3">
          {loadingComments ? (
            <p className="text-sm text-gray-400">Loading comments…</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-400">No comments yet. Be the first.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-sm font-bold text-emerald-300">
                    {commentAuthorProfiles[c.author_id]?.username ?? c.author_username}
                  </span>{' '}
                  <span className="text-sm text-white/90">{c.content}</span>
                  <p className="text-xs text-gray-500">{timeAgo(c.created_at)}</p>
                </div>
                {user?.id === c.author_id && (
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="text-xs text-red-400 hover:text-red-300 shrink-0"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}

          {user && (
            <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={300}
                placeholder="Write a comment…"
                className="flex-1 bg-transparent border border-emerald-500 rounded p-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                disabled={postingComment || newComment.trim().length === 0}
                className="bg-emerald-500 text-black text-sm font-bold px-3 py-2 rounded hover:bg-emerald-600 disabled:opacity-40"
              >
                {postingComment ? '...' : 'Reply'}
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  );
};

export default PostCard;
