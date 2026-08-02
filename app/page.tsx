import {
  ArrowUpRight,
  CalendarDays,
  ChartNoAxesCombined,
  CircleDollarSign,
  FileSpreadsheet,
  LayoutDashboard,
  Package,
  ReceiptText,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRecentOrders, getRevenueSummary } from "@/lib/orders/queries";

export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const marketplaceLabel = {
  shopee: "Shopee",
  tiktok_shop: "TikTok Shop",
} as const;

const navigation = [
  { label: "Tổng quan", icon: LayoutDashboard, active: true, href: "/" },
  { label: "Đơn hàng", icon: ReceiptText },
  { label: "Sản phẩm", icon: Package },
  { label: "Báo cáo", icon: ChartNoAxesCombined },
  { label: "Chi vốn", icon: CircleDollarSign, href: "/capital" },
];

export default async function Home() {
  const [orders, revenue] = await Promise.all([getRecentOrders(), getRevenueSummary()]);

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-5 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="grid size-9 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white">M</div>
            <div>
              <p className="font-semibold tracking-tight">Meowzyy ERP</p>
              <p className="text-xs text-slate-500">Bán hàng đa sàn</p>
            </div>
          </div>
          <nav className="mt-10 space-y-1">
            {navigation.map(({ label, icon: Icon, active, href }) => (
              href ? <Link href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${active ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"}`} key={label}>
                <Icon className="size-4" />{label}
              </Link> : <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500" key={label}>
                <Icon className="size-4" />{label}
              </div>
            ))}
          </nav>
          <div className="mt-auto rounded-xl bg-amber-50 p-4">
            <FileSpreadsheet className="size-5 text-amber-700" />
            <p className="mt-3 text-sm font-medium">Import Excel</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">Đang chờ xác minh file mẫu từ các sàn.</p>
            <Badge className="mt-3" variant="outline">Pending</Badge>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 md:px-10">
            <div className="lg:hidden"><p className="font-semibold">Meowzyy ERP</p><p className="text-xs text-slate-500">Tổng quan</p></div>
            <div className="hidden lg:block"><p className="text-sm text-slate-500">Xin chào,</p><p className="font-semibold">Tổng quan vận hành</p></div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="hidden sm:inline-flex">MVP · Nội bộ</Badge>
              <div className="grid size-9 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">M</div>
            </div>
          </header>

          <div className="p-6 md:p-10">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-medium text-amber-700">Doanh thu đã hoàn tất</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight">Bức tranh bán hàng</h1>
                <p className="mt-2 text-sm text-slate-500">Theo tiền sàn chuyển và ngày hoàn tất đơn.</p>
              </div>
              <Button disabled size="lg" className="w-full md:w-auto"><FileSpreadsheet data-icon="inline-start" /> Import Excel <Badge variant="secondary">Sắp có</Badge></Button>
            </div>

            <section className="mt-8 grid gap-4 md:grid-cols-2">
              <Card className="border-0 bg-slate-950 text-white ring-0">
                <CardHeader>
                  <CardDescription className="text-slate-400">Tiền sàn chuyển</CardDescription>
                  <CardTitle className="text-3xl font-semibold tracking-tight">{currency.format(revenue.payout)}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-sm text-slate-300"><CircleDollarSign className="size-4" /> Chỉ tính đơn hoàn tất</CardContent>
              </Card>
              <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200">
                <CardHeader>
                  <CardDescription>Số đơn hoàn tất</CardDescription>
                  <CardTitle className="text-3xl font-semibold tracking-tight">{revenue.completedOrderCount}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-sm text-slate-500"><ShoppingBag className="size-4" /> Shopee và TikTok Shop</CardContent>
              </Card>
            </section>

            <section className="mt-8 grid gap-4 xl:grid-cols-[1.7fr_0.8fr]">
              <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle>Đơn hàng mới cập nhật</CardTitle>
                  <CardDescription>Danh sách sẽ được cập nhật sau mỗi lần import.</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  {orders.length === 0 ? (
                    <div className="grid min-h-56 place-items-center px-6 text-center">
                      <div><div className="mx-auto grid size-11 place-items-center rounded-full bg-slate-100"><ReceiptText className="size-5 text-slate-500" /></div><p className="mt-3 font-medium">Chưa có đơn hàng</p><p className="mt-1 max-w-xs text-sm text-slate-500">Dữ liệu sẽ xuất hiện ở đây sau khi phần import Excel được hoàn tất.</p></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader><TableRow><TableHead className="pl-6">Sàn</TableHead><TableHead>Mã đơn</TableHead><TableHead>Trạng thái</TableHead><TableHead>Hoàn tất</TableHead><TableHead className="pr-6 text-right">Tiền sàn chuyển</TableHead></TableRow></TableHeader>
                      <TableBody>{orders.map((order) => <TableRow key={order.id}><TableCell className="pl-6 font-medium">{marketplaceLabel[order.marketplace]}</TableCell><TableCell>{order.marketplace_order_id}</TableCell><TableCell><Badge variant="secondary">{order.raw_status}</Badge></TableCell><TableCell>{order.completed_at ? new Date(order.completed_at).toLocaleDateString("vi-VN") : "—"}</TableCell><TableCell className="pr-6 text-right font-medium">{order.marketplace_payout === null ? "—" : currency.format(Number(order.marketplace_payout))}</TableCell></TableRow>)}</TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 bg-amber-50 shadow-sm ring-1 ring-amber-200">
                <CardHeader><div className="flex size-10 items-center justify-center rounded-xl bg-amber-100"><CalendarDays className="size-5 text-amber-800" /></div><CardTitle className="mt-3">Bước tiếp theo</CardTitle><CardDescription className="leading-6 text-slate-600">Xác minh file export của Shopee và TikTok Shop trước khi bật import.</CardDescription></CardHeader>
                <CardContent><ul className="space-y-3 text-sm text-slate-700"><li className="flex gap-2"><span className="mt-1 size-1.5 rounded-full bg-amber-700" />Mapping cột và định dạng dữ liệu</li><li className="flex gap-2"><span className="mt-1 size-1.5 rounded-full bg-amber-700" />Trạng thái được tính hoàn tất</li><li className="flex gap-2"><span className="mt-1 size-1.5 rounded-full bg-amber-700" />Giá trị tiền sàn chuyển</li></ul><Button variant="outline" className="mt-6 w-full" disabled>Xem hướng dẫn <ArrowUpRight data-icon="inline-end" /></Button></CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
