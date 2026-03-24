-- NOTES table for user-uploaded study materials

create table if not exists "NOTES" (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references "USERS"(id) on delete cascade,
  title       text not null,
  subject     text not null,
  module_code text not null,
  description text,
  file_url    text not null,
  created_at  timestamptz default now()
);

alter table "NOTES" enable row level security;

create policy "Public read NOTES"
  on "NOTES" for select
  using (true);

create policy "Authenticated insert NOTES"
  on "NOTES" for insert
  to authenticated
  with check (auth.uid() = user_id);
