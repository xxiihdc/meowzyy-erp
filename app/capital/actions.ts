"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { CapitalTreatment } from "@/lib/capital/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const treatments = new Set<CapitalTreatment>(["immediate_expense", "depreciable_asset", "inventory_capital"]);

function stringValue(formData: FormData, field: string) {
  return String(formData.get(field) ?? "").trim();
}

function parseExpense(formData: FormData) {
  const categoryId = stringValue(formData, "category_id");
  const paidOn = stringValue(formData, "paid_on");
  const amount = Number(stringValue(formData, "amount"));
  const description = stringValue(formData, "description") || null;
  const referenceCode = stringValue(formData, "reference_code") || null;
  const usefulLifeInput = stringValue(formData, "useful_life_months");
  const quantityInput = stringValue(formData, "quantity");
  const unitLabel = stringValue(formData, "unit_label") || null;
  if (!categoryId || !paidOn || !Number.isFinite(amount) || amount <= 0) throw new Error("Vui lòng nhập danh mục, ngày chi và số tiền hợp lệ.");
  const quantity = quantityInput ? Number(quantityInput) : null;
  if (quantity !== null && (!Number.isInteger(quantity) || quantity <= 0)) throw new Error("Số lượng phải là số nguyên dương.");
  if (unitLabel && quantity === null) throw new Error("Vui lòng nhập số lượng trước khi nhập đơn vị tính.");
  return { categoryId, paidOn, amount, description, referenceCode, usefulLifeInput, quantity, unitLabel };
}

async function categoryTreatment(categoryId: string, permittedInactiveCategoryId?: string) {
  const supabase = createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase chưa được cấu hình.");
  const { data, error } = await supabase.from("capital_categories").select("treatment, is_active").eq("id", categoryId).single();
  if (error || !data || (!data.is_active && categoryId !== permittedInactiveCategoryId)) throw new Error("Danh mục không tồn tại hoặc đã ngừng sử dụng.");
  return { supabase, treatment: data.treatment as CapitalTreatment };
}

function usefulLifeMonthsFor(treatment: CapitalTreatment, usefulLifeInput: string, quantity: number | null) {
  if (treatment !== "depreciable_asset") return null;
  const usefulLifeMonths = usefulLifeInput ? Number(usefulLifeInput) : null;
  if (usefulLifeMonths !== null && (!Number.isInteger(usefulLifeMonths) || usefulLifeMonths <= 0)) throw new Error("Số tháng sử dụng phải là số nguyên dương.");
  if (usefulLifeMonths === null && quantity === null) throw new Error("Tài sản cần số tháng sử dụng hoặc số lượng hợp lệ.");
  return usefulLifeMonths;
}

export async function createCapitalCategory(formData: FormData) {
  const name = stringValue(formData, "name");
  const treatment = stringValue(formData, "treatment") as CapitalTreatment;
  if (!name || !treatments.has(treatment)) throw new Error("Vui lòng nhập tên và cách xử lý danh mục.");
  const supabase = createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase chưa được cấu hình.");
  const { error } = await supabase.from("capital_categories").insert({ name, treatment });
  if (error) throw new Error(`Không thể tạo danh mục: ${error.message}`);
  revalidatePath("/capital");
}

export async function archiveCapitalCategory(formData: FormData) {
  const id = stringValue(formData, "id");
  const supabase = createServerSupabaseClient();
  if (!supabase || !id) throw new Error("Không thể ngừng sử dụng danh mục.");
  const { error } = await supabase.from("capital_categories").update({ is_active: false }).eq("id", id);
  if (error) throw new Error(`Không thể ngừng sử dụng danh mục: ${error.message}`);
  revalidatePath("/capital");
}

export async function createCapitalExpense(formData: FormData) {
  const input = parseExpense(formData);
  const { supabase, treatment } = await categoryTreatment(input.categoryId);
  const usefulLifeMonths = usefulLifeMonthsFor(treatment, input.usefulLifeInput, input.quantity);
  const { error } = await supabase.from("capital_expenses").insert({
    category_id: input.categoryId, treatment, paid_on: input.paidOn, amount: input.amount,
    description: input.description, reference_code: input.referenceCode, useful_life_months: usefulLifeMonths,
    quantity: input.quantity, unit_label: input.unitLabel,
  });
  if (error) throw new Error(`Không thể ghi khoản chi: ${error.message}`);
  revalidatePath("/capital");
}

export async function updateCapitalExpense(formData: FormData) {
  const id = stringValue(formData, "id");
  const input = parseExpense(formData);
  if (!id) throw new Error("Không tìm thấy khoản chi cần sửa.");
  const serverClient = createServerSupabaseClient();
  if (!serverClient) throw new Error("Supabase chưa được cấu hình.");
  const { data: existing, error: existingError } = await serverClient.from("capital_expenses").select("category_id").eq("id", id).single();
  if (existingError || !existing) throw new Error("Không tìm thấy khoản chi cần sửa.");
  const { supabase, treatment } = await categoryTreatment(input.categoryId, existing.category_id);
  const usefulLifeMonths = usefulLifeMonthsFor(treatment, input.usefulLifeInput, input.quantity);
  const { error } = await supabase.from("capital_expenses").update({
    category_id: input.categoryId, treatment, paid_on: input.paidOn, amount: input.amount,
    description: input.description, reference_code: input.referenceCode, useful_life_months: usefulLifeMonths,
    quantity: input.quantity, unit_label: input.unitLabel,
  }).eq("id", id);
  if (error) throw new Error(`Không thể sửa khoản chi: ${error.message}`);
  revalidatePath("/capital");
  redirect("/capital");
}
