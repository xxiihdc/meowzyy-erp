import { createServerSupabaseClient } from "@/lib/supabase/server";

export type CapitalTreatment = "immediate_expense" | "depreciable_asset" | "inventory_capital";

export type CapitalCategory = {
  id: string;
  name: string;
  treatment: CapitalTreatment;
  is_active: boolean;
};

export type CapitalExpense = {
  id: string;
  category_id: string;
  treatment: CapitalTreatment;
  paid_on: string;
  amount: number | string;
  description: string | null;
  reference_code: string | null;
  useful_life_months: number | null;
  category: Pick<CapitalCategory, "name"> | null;
};

export type CapitalSummary = {
  cashSpent: number;
  inventoryCapital: number;
  periodExpense: number;
  depreciation: number;
};

export type CapitalExpenseChange = {
  id: string;
  old_value: Record<string, unknown>;
  new_value: Record<string, unknown>;
  changed_at: string;
};

export const capitalTreatmentLabel: Record<CapitalTreatment, string> = {
  immediate_expense: "Chi phí ngay",
  depreciable_asset: "Tài sản khấu hao",
  inventory_capital: "Vốn nhập hàng",
};

export async function getCapitalCategories(includeInactive = false): Promise<CapitalCategory[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return [];
  let query = supabase.from("capital_categories").select("id, name, treatment, is_active").order("name");
  if (!includeInactive) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw new Error(`Không thể tải danh mục chi: ${error.message}`);
  return (data ?? []) as CapitalCategory[];
}

export async function getCapitalExpenses(): Promise<CapitalExpense[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("capital_expenses")
    .select("id, category_id, treatment, paid_on, amount, description, reference_code, useful_life_months, category:capital_categories(name)")
    .order("paid_on", { ascending: false })
    .limit(100);
  if (error) throw new Error(`Không thể tải khoản chi: ${error.message}`);
  return (data ?? []) as unknown as CapitalExpense[];
}

export async function getCapitalExpense(id: string): Promise<CapitalExpense | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("capital_expenses")
    .select("id, category_id, treatment, paid_on, amount, description, reference_code, useful_life_months, category:capital_categories(name)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Không thể tải khoản chi: ${error.message}`);
  return data as unknown as CapitalExpense | null;
}

export async function getCapitalExpenseChanges(id: string): Promise<CapitalExpenseChange[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("capital_expense_changes")
    .select("id, old_value, new_value, changed_at")
    .eq("capital_expense_id", id)
    .order("changed_at", { ascending: false });
  if (error) throw new Error(`Không thể tải lịch sử khoản chi: ${error.message}`);
  return (data ?? []) as CapitalExpenseChange[];
}

function monthBounds(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthNumber - 1, 1));
  const end = new Date(Date.UTC(year, monthNumber, 1));
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10), index: year * 12 + monthNumber - 1 };
}

function depreciationForMonth(expense: CapitalExpense, reportMonthIndex: number) {
  if (expense.treatment !== "depreciable_asset" || !expense.useful_life_months) return 0;
  const [year, month] = expense.paid_on.split("-").map(Number);
  const purchaseMonthIndex = year * 12 + month - 1;
  const elapsed = reportMonthIndex - purchaseMonthIndex;
  if (elapsed < 0 || elapsed >= expense.useful_life_months) return 0;
  const amount = Number(expense.amount);
  const base = Math.floor((amount * 100) / expense.useful_life_months) / 100;
  return elapsed === expense.useful_life_months - 1 ? amount - base * (expense.useful_life_months - 1) : base;
}

export async function getCapitalSummary(month: string): Promise<CapitalSummary> {
  const [expenses, supabase] = await Promise.all([getCapitalExpenses(), Promise.resolve(createServerSupabaseClient())]);
  if (!supabase) return { cashSpent: 0, inventoryCapital: 0, periodExpense: 0, depreciation: 0 };
  const { start, end, index } = monthBounds(month);
  const paidInMonth = expenses.filter((expense) => expense.paid_on >= start && expense.paid_on < end);
  const cashSpent = paidInMonth.reduce((total, expense) => total + Number(expense.amount), 0);
  const inventoryCapital = paidInMonth.filter((expense) => expense.treatment === "inventory_capital").reduce((total, expense) => total + Number(expense.amount), 0);
  const immediateExpense = paidInMonth.filter((expense) => expense.treatment === "immediate_expense").reduce((total, expense) => total + Number(expense.amount), 0);
  const depreciation = expenses.reduce((total, expense) => total + depreciationForMonth(expense, index), 0);
  return { cashSpent, inventoryCapital, depreciation, periodExpense: immediateExpense + depreciation };
}
