import { formatCurrency, formatDate } from './templateRegistry';

export default function ExecutiveTemplate({ quote, printMode = false }) {
  const items = quote.items || [];
  const total = quote.total || 0;
  const basePrice = quote.basePrice || 0;
  const discountAmount = quote.discountAmount || 0;
  const implFee = quote.implFee || 0;

  return (
    <div className={`template-document executive-theme ${printMode ? 'p-0 bg-white text-slate-900' : 'bg-white text-slate-900 rounded-[12px] p-6 sm:p-10 shadow-lg border border-slate-200'} font-sans`}>
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded bg-slate-900 text-white font-bold flex items-center justify-center text-xs tracking-wider">
              PAX
            </span>
            <span className="font-semibold text-lg tracking-tight text-slate-900">
              Pax Enterprise Systems Ltd.
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Commercial Systems Division · Abu Dhabi Global Market (ADGM)
          </p>
          <p className="text-xs text-slate-400">
            TRN: 100482910000003 · License: CN-1092837
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
            {quote.status || 'Approved Commercial Proposal'}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            COMMERCIAL QUOTATION
          </h2>
          <div className="font-mono text-xs text-slate-600 mt-1">
            Ref: <strong className="text-slate-900">{quote.id}</strong>
          </div>
        </div>
      </div>

      {/* 2. Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
        <div>
          <span className="block font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
            Client Organization
          </span>
          <h3 className="text-base font-bold text-slate-900 leading-tight">
            {quote.client}
          </h3>
          <p className="text-slate-600 mt-1">
            Primary Contact: <strong className="text-slate-800">{quote.contact}</strong>
          </p>
          <p className="text-slate-500">
            Region / Tenant: {quote.city || 'United Arab Emirates'}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-medium">
            <span>Client Discount Tier:</span>
            <strong>{quote.tier}</strong>
          </div>
        </div>

        <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l md:pl-6 border-slate-200 pt-3 md:pt-0">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Date of Issuance
              </span>
              <span className="text-slate-800 font-medium">
                {formatDate(quote.date)}
              </span>
            </div>
            <div>
              <span className="block font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Valid Until
              </span>
              <span className="text-slate-800 font-medium">
                {formatDate(quote.expiryDate)}
              </span>
            </div>
            <div>
              <span className="block font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Payment Terms
              </span>
              <span className="text-slate-800 font-medium">
                Net 30 Days Electronic
              </span>
            </div>
            <div>
              <span className="block font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Validity Window
              </span>
              <span className="text-emerald-700 font-semibold">
                {quote.expiryDays || 30} Days Guaranteed
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Account Executive: <strong>Jordan Davis</strong> (Enterprise Solutions)
          </div>
        </div>
      </div>

      {/* 3. Line Items Schedule */}
      <div className="my-6">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          1. Schedule of Software Modules & Professional Services
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-800 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3 font-bold">SKU / Item</th>
                <th className="py-2.5 px-3 font-bold">Scope & Description</th>
                <th className="py-2.5 px-3 font-bold">Term</th>
                <th className="py-2.5 px-3 font-bold text-right">Standard Rate</th>
                <th className="py-2.5 px-3 font-bold text-right">Tier Discount</th>
                <th className="py-2.5 px-3 font-bold text-right">Net Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900 whitespace-nowrap">
                    {item.sku || `MOD-0${idx + 1}`}
                  </td>
                  <td className="py-3 px-3">
                    <strong className="text-slate-900 block">{item.name}</strong>
                    <span className="text-slate-500 text-[11px] block mt-0.5">{item.desc}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                    {item.term || 'Annual'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 whitespace-nowrap">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap font-mono text-emerald-700 font-medium">
                    {item.discount > 0 ? `-${formatCurrency(item.discount)}` : '—'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(item.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Financial Summary Cards */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 my-6 pt-4 border-t border-slate-200">
        <div className="w-full sm:max-w-[55%] text-xs text-slate-600 space-y-2">
          <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
            Commercial Terms & Service Guarantees
          </h5>
          <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
            <li><strong>Support SLA:</strong> 24/7 dedicated enterprise response team with 99.95% uptime.</li>
            <li><strong>Data Sovereignty:</strong> In-country UAE hosting complying with TDRA cloud standards.</li>
            <li><strong>Deployment Turnaround:</strong> Dedicated tenant credentials issued within 48 hours.</li>
            <li><strong>Invoicing:</strong> Annual billing in advance; Net 30 days from electronic receipt.</li>
          </ul>
        </div>

        <div className="w-full sm:w-72 bg-slate-50 border border-slate-300 rounded-lg p-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Gross Modules Subtotal:</span>
            <span className="font-mono">{formatCurrency(basePrice)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Client Tier Discount ({quote.tier?.split('-')[1]?.trim() || 'Applied'}):</span>
              <span className="font-mono">-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Implementation & Setup:</span>
            <span className="font-mono">{formatCurrency(implFee)}</span>
          </div>
          <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-baseline text-slate-900">
            <span className="font-bold text-sm">Total Year 1 Investment:</span>
            <span className="font-mono font-bold text-base text-slate-900">
              {formatCurrency(total)}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 text-right mt-1">
            All prices quoted in USD. UAE VAT (5%) applicable where statutory.
          </p>
        </div>
      </div>

      {/* 5. Authorization & Sign-off Stamp */}
      <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
        <div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Authorized Corporate Signatory
          </span>
          <div className="h-12 flex items-center">
            <span className="font-serif italic text-xl text-slate-800 tracking-wide">
              Jordan Davis
            </span>
          </div>
          <div className="border-t border-slate-400 pt-1 text-xs">
            <p className="font-semibold text-slate-800">Jordan Davis</p>
            <p className="text-slate-500 text-[11px]">Head of Enterprise Solutions · Pax Enterprise Systems Ltd.</p>
          </div>
        </div>

        <div className="flex sm:justify-end">
          <div className="p-3 border-2 border-slate-800 rounded-lg bg-slate-50 max-w-[260px] text-center">
            <div className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">
              SECURITY VERIFIED ISSUANCE
            </div>
            <div className="my-1 text-xs font-bold font-mono text-slate-900">
              LEVEL 3 COMMERCIAL SIGN-OFF
            </div>
            <div className="text-[9px] font-mono text-emerald-700">
              STAMP REF: {quote.id}-AUTH-OK
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
