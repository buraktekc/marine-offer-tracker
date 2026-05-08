alter table companies enable row level security;
alter table company_terms enable row level security;
alter table vessels enable row level security;
alter table vessel_terms enable row level security;

create policy "auth_all" on companies for all to authenticated using (true) with check (true);
create policy "auth_all" on company_terms for all to authenticated using (true) with check (true);
create policy "auth_all" on vessels for all to authenticated using (true) with check (true);
create policy "auth_all" on vessel_terms for all to authenticated using (true) with check (true);
