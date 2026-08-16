import { createServerSupabaseClient } from "@/lib/supabase/server";

export type Marketplace = "shopee" | "tiktok_shop";

export type OrderListItem = {
  id: string;
  marketplace: Marketplace;
  marketplace_order_id: string;
  raw_status: string;
  normalized_status: string;
  completed_at: string | null;
  actual_revenue: number | string | null;
};

export async function getRecentOrders(): Promise<OrderListItem[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("orders").select("id, marketplace, marketplace_order_id, raw_status, normalized_status, completed_at, actual_revenue").order("updated_at", { ascending: false }).limit(20);
  if (error) throw new Error(`Không thể tải đơn hàng: ${error.message}`);
  return (data ?? []) as OrderListItem[];
}

export async function getRevenueSummary() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return { actualRevenue: 0, completedOrderCount: 0 };
  const { data, error } = await supabase.from("orders").select("actual_revenue").eq("normalized_status", "completed");
  if (error) throw new Error(`Không thể tải báo cáo: ${error.message}`);
  return (data ?? []).reduce((summary, order) => ({ actualRevenue: summary.actualRevenue + Number(order.actual_revenue ?? 0), completedOrderCount: summary.completedOrderCount + 1 }), { actualRevenue: 0, completedOrderCount: 0 });
}
