"use client";

import { useState } from "react";

const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

type CapitalExpenseQuantityFieldsProps = {
  initialAmount?: number | string | null;
  initialQuantity?: number | null;
  initialUnitLabel?: string | null;
};

export function CapitalExpenseQuantityFields({
  initialAmount = "",
  initialQuantity = null,
  initialUnitLabel = null,
}: CapitalExpenseQuantityFieldsProps) {
  const [amount, setAmount] = useState(String(initialAmount ?? ""));
  const [quantity, setQuantity] = useState(initialQuantity === null ? "" : String(initialQuantity));
  const [unitLabel, setUnitLabel] = useState(initialUnitLabel ?? "");
  const amountValue = Number(amount);
  const quantityValue = Number(quantity);
  const hasValidQuantity = Number.isInteger(quantityValue) && quantityValue > 0;
  const unitPrice = Number.isFinite(amountValue) && amountValue > 0 && hasValidQuantity ? amountValue / quantityValue : null;

  return <>
    <label className="grid gap-1 text-sm font-medium">Số tiền (VND)<input required name="amount" type="number" min="1" step="1" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} className="h-10 rounded-md border border-slate-300 bg-white px-3" /></label>
    <label className="grid gap-1 text-sm font-medium">Số lượng <span className="font-normal text-slate-500">(tùy chọn)</span><input name="quantity" type="number" min="1" step="1" inputMode="numeric" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="h-10 rounded-md border border-slate-300 bg-white px-3" /></label>
    <label className="grid gap-1 text-sm font-medium">Đơn vị tính <span className="font-normal text-slate-500">(tùy chọn, không quyết định số tháng sử dụng)</span><input name="unit_label" value={unitLabel} onChange={(event) => setUnitLabel(event.target.value)} disabled={!hasValidQuantity} className="h-10 rounded-md border border-slate-300 bg-white px-3 disabled:cursor-not-allowed disabled:bg-slate-100" placeholder="Ví dụ: túi" /></label>
    {unitPrice !== null ? <p className="text-sm text-slate-600 md:col-span-2">Đơn giá tham chiếu: <span className="font-medium text-slate-950">{currency.format(unitPrice)}{unitLabel.trim() ? `/${unitLabel.trim()}` : ""}</span></p> : null}
  </>;
}
