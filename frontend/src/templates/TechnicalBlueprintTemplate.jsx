import { formatCurrency, formatDate } from './templateRegistry';

export default function TechnicalBlueprintTemplate({ quote, printMode = false }) {
  const items = quote.items || [];
  const total = quote.total || 0;
  const basePrice = quote.basePrice || 0;
  const discountAmount = quote.discountAmount || 0;
  const implFee = quote.implFee || 0;

  return (
    <div className={`template-document technical-theme ${printMode ? 'p-0 bg-white text-slate-900' : 'bg-white text-slate-900 rounded-[12px] p-6 sm:p-10 shadow-lg border border-sky-300'} font-mono`}>
      {/* 1. Technical Blueprint Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 text-[11px] font-bold">
              ENG-SPEC-2026
            </span>
            <span className="font-bold text-sm tracking-tight text-slate-900">
              PAX SYSTEMS // COMMERCIAL ARCHITECTURE SPEC
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            TENANT ENVIRONMENT: DEDICATED SOVEREIGN POD [AZ-UAE-NORTH-01]
          </p>
          <p className="text-[10px] text-slate-500">
            COMPUTE ENGINE: K8s ISOLATED NAMESPACE · ENCRYPTION: AES-256 GCM
          </p>
        </div>

        <div className="text-left sm:text-right text-xs">
          <div className="font-bold text-sky-900">
            SPEC ID: {quote.id}
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            CHECKSUM: <span className="font-bold text-slate-800">SHA256:7B94-E481-99C1</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            STATUS: <strong className="text-emerald-700">{quote.status || 'PROVISIONING_APPROVED'}</strong>
          </div>
        </div>
      </div>

      {/* 2. Client & Environment Matrix */}
      <div className="my-5 p-3.5 rounded bg-slate-50 border border-slate-300 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
          <div>
            <span className="text-slate-500 block uppercase text-[9px] font-bold">TARGET CLIENT</span>
            <strong className="text-slate-900 block truncate">{quote.client}</strong>
            <span className="text-slate-600 text-[10px]">{quote.contact}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase text-[9px] font-bold">DISCOUNT MATRIX</span>
            <strong className="text-sky-900 block">{quote.tier}</strong>
            <span className="text-slate-600 text-[10px]">Pre-Authorized Contract</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase text-[9px] font-bold">TIMESTAMP / VALIDITY</span>
            <span className="text-slate-800 block">{formatDate(quote.date)}</span>
            <span className="text-emerald-700 text-[10px]">T-Minus {quote.expiryDays || 30} Days</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase text-[9px] font-bold">SLA LEVEL</span>
            <strong className="text-slate-900 block">TIER 1 (99.95%)</strong>
            <span className="text-slate-600 text-[10px]">RTO &lt; 15m // RPO &lt; 5m</span>
          </div>
        </div>
      </div>

      {/* 3. Technical Bill of Materials (BOM) */}
      <div className="my-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
            // BILL OF MATERIALS (BOM) & LICENSING SCHEDULE
          </h4>
          <span className="text-[10px] text-slate-500">FORMAT: ISO-8601 USD PRICING</span>
        </div>

        <div className="overflow-x-auto border border-slate-300 rounded">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-100 text-[10px] uppercase">
                <th className="py-2.5 px-3">SKU CODE</th>
                <th className="py-2.5 px-3">TECHNICAL SPECIFICATION</th>
                <th className="py-2.5 px-3">DEPLOYMENT</th>
                <th className="py-2.5 px-3 text-right">LIST RATE</th>
                <th className="py-2.5 px-3 text-right">TIER ADJ.</th>
                <th className="py-2.5 px-3 text-right">NET PAYABLE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {items.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="py-2.5 px-3 font-bold text-sky-950 whitespace-nowrap">
                    {item.sku || `SKU-0${idx + 1}`}
                  </td>
                  <td className="py-2.5 px-3">
                    <strong className="text-slate-900 block">{item.name}</strong>
                    <span className="text-slate-500 text-[10px] block font-sans">{item.desc}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                    {item.term?.includes("Annual") ? "CLOUD-VPC/YR" : "SETUP-FLAT"}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap text-slate-700">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap text-emerald-700 font-bold">
                    {item.discount > 0 ? `-${formatCurrency(item.discount)}` : '0.00'}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap font-bold text-slate-900">
                    {formatCurrency(item.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Infrastructure SLA Metrics & Total Calculus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-5 pt-3 border-t border-slate-200">
        <div className="p-3 bg-slate-950 text-slate-200 rounded text-[11px] space-y-1.5">
          <div className="text-sky-400 font-bold text-[10px] uppercase">
            // INFRASTRUCTURE & RECOVERY PARAMETERS
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>• Database: PostgreSQL + Redis In-Memory</div>
            <div>• Backup: Hourly Automated Snapshot</div>
            <div>• UAE WPS: WPS 2.0 SIF Automated Format</div>
            <div>• Turn-up SLA: 48h Provisioning Window</div>
          </div>
          <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
            Payment Term: Net 30 Electronic Clearance upon SOW verification.
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-300 p-4 rounded text-xs space-y-2">
          <div className="flex justify-between text-slate-700">
            <span>SUM_LIST_MODULES:</span>
            <span>{formatCurrency(basePrice)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-800 font-bold">
              <span>DISCOUNT_CONTRACT_DEDUCT:</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-700">
            <span>CLOUD_PROVISION_FEE:</span>
            <span>{formatCurrency(implFee)}</span>
          </div>
          <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-baseline font-bold text-slate-950">
            <span className="text-xs">NET_YEAR1_COMMITMENT:</span>
            <span className="text-base text-sky-950">
              {formatCurrency(total)} USD
            </span>
          </div>
        </div>
      </div>

      {/* 5. DevOps / Technical Sign-off Stamp */}
      <div className="mt-6 pt-4 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center text-xs">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block font-bold">
            LEAD ENTERPRISE ARCHITECT
          </span>
          <div className="my-1 text-slate-900 font-bold">
            JORDAN DAVIS // DEVOPS & SOLUTIONS DIRECTOR
          </div>
          <div className="text-[10px] text-slate-500">
            VERIFICATION: GPG KEY ID #4A19F83C · COMMIT: 8a4f91b
          </div>
        </div>

        <div className="sm:text-right">
          <div className="inline-block p-2.5 border border-sky-600 rounded bg-sky-100 text-[10px] text-sky-950 text-left">
            <div className="font-bold">// SYSTEM ARCHITECTURE APPROVED</div>
            <div>DEPLOYMENT QUEUE: READY_TO_SPAWN</div>
            <div className="text-[9px] text-slate-600 font-sans">Pax Enterprise Cloud Systems · UAE Sovereign VPC</div>
          </div>
        </div>
      </div>
    </div>
  );
}
