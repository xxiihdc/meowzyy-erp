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

  const fieldClassName = "h-11 w-full rounded-sm border border-[#c6c6cd] bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0051d5] focus:ring-2 focus:ring-blue-100";

  return <>
    <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.06em] text-[#45464d]">Số tiền (VND)<input required name="amount" type="number" min="1" step="1" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} className={fieldClassName} /></label>
    <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.06em] text-[#45464d]">Số lượng <span className="normal-case font-normal tracking-normal text-slate-500">(tùy chọn)</span><input name="quantity" type="number" min="1" step="1" inputMode="numeric" value={quantity} onChange={(event) => setQuantity(event.target.value)} className={fieldClassName} /></label>
    <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.06em] text-[#45464d]">Đơn vị tính <span className="normal-case font-normal tracking-normal text-slate-500">(tùy chọn)</span><input name="unit_label" value={unitLabel} onChange={(event) => setUnitLabel(event.target.value)} disabled={!hasValidQuantity} className={`${fieldClassName} disabled:cursor-not-allowed disabled:bg-slate-100`} placeholder="Ví dụ: túi" /></label>
    {unitPrice !== null ? <p className="text-xs text-slate-600">Đơn giá tham chiếu: <span className="font-semibold text-slate-950">{currency.format(unitPrice)}{unitLabel.trim() ? `/${unitLabel.trim()}` : ""}</span></p> : null}
  </>;
}
