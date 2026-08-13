import Link from "next/link";
import {
  Archive,
  Bell,
  ChartNoAxesCombined,
  ChevronDown,
  CircleDollarSign,
  LayoutDashboard,
  Package,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  Settings,
} from "lucide-react";

import { archiveCapitalCategory, createCapitalCategory, createCapitalExpense } from "@/app/capital/actions";
import { CapitalExpenseQuantityFields } from "@/components/capital-expense-quantity-fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CapitalTreatment, capitalTreatmentLabel, getCapitalCategories, getCapitalExpenses, getCapitalSummary } from "@/lib/capital/queries";

const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const today = new Date().toISOString().slice(0, 10);
const currentMonth = today.slice(0, 7);

function monthName(month: string) {
  const [year, monthNumber] = month.split("-");
  return `Tháng ${Number(monthNumber)}/${year}`;
}

function TreatmentBadge({ treatment }: { treatment: CapitalTreatment }) {
  const className = treatment === "depreciable_asset" ? "border-blue-100 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600";
  return <Badge className={`border font-medium ${className}`} variant="outline">{capitalTreatmentLabel[treatment]}</Badge>;
}

function quantityLabel(expense: { quantity: number | null; unit_label: string | null }) {
  if (!expense.quantity) return "—";
  return `${expense.quantity}${expense.unit_label ? ` ${expense.unit_label}` : ""}`;
}

function referenceUnitPrice(expense: { amount: number | string; quantity: number | null }) {
  return expense.quantity ? currency.format(Number(expense.amount) / expense.quantity) : "—";
}

const fieldClassName = "h-11 w-full rounded-sm border border-[#c6c6cd] bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0051d5] focus:ring-2 focus:ring-blue-100";

