create or replace view company_return_stats as
select
  c.id as company_id,
  c.name as company_name,
  
  count(q.id) as total_offers,
  count(q.id) filter (where q.status = 'sent') as open_offers,
  count(q.id) filter (where q.status in ('won', 'partially_won')) as returned_offers,
  count(q.id) filter (where q.status = 'won') as won_offers,
  count(q.id) filter (where q.status = 'partially_won') as partially_won_offers,
  count(q.id) filter (where q.status = 'lost') as lost_offers,
  
  coalesce(sum(q.quote_total_amount), 0) as total_quote_amount,
  coalesce(sum(q.order_total_amount), 0) as total_order_amount,
  
  round(
    count(q.id) filter (where q.status in ('won', 'partially_won'))::numeric
    / nullif(count(q.id), 0) * 100,
    2
  ) as offer_return_rate_pct,
  
  round(
    sum(q.order_total_amount)::numeric
    / nullif(sum(q.quote_total_amount), 0) * 100,
    2
  ) as amount_return_rate_pct
  
from companies c
left join quotes q on q.company_id = c.id
group by c.id, c.name;

create or replace view vessel_return_stats as
select
  v.id as vessel_id,
  v.name as vessel_name,
  v.company_id,
  c.name as company_name,
  
  count(q.id) as total_offers,
  count(q.id) filter (where q.status = 'sent') as open_offers,
  count(q.id) filter (where q.status in ('won', 'partially_won')) as returned_offers,
  count(q.id) filter (where q.status = 'won') as won_offers,
  count(q.id) filter (where q.status = 'partially_won') as partially_won_offers,
  count(q.id) filter (where q.status = 'lost') as lost_offers,
  
  coalesce(sum(q.quote_total_amount), 0) as total_quote_amount,
  coalesce(sum(q.order_total_amount), 0) as total_order_amount,
  
  round(
    count(q.id) filter (where q.status in ('won', 'partially_won'))::numeric
    / nullif(count(q.id), 0) * 100,
    2
  ) as offer_return_rate_pct,
  
  round(
    sum(q.order_total_amount)::numeric
    / nullif(sum(q.quote_total_amount), 0) * 100,
    2
  ) as amount_return_rate_pct
  
from vessels v
join companies c on c.id = v.company_id
left join quotes q on q.vessel_id = v.id
group by v.id, v.name, v.company_id, c.name;

create or replace view monthly_return_trend as
select
  date_trunc('month', quote_date) as month,
  
  count(*) as total_offers,
  count(*) filter (where status in ('won', 'partially_won')) as returned_offers,
  count(*) filter (where status = 'won') as won_offers,
  count(*) filter (where status = 'partially_won') as partially_won_offers,
  count(*) filter (where status = 'lost') as lost_offers,
  count(*) filter (where status = 'sent') as open_offers,
  
  coalesce(sum(quote_total_amount), 0) as total_quote_amount,
  coalesce(sum(order_total_amount), 0) as total_order_amount,
  
  round(
    count(*) filter (where status in ('won', 'partially_won'))::numeric
    / nullif(count(*), 0) * 100,
    2
  ) as offer_return_rate_pct,
  
  round(
    sum(order_total_amount)::numeric
    / nullif(sum(quote_total_amount), 0) * 100,
    2
  ) as amount_return_rate_pct
  
from quotes
group by date_trunc('month', quote_date)
order by month desc;

create or replace view dashboard_summary as
select
  count(*) as total_offers,
  count(*) filter (where status in ('won', 'partially_won')) as returned_offers,
  count(*) filter (where status = 'sent') as open_offers,
  
  coalesce(sum(quote_total_amount), 0) as total_quote_amount,
  coalesce(sum(order_total_amount), 0) as total_order_amount,
  
  round(
    count(*) filter (where status in ('won', 'partially_won'))::numeric
    / nullif(count(*), 0) * 100,
    2
  ) as offer_return_rate_pct,
  
  round(
    sum(order_total_amount)::numeric
    / nullif(sum(quote_total_amount), 0) * 100,
    2
  ) as amount_return_rate_pct
  
from quotes;
