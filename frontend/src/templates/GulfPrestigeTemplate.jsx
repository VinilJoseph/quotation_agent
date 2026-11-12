import { formatCurrency, formatDate } from './templateRegistry';

export default function GulfPrestigeTemplate({ quote, printMode = false }) {
  const items = quote.items || [];
  const total = quote.total || 0;
  const basePrice = quote.basePrice || 0;
  const discountAmount = quote.discountAmount || 0;
  const implFee = quote.implFee || 0;

  return (
    <div className={`template-document prestige-theme ${printMode ? 'p-0 bg-white text-slate-900' : 'bg-white text-slate-900 rounded-[12px] p-6 sm:p-10 shadow-xl border-2 border-amber-600/30'} font-sans relative`}>
      {/* Decorative Gold Header Top Accent */}
      <div className="h-2 bg-gradient-to-r from-emerald-800 via-amber-500 to-emerald-800 -mt-6 sm:-mt-10 -mx-6 sm:-mx-10 rounded-t-[10px] mb-6"></div>

      {/* 1. Header Bar with Bilingual Branding */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-amber-200">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-emerald-900 border border-amber-400 flex items-center justify-center text-amber-300 font-bold text-sm shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-emerald-950 tracking-tight">
                PAX ENTERPRISE SYSTEMS
              </h1>
              <p className="text-xs text-amber-800 font-medium">
                باكس لأنظمة المؤسسات · Commercial Enterprise Directorate
              </p>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
            <p>UAE Federal Tax Registration (TRN): <strong>100482910000003</strong></p>
            <p>Commercial License No: CN-1092837 · Abu Dhabi / Dubai HQ</p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="inline-block px-3 py-1 rounded bg-emerald-900 text-amber-300 border border-amber-500/40 text-[11px] font-medium tracking-wide">
            وثيقة تجارية رسمية · OFFICIAL COMMERCIAL QUOTE
          </div>
          <div className="font-serif text-2xl font-bold text-emerald-950 mt-2">
            عـرض أسـعـار تـجـاري
          </div>
          <div className="font-mono text-xs text-slate-700 mt-1">
            Reference / المرجع: <strong className="text-emerald-900">{quote.id}</strong>
          </div>
        </div>
      </div>

      {/* 2. Enterprise Client Protocol Banner */}
      <div className="my-6 p-4 rounded-xl bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/50 border border-emerald-200 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">
              جهة التعاقد المعتمدة · Client Organization
            </span>
            <h3 className="text-lg font-bold text-emerald-950 leading-snug">
              {quote.client}
            </h3>
            <p className="text-slate-700 mt-1">
              Authorized Representative: <strong className="text-emerald-950">{quote.contact}</strong>
            </p>
            <p className="text-slate-600">
              Tenant Jurisdiction: {quote.city || 'United Arab Emirates'} (Sovereign Cloud)
            </p>
          </div>

          <div className="border-t md:border-t-0 md:border-l md:pl-4 border-emerald-200/60 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Date of Issue</span>
                <span className="font-semibold text-slate-800">{formatDate(quote.date)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Expiry Date</span>
                <span className="font-semibold text-slate-800">{formatDate(quote.expiryDate)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Payment Terms</span>
                <span className="font-semibold text-emerald-900">Net 30 Days Electronic</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Pricing Agreement</span>
                <span className="font-bold text-amber-800 font-mono">{quote.tier}</span>
              </div>
            </div>

            <div className="mt-2 text-[11px] text-emerald-800 font-medium">
              ★ Enterprise Partner Level: Approved for UAE Sovereign Government Tender
            </div>
          </div>
        </div>
      </div>

      {/* 3. Line Items Schedule */}
      <div className="my-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
            جدول الأسعار والخدمات · Commercial Fee Schedule
          </h4>
          <span className="text-[10px] font-mono text-slate-500">Currency: USD / AED Pegged</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-emerald-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-900 text-white uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3 font-semibold">SKU / البند</th>
                <th className="py-3 px-3 font-semibold">Description / المواصفات والحلول</th>
                <th className="py-3 px-3 font-semibold">Period</th>
                <th className="py-3 px-3 font-semibold text-right">List Price</th>
                <th className="py-3 px-3 font-semibold text-right">Discount</th>
                <th className="py-3 px-3 font-semibold text-right text-amber-300">Net Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              {items.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30'}>
                  <td className="py-3 px-3 font-mono font-semibold text-emerald-950 whitespace-nowrap">
                    {item.sku || `MOD-0${idx + 1}`}
                  </td>
                  <td className="py-3 px-3">
                    <strong className="text-emerald-950 block">{item.name}</strong>
                    <span className="text-slate-600 text-[11px] block mt-0.5">{item.desc}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-medium">
                    {item.term || 'Annual'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 whitespace-nowrap">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap font-mono text-emerald-700 font-bold">
                    {item.discount > 0 ? `-${formatCurrency(item.discount)}` : '—'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-950 whitespace-nowrap">
                    {formatCurrency(item.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Financial Summary & Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 pt-4 border-t border-amber-200 items-start">
        <div className="text-xs text-slate-700 space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <h5 className="font-bold text-emerald-950 uppercase tracking-wider text-[11px]">
            Sovereign Guarantees & SLA Compliance
          </h5>
          <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
            <li><strong>UAE In-Country Data Residency:</strong> Sovereign data centers hosted in Abu Dhabi & Dubai regions.</li>
            <li><strong>WPS & MoHRE Certified:</strong> Fully compliant with UAE Ministry of Human Resources WPS wage protocols.</li>
            <li><strong>High-Availability SLA:</strong> 99.99% service uptime backed by platinum engineering pod.</li>
            <li><strong>Payment Milestones:</strong> Standard Net 30 days upon delivery of official electronic tax invoice.</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-xl p-5 shadow-md space-y-2.5 text-xs">
          <div className="flex justify-between text-emerald-200">
            <span>List Commercial Subtotal:</span>
            <span className="font-mono">{formatCurrency(basePrice)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-amber-300 font-medium">
              <span>Preferential Enterprise Discount ({quote.tier?.split('-')[1]?.trim() || 'Tiered'}):</span>
              <span className="font-mono">-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-emerald-200">
            <span>Dedicated Cloud Provisioning & Setup:</span>
            <span className="font-mono">{formatCurrency(implFee)}</span>
          </div>

          <div className="pt-3 border-t border-emerald-700/80 flex justify-between items-baseline">
            <div>
              <span className="block font-bold text-sm text-white">إجمالي الاستثمار · Net Year 1 Investment</span>
              <span className="text-[10px] text-emerald-300">Includes core license + UAE compliance setup</span>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-xl text-amber-300">
                {formatCurrency(total)}
              </span>
              <span className="block text-[10px] text-emerald-300 font-mono">USD Net Payable</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Official Bilateral Seal & Dual Signatory Block */}
      <div className="mt-8 pt-6 border-t border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        <div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Pax Commercial Authority
          </span>
          <div className="h-10 flex items-center">
            <span className="font-serif italic text-lg text-emerald-950 font-bold">
              Jordan Davis
            </span>
          </div>
          <div className="border-t border-slate-300 pt-1 text-xs">
            <p className="font-semibold text-slate-800">Director of Enterprise Solutions</p>
            <p className="text-slate-500 text-[11px]">Pax Enterprise Systems Ltd.</p>
          </div>
        </div>

        {/* Circular Official Emerald & Gold Seal Graphic */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-600 bg-emerald-50 p-1 flex flex-col items-center justify-center text-center shadow-inner">
            <div className="w-full h-full rounded-full border border-emerald-700 flex flex-col items-center justify-center text-[8px] font-mono font-bold text-emerald-900 leading-tight">
              <span>★ PAX UAE ★</span>
              <span className="text-[9px] text-amber-700 my-0.5">معتمد رسمياً</span>
              <span>CERTIFIED</span>
              <span className="text-[7px] text-slate-500">2026</span>
            </div>
          </div>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Client Acceptance & PO Sign-off
          </span>
          <div className="h-10 border-b border-dashed border-slate-400 flex items-end pb-1 text-slate-400 text-xs italic">
            Authorized Signatory Stamp Here
          </div>
          <div className="pt-1 text-xs">
            <p className="font-semibold text-slate-800">{quote.contact}</p>
            <p className="text-slate-500 text-[11px]">{quote.client}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