export default async function CapitalPage({ searchParams }: { searchParams: Promise<{ month?: string; category?: string; treatment?: string }> }) {
  const params = await searchParams;
  const month = /^\d{4}-(0[1-9]|1[0-2])$/.test(params.month ?? "") ? params.month! : currentMonth;
  const [categories, allCategories, expenses, summary] = await Promise.all([
    getCapitalCategories(), getCapitalCategories(true), getCapitalExpenses(), getCapitalSummary(month),
  ]);
  const selectedCategory = allCategories.some((category) => category.id === params.category) ? params.category : "";
  const selectedTreatment = Object.hasOwn(capitalTreatmentLabel, params.treatment ?? "") ? params.treatment as CapitalTreatment : "";
  const filteredExpenses = expenses.filter((expense) =>
    (!selectedCategory || expense.category_id === selectedCategory) && (!selectedTreatment || expense.treatment === selectedTreatment),
  );

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[280px] border-r border-slate-200 bg-white px-6 py-6 lg:flex lg:flex-col">
        <Link className="flex items-center gap-4" href="/">
          <div className="grid size-10 place-items-center rounded-md bg-[#0051d5] text-sm font-bold text-white">M</div>
          <div><p className="text-lg font-semibold leading-6 tracking-tight">Meowzyy ERP</p><p className="text-xs text-slate-500">Bán hàng đa sàn</p></div>
        </Link>
        <nav className="mt-8 space-y-3 text-sm font-medium">
          <Link className="flex h-11 items-center gap-4 rounded-sm px-4 text-slate-600 hover:bg-slate-50" href="/"><LayoutDashboard className="size-[18px]" />Tổng quan</Link>
          <span className="flex h-11 items-center gap-4 rounded-sm px-4 text-slate-400"><ReceiptText className="size-[18px]" />Đơn hàng</span>
          <span className="flex h-11 items-center gap-4 rounded-sm px-4 text-slate-400"><Package className="size-[18px]" />Sản phẩm</span>
          <span className="flex h-11 items-center gap-4 rounded-sm px-4 text-slate-400"><ChartNoAxesCombined className="size-[18px]" />Báo cáo</span>
          <Link aria-current="page" className="flex h-11 items-center gap-4 rounded-sm bg-[#e8f0ff] px-4 text-[#0051d5]" href="/capital"><CircleDollarSign className="size-[18px]" />Chi vốn</Link>
        </nav>
        <div className="mt-auto border-t border-slate-100 pt-5"><span className="flex h-10 items-center gap-4 px-4 text-sm font-medium text-slate-500"><Settings className="size-[18px]" />Cài đặt</span></div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
          <div className="flex items-center gap-3 lg:hidden"><div className="grid size-8 place-items-center rounded bg-[#0051d5] text-xs font-bold text-white">M</div><p className="font-semibold">Meowzyy ERP</p></div>
          <p className="hidden text-sm text-slate-500 lg:block">Quản lý vận hành</p>
          <div className="flex items-center gap-4 text-slate-500"><Bell className="size-5" /><div className="grid size-8 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">M</div></div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-8">
          <header className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Quản lý chi vốn</h1>
            <p className="mt-1 text-sm text-[#45464d]">Theo dõi, phân loại và quản lý dòng tiền đã thanh toán.</p>
          </header>

          <div className="mt-6 grid gap-6 xl:grid-cols-[296px_minmax(0,1fr)]">
            <div className="space-y-6">
              <Card className="rounded-lg border-[#c6c6cd] shadow-[0_1px_1.5px_rgba(0,0,0,0.1)]">
                <CardHeader className="p-6 pb-4"><CardTitle className="text-xl">Ghi khoản chi</CardTitle><CardDescription>Chỉ ghi nhận tiền đã trả thực tế.</CardDescription></CardHeader>
                <CardContent className="p-6 pt-0">
                  {categories.length === 0 ? <p className="rounded-sm bg-amber-50 p-4 text-sm text-amber-900">Tạo ít nhất một danh mục ở phần bên dưới trước khi ghi khoản chi.</p> : (
                    <form action={createCapitalExpense} className="grid gap-4">
                      <CapitalExpenseQuantityFields />
                      <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.06em] text-[#45464d]">Ngày đã trả<input required name="paid_on" type="date" defaultValue={today} className={fieldClassName} /></label>
                      <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.06em] text-[#45464d]">Danh mục<select required name="category_id" className={fieldClassName} defaultValue=""><option disabled value="">Chọn danh mục</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name} · {capitalTreatmentLabel[category.treatment]}</option>)}</select></label>
                      <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.06em] text-[#45464d]">Số tháng sử dụng <span className="normal-case font-normal tracking-normal text-slate-500">(chỉ tài sản; có thể để trống khi có số lượng hợp lệ)</span><input name="useful_life_months" type="number" min="1" step="1" className={fieldClassName} /></label>
                      <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.06em] text-[#45464d]">Mô tả<textarea name="description" className="min-h-24 w-full resize-y rounded-sm border border-[#c6c6cd] bg-white px-3 py-3 text-sm shadow-sm outline-none transition focus:border-[#0051d5] focus:ring-2 focus:ring-blue-100" placeholder="Chi tiết ngắn về khoản chi..." /></label>
                      <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.06em] text-[#45464d]">Mã chứng từ <span className="normal-case font-normal tracking-normal text-slate-500">(tùy chọn)</span><input name="reference_code" className={fieldClassName} /></label>
                      <Button className="mt-2 h-10 w-full rounded-sm bg-[#0051d5] text-xs font-semibold uppercase tracking-[0.06em] hover:bg-[#0044b5]" type="submit"><Plus className="size-4" />Lưu khoản chi</Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-lg border-[#c6c6cd] shadow-[0_1px_1.5px_rgba(0,0,0,0.1)]">
                <CardHeader className="p-6 pb-4"><CardTitle className="text-xl">Báo cáo kỳ</CardTitle><CardDescription>{monthName(month)} · theo workflow đã duyệt</CardDescription></CardHeader>
                <CardContent className="grid gap-2 p-6 pt-0">
                  {[
                    ["Tiền đã chi", summary.cashSpent], ["Vốn nhập hàng", summary.inventoryCapital], ["Khấu hao", summary.depreciation], ["Chi phí kỳ", summary.periodExpense], ["Chờ phân bổ", summary.pendingOrderAllocation],
                  ].map(([label, value]) => <div className="flex items-center justify-between gap-3 rounded-sm bg-slate-50 px-3 py-2 text-xs" key={String(label)}><span className="text-slate-600">{label}</span><span className="font-semibold text-slate-900">{currency.format(Number(value))}</span></div>)}
                  <p className="pt-1 text-xs leading-5 text-slate-500">Chờ phân bổ không tính vào khấu hao hoặc chi phí kỳ.</p>
                </CardContent>
              </Card>

              <Card className="rounded-lg border-[#c6c6cd] shadow-[0_1px_1.5px_rgba(0,0,0,0.1)]">
                <CardHeader className="p-6 pb-4"><CardTitle className="text-xl">Danh mục chi</CardTitle><CardDescription>Danh mục quyết định cách tính báo cáo.</CardDescription></CardHeader>
                <CardContent className="p-6 pt-0">
                  <form action={createCapitalCategory} className="grid gap-3"><input required name="name" className={fieldClassName} placeholder="Tên danh mục" /><select required name="treatment" defaultValue="immediate_expense" className={fieldClassName}>{(Object.entries(capitalTreatmentLabel) as [CapitalTreatment, string][]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><Button type="submit" variant="outline" className="rounded-sm"><Plus className="size-4" />Tạo danh mục</Button></form>
                  <div className="mt-5 space-y-2">{allCategories.length === 0 ? <p className="text-sm text-slate-500">Chưa có danh mục.</p> : allCategories.map((category) => <div key={category.id} className="flex items-center justify-between gap-3 rounded-sm border border-slate-200 p-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{category.name}</p><TreatmentBadge treatment={category.treatment} /></div>{category.is_active ? <form action={archiveCapitalCategory}><input type="hidden" name="id" value={category.id} /><Button type="submit" size="sm" variant="ghost" title="Ngừng sử dụng"><Archive className="size-4" /></Button></form> : <Badge variant="outline">Đã ngừng</Badge>}</div>)}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="min-w-0 rounded-lg border-[#c6c6cd] shadow-[0_1px_1.5px_rgba(0,0,0,0.1)]">
              <CardHeader className="gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
                <div><CardTitle className="text-xl">Khoản chi gần đây</CardTitle><CardDescription className="mt-1">Sửa khoản chi sẽ lưu lịch sử giá trị trước và sau.</CardDescription></div>
                <form action="/capital" method="get" className="flex flex-wrap items-center gap-2"><input type="hidden" name="month" value={month} /><select aria-label="Lọc danh mục" name="category" defaultValue={selectedCategory} className="h-9 min-w-36 rounded-sm border border-[#c6c6cd] bg-white px-2 text-sm"><option value="">Mọi danh mục</option>{allCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><select aria-label="Lọc cách xử lý" name="treatment" defaultValue={selectedTreatment} className="h-9 min-w-36 rounded-sm border border-[#c6c6cd] bg-white px-2 text-sm"><option value="">Mọi cách xử lý</option>{(Object.entries(capitalTreatmentLabel) as [CapitalTreatment, string][]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><Button type="submit" size="sm" variant="outline" className="h-9 rounded-sm"><Search className="size-4" />Lọc</Button></form>
              </CardHeader>
              <CardContent className="p-0">
                {filteredExpenses.length === 0 ? <div className="grid min-h-64 place-items-center px-6 text-center text-sm text-slate-500"><div><ReceiptText className="mx-auto mb-3 size-5" />Chưa có khoản chi phù hợp.</div></div> : <div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-slate-50"><TableHead className="pl-6">Ngày trả</TableHead><TableHead>Danh mục</TableHead><TableHead>Cách xử lý</TableHead><TableHead>Mô tả</TableHead><TableHead>Số lượng</TableHead><TableHead className="text-right">Đơn giá</TableHead><TableHead className="text-right">Số tiền</TableHead><TableHead className="pr-6"></TableHead></TableRow></TableHeader><TableBody>{filteredExpenses.map((expense) => <TableRow className="h-20" key={expense.id}><TableCell className="pl-6 whitespace-nowrap">{new Date(`${expense.paid_on}T00:00:00`).toLocaleDateString("vi-VN")}</TableCell><TableCell className="font-medium">{expense.category?.name ?? "—"}</TableCell><TableCell><TreatmentBadge treatment={expense.treatment} /></TableCell><TableCell className="max-w-44 whitespace-normal">{expense.description ?? expense.reference_code ?? "—"}</TableCell><TableCell>{quantityLabel(expense)}</TableCell><TableCell className="text-right whitespace-nowrap">{referenceUnitPrice(expense)}</TableCell><TableCell className="text-right font-medium whitespace-nowrap">{currency.format(Number(expense.amount))}</TableCell><TableCell className="pr-6 text-right"><Link className="inline-flex size-8 items-center justify-center rounded-sm text-slate-600 hover:bg-slate-100" href={`/capital/${expense.id}`}><Pencil className="size-4" /><span className="sr-only">Sửa</span></Link></TableCell></TableRow>)}</TableBody></Table></div>}
              </CardContent>
              <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 text-xs text-slate-500"><span>{filteredExpenses.length} khoản chi hiển thị</span><span className="flex items-center gap-1">Bộ lọc <ChevronDown className="size-3" /></span></div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
