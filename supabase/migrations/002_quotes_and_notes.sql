create table quotes (
  id uuid primary key default gen_random_uuid(),
  
  -- References
  reference_no text unique not null,
  customer_reference text,
  subject text,
  
  -- Relations
  company_id uuid not null references companies(id) on delete restrict,
  vessel_id uuid references vessels(id) on delete restrict,
  
  -- Offer details
  quote_date date not null default current_date,
  sent_date date,
  validity_date date,
  port text,
  agent text,
  
  -- Quote amount
  quote_total_amount numeric(12,2),
  quote_currency text check (quote_currency in ('USD', 'EUR', 'TRY', 'GBP', 'AED')),
  item_count integer default 0,
  
  -- Order return
  order_no text,
  order_date date,
  order_total_amount numeric(12,2),
  order_currency text check (order_currency in ('USD', 'EUR', 'TRY', 'GBP', 'AED')),
  order_difference_note text,
  
  -- Status
  status text not null default 'sent'
    check (status in ('sent', 'won', 'partially_won', 'lost', 'expired', 'cancelled')),
  
  -- Generated: return rate when quote and order currency match
  return_rate_pct numeric(6,2) generated always as (
    case
      when quote_total_amount is not null
        and quote_total_amount > 0
        and order_total_amount is not null
        and quote_currency = order_currency
      then round((order_total_amount / quote_total_amount) * 100, 2)
      else null
    end
  ) stored,
  
  lost_reason text,
  notes text,
  
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_quotes_reference_no on quotes(reference_no);
create index idx_quotes_customer_reference on quotes(customer_reference);
create index idx_quotes_company on quotes(company_id);
create index idx_quotes_vessel on quotes(vessel_id);
create index idx_quotes_status on quotes(status);
create index idx_quotes_quote_date on quotes(quote_date desc);
create index idx_quotes_validity_date on quotes(validity_date);

alter table quotes enable row level security;

create policy "auth_all" on quotes for all to authenticated using (true) with check (true);
