create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text check (type in ('owner', 'operator', 'agent', 'manager', 'trader', 'other')),
  contact_email text,
  contact_phone text,
  address text,
  notes text,
  is_active boolean default true,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_companies_name on companies(name);
create index idx_companies_active on companies(is_active);

create table company_terms (
  company_id uuid primary key references companies(id) on delete cascade,
  currency text not null check (currency in ('USD', 'EUR', 'TRY', 'GBP', 'AED')),
  pricing_type text not null check (pricing_type in ('net', 'discounted')),
  discount_percentage numeric(5,2) check (discount_percentage >= 0 and discount_percentage <= 100),
  payment_terms text,
  delivery_terms text,
  notes text,
  updated_at timestamptz default now()
);

create table vessels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  imo_number text unique,
  company_id uuid not null references companies(id) on delete restrict,
  flag text,
  vessel_type text,
  notes text,
  is_active boolean default true,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_vessels_name on vessels(name);
create index idx_vessels_company on vessels(company_id);
create index idx_vessels_active on vessels(is_active);

create table vessel_terms (
  vessel_id uuid primary key references vessels(id) on delete cascade,
  currency text check (currency in ('USD', 'EUR', 'TRY', 'GBP', 'AED')),
  pricing_type text check (pricing_type in ('net', 'discounted')),
  discount_percentage numeric(5,2) check (discount_percentage >= 0 and discount_percentage <= 100),
  payment_terms text,
  delivery_terms text,
  notes text,
  updated_at timestamptz default now()
);
