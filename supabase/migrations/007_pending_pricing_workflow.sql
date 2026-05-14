-- 007_pending_pricing_workflow.sql
-- v5: Add pending_pricing and not_available statuses + dual KPI views
-- NOT: Bu migration Supabase'de manuel olarak çalıştırıldı. Bu dosya kayıt amaçlıdır.

BEGIN;

-- 1. Add new columns to quotes
alter table quotes
  add column rfq_received_date date,
  add column not_available_reason_category text
    check (not_available_reason_category in (
      'supplier_unavailable',
      'out_of_stock',
      'insufficient_lead_time',
      'out_of_scope',
      'price_uncompetitive',
      'other'
    )),
  add column not_available_note text;

-- 2. Add response_time_days generated column
alter table quotes
  add column response_time_days integer generated always as (
    case
      when sent_date is not null and rfq_received_date is not null
      then (sent_date - rfq_received_date)::integer
      else null
    end
  ) stored;

-- 3. Update status constraint
alter table quotes drop constraint quotes_status_check;
alter table quotes add constraint quotes_status_check
  check (status in (
    'pending_pricing', 'not_available', 'sent', 'won',
    'partially_won', 'lost', 'expired', 'cancelled'
  ));
alter table quotes alter column status set default 'pending_pricing';

-- 4. Indexes
create index idx_quotes_rfq_received_date on quotes(rfq_received_date);
create index idx_quotes_na_reason
  on quotes(not_available_reason_category)
  where not_available_reason_category is not null;

-- 5. Drop and recreate views with dual KPI
drop view if exists dashboard_summary cascade;
drop view if exists monthly_return_trend cascade;
drop view if exists company_return_stats cascade;
drop view if exists vessel_return_stats cascade;

create view company_return_stats as
select
  c.id as company_id,
  c.name as company_name,
  count(q.id) as total_offers,
  count(q.id) filter (where q.status = 'pending_pricing') as pending_pricing,
  count(q.id) filter (where q.status = 'not_available') as not_available,
  count(q.id) filter (where q.status = 'sent') as open_offers,
  count(q.id) filter (where q.status in ('won', 'partially_won')) as returned_offers,
  count(q.id) filter (where q.status = 'won') as won_offers,
  count(q.id) filter (where q.status = 'partially_won') as partially_won_offers,
  count(q.id) filter (where q.status = 'lost') as lost_offers,
  coalesce(sum(q.quote_total_amount) filter (
    where q.status in ('sent', 'won', 'partially_won', 'lost', 'expired')
  ), 0) as total_quote_amount,
  coalesce(sum(q.order_total_amount), 0) as total_order_amount,
  round(
    count(q.id) filter (where q.status in ('sent','won','partially_won','lost','expired'))::numeric
    / nullif(count(q.id) filter (where q.status in ('sent','won','partially_won','lost','expired','not_available')), 0) * 100,
    2
  ) as pricing_rate_pct,
  round(
    count(q.id) filter (where q.status in ('won','partially_won'))::numeric
    / nullif(count(q.id) filter (where q.status in ('sent','won','partially_won','lost','expired')), 0) * 100,
    2
  ) as win_rate_pct,
  round(
    sum(q.order_total_amount)::numeric
    / nullif(sum(q.quote_total_amount) filter (
      where q.status in ('sent','won','partially_won','lost','expired')
    ), 0) * 100,
    2
  ) as amount_win_rate_pct,
  round(avg(q.response_time_days) filter (where q.response_time_days is not null), 1) as avg_response_days
from companies c
left join quotes q on q.company_id = c.id
group by c.id, c.name;

