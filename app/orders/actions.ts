"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { read, utils } from "xlsx";

import { parseShopeeRows, SHOPEE_MAPPING_VERSION, validateShopeeHeaders } from "@/lib/orders/shopee-parser";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function importShopeeOrders(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0 || !file.name.toLowerCase().endsWith(".xlsx")) redirect("/?import_error=Vui+lòng+chọn+file+.xlsx+hợp+lệ.");
  const workbook = read(await file.arrayBuffer());
  const worksheet = workbook.Sheets.orders;
  if (!worksheet) redirect("/?import_error=Không+tìm+thấy+sheet+orders.");
  const table = utils.sheet_to_json<unknown[]>(worksheet, { header: 1, defval: "" });
  const headers = (table[0] ?? []).map((value) => String(value).trim());
  const missing = validateShopeeHeaders(headers);
  if (missing.length) redirect(`/?import_error=Thiếu+cột+bắt+buộc:+${encodeURIComponent(missing.join(", "))}`);
  const rows = table.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index]])));
  const parsed = parseShopeeRows(rows);
  const supabase = createServerSupabaseClient();
  if (!supabase) redirect("/?import_error=Supabase+chưa+được+cấu+hình.");
  const { data: batch, error: batchError } = await supabase.from("import_batches").insert({ marketplace: "shopee", source_filename: file.name, total_rows: rows.length, failed_rows: parsed.rejected.length }).select("id").single();
  if (batchError || !batch) redirect(`/?import_error=${encodeURIComponent(batchError?.message ?? "Không thể tạo import batch.")}`);
  let created = 0;
  let updated = 0;
  let failed = parsed.rejected.length;
  for (const order of parsed.orders) {
    const { data: old } = await supabase.from("orders").select("id").eq("marketplace", "shopee").eq("marketplace_order_id", order.marketplaceOrderId).maybeSingle();
    const { data: saved, error: orderError } = await supabase.from("orders").upsert({ marketplace: "shopee", marketplace_order_id: order.marketplaceOrderId, raw_status: order.rawStatus, normalized_status: "unknown", ordered_at: order.orderedAt, completed_at: null, final_selling_price: order.finalSellingPrice, actual_revenue: order.actualRevenue, revenue_mapping_version: SHOPEE_MAPPING_VERSION, last_import_batch_id: batch.id }, { onConflict: "marketplace,marketplace_order_id" }).select("id").single();
    if (orderError || !saved) { failed += order.lines.length; continue; }
    if (old) updated += order.lines.length; else created += order.lines.length;
    await supabase.from("order_lines").delete().eq("order_id", saved.id);
    const lineResult = await supabase.from("order_lines").insert(order.lines.map((line) => ({ order_id: saved.id, product_name: line.productName, sku: line.sku, quantity: line.quantity })));
    const componentResult = await supabase.from("order_monetary_components").insert(order.components.map((component) => ({ order_id: saved.id, import_batch_id: batch.id, component_code: component.code, amount: component.amount, source_column: component.sourceColumn, source_scope: component.sourceScope, aggregation_method: component.aggregationMethod, mapping_version: SHOPEE_MAPPING_VERSION, included_in_actual_revenue: component.includedInActualRevenue })));
    if (lineResult.error || componentResult.error) failed += order.lines.length;
  }
  await supabase.from("import_batches").update({ created_rows: created, updated_rows: updated, failed_rows: failed, completed_at: new Date().toISOString() }).eq("id", batch.id);
  revalidatePath("/");
  redirect(`/?import_created=${created}&import_updated=${updated}&import_failed=${failed}`);
}
