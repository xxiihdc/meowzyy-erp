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
  if (!categoryId || !paidOn || !Number.isFinite(amount) || amount <= 0) throw new Error("Vui lòng nhập danh mục, ngày chi và số tiền hợp lệ.");
  return { categoryId, paidOn, amount, description, referenceCode, usefulLifeInput };
}

async function categoryTreatment(categoryId: string, permittedInactiveCategoryId?: string) {
  const supabase = createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase chưa được cấu hình.");
  const { data, error } = await supabase.from("capital_categories").select("treatment, is_active").eq("id", categoryId).single();
  if (error || !data || (!data.is_active && categoryId !== permittedInactiveCategoryId)) throw new Error("Danh mục không tồn tại hoặc đã ngừng sử dụng.");
  return { supabase, treatment: data.treatment as CapitalTreatment };
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
  const usefulLifeMonths = treatment === "depreciable_asset" ? Number(input.usefulLifeInput) : null;
  if (treatment === "depreciable_asset" && (usefulLifeMonths === null || !Number.isInteger(usefulLifeMonths) || usefulLifeMonths <= 0)) throw new Error("Tài sản cần số tháng sử dụng hợp lệ.");
  const { error } = await supabase.from("capital_expenses").insert({
    category_id: input.categoryId, treatment, paid_on: input.paidOn, amount: input.amount,
    description: input.description, reference_code: input.referenceCode, useful_life_months: usefulLifeMonths,
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
  const usefulLifeMonths = treatment === "depreciable_asset" ? Number(input.usefulLifeInput) : null;
  if (treatment === "depreciable_asset" && (usefulLifeMonths === null || !Number.isInteger(usefulLifeMonths) || usefulLifeMonths <= 0)) throw new Error("Tài sản cần số tháng sử dụng hợp lệ.");
  const { error } = await supabase.from("capital_expenses").update({
    category_id: input.categoryId, treatment, paid_on: input.paidOn, amount: input.amount,
    description: input.description, reference_code: input.referenceCode, useful_life_months: usefulLifeMonths,
  }).eq("id", id);
  if (error) throw new Error(`Không thể sửa khoản chi: ${error.message}`);
  revalidatePath("/capital");
  redirect("/capital");
}
