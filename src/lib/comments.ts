import { supabase } from '@lib/supabase';

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  author_username: string;
  content: string;
  created_at: string;
};

export const fetchCommentCount = async (postId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);
  if (error) throw error;
  return count ?? 0;
};

export const fetchComments = async (postId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const createComment = async ({
  postId,
  authorId,
  authorUsername,
  content,
}: {
  postId: string;
  authorId: string;
  authorUsername: string;
  content: string;
}): Promise<Comment> => {
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, author_id: authorId, author_username: authorUsername, content })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  const { error } = await supabase.from('comments').delete().eq('id', commentId);
  if (error) throw error;
};
