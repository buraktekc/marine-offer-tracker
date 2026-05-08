# Marine Offer Return Tracker — Teknik Spec v4 (Codex Edition)

> **Tek hedef:** Müşteriye geçilen tekliflerin durumunu (sent / won / partially_won / lost / expired / cancelled) ve siparişe dönüşüm oranını **tutar ve sayı bazında** görmek.
>
> Follow-up takibi v1 kapsam dışıdır — gerekli görülen takip bilgisi `quotes` tablosundaki status alanı ve dashboard üzerinden izlenir.

---

## 0. v3'ten v4'e Değişiklikler

**Eklendi (mockup'a göre geri geldi):**

- Currency: **GBP** ve **AED** eklendi (USD, EUR, TRY, GBP, AED)
- `customer_reference`, `subject`, `sent_date`, `validity_date` alanları (quotes)
- `amount_return_rate_pct` view'larda (tutar bazlı dönüşüm)
- Monthly return trend view + dashboard chart
- Top Companies by Return Rate (dashboard chart)
- Notes tablosu + sidebar menüsü
- Recent Offer References dashboard tablosu
- Total Quote Amount + Total Order Amount KPI'ları

**Çıkarıldı kaldı (kesinlikle yok):**

- ❌ Tüm follow-up altyapısı: `quote_followups` tablosu, trigger, due view
- ❌ `follow_up_date`, `last_follow_up_date`, `follow_up_count` alanları
- ❌ Follow-ups sayfası, Follow-up Due liste, Open Follow-ups KPI
- ❌ Sidebar'da Follow-ups menüsü
- ❌ Recent References tablosunda Follow-up Date kolonu
- ❌ Add Follow-up modal

**Sonuç:** Tablo: 6 (companies, company_terms, vessels, vessel_terms, quotes, notes). Sprint: 5.

---

## 1. Mimari

- **Frontend:** React + Vite + Tailwind + React Router + TanStack Query + Recharts
- **Backend:** Supabase (Postgres + Auth + RLS + Views)
- **Hosting:** Vercel
- **Tema:** Teal `#00ADB5` + Purple `#7F30E4`, koyu sidebar, beyaz dashboard kartları (mockup'a göre)
- **Tool:** Codex (cloud-based agentic) — spec self-contained olmalı

---

## 2. Sayfa Haritası

| Sidebar | Sayfa | Amaç |
|---|---|---|
| Dashboard | `/` | KPI + trend + top companies + recent refs |
| Companies | `/companies` | Şirket CRUD + default terms + return stats |
| Vessels | `/vessels` | Gemi CRUD + override terms + return stats |
| Quotes | `/quotes` | Teklif listesi + filtreler + CRUD |
| Notes | `/notes` | Genel notlar (Marine Notes app'ten ileride migrate) |

Dashboard layout (mockup birebir):

```
┌──────────────────────────────────────────────────────────────────┐
│ KPI Row: Total Offers │ Returned │ Return Rate │ Total Quote $   │
│          Total Order $ │ Amount Return Rate                       │
├──────────────────────────────────────────────────────────────────┤
│ Monthly Return Trend (line chart) — 7 ay                          │
├──────────────────────────────────────────────────────────────────┤
│ Recent Offer References (tablo, 4-5 satır)                        │
├──────────────────────────────────────────────────────────────────┤
│ Top Companies by Return Rate (horizontal bar chart)               │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema

### 3.1 Companies

```sql
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
```

### 3.2 Company Default Terms

```sql
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
```

### 3.3 Vessels

```sql
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
```

### 3.4 Vessel Override Terms

```sql
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
```

### 3.5 Quotes (Ana Tablo)

```sql
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
  
  -- Order return (sipariş gelince doldurulur)
  order_no text,
  order_date date,
  order_total_amount numeric(12,2),
  order_currency text check (order_currency in ('USD', 'EUR', 'TRY', 'GBP', 'AED')),
  order_difference_note text,
  
  -- Status
  status text not null default 'sent'
    check (status in ('sent', 'won', 'partially_won', 'lost', 'expired', 'cancelled')),
  
  -- Generated: return rate (sadece aynı currency'de hesaplanır)
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
```

### 3.6 Notes

```sql
create table notes (
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

create index idx_notes_archived on notes(is_archived);
create index idx_notes_deadline on notes(deadline);
```

---

## 4. Status Enum

| Status | Anlam |
|---|---|
| `sent` | Teklif gönderildi (default) |
| `won` | Tam siparişe döndü |
| `partially_won` | Kısmen siparişe döndü |
| `lost` | Siparişe dönmedi |
| `expired` | Geçerlilik süresi doldu |
| `cancelled` | Talep iptal edildi |

---

## 5. Views

### 5.1 Effective Vessel Terms

```sql
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
```

### 5.2 Company Return Stats

```sql
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
```

### 5.3 Vessel Return Stats

```sql
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
```

### 5.4 Monthly Return Trend

```sql
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
```

### 5.5 Dashboard Summary (KPI Card için)

```sql
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
```

---

## 6. RLS

```sql
alter table companies enable row level security;
alter table company_terms enable row level security;
alter table vessels enable row level security;
alter table vessel_terms enable row level security;
alter table quotes enable row level security;
alter table notes enable row level security;

create policy "auth_all" on companies for all to authenticated using (true) with check (true);
create policy "auth_all" on company_terms for all to authenticated using (true) with check (true);
create policy "auth_all" on vessels for all to authenticated using (true) with check (true);
create policy "auth_all" on vessel_terms for all to authenticated using (true) with check (true);
create policy "auth_all" on quotes for all to authenticated using (true) with check (true);
create policy "auth_all" on notes for all to authenticated using (true) with check (true);
```

---

## 7. Frontend Klasör Yapısı

```
src/
├── lib/
│   ├── supabase.js
│   └── utils.js                         # formatCurrency, formatDate, formatPct
├── hooks/
│   ├── useCompanies.js
│   ├── useCompanyTerms.js
│   ├── useVessels.js
│   ├── useVesselTerms.js
│   ├── useEffectiveTerms.js
│   ├── useQuotes.js
│   ├── useNotes.js
│   └── useDashboard.js                  # summary + monthly trend + top companies
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── ui/
│   │   ├── KPICard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── CurrencyAmount.jsx
│   │   └── EmptyState.jsx
│   ├── companies/
│   │   ├── CompanyList.jsx
│   │   ├── CompanyForm.jsx
│   │   ├── CompanyDetail.jsx
│   │   └── CompanyTermsForm.jsx
│   ├── vessels/
│   │   ├── VesselList.jsx
│   │   ├── VesselForm.jsx
│   │   ├── VesselDetail.jsx
│   │   └── VesselTermsForm.jsx
│   ├── quotes/
│   │   ├── QuoteList.jsx
│   │   ├── QuoteForm.jsx
│   │   ├── QuoteDetail.jsx
│   │   ├── QuoteFilters.jsx
│   │   ├── MarkAsOrderModal.jsx
│   │   └── MarkAsLostModal.jsx
│   ├── notes/
│   │   ├── NoteList.jsx
│   │   └── NoteForm.jsx
│   └── dashboard/
│       ├── KPIRow.jsx
│       ├── MonthlyReturnChart.jsx
│       ├── RecentReferencesTable.jsx
│       └── TopCompaniesChart.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Companies.jsx
│   ├── Vessels.jsx
│   ├── Quotes.jsx
│   ├── Notes.jsx
│   └── Login.jsx
└── App.jsx
```

---

## 8. Sayfa Detayları

### 8.1 Dashboard

**KPI Cards (6 adet):**

```text
1. Total Offers          (count)         icon: document
2. Returned Offers       (count)         icon: arrow-right-circle
3. Offer Return Rate     (%)             icon: pie-chart
4. Total Quote Amount    (USD ana)       icon: dollar
5. Total Order Amount    (USD ana)       icon: cart
6. Amount Return Rate    (%)             icon: trending-up
```

> Not: Toplam tutar gösterilirken farklı para birimlerini USD'ye çevirme yok (v1). Karışık currency varsa **"Mixed"** ya da en yaygın currency gösterilir.

**Monthly Return Trend** — Recharts LineChart, 2 line (Offers + Returned Offers), son 7 ay

**Recent Offer References** — son 5 quote, kolonlar:

```text
Reference No │ Customer Ref │ Company │ Vessel │ Port │ Quote Total │ Order Total │ Return % │ Status
```

**Top Companies by Return Rate** — Recharts horizontal BarChart, top 5

### 8.2 Quotes Page

**Tablo kolonları:**

```text
Reference No │ Customer Ref │ Company │ Vessel │ Port │ Quote Date │ Quote Total │ Order Total │ Return % │ Status │ Actions
```

**Filtreler:** Search · Company · Vessel · Status · Date Range · Currency · Port

**Aksiyonlar:** View · Edit · Mark as Order · Mark as Lost · Cancel

### 8.3 Quote Detail

Bölümler: Reference Details · Company/Vessel · Quote Amount · Order Return Details · Status · Notes

### 8.4 Companies Page

```text
Company Name │ Type │ Default Currency │ Default Pricing │ Total Offers │ Returned │ Return Rate
```

### 8.5 Vessels Page

```text
Vessel Name │ IMO │ Company │ Active │ Total Offers │ Returned │ Return Rate
```

### 8.6 Notes Page

Marine Notes app'in basit hali — title, content, category, deadline, archive toggle.

---

## 9. UX Notları

### 9.1 Quote Form

Vessel seçildiğinde:
- Company otomatik dolar (vessel.company_id'den)
- `effective_vessel_terms` view'ından currency ve pricing type otomatik gelir
- Kullanıcı isterse currency'yi manuel değiştirebilir

### 9.2 Mark as Order Modal

```text
Reference: SIM-Q-2026-001
Quote Total: USD 10,000.00

Order No:        [________]
Order Date:      [________]
Order Total:     [________]
Currency:        [USD ▾]

Suggested Status:
( ) Won
(•) Partially Won  ← otomatik öneri (order < quote ise)

Order Difference Note (opsiyonel):
[________________________]
```

```js
function suggestOrderStatus(quoteTotal, orderTotal) {
  if (!quoteTotal || !orderTotal) return "won";
  if (orderTotal > 0 && orderTotal < quoteTotal) return "partially_won";
  return "won";
}
```

### 9.3 Vessel Terms Override UI

```text
[ ] Şirket default şartını kullan (Önerilir)
[X] Bu gemi için özel şart tanımla
    Para birimi:    [EUR ▾]   default: USD (şirketten)
    Fiyat tipi:     [Net ▾]   default: İskontolu
    İskonto %:      [—]       default: 5
    Ödeme şartı:    [—]       default: 30 gün net
```

Sadece doldurulmuş alanlar `vessel_terms`'e yazılır; gerisi null kalır.

---

## 10. Sprint Planı (5 Sprint)

### Sprint 1 — Foundation

**Kapsam:**
- Vite + React + Tailwind kurulumu
- Supabase client + env dosyası
- Auth (email + password)
- ProtectedRoute
- Layout: Sidebar + TopBar
- React Router setup

**Acceptance Criteria:**
- [ ] `npm run dev` ile uygulama açılıyor
- [ ] Login olmayan kullanıcı `/login`'e yönleniyor
- [ ] Login sonrası `/` (Dashboard placeholder) açılıyor
- [ ] Sidebar 5 menü görünüyor (Dashboard, Companies, Vessels, Quotes, Notes)
- [ ] TopBar'da kullanıcı email'i görünüyor

---

### Sprint 2 — Master Data

**Kapsam:**
- Companies CRUD + CompanyTermsForm
- Vessels CRUD + VesselTermsForm (override UI)
- `effective_vessel_terms` view kullanımı

**Acceptance Criteria:**
- [ ] Yeni şirket eklenebiliyor; default terms zorunlu (USD/EUR/TRY/GBP/AED + net/discounted)
- [ ] Şirket düzenlenip silinebiliyor (soft delete: is_active=false)
- [ ] Yeni gemi eklenebiliyor, şirkete bağlanıyor
- [ ] Vessel Terms Form'da "Şirket default kullan" / "Override et" seçimi çalışıyor
- [ ] Override sadece değişen alanları yazıyor (diğerleri null kalır)
- [ ] Vessel Detail sayfasında "Geçerli şartlar: USD, Net, 30 gün" görünüyor (effective view'dan)

---

### Sprint 3 — Quote Tracking

**Kapsam:**
- Quotes CRUD
- Quote List + filtreler + StatusBadge
- Quote Detail page
- Mark as Order modal
- Mark as Lost modal

**Acceptance Criteria:**
- [ ] Yeni quote oluşturulabiliyor; reference_no unique kontrol ediliyor
- [ ] Vessel seçilince company ve currency otomatik dolduruluyor
- [ ] Quote List filtreleri çalışıyor (status, company, vessel, currency, date range, search)
- [ ] Mark as Order modal'ı: order_no, order_date, order_total_amount, order_currency dolduruluyor
- [ ] order_total < quote_total ise status otomatik "partially_won" öneriliyor
- [ ] return_rate_pct DB'de generated column ile otomatik hesaplanıyor (aynı currency'de)
- [ ] Mark as Lost modal'ı lost_reason ve notes alıyor

---

### Sprint 4 — Dashboard

**Kapsam:**
- KPI Cards (6 adet, dashboard_summary view'ından)
- Monthly Return Trend chart (Recharts LineChart)
- Recent Offer References tablosu (son 5 quote)
- Top Companies by Return Rate (Recharts BarChart, horizontal)

**Acceptance Criteria:**
- [ ] 6 KPI card mockup'taki gibi sıralı
- [ ] Trend chart son 7 ayın Offers + Returned Offers'ını gösteriyor
- [ ] Recent References tablosu en son 5 quote'u gösteriyor, satıra tıklayınca detay açılıyor
- [ ] Top Companies bar chart en yüksek return rate'li 5 şirketi gösteriyor
- [ ] Tüm KPI'lar 0 datayken bile crash olmuyor (empty state)

---

### Sprint 5 — Notes + Polish

**Kapsam:**
- Notes CRUD (basit)
- Companies/Vessels listelerine return stats kolonları
- Responsive UI (mobile/tablet check)
- Dark mode toggle (opsiyonel)
- Vercel deploy + production env

**Acceptance Criteria:**
- [ ] Notes CRUD çalışıyor (title, content, category, deadline, archive)
- [ ] Companies tablosunda Total Offers / Returned / Return Rate kolonları görünüyor
- [ ] Vessels tablosunda aynı kolonlar
- [ ] Mobile (iPhone size) ekranda sidebar collapse oluyor
- [ ] Production build hatasız geçiyor
- [ ] Vercel'de deploy edildi, env değişkenleri ayarlandı

---

## 11. Migration Dosya Yapısı

```text
supabase/migrations/
├── 001_master_data.sql           # companies, company_terms, vessels, vessel_terms + index
├── 002_quotes_and_notes.sql      # quotes (generated column dahil), notes + index
├── 003_views.sql                 # effective_vessel_terms, return_stats, monthly_trend, summary
└── 004_rls.sql                   # Tüm RLS policy'leri
```

---

## 12. İlk Komutlar

```bash
npm create vite@latest marine-offer-tracker -- --template react
cd marine-offer-tracker

npm install @supabase/supabase-js @tanstack/react-query react-router-dom recharts lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

`.env`:

```text
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

`tailwind.config.js`:

```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        teal: { brand: "#00ADB5" },
        purple: { brand: "#7F30E4" },
        sidebar: "#0F1419",
      }
    }
  },
  plugins: [],
};
```

---

## 13. Codex İçin Çalışma Talimatı

Bu spec **self-contained** olacak şekilde yazıldı. Codex'e task verirken:

### 13.1 Repo Hazırlığı

1. GitHub'da boş bir repo oluştur (`marine-offer-tracker`)
2. Bu spec'i `docs/SPEC.md` olarak repo'ya commit'le
3. README'de kısa proje açıklaması ve `docs/SPEC.md`'ye link
4. Codex'e bu repo'yu bağla

### 13.2 Sprint Kickoff Prompt Şablonu

Her sprint için Codex'e şu formatta task ver:

```text
Implement Sprint [N] from docs/SPEC.md.

Read docs/SPEC.md fully before starting. Focus on Section 10, Sprint [N].

Requirements:
- Follow exact folder structure in Section 7
- Use exact SQL from Section 3, 5, 6 for migrations
- Tailwind colors from Section 12
- All Acceptance Criteria in Section 10 Sprint [N] must pass
- Do not implement future sprint features
- Do not add follow-up tracking (explicitly out of scope per Section 0)

Deliverables:
- Pull request with all sprint files
- Brief PR description listing which acceptance criteria are met
- Manual test steps in PR description
```

### 13.3 Önemli Yasaklar (Codex'e net belirt)

- ❌ `quote_followups` tablosu **açma**
- ❌ `follow_up_*` alanları quotes'a **ekleme**
- ❌ Ayrı `orders` tablosu **açma** (sipariş bilgisi quotes içinde)
- ❌ PDF, email, item-level pricing **eklemeden git**
- ❌ Currency conversion (USD'ye dönüştürme) **yapma** — v1'de farklı currency'ler ayrı kalır

### 13.4 Sprint 1 Başlangıç Prompt'u (kopyala-yapıştır)

```text
Implement Sprint 1 from docs/SPEC.md.

Tasks:
1. Initialize Vite + React project at repo root
2. Install dependencies per Section 12
3. Configure Tailwind per Section 12
4. Create folder structure under src/ per Section 7 (empty files OK for unused ones)
5. Implement src/lib/supabase.js with createClient
6. Implement Auth flow:
   - src/pages/Login.jsx (email + password form)
   - src/components/layout/ProtectedRoute.jsx
7. Implement Layout:
   - src/components/layout/Sidebar.jsx (5 menu items per Section 2)
   - src/components/layout/TopBar.jsx (search placeholder + user email + logout)
8. Setup React Router with protected routes:
   - / → Dashboard placeholder ("Coming soon")
   - /companies, /vessels, /quotes, /notes → placeholder pages
   - /login → public

Use teal #00ADB5 as primary, sidebar background #0F1419 with white text.
Sidebar should be 240px wide, collapsible to icons-only on mobile.

Validate Acceptance Criteria from Section 10 Sprint 1.
```

---

## 14. v2+ Roadmap

İleride değerlendirilebilir:
- Follow-up takibi (eğer ihtiyaç doğarsa)
- PDF teklif çıktısı
- Email gönderimi
- Excel/CSV export
- Currency conversion
- Item-level quote detail
- Multiple orders per quote
- SIMSEKLER ERP user/role entegrasyonu
- Lost reason lookup table
- Marine Notes app'inden veri migrasyonu

---

## 15. Kısa Tanım

```text
Marine Offer Tracker, müşterilere geçilen teklif referanslarını, tutar ve sayı bazlı siparişe dönüşüm oranlarını ve şirket/gemi bazlı performansı gösteren minimal bir takip uygulamasıdır. Follow-up yönetimi v1 kapsamı dışındadır.
```

