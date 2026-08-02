import Link from "next/link";
import { notFound } from "next/navigation";

import { updateCapitalExpense } from "@/app/capital/actions";
import { CapitalExpenseQuantityFields } from "@/components/capital-expense-quantity-fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { capitalTreatmentLabel, getCapitalCategories, getCapitalExpense, getCapitalExpenseChanges } from "@/lib/capital/queries";

const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

function auditQuantity(value: Record<string, unknown>) {
  const quantity = value.quantity;
  if (typeof quantity !== "number" && typeof quantity !== "string") return "—";
  const unitLabel = typeof value.unit_label === "string" && value.unit_label ? ` ${value.unit_label}` : "";
  return `${quantity}${unitLabel}`;
}

export default async function EditCapitalExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [expense, categories, changes] = await Promise.all([getCapitalExpense(id), getCapitalCategories(true), getCapitalExpenseChanges(id)]);
  if (!expense) notFound();

  return <main className="min-h-screen bg-[#f7f7f5] px-6 py-8 text-slate-950 md:px-10"><div className="mx-auto max-w-2xl">
    <Link className="text-sm font-medium text-slate-500 hover:text-slate-950" href="/capital">← Chi vốn</Link>
    <Card className="mt-6"><CardHeader><CardTitle>Sửa khoản chi</CardTitle><CardDescription>Lịch sử giá trị trước/sau sẽ được lưu tự động.</CardDescription></CardHeader><CardContent>
      <form action={updateCapitalExpense} className="grid gap-4 md:grid-cols-2">
        <input type="hidden" name="id" value={expense.id} />
        <label className="grid gap-1 text-sm font-medium">Danh mục<select required name="category_id" defaultValue={expense.category_id} className="h-10 rounded-md border border-slate-300 bg-white px-3">{categories.filter((category) => category.is_active || category.id === expense.category_id).map((category) => <option key={category.id} value={category.id}>{category.name} · {capitalTreatmentLabel[category.treatment]}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-medium">Ngày đã trả<input required name="paid_on" type="date" defaultValue={expense.paid_on} className="h-10 rounded-md border border-slate-300 bg-white px-3" /></label>
        <CapitalExpenseQuantityFields initialAmount={expense.amount} initialQuantity={expense.quantity} initialUnitLabel={expense.unit_label} />
        <label className="grid gap-1 text-sm font-medium">Số tháng sử dụng <span className="font-normal text-slate-500">(chỉ tài sản; có thể để trống khi có số lượng hợp lệ)</span><input name="useful_life_months" type="number" min="1" step="1" defaultValue={expense.useful_life_months ?? ""} className="h-10 rounded-md border border-slate-300 bg-white px-3" /></label>
        <label className="grid gap-1 text-sm font-medium md:col-span-2">Mô tả<input name="description" defaultValue={expense.description ?? ""} className="h-10 rounded-md border border-slate-300 bg-white px-3" /></label>
        <label className="grid gap-1 text-sm font-medium">Mã chứng từ<input name="reference_code" defaultValue={expense.reference_code ?? ""} className="h-10 rounded-md border border-slate-300 bg-white px-3" /></label>
        <div className="flex items-end gap-2"><Button className="flex-1" type="submit">Lưu thay đổi</Button><Link className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium hover:bg-slate-100" href="/capital">Hủy</Link></div>
      </form>
    </CardContent></Card>
    <Card className="mt-6"><CardHeader><CardTitle>Lịch sử sửa</CardTitle><CardDescription>Giá trị trước và sau của mỗi lần cập nhật.</CardDescription></CardHeader><CardContent>{changes.length === 0 ? <p className="text-sm text-slate-500">Chưa có thay đổi.</p> : <div className="space-y-3">{changes.map((change) => <div className="rounded-md border border-slate-200 p-3 text-sm" key={change.id}><p className="font-medium">{new Date(change.changed_at).toLocaleString("vi-VN")}</p><p className="mt-1 text-slate-600">Số tiền: {currency.format(Number(change.old_value.amount))} → {currency.format(Number(change.new_value.amount))}</p><p className="text-slate-600">Ngày trả: {String(change.old_value.paid_on)} → {String(change.new_value.paid_on)}</p><p className="text-slate-600">Số lượng: {auditQuantity(change.old_value)} → {auditQuantity(change.new_value)}</p></div>)}</div>}</CardContent></Card>
  </div></main>;
}
