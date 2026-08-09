import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { useAuth } from '@context/AuthContext';
import { supabase } from '@lib/supabase';
import { fetchUnreadCount } from '@lib/notifications';

import sankofa from '@assets/icons/sankofa.webp';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SidePanel = ({ isOpen, onClose }: Props) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    fetchUnreadCount(user.id).then(setUnreadCount).catch(() => {});

    const channel = supabase
      .channel('sidepanel-notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${user.id}` },
        () => fetchUnreadCount(user.id).then(setUnreadCount).catch(() => {})
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {/* Backdrop — mobile only, closes the drawer on tap */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-black/90 border-r border-emerald-600 p-4 z-50
          transform transition-transform duration-200 ease-out
          md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Link to="/app/dashboard" onClick={onClose} className="flex items-center gap-2 mb-6">
          <img src={sankofa} alt="Sankofa" className="w-7 h-7" />
          <Motion.h1
            className="text-2xl font-bold text-emerald-400"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            JungleX
          </Motion.h1>
        </Link>

        <nav className="space-y-3 text-base">
          <Link to="/app/dashboard" onClick={onClose} className="block">Dashboard</Link>
          <Link to="/app/feed" onClick={onClose} className="block">Feed</Link>
          <Link to="/app/profile" onClick={onClose} className="block">Profile</Link>
          <Link to="/app/notifications" onClick={onClose} className="block">
            Notifications{unreadCount > 0 && <span className="ml-2 text-emerald-400">({unreadCount})</span>}
          </Link>
          <Link to="/app/bookmarks" onClick={onClose} className="block">Bookmarks</Link>
        </nav>

        <div className="mt-8 border-t border-emerald-700 pt-4 text-sm text-gray-400 space-y-2">
          <button onClick={handleSignOut} className="block text-left">Sign Out</button>
          <Link to="/terms" onClick={onClose} className="block">Terms</Link>
          <Link to="/privacy" onClick={onClose} className="block">Privacy</Link>
          <Link to="/cookies" onClick={onClose} className="block">Cookies</Link>
        </div>
      </aside>
    </>
  );
};

export default SidePanel;
