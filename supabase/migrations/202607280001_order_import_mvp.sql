create type public.marketplace as enum ('shopee', 'tiktok_shop');
create type public.normalized_order_status as enum ('unknown', 'in_progress', 'completed', 'cancelled', 'returned');

create table public.import_batches (
  id uuid primary key default gen_random_uuid(),
  marketplace public.marketplace not null,
  source_filename text not null,
  imported_at timestamptz not null default now(),
  total_rows integer not null default 0 check (total_rows >= 0),
  created_rows integer not null default 0 check (created_rows >= 0),
  updated_rows integer not null default 0 check (updated_rows >= 0),
  failed_rows integer not null default 0 check (failed_rows >= 0),
  completed_at timestamptz,
  check (created_rows + updated_rows + failed_rows <= total_rows)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  marketplace public.marketplace not null,
  marketplace_order_id text not null,
  raw_status text not null,
  normalized_status public.normalized_order_status not null default 'unknown',
  ordered_at timestamptz,
  completed_at timestamptz,
  marketplace_payout numeric(18,2) check (marketplace_payout >= 0),
  last_import_batch_id uuid references public.import_batches(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (marketplace, marketplace_order_id),
  check (normalized_status <> 'completed' or completed_at is not null)
);

create table public.order_lines (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  marketplace_line_id text,
  product_name text not null,
  sku text,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (order_id, marketplace_line_id)
);

create table public.order_field_changes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  field_name text not null,
  old_value jsonb,
  new_value jsonb,
  changed_at timestamptz not null default now(),
  check (old_value is distinct from new_value)
);

create index orders_completed_report_idx on public.orders (completed_at, marketplace) where normalized_status = 'completed';
create index order_lines_order_id_idx on public.order_lines (order_id);
create index order_field_changes_order_id_idx on public.order_field_changes (order_id, changed_at desc);

create function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger orders_set_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger order_lines_set_updated_at before update on public.order_lines for each row execute function public.set_updated_at();

-- Browser roles receive no table grants. Until an approved auth model exists,
-- application access must stay server-side via the service-role environment key.
