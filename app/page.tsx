import Link from "next/link";
import {
  Bell,
  ChartNoAxesCombined,
  ChevronRight,
  CircleDollarSign,
  FileSpreadsheet,
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings,
  ShoppingBag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRecentOrders, getRevenueSummary } from "@/lib/orders/queries";

export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

const marketplaceLabel = {
  shopee: "Shopee",
  tiktok_shop: "TikTok Shop",
} as const;

const metricCardClassName = "rounded-lg border-[#c6c6cd] shadow-[0_1px_1px_rgba(0,0,0,0.05)]";

export default async function Home() {
  const [orders, revenue] = await Promise.all([getRecentOrders(), getRevenueSummary()]);

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[280px] border-r border-slate-200 bg-white px-6 py-6 lg:flex lg:flex-col">
        <Link className="flex items-center gap-4" href="/"><div className="grid size-10 place-items-center rounded-md bg-[#0051d5] text-sm font-bold text-white">M</div><div><p className="text-lg font-semibold leading-6 tracking-tight">Meowzyy ERP</p><p className="text-xs text-slate-500">Bán hàng đa sàn</p></div></Link>
        <nav className="mt-8 space-y-3 text-sm font-medium">
          <Link aria-current="page" className="flex h-11 items-center gap-4 rounded-sm bg-[#e8f0ff] px-4 text-[#0051d5]" href="/"><LayoutDashboard className="size-[18px]" />Tổng quan</Link>
          <span className="flex h-11 items-center gap-4 rounded-sm px-4 text-slate-400"><ReceiptText className="size-[18px]" />Đơn hàng</span>
          <span className="flex h-11 items-center gap-4 rounded-sm px-4 text-slate-400"><Package className="size-[18px]" />Sản phẩm</span>
          <span className="flex h-11 items-center gap-4 rounded-sm px-4 text-slate-400"><ChartNoAxesCombined className="size-[18px]" />Báo cáo</span>
          <Link className="flex h-11 items-center gap-4 rounded-sm px-4 text-slate-600 hover:bg-slate-50" href="/capital"><CircleDollarSign className="size-[18px]" />Chi vốn</Link>
        </nav>
        <div className="mt-auto border-t border-slate-100 pt-5"><span className="flex h-10 items-center gap-4 px-4 text-sm font-medium text-slate-500"><Settings className="size-[18px]" />Cài đặt</span></div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8"><div className="flex items-center gap-3 lg:hidden"><div className="grid size-8 place-items-center rounded bg-[#0051d5] text-xs font-bold text-white">M</div><p className="font-semibold">Meowzyy ERP</p></div><p className="hidden text-sm text-slate-500 lg:block">Quản lý vận hành</p><div className="flex items-center gap-4 text-slate-500"><Bell className="size-5" /><div className="grid size-8 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">M</div></div></header>

        <div className="mx-auto max-w-[1440px] p-5 md:p-8">
          <header><h1 className="text-2xl font-semibold tracking-tight">Tổng quan</h1><p className="mt-1 text-sm text-[#45464d]">Tổng hợp tiền sàn chuyển và đơn hoàn tất trên các sàn.</p></header>

          <section className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <Card className={metricCardClassName}><CardHeader className="p-[18px] pb-2"><div className="flex items-center justify-between"><CardDescription className="text-xs font-semibold uppercase tracking-[0.06em] text-[#45464d]">Tiền sàn chuyển</CardDescription><CircleDollarSign className="size-5 text-[#0051d5]" /></div><CardTitle className="pt-3 text-3xl font-bold tracking-tight">{currency.format(revenue.payout)}</CardTitle></CardHeader><CardContent className="p-[18px] pt-1"><p className="inline-flex rounded-sm bg-[#eff4ff] px-2 py-1 text-xs font-semibold text-[#0051d5]">Đơn hoàn tất</p></CardContent></Card>
            <Card className={metricCardClassName}><CardHeader className="p-[18px] pb-2"><div className="flex items-center justify-between"><CardDescription className="text-xs font-semibold uppercase tracking-[0.06em] text-[#45464d]">Đơn hoàn tất</CardDescription><ShoppingBag className="size-5 text-[#0051d5]" /></div><CardTitle className="pt-3 text-3xl font-bold tracking-tight">{revenue.completedOrderCount}</CardTitle></CardHeader><CardContent className="p-[18px] pt-1"><p className="inline-flex rounded-sm bg-[#eff4ff] px-2 py-1 text-xs font-semibold text-[#0051d5]">Shopee + TikTok Shop</p></CardContent></Card>
            <Card className={metricCardClassName}><CardHeader className="p-[18px] pb-2"><div className="flex items-center justify-between"><CardDescription className="text-xs font-semibold uppercase tracking-[0.06em] text-[#45464d]">Nguồn dữ liệu</CardDescription><FileSpreadsheet className="size-5 text-slate-500" /></div><CardTitle className="pt-3 text-xl font-semibold tracking-tight">Chờ import</CardTitle></CardHeader><CardContent className="p-[18px] pt-1"><p className="inline-flex rounded-sm bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">File mẫu chưa xác minh</p></CardContent></Card>
            <Card className={metricCardClassName}><CardHeader className="p-[18px] pb-2"><div className="flex items-center justify-between"><CardDescription className="text-xs font-semibold uppercase tracking-[0.06em] text-[#45464d]">Báo cáo chi tiết</CardDescription><ChartNoAxesCombined className="size-5 text-slate-500" /></div><CardTitle className="pt-3 text-xl font-semibold tracking-tight">Chưa thiết lập</CardTitle></CardHeader><CardContent className="p-[18px] pt-1"><p className="inline-flex rounded-sm bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">Theo ngày · sàn · SKU</p></CardContent></Card>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            <Card className={`xl:col-span-2 ${metricCardClassName}`}><CardHeader className="flex-row items-center justify-between p-6"><div><CardTitle className="text-xl">Tiền sàn chuyển</CardTitle><CardDescription className="mt-1">Phân rã theo ngày và sàn sẽ có sau khi import được xác minh.</CardDescription></div><Badge variant="outline" className="border-[#c6c6cd] bg-[#f8f9ff] text-slate-600">MVP</Badge></CardHeader><CardContent className="p-6 pt-0"><div className="grid min-h-64 place-items-center border-b border-l border-dashed border-[#c6c6cd] text-center"><div><ChartNoAxesCombined className="mx-auto size-8 text-slate-300" /><p className="mt-3 text-sm font-medium text-slate-700">Chưa có dữ liệu biểu đồ</p><p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">Không dùng số liệu Revenue, Cost, Profit hoặc ROI mẫu từ Figma vì các chỉ số này chưa thuộc scope MVP.</p></div></div></CardContent></Card>
            <Card className={metricCardClassName}><CardHeader className="p-6"><div className="grid size-10 place-items-center rounded-md bg-[#eff4ff]"><FileSpreadsheet className="size-5 text-[#0051d5]" /></div><CardTitle className="mt-4 text-xl">Bước tiếp theo</CardTitle><CardDescription className="mt-1 leading-6">Xác minh file export từ Shopee và TikTok Shop trước khi bật import.</CardDescription></CardHeader><CardContent className="p-6 pt-0"><ul className="space-y-3 text-sm text-slate-700"><li className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#0051d5]" />Mapping cột và định dạng dữ liệu</li><li className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#0051d5]" />Trạng thái được tính hoàn tất</li><li className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#0051d5]" />Tiền sàn chuyển theo từng đơn</li></ul><Button disabled variant="outline" className="mt-6 w-full rounded-sm">Import Excel <ChevronRight className="size-4" /></Button></CardContent></Card>
          </section>

          <section className={`mt-6 ${metricCardClassName} rounded-lg bg-white`}><CardHeader className="border-b border-slate-200 p-6"><CardTitle className="text-xl">Đơn hàng mới cập nhật</CardTitle><CardDescription className="mt-1">Danh sách được cập nhật sau mỗi lần import.</CardDescription></CardHeader><CardContent className="p-0">{orders.length === 0 ? <div className="grid min-h-64 place-items-center px-6 text-center"><div><ReceiptText className="mx-auto size-8 text-slate-300" /><p className="mt-3 font-medium">Chưa có đơn hàng</p><p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">Dữ liệu sẽ xuất hiện sau khi phần import Excel được hoàn tất.</p></div></div> : <div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-slate-50"><TableHead className="pl-6">Sàn</TableHead><TableHead>Mã đơn</TableHead><TableHead>Trạng thái</TableHead><TableHead>Hoàn tất</TableHead><TableHead className="pr-6 text-right">Tiền sàn chuyển</TableHead></TableRow></TableHeader><TableBody>{orders.map((order) => <TableRow className="h-16" key={order.id}><TableCell className="pl-6 font-medium">{marketplaceLabel[order.marketplace]}</TableCell><TableCell>{order.marketplace_order_id}</TableCell><TableCell><Badge variant="secondary">{order.raw_status}</Badge></TableCell><TableCell>{order.completed_at ? new Date(order.completed_at).toLocaleDateString("vi-VN") : "—"}</TableCell><TableCell className="pr-6 text-right font-medium">{order.marketplace_payout === null ? "—" : currency.format(Number(order.marketplace_payout))}</TableCell></TableRow>)}</TableBody></Table></div>}</CardContent></section>
        </div>
      </div>
    </main>
  );
}
