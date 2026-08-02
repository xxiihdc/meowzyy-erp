-- Local Supabase with auto_expose_new_tables disabled does not grant new tables
-- to the server role automatically. Browser roles intentionally receive no grants.
grant usage on schema public to service_role;
grant all privileges on table public.capital_categories, public.capital_expenses, public.capital_expense_changes to service_role;
