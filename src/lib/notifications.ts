import { supabase } from '@lib/supabase';

export type Notification = {
  id: string;
  recipient_id: string;
  actor_id: string | null;
  actor_username: string;
  type: 'reaction' | 'follow' | 'comment';
  post_id: string | null;
  reaction_type: string | null;
  is_read: boolean;
  created_at: string;
};

export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
};

export const fetchUnreadCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .eq('is_read', false);
  if (error) throw error;
  return count ?? 0;
};

export const markAllRead = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('recipient_id', userId)
    .eq('is_read', false);
  if (error) throw error;
};
