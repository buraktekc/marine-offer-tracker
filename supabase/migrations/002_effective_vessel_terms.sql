create or replace view effective_vessel_terms as
select
  v.id as vessel_id,
  v.name as vessel_name,
  v.company_id,
  c.name as company_name,
  
  coalesce(vt.currency, ct.currency) as currency,
  coalesce(vt.pricing_type, ct.pricing_type) as pricing_type,
  coalesce(vt.discount_percentage, ct.discount_percentage) as discount_percentage,
  coalesce(vt.payment_terms, ct.payment_terms) as payment_terms,
  coalesce(vt.delivery_terms, ct.delivery_terms) as delivery_terms,
  
  case
    when vt.currency is not null
      or vt.pricing_type is not null
      or vt.discount_percentage is not null
      or vt.payment_terms is not null
      or vt.delivery_terms is not null
    then true
    else false
  end as has_override
  
from vessels v
join companies c on c.id = v.company_id
left join company_terms ct on ct.company_id = v.company_id
left join vessel_terms vt on vt.vessel_id = v.id;
