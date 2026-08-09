import { supabase } from '@lib/supabase';

export const fetchFollowingIds = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase.from('follows').select('following_id').eq('follower_id', userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.following_id);
};

export const fetchFollowCounts = async (userId: string): Promise<{ followers: number; following: number }> => {
  const [followersRes, followingRes] = await Promise.all([
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
  ]);

  if (followersRes.error) throw followersRes.error;
  if (followingRes.error) throw followingRes.error;

  return { followers: followersRes.count ?? 0, following: followingRes.count ?? 0 };
};

export const isFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
};

export const follow = async (followerId: string, followingId: string): Promise<void> => {
  const { error } = await supabase.from('follows').insert({ follower_id: followerId, following_id: followingId });
  if (error) throw error;
};

export const unfollow = async (followerId: string, followingId: string): Promise<void> => {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);
  if (error) throw error;
};
