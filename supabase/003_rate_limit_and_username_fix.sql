-- JungleX: post rate limiting + username collision handling
-- Run this once in your Supabase project's SQL Editor, AFTER 001 and 002.

-- POST RATE LIMITING ---------------------------------------------------
-- Enforced in the database, not just the frontend, so it can't be bypassed
-- by hitting the API directly. Historic/system posts (author_id null) are
-- exempt. Adjust the interval below to change the cooldown.
create or replace function public.enforce_post_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  last_post_at timestamptz;
begin
  if new.author_id is null then
    return new;
  end if;

  select created_at into last_post_at
  from public.posts
  where author_id = new.author_id
  order by created_at desc
  limit 1;

  if last_post_at is not null and new.created_at - last_post_at < interval '15 seconds' then
    raise exception 'You are posting too fast — please wait a few seconds and try again.';
  end if;

  return new;
end;
$$;

drop trigger if exists before_post_rate_limit on public.posts;
create trigger before_post_rate_limit
  before insert on public.posts
  for each row execute function public.enforce_post_rate_limit();

-- USERNAME COLLISIONS --------------------------------------------------
-- Case-insensitive uniqueness, enforced at the database level.
create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username));

-- Rewrite the signup trigger so a taken username doesn't fail the entire
-- signup — it auto-appends a number instead (e.g. "king" -> "king1").
-- The user can rename themselves afterward from the Profile page.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  candidate text;
  suffix int := 0;
begin
  base_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  candidate := base_username;

  while exists (select 1 from public.profiles where lower(username) = lower(candidate)) loop
    suffix := suffix + 1;
    candidate := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username, spirit_animal)
  values (new.id, candidate, new.raw_user_meta_data->>'spirit_animal')
  on conflict (id) do nothing;

  return new;
end;
$$;
