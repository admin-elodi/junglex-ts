-- JungleX: handle numbers (#N) — a permanent, unique, system-assigned
-- identifier separate from the freely-editable, non-unique display name.
-- Run this once in your Supabase project's SQL Editor, AFTER 001, 002, 003.

-- SUPERSEDING THE OLD USERNAME-UNIQUENESS APPROACH ----------------------
-- An earlier migration ("post rate limiting + username collision handling")
-- enforced a case-insensitive unique index on username and auto-suffixed
-- collisions (e.g. "king" -> "king1"). That approach is now replaced by
-- this one: usernames are intentionally NOT unique (two people can share
-- a display name, same as Facebook) — handle_number is the sole unique
-- identifier going forward. The old unique index must be dropped, or it
-- will silently reject any future signup or rename that happens to
-- collide with an existing username, even though that's now allowed.
drop index if exists public.profiles_username_lower_idx;

alter table public.profiles add column if not exists handle_number integer;

-- Backfill everyone who already has a profile, in original signup order —
-- the earliest account (the founder) becomes #1.
with numbered as (
  select id, row_number() over (order by created_at asc) as rn
  from public.profiles
)
update public.profiles p
set handle_number = numbered.rn
from numbered
where p.id = numbered.id
  and p.handle_number is null;

-- Now that every existing row has a number, enforce uniqueness going forward.
alter table public.profiles add constraint profiles_handle_number_unique unique (handle_number);
alter table public.profiles alter column handle_number set not null;

-- A sequence that hands out the next handle number automatically.
-- Starts counting up from whatever the highest backfilled number was.
create sequence if not exists public.handle_number_seq;
select setval('public.handle_number_seq', (select coalesce(max(handle_number), 0) from public.profiles));

-- Update the signup trigger to assign the next handle number automatically —
-- nobody ever picks their own number, it's earned purely by signup order.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, spirit_animal, handle_number)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'spirit_animal',
    nextval('public.handle_number_seq')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Fast lookups by handle number (used by every profile-link click)
create index if not exists profiles_handle_number_idx on public.profiles (handle_number);
