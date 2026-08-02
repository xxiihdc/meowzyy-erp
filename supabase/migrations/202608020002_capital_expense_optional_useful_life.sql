alter table public.capital_expenses
  drop constraint capital_expenses_check,
  add constraint capital_expenses_treatment_useful_life_or_quantity_check check (
    (
      treatment = 'depreciable_asset'
      and (useful_life_months is not null or quantity is not null)
    )
    or (
      treatment <> 'depreciable_asset'
      and useful_life_months is null
    )
  );
