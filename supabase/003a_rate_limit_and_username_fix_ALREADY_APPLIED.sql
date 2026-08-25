-- JungleX: post rate limiting + username collision handling
-- STATUS: already applied to the live database (confirmed via diagnostic
-- query — the `before_post_rate_limit` trigger and `profiles_username_lower_idx`
-- index both exist). Kept here as a reference copy so local project files
-- match production, not as something to run again.
--
-- NOTE: the username-uniqueness half of this migration (the unique index
-- and the auto-suffix trigger logic) is superseded by 004_handle_numbers.sql,
-- which drops the index and replaces the trigger. The rate-limiting half
-- (enforce_post_rate_limit / before_post_rate_limit) is untouched and stays
-- active — it's unrelated to the username/handle decision.

-- POST RATE LIMITING ---------------------------------------------------
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

-- USERNAME COLLISIONS — SUPERSEDED, see note above --------------------
-- (original content preserved for reference only)
create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username));

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
