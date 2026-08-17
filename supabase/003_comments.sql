-- JungleX: comments
-- Run this once in your Supabase project's SQL Editor, AFTER 001 and 002.

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_username text not null,
  content text not null check (char_length(content) between 1 and 300),
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "Anyone signed in can read comments"
  on public.comments for select
  to authenticated
  using (true);

create policy "Users can add their own comments"
  on public.comments for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "Users can delete their own comments"
  on public.comments for delete
  to authenticated
  using (auth.uid() = author_id);

alter publication supabase_realtime add table public.comments;

-- Allow 'comment' alongside the existing 'reaction' / 'follow' notification types
alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications add constraint notifications_type_check
  check (type in ('reaction', 'follow', 'comment'));

-- Auto-notify a post's author when someone comments (never notify yourself)
create or replace function public.handle_new_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  post_author_id uuid;
begin
  select author_id into post_author_id from public.posts where id = new.post_id;

  if post_author_id is null or post_author_id = new.author_id then
    return new;
  end if;

  insert into public.notifications (recipient_id, actor_id, actor_username, type, post_id)
  values (post_author_id, new.author_id, new.author_username, 'comment', new.post_id);

  return new;
end;
$$;

drop trigger if exists on_comment_created on public.comments;
create trigger on_comment_created
  after insert on public.comments
  for each row execute function public.handle_new_comment();
