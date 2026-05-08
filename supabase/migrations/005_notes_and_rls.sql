create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  category text,
  deadline date,
  is_archived boolean default false,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_notes_archived on notes(is_archived);
create index if not exists idx_notes_deadline on notes(deadline);

alter table companies enable row level security;
alter table company_terms enable row level security;
alter table vessels enable row level security;
alter table vessel_terms enable row level security;
alter table quotes enable row level security;
alter table notes enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'companies'
      and policyname = 'auth_all'
  ) then
    execute 'create policy "auth_all" on companies for all to authenticated using (true) with check (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'company_terms'
      and policyname = 'auth_all'
  ) then
    execute 'create policy "auth_all" on company_terms for all to authenticated using (true) with check (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'vessels'
      and policyname = 'auth_all'
  ) then
    execute 'create policy "auth_all" on vessels for all to authenticated using (true) with check (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'vessel_terms'
      and policyname = 'auth_all'
  ) then
    execute 'create policy "auth_all" on vessel_terms for all to authenticated using (true) with check (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'quotes'
      and policyname = 'auth_all'
  ) then
    execute 'create policy "auth_all" on quotes for all to authenticated using (true) with check (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'notes'
      and policyname = 'auth_all'
  ) then
    execute 'create policy "auth_all" on notes for all to authenticated using (true) with check (true)';
  end if;
end $$;
