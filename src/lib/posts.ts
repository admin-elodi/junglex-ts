import { supabase } from '@lib/supabase';

export type ReactionType = 'fire' | 'strike' | 'paw';

export type Post = {
  id: string;
  author_id: string | null;
  author_username: string;
  content: string;
  is_historic: boolean;
  created_at: string;
  edited_at: string | null;
};

export type Reaction = {
  id: string;
  post_id: string;
  user_id: string;
  type: ReactionType;
  created_at: string;
};

export const REACTION_TYPES: { type: ReactionType; label: string; emoji: string }[] = [
  { type: 'fire', label: 'Ignite', emoji: '🔥' },
  { type: 'strike', label: 'Strike', emoji: '⚡' },
  { type: 'paw', label: 'Respect', emoji: '🐾' },
];

export const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('is_historic', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
};

export const fetchReactionsForPosts = async (postIds: string[]): Promise<Reaction[]> => {
  if (postIds.length === 0) return [];

  const { data, error } = await supabase
    .from('reactions')
    .select('*')
    .in('post_id', postIds);

  if (error) throw error;
  return data ?? [];
};

export const createPost = async ({
  authorId,
  authorUsername,
  content,
}: {
  authorId: string;
  authorUsername: string;
  content: string;
}): Promise<Post> => {
  const { data, error } = await supabase
    .from('posts')
    .insert({ author_id: authorId, author_username: authorUsername, content })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Toggles a reaction: adds it if the user hasn't reacted this way yet,
// removes it if they have. Returns the resulting state ('added' | 'removed').
export const toggleReaction = async ({
  postId,
  userId,
  type,
}: {
  postId: string;
  userId: string;
  type: ReactionType;
}): Promise<'added' | 'removed'> => {
  const { data: existing, error: findError } = await supabase
    .from('reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .eq('type', type)
    .maybeSingle();

  if (findError) throw findError;

  if (existing) {
    const { error } = await supabase.from('reactions').delete().eq('id', existing.id);
    if (error) throw error;
    return 'removed';
  }

  const { error } = await supabase.from('reactions').insert({ post_id: postId, user_id: userId, type });
  if (error) throw error;
  return 'added';
};

export const updatePost = async (postId: string, content: string): Promise<Post> => {
  const { data, error } = await supabase
    .from('posts')
    .update({ content, edited_at: new Date().toISOString() })
    .eq('id', postId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deletePost = async (postId: string): Promise<void> => {
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) throw error;
};

export const fetchPostsByAuthor = async (authorId: string): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
};
