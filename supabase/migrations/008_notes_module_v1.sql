-- 008_notes_module_v1.sql
-- v6: Marine Notes Module - vessel link, comments, realtime
-- NOT: Bu migration Supabase'de manuel olarak çalıştırıldı. Bu dosya kayıt amaçlıdır.

BEGIN;

-- 1. Extend notes table
alter table notes
  add column vessel_id uuid references vessels(id) on delete set null,
  add column priority text default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  add column author_name text;

create index idx_notes_vessel on notes(vessel_id);
create index idx_notes_priority on notes(priority);

-- 2. Note comments table
create table note_comments (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references notes(id) on delete cascade,
  author_name text not null,
  content text not null,
  created_at timestamptz default now()
);

create index idx_note_comments_note on note_comments(note_id, created_at);

-- 3. RLS
alter table note_comments enable row level security;

create policy "anon_all" on note_comments for all to anon using (true) with check (true);
create policy "authenticated_all" on note_comments
  for all to authenticated using (true) with check (true);

-- 4. Enable realtime
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and tablename = 'notes'
    ) then
      alter publication supabase_realtime add table notes;
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and tablename = 'note_comments'
    ) then
      alter publication supabase_realtime add table note_comments;
    end if;
  end if;
end $$;

-- 5. View: notes with comment count and vessel name
create view notes_enriched as
select
  n.*,
  v.name as vessel_name,
  v.imo_number as vessel_imo,
  coalesce(cc.comment_count, 0) as comment_count,
  cc.last_comment_at
from notes n
left join vessels v on v.id = n.vessel_id
left join (
  select
    note_id,
    count(*) as comment_count,
    max(created_at) as last_comment_at
  from note_comments
  group by note_id
) cc on cc.note_id = n.id;

COMMIT;
