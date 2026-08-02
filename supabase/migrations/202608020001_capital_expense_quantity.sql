alter table public.capital_expenses
  add column quantity integer,
  add column unit_label text,
  add constraint capital_expenses_quantity_positive check (quantity is null or quantity > 0),
  add constraint capital_expenses_unit_label_requires_quantity check (
    unit_label is null or (quantity is not null and char_length(btrim(unit_label)) > 0)
  );
