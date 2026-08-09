import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { supabase } from '@lib/supabase';
import { fetchNotifications, markAllRead, type Notification } from '@lib/notifications';
import { REACTION_TYPES } from '@lib/posts';

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

const emojiFor = (type: string | null) => REACTION_TYPES.find((r) => r.type === type)?.emoji ?? '👋';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const data = await fetchNotifications(user.id);
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    load();

    if (!user) return;

    const channel = supabase
      .channel('notifications-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${user.id}` },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllRead(user.id);
    load();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-emerald-300 font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="text-xs text-emerald-300 hover:text-emerald-100 underline">
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-emerald-200 text-sm">Loading…</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-400 text-sm">You're all caught up.</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-lg p-4 border text-sm ${
                n.is_read ? 'border-gray-700 bg-black/30' : 'border-emerald-500 bg-black/60'
              }`}
            >
              {n.type === 'reaction' ? (
                <p className="text-white">
                  <span className="mr-1">{emojiFor(n.reaction_type)}</span>
                  <Link to={`/app/u/${n.actor_username}`} className="font-bold text-emerald-300 hover:text-emerald-100">
                    {n.actor_username}
                  </Link>{' '}
                  reacted to your post
                </p>
              ) : (
                <p className="text-white">
                  <span className="mr-1">🐾</span>
                  <Link to={`/app/u/${n.actor_username}`} className="font-bold text-emerald-300 hover:text-emerald-100">
                    {n.actor_username}
                  </Link>{' '}
                  started following you
                </p>
              )}
              <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
