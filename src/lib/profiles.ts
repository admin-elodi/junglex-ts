import { supabase } from '@lib/supabase';

export type Profile = {
  id: string;
  username: string;
  spirit_animal: string | null;
  bio: string | null;
  handle_number: number;
  created_at: string;
};

export const fetchProfileById = async (id: string): Promise<Profile | null> => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
};

export const fetchProfileByHandle = async (handleNumber: number): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle_number', handleNumber)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const fetchProfilesByIds = async (ids: string[]): Promise<Record<string, Profile>> => {
  if (ids.length === 0) return {};
  const { data, error } = await supabase.from('profiles').select('*').in('id', ids);
  if (error) throw error;
  const map: Record<string, Profile> = {};
  for (const p of data ?? []) map[p.id] = p;
  return map;
};

export const updateProfile = async (
  id: string,
  updates: { username?: string; spirit_animal?: string; bio?: string }
): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};