create view vessel_return_stats as
select
  v.id as vessel_id,
  v.name as vessel_name,
  v.company_id,
  c.name as company_name,
  count(q.id) as total_offers,
  count(q.id) filter (where q.status = 'pending_pricing') as pending_pricing,
  count(q.id) filter (where q.status = 'not_available') as not_available,
  count(q.id) filter (where q.status = 'sent') as open_offers,
  count(q.id) filter (where q.status in ('won', 'partially_won')) as returned_offers,
  count(q.id) filter (where q.status = 'won') as won_offers,
  count(q.id) filter (where q.status = 'partially_won') as partially_won_offers,
  count(q.id) filter (where q.status = 'lost') as lost_offers,
  coalesce(sum(q.quote_total_amount) filter (
    where q.status in ('sent', 'won', 'partially_won', 'lost', 'expired')
  ), 0) as total_quote_amount,
  coalesce(sum(q.order_total_amount), 0) as total_order_amount,
  round(
    count(q.id) filter (where q.status in ('sent','won','partially_won','lost','expired'))::numeric
    / nullif(count(q.id) filter (where q.status in ('sent','won','partially_won','lost','expired','not_available')), 0) * 100,
    2
  ) as pricing_rate_pct,
  round(
    count(q.id) filter (where q.status in ('won','partially_won'))::numeric
    / nullif(count(q.id) filter (where q.status in ('sent','won','partially_won','lost','expired')), 0) * 100,
    2
  ) as win_rate_pct,
  round(
    sum(q.order_total_amount)::numeric
    / nullif(sum(q.quote_total_amount) filter (
      where q.status in ('sent','won','partially_won','lost','expired')
    ), 0) * 100,
    2
  ) as amount_win_rate_pct,
  round(avg(q.response_time_days) filter (where q.response_time_days is not null), 1) as avg_response_days
from vessels v
join companies c on c.id = v.company_id
left join quotes q on q.vessel_id = v.id
group by v.id, v.name, v.company_id, c.name;

create view monthly_return_trend as
select
  date_trunc('month', coalesce(rfq_received_date, quote_date)) as month,
  count(*) as total_offers,
  count(*) filter (where status = 'pending_pricing') as pending_pricing,
  count(*) filter (where status = 'not_available') as not_available,
  count(*) filter (where status = 'sent') as open_offers,
  count(*) filter (where status in ('won', 'partially_won')) as returned_offers,
  count(*) filter (where status = 'won') as won_offers,
  count(*) filter (where status = 'partially_won') as partially_won_offers,
  count(*) filter (where status = 'lost') as lost_offers,
  coalesce(sum(quote_total_amount) filter (
    where status in ('sent', 'won', 'partially_won', 'lost', 'expired')
  ), 0) as total_quote_amount,
  coalesce(sum(order_total_amount), 0) as total_order_amount,
  round(
    count(*) filter (where status in ('won','partially_won'))::numeric
    / nullif(count(*) filter (where status in ('sent','won','partially_won','lost','expired')), 0) * 100,
    2
  ) as win_rate_pct
from quotes
group by date_trunc('month', coalesce(rfq_received_date, quote_date))
order by month desc;

create view dashboard_summary as
select
  count(*) as total_offers,
  count(*) filter (where status = 'pending_pricing') as pending_pricing,
  count(*) filter (where status = 'not_available') as not_available,
  count(*) filter (where status = 'sent') as open_offers,
  count(*) filter (where status in ('won', 'partially_won')) as returned_offers,
  coalesce(sum(quote_total_amount) filter (
    where status in ('sent', 'won', 'partially_won', 'lost', 'expired')
  ), 0) as total_quote_amount,
  coalesce(sum(order_total_amount), 0) as total_order_amount,
  round(
    count(*) filter (where status in ('sent','won','partially_won','lost','expired'))::numeric
    / nullif(count(*) filter (where status in ('sent','won','partially_won','lost','expired','not_available')), 0) * 100,
    2
  ) as pricing_rate_pct,
  round(
    count(*) filter (where status in ('won','partially_won'))::numeric
    / nullif(count(*) filter (where status in ('sent','won','partially_won','lost','expired')), 0) * 100,
    2
  ) as win_rate_pct,
  round(
    sum(order_total_amount)::numeric
    / nullif(sum(quote_total_amount) filter (
      where status in ('sent','won','partially_won','lost','expired')
    ), 0) * 100,
    2
  ) as amount_win_rate_pct,
  round(avg(response_time_days) filter (where response_time_days is not null), 1) as avg_response_days
from quotes;

COMMIT;
