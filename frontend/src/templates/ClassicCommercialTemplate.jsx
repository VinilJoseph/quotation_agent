import { formatCurrency, formatDate } from './templateRegistry';

export default function ClassicCommercialTemplate({ quote, printMode = false }) {
  const items = quote.items || [];
  const total = quote.total || 0;
  const basePrice = quote.basePrice || 0;
  const discountAmount = quote.discountAmount || 0;
  const implFee = quote.implFee || 0;

  return (
    <div className={`template-document classic-theme ${printMode ? 'p-0 bg-white text-slate-900' : 'bg-white text-slate-900 rounded-[12px] p-6 sm:p-12 shadow-md border border-slate-300'} font-serif`}>
      {/* 1. Formal Letterhead Header */}
      <div className="text-center pb-6 border-b-2 border-slate-900">
        <h1 className="text-2xl font-bold tracking-wider uppercase text-slate-900">
          Pax Enterprise Systems Ltd.
        </h1>
        <p className="text-xs text-slate-600 font-sans tracking-wide mt-1">
          Level 14, Al Sila Tower · Abu Dhabi Global Market Square · Al Maryah Island · Abu Dhabi, UAE
        </p>
        <div className="text-[11px] text-slate-500 font-sans mt-0.5 space-x-3">
          <span>Registration No. 000003418</span>
          <span>·</span>
          <span>Tax Registration Number (TRN): 100482910000003</span>
          <span>·</span>
          <span>commercial@paxsystems.ae</span>
        </div>
      </div>

      {/* 2. Formal Letter Meta & Salutation Block */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans text-xs">
        <div>
          <span className="block font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-1">
            Recipient / Tenderer
          </span>
          <div className="text-sm font-bold text-slate-900 font-serif">
            {quote.client}
          </div>
          <div className="text-slate-700 mt-0.5">
            Attn: <strong>{quote.contact}</strong> (Procurement Directorate)
          </div>
          <div className="text-slate-600">
            Registered Tenant: {quote.city || 'United Arab Emirates'}
          </div>
          <div className="mt-2 text-slate-700">
            Pricing Category: <span className="font-semibold text-slate-900 font-mono">{quote.tier}</span>
          </div>
        </div>

        <div className="sm:text-right space-y-1">
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold">Document Reference: </span>
            <strong className="font-mono text-slate-900 text-sm">{quote.id}</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold">Date of Issuance: </span>
            <span className="text-slate-800">{formatDate(quote.date)}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold">Offer Expiry: </span>
            <span className="text-slate-800 font-semibold">{formatDate(quote.expiryDate)}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold">Offer Validity: </span>
            <span className="text-slate-800">{quote.expiryDays || 30} Calendar Days</span>
          </div>
        </div>
      </div>

      {/* Subject Line */}
      <div className="my-4 py-2 border-y border-slate-300 font-sans text-xs">
        <strong className="text-slate-900">SUBJECT: </strong>
        <span className="text-slate-800 font-medium">
          Formal Commercial Proposal & Tender Quotation for Pax Enterprise ERP Platform & Integrated Software Modules
        </span>
      </div>

      <p className="text-xs text-slate-700 leading-relaxed font-sans mb-4">
        Dear <strong>{quote.contact}</strong>, Pax Enterprise Systems Ltd. is pleased to submit this formal commercial quotation for the provision, licensing, and cloud onboarding of our enterprise software suite for <strong>{quote.client}</strong>. All rates reflect the agreed commercial terms under discount agreement <em>{quote.tier}</em>.
      </p>

      {/* 3. Formal Schedule of Supply Table */}
      <div className="my-6 font-sans">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          Schedule A: Commercial Scope & Fees
        </h4>

        <div className="overflow-x-auto border border-slate-300">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 text-[11px] font-bold">
                <th className="py-2.5 px-3">Item #</th>
                <th className="py-2.5 px-3">Scope Description</th>
                <th className="py-2.5 px-3">Billing Term</th>
                <th className="py-2.5 px-3 text-right">Standard Rate</th>
                <th className="py-2.5 px-3 text-right">Volume Discount</th>
                <th className="py-2.5 px-3 text-right">Net Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="py-2.5 px-3">
                    <strong className="text-slate-900 block">{item.name}</strong>
                    <span className="text-slate-500 text-[11px] block">{item.desc}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                    {item.term || 'Annual'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700 whitespace-nowrap">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono text-emerald-800 font-medium">
                    {item.discount > 0 ? `-${formatCurrency(item.discount)}` : '0.00'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(item.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Financial Total & Milestone Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 pt-2 font-sans text-xs items-start">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
          <h5 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
            Commercial Milestones & Payment Schedule
          </h5>
          <ol className="list-decimal pl-4 space-y-1 text-slate-700 text-[11px]">
            <li><strong>Initial Milestone (50%):</strong> Due upon Purchase Order issuance and cloud tenant initialization.</li>
            <li><strong>Completion Milestone (50%):</strong> Due upon final User Acceptance Testing (UAT) sign-off.</li>
            <li><strong>Payment Credit:</strong> Standard Net 30 days from official electronic invoice receipt.</li>
            <li><strong>Governing Law:</strong> This offer is governed by the laws and regulations of Abu Dhabi Global Market (ADGM).</li>
          </ol>
        </div>

        <div className="border border-slate-300 p-4 rounded space-y-2 bg-white">
          <div className="flex justify-between text-slate-600">
            <span>Gross Value of Software Modules:</span>
            <span className="font-mono">{formatCurrency(basePrice)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-800 font-semibold">
              <span>Client Tier Discount Applied:</span>
              <span className="font-mono">-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Implementation & Cloud Onboarding:</span>
            <span className="font-mono">{formatCurrency(implFee)}</span>
          </div>
          <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-baseline text-slate-950 font-bold">
            <span className="text-sm">Total Commercial Commitment (Year 1):</span>
            <span className="font-mono text-base font-bold text-slate-900">
              {formatCurrency(total)} USD
            </span>
          </div>
          <p className="text-[10px] text-slate-500 text-right mt-1">
            Subject to statutory UAE Value Added Tax (VAT 5%).
          </p>
        </div>
      </div>

      {/* 5. Formal Corporate Seal & Signatures */}
      <div className="mt-8 pt-6 border-t-2 border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-8 items-end font-sans text-xs">
        <div>
          <p className="text-slate-600 mb-2">Respectfully submitted on behalf of,</p>
          <p className="font-serif font-bold text-base text-slate-900">Pax Enterprise Systems Ltd.</p>
          <div className="h-10 flex items-center">
            <span className="font-serif italic text-lg text-slate-800">
              Jordan Davis
            </span>
          </div>
          <div className="border-t border-slate-400 pt-1 text-slate-700">
            <p className="font-semibold text-slate-900">Jordan Davis</p>
            <p className="text-slate-500 text-[11px]">Director of Commercial Operations · Pax Enterprise Systems</p>
          </div>
        </div>

        <div className="flex sm:justify-end">
          <div className="border border-slate-400 p-3 rounded text-center w-52 bg-slate-50">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              PAX CORPORATE SEAL
            </div>
            <div className="my-1 font-serif text-xs font-bold text-slate-900">
              ADGM REGISTERED
            </div>
            <div className="text-[9px] font-mono text-slate-500">
              REF: {quote.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
