create type public.capital_treatment as enum ('immediate_expense', 'depreciable_asset', 'inventory_capital');

create table public.capital_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  treatment public.capital_treatment not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(btrim(name)) > 0)
);

create table public.capital_expenses (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.capital_categories(id) on delete restrict,
  treatment public.capital_treatment not null,
  paid_on date not null,
  amount numeric(18,2) not null check (amount > 0),
  description text,
  reference_code text,
  useful_life_months integer check (useful_life_months > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((treatment = 'depreciable_asset') = (useful_life_months is not null))
);

create table public.capital_expense_changes (
  id uuid primary key default gen_random_uuid(),
  capital_expense_id uuid not null references public.capital_expenses(id) on delete cascade,
  old_value jsonb not null,
  new_value jsonb not null,
  changed_at timestamptz not null default now()
);

create index capital_expenses_paid_on_idx on public.capital_expenses (paid_on desc);
create index capital_expenses_category_id_idx on public.capital_expenses (category_id);
create index capital_expense_changes_expense_id_idx on public.capital_expense_changes (capital_expense_id, changed_at desc);

create trigger capital_categories_set_updated_at before update on public.capital_categories for each row execute function public.set_updated_at();
create trigger capital_expenses_set_updated_at before update on public.capital_expenses for each row execute function public.set_updated_at();

create function public.prevent_used_category_treatment_change() returns trigger language plpgsql as $$
begin
  if new.treatment is distinct from old.treatment and exists (
    select 1 from public.capital_expenses where category_id = old.id
  ) then
    raise exception 'Không thể đổi cách xử lý của danh mục đã có khoản chi';
  end if;
  return new;
end;
$$;

create trigger capital_categories_lock_treatment before update on public.capital_categories for each row execute function public.prevent_used_category_treatment_change();

create function public.audit_capital_expense_change() returns trigger language plpgsql as $$
declare
  old_payload jsonb := to_jsonb(old) - 'updated_at';
  new_payload jsonb := to_jsonb(new) - 'updated_at';
begin
  if old_payload is distinct from new_payload then
    insert into public.capital_expense_changes (capital_expense_id, old_value, new_value)
    values (new.id, old_payload, new_payload);
  end if;
  return new;
end;
$$;

create trigger capital_expenses_audit after update on public.capital_expenses for each row execute function public.audit_capital_expense_change();

-- Browser roles receive no table grants. Until an approved auth model exists,
-- application access must stay server-side via the service-role environment key.
