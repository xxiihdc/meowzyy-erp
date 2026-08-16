alter table public.orders
  add column final_selling_price numeric(18,2),
  add column actual_revenue numeric(18,2),
  add column revenue_mapping_version text;

create table public.order_monetary_components (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  import_batch_id uuid not null references public.import_batches(id) on delete cascade,
  component_code text not null,
  amount numeric(18,2) not null,
  source_column text not null,
  source_scope text not null check (source_scope in ('order_line', 'order')),
  aggregation_method text not null check (aggregation_method in ('sum', 'first')),
  mapping_version text not null,
  included_in_actual_revenue boolean not null default false,
  created_at timestamptz not null default now(),
  unique (order_id, import_batch_id, component_code)
);

create index order_monetary_components_order_batch_idx
  on public.order_monetary_components (order_id, import_batch_id);

alter table public.orders
  add constraint orders_final_selling_price_nonnegative
    check (final_selling_price is null or final_selling_price >= 0);

grant all privileges on table public.order_monetary_components to service_role;
