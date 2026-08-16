export const SHOPEE_MAPPING_VERSION = "shopee-v1";

export type ShopeeSourceRow = Record<string, unknown>;

export type RejectedShopeeRow = { rowNumber: number; reason: string };

export type ParsedShopeeOrder = {
  marketplaceOrderId: string;
  rawStatus: string;
  orderedAt: string | null;
  completedAt: string | null;
  lines: Array<{ productName: string; sku: string | null; quantity: number }>;
  components: Array<{ code: string; amount: number; sourceColumn: string; sourceScope: "order_line" | "order"; aggregationMethod: "sum" | "first"; includedInActualRevenue: boolean }>;
  finalSellingPrice: number;
  actualRevenue: number;
};

const requiredHeaders = ["Mã đơn hàng", "Trạng Thái Đơn Hàng", "Tên sản phẩm", "Số lượng", "Giá gốc", "Tổng số tiền được người bán trợ giá", "Phí cố định", "Phí Dịch Vụ", "Phí xử lý giao dịch"] as const;
const money = (value: unknown) => {
  const number = typeof value === "number" ? value : Number(String(value ?? "").replace(/[,\s]/g, ""));
  return Number.isFinite(number) ? number : null;
};
const text = (value: unknown) => String(value ?? "").trim();

export function validateShopeeHeaders(headers: string[]) {
  return requiredHeaders.filter((header) => !headers.includes(header));
}

export function parseShopeeRows(rows: ShopeeSourceRow[]): { orders: ParsedShopeeOrder[]; rejected: RejectedShopeeRow[] } {
  const groups = new Map<string, Array<{ row: ShopeeSourceRow; rowNumber: number }>>();
  const rejected: RejectedShopeeRow[] = [];
  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const orderId = text(row["Mã đơn hàng"]);
    const productName = text(row["Tên sản phẩm"]);
    const quantity = money(row["Số lượng"]);
    if (!orderId) return rejected.push({ rowNumber, reason: "Thiếu Mã đơn hàng." });
    if (!productName) return rejected.push({ rowNumber, reason: "Thiếu Tên sản phẩm." });
    if (!Number.isInteger(quantity) || quantity! <= 0) return rejected.push({ rowNumber, reason: "Số lượng phải là số nguyên dương." });
    if (["Giá gốc", "Tổng số tiền được người bán trợ giá", "Phí cố định", "Phí Dịch Vụ", "Phí xử lý giao dịch"].some((field) => money(row[field]) === null)) return rejected.push({ rowNumber, reason: "Thiếu hoặc sai một khoản tiền bắt buộc." });
    groups.set(orderId, [...(groups.get(orderId) ?? []), { row, rowNumber }]);
  });
  const orders = [...groups.entries()].map(([marketplaceOrderId, entries]) => {
    const first = entries[0].row;
    const sum = (field: string) => entries.reduce((total, entry) => total + (money(entry.row[field]) ?? 0), 0);
    const once = (field: string) => money(first[field]) ?? 0;
    const originalPrice = sum("Giá gốc");
    const sellerSubsidy = sum("Tổng số tiền được người bán trợ giá");
    const fixedFee = once("Phí cố định");
    const serviceFee = once("Phí Dịch Vụ");
    const processingFee = once("Phí xử lý giao dịch");
    const finalSellingPrice = originalPrice - sellerSubsidy;
    return {
      marketplaceOrderId,
      rawStatus: text(first["Trạng Thái Đơn Hàng"]),
      orderedAt: text(first["Ngày đặt hàng"]) || null,
      completedAt: text(first["Thời gian hoàn thành đơn hàng"]) || null,
      lines: entries.map(({ row }) => ({ productName: text(row["Tên sản phẩm"]), sku: text(row["SKU phân loại hàng"]) || text(row["SKU sản phẩm"]) || null, quantity: money(row["Số lượng"])! })),
      components: [
        ["original_price", originalPrice, "Giá gốc", "order_line", "sum", false],
        ["seller_subsidy", sellerSubsidy, "Tổng số tiền được người bán trợ giá", "order_line", "sum", true],
        ["fixed_fee", fixedFee, "Phí cố định", "order", "first", true],
        ["service_fee", serviceFee, "Phí Dịch Vụ", "order", "first", true],
        ["processing_fee", processingFee, "Phí xử lý giao dịch", "order", "first", true],
      ].map(([code, amount, sourceColumn, sourceScope, aggregationMethod, includedInActualRevenue]) => ({ code: code as string, amount: amount as number, sourceColumn: sourceColumn as string, sourceScope: sourceScope as "order_line" | "order", aggregationMethod: aggregationMethod as "sum" | "first", includedInActualRevenue: includedInActualRevenue as boolean })),
      finalSellingPrice,
      actualRevenue: finalSellingPrice - fixedFee - serviceFee - processingFee,
    };
  });
  return { orders, rejected };
}
