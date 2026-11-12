import { useEffect } from 'react';
import TemplateRenderer from './TemplateRenderer';
import { TEMPLATES, getTemplateById } from './templateRegistry';

export default function PrintPreviewModal({
  isOpen,
  onClose,
  quote,
  onUpdateTemplate
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !quote) return null;

  const currentTemplateId = quote.templateId || 'executive';
  const currentTemplate = getTemplateById(currentTemplateId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex flex-col no-print-modal">
      {/* 1. Modal Top Bar (Sticky, non-printing) */}
      <header className="sticky top-0 z-20 bg-[#161817] border-b border-[#303332] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg no-print">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#242725] border border-[#3e4340] grid place-items-center text-white text-xs font-bold">
            🖨️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Print Preview · {quote.client}
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#252927] text-[#9db5a3] border border-[#373d39]">
                {quote.id}
              </span>
            </div>
            <p className="text-[11px] text-[#999e9a]">
              Inspect layout, change templates, or print directly to paper or PDF
            </p>
          </div>
        </div>

        {/* Template Quick Switcher inside Preview */}
        <div className="flex items-center gap-1.5 bg-[#1d1f1e] p-1 rounded-lg border border-[#333735]">
          <span className="text-[10px] text-[#999e9a] uppercase font-mono px-2 hidden md:inline">
            Template:
          </span>
          {TEMPLATES.map((tmpl) => {
            const isActive = currentTemplateId === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onUpdateTemplate(tmpl.id)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#131514] font-semibold shadow-sm'
                    : 'text-[#999e9a] hover:text-white hover:bg-[#282c2a]'
                }`}
                title={tmpl.description}
              >
                {tmpl.name}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Document</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-[#383d3a] bg-[#222523] hover:bg-[#2d312f] text-xs text-[#d6d9d6] transition-colors cursor-pointer"
          >
            Close (Esc)
          </button>
        </div>
      </header>

      {/* 2. Modal Body: Scaled paper sheet preview */}
      <main className="flex-1 p-4 sm:p-8 flex justify-center items-start">
        <div className="w-full max-w-[840px] shadow-2xl transition-all">
          {/* Informational banner above sheet */}
          <div className="mb-3 px-3 py-2 rounded-lg bg-[#1e2220] border border-[#323834] flex items-center justify-between text-xs text-[#999e9a] no-print">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTemplate.accentColor }}></span>
              <span>Currently previewing: <strong>{currentTemplate.name}</strong> ({currentTemplate.tagline})</span>
            </span>
            <span className="text-[11px] font-mono text-[#686e6a]">Standard A4 Print Dimensions</span>
          </div>

          {/* Render the printable quotation document sheet */}
          <div className="printable-quote-document rounded-[12px] overflow-hidden">
            <TemplateRenderer quote={quote} templateId={currentTemplateId} printMode={false} />
          </div>
        </div>
      </main>
    </div>
  );
}
