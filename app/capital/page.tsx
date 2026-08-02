import Link from "next/link";
import { Archive, ChartNoAxesCombined, CircleDollarSign, Pencil, Plus, ReceiptText } from "lucide-react";

import { archiveCapitalCategory, createCapitalCategory, createCapitalExpense } from "@/app/capital/actions";
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
  const variant = treatment === "depreciable_asset" ? "default" : "secondary";
  return <Badge variant={variant}>{capitalTreatmentLabel[treatment]}</Badge>;
}

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
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
        <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-7 md:flex-row md:items-end">
          <div>
            <Link className="text-sm font-medium text-slate-500 hover:text-slate-950" href="/">← Tổng quan</Link>
            <p className="mt-5 text-sm font-medium text-amber-700">Tiền đã thanh toán</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Chi vốn</h1>
            <p className="mt-2 text-sm text-slate-500">Theo dõi dòng tiền đã chi và chi phí được ghi nhận theo kỳ.</p>
          </div>
          <form className="flex items-end gap-2" action="/capital" method="get">
            <label className="grid gap-1 text-sm font-medium text-slate-600">Kỳ báo cáo
              <input className="h-10 rounded-md border border-slate-300 bg-white px-3" type="month" name="month" defaultValue={month} />
            </label>
            <Button type="submit" variant="outline">Xem kỳ</Button>
          </form>
        </header>

        <section className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-0 bg-slate-950 text-white"><CardHeader><CardDescription className="text-slate-400">Tiền đã chi · {monthName(month)}</CardDescription><CardTitle className="text-2xl">{currency.format(summary.cashSpent)}</CardTitle></CardHeader><CardContent className="flex gap-2 text-sm text-slate-300"><CircleDollarSign className="size-4" /> Mọi khoản đã thanh toán</CardContent></Card>
          <Card><CardHeader><CardDescription>Vốn nhập hàng</CardDescription><CardTitle className="text-2xl">{currency.format(summary.inventoryCapital)}</CardTitle></CardHeader><CardContent className="text-sm text-slate-500">Chưa phải giá vốn trong MVP</CardContent></Card>
          <Card><CardHeader><CardDescription>Khấu hao</CardDescription><CardTitle className="text-2xl">{currency.format(summary.depreciation)}</CardTitle></CardHeader><CardContent className="text-sm text-slate-500">Phân bổ đều theo tháng</CardContent></Card>
          <Card className="bg-amber-50"><CardHeader><CardDescription>Chi phí kỳ</CardDescription><CardTitle className="text-2xl">{currency.format(summary.periodExpense)}</CardTitle></CardHeader><CardContent className="flex gap-2 text-sm text-slate-600"><ChartNoAxesCombined className="size-4" /> Chi phí ngay + khấu hao</CardContent></Card>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <Card>
            <CardHeader><CardTitle>Ghi khoản chi</CardTitle><CardDescription>Mỗi bản ghi là tiền đã trả thực tế.</CardDescription></CardHeader>
            <CardContent>
              {categories.length === 0 ? <p className="rounded-md bg-amber-50 p-4 text-sm text-amber-900">Tạo ít nhất một danh mục ở cột bên phải trước khi ghi khoản chi.</p> : (
                <form action={createCapitalExpense} className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1 text-sm font-medium">Danh mục<select required name="category_id" className="h-10 rounded-md border border-slate-300 bg-white px-3" defaultValue=""><option disabled value="">Chọn danh mục</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name} · {capitalTreatmentLabel[category.treatment]}</option>)}</select></label>
                  <label className="grid gap-1 text-sm font-medium">Ngày đã trả<input required name="paid_on" type="date" defaultValue={today} className="h-10 rounded-md border border-slate-300 bg-white px-3" /></label>
                  <label className="grid gap-1 text-sm font-medium">Số tiền (VND)<input required name="amount" type="number" min="1" step="1" inputMode="decimal" className="h-10 rounded-md border border-slate-300 bg-white px-3" /></label>
                  <label className="grid gap-1 text-sm font-medium">Số tháng sử dụng <span className="font-normal text-slate-500">(chỉ tài sản)</span><input name="useful_life_months" type="number" min="1" step="1" className="h-10 rounded-md border border-slate-300 bg-white px-3" /></label>
                  <label className="grid gap-1 text-sm font-medium md:col-span-2">Mô tả<input name="description" className="h-10 rounded-md border border-slate-300 bg-white px-3" placeholder="Ví dụ: Nhập lô hàng tháng 7" /></label>
                  <label className="grid gap-1 text-sm font-medium">Mã chứng từ <span className="font-normal text-slate-500">(tùy chọn)</span><input name="reference_code" className="h-10 rounded-md border border-slate-300 bg-white px-3" /></label>
                  <div className="flex items-end"><Button className="w-full" type="submit"><Plus /> Lưu khoản chi</Button></div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Danh mục chi</CardTitle><CardDescription>Danh mục quyết định cách tính báo cáo.</CardDescription></CardHeader>
            <CardContent>
              <form action={createCapitalCategory} className="grid gap-3">
                <input required name="name" className="h-10 rounded-md border border-slate-300 bg-white px-3" placeholder="Tên danh mục, ví dụ: Bao bì" />
                <select required name="treatment" defaultValue="immediate_expense" className="h-10 rounded-md border border-slate-300 bg-white px-3">
                  {(Object.entries(capitalTreatmentLabel) as [CapitalTreatment, string][]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <Button type="submit" variant="outline"><Plus /> Tạo danh mục</Button>
              </form>
              <div className="mt-5 space-y-2">
                {allCategories.length === 0 ? <p className="text-sm text-slate-500">Chưa có danh mục.</p> : allCategories.map((category) => <div key={category.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3"><div><p className="text-sm font-medium">{category.name}</p><TreatmentBadge treatment={category.treatment} /></div>{category.is_active ? <form action={archiveCapitalCategory}><input type="hidden" name="id" value={category.id} /><Button type="submit" size="sm" variant="ghost" title="Ngừng sử dụng"><Archive /></Button></form> : <Badge variant="outline">Đã ngừng</Badge>}</div>)}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8"><Card><CardHeader><CardTitle>Khoản chi gần đây</CardTitle><CardDescription>Sửa khoản chi sẽ lưu lịch sử giá trị trước và sau.</CardDescription><form action="/capital" method="get" className="mt-3 flex flex-wrap gap-2"><input type="hidden" name="month" value={month} /><select name="category" defaultValue={selectedCategory} className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm"><option value="">Mọi danh mục</option>{allCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><select name="treatment" defaultValue={selectedTreatment} className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm"><option value="">Mọi cách xử lý</option>{(Object.entries(capitalTreatmentLabel) as [CapitalTreatment, string][]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><Button type="submit" size="sm" variant="outline">Lọc</Button></form></CardHeader><CardContent className="px-0">
          {filteredExpenses.length === 0 ? <div className="grid min-h-40 place-items-center px-6 text-center text-sm text-slate-500"><ReceiptText className="mb-2 size-5" />Chưa có khoản chi phù hợp.</div> : <Table><TableHeader><TableRow><TableHead className="pl-6">Ngày trả</TableHead><TableHead>Danh mục</TableHead><TableHead>Cách xử lý</TableHead><TableHead>Mô tả</TableHead><TableHead className="text-right">Số tiền</TableHead><TableHead className="pr-6"></TableHead></TableRow></TableHeader><TableBody>{filteredExpenses.map((expense) => <TableRow key={expense.id}><TableCell className="pl-6">{new Date(`${expense.paid_on}T00:00:00`).toLocaleDateString("vi-VN")}</TableCell><TableCell className="font-medium">{expense.category?.name ?? "—"}</TableCell><TableCell><TreatmentBadge treatment={expense.treatment} /></TableCell><TableCell>{expense.description ?? expense.reference_code ?? "—"}</TableCell><TableCell className="text-right font-medium">{currency.format(Number(expense.amount))}</TableCell><TableCell className="pr-6 text-right"><Link className="inline-flex h-7 items-center rounded-md px-2 text-slate-600 hover:bg-slate-100" href={`/capital/${expense.id}`}><Pencil className="size-4" /> <span className="sr-only">Sửa</span></Link></TableCell></TableRow>)}</TableBody></Table>}
        </CardContent></Card></section>
      </div>
    </main>
  );
}
