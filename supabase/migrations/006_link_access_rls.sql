alter table companies enable row level security;
alter table company_terms enable row level security;
alter table vessels enable row level security;
alter table vessel_terms enable row level security;
alter table quotes enable row level security;
alter table notes enable row level security;

drop policy if exists "auth_all" on companies;
drop policy if exists "anon_all" on companies;
drop policy if exists "authenticated_all" on companies;
create policy "anon_all" on companies for all to anon using (true) with check (true);
create policy "authenticated_all" on companies for all to authenticated using (true) with check (true);

drop policy if exists "auth_all" on company_terms;
drop policy if exists "anon_all" on company_terms;
drop policy if exists "authenticated_all" on company_terms;
create policy "anon_all" on company_terms for all to anon using (true) with check (true);
create policy "authenticated_all" on company_terms for all to authenticated using (true) with check (true);

drop policy if exists "auth_all" on vessels;
drop policy if exists "anon_all" on vessels;
drop policy if exists "authenticated_all" on vessels;
create policy "anon_all" on vessels for all to anon using (true) with check (true);
create policy "authenticated_all" on vessels for all to authenticated using (true) with check (true);

drop policy if exists "auth_all" on vessel_terms;
drop policy if exists "anon_all" on vessel_terms;
drop policy if exists "authenticated_all" on vessel_terms;
create policy "anon_all" on vessel_terms for all to anon using (true) with check (true);
create policy "authenticated_all" on vessel_terms for all to authenticated using (true) with check (true);

drop policy if exists "auth_all" on quotes;
drop policy if exists "anon_all" on quotes;
drop policy if exists "authenticated_all" on quotes;
create policy "anon_all" on quotes for all to anon using (true) with check (true);
create policy "authenticated_all" on quotes for all to authenticated using (true) with check (true);

drop policy if exists "auth_all" on notes;
drop policy if exists "anon_all" on notes;
drop policy if exists "authenticated_all" on notes;
create policy "anon_all" on notes for all to anon using (true) with check (true);
create policy "authenticated_all" on notes for all to authenticated using (true) with check (true);
