// Registry and metadata for all available quotation templates
export const TEMPLATES = [
  {
    id: 'executive',
    name: 'Pax Executive',
    tagline: 'Modern Corporate Minimalist',
    description: 'Sleek corporate slate layout with executive summary, clear pricing matrix, and Level-3 digital authorization stamp.',
    badge: 'Executive Standard',
    accentColor: '#9db5a3',
    textColor: '#191b1a',
    borderColor: '#3a3f3c',
    icon: 'briefcase',
    bestFor: 'Multinational corporations, oil & gas enterprises, and executive board reviews'
  },
  {
    id: 'prestige',
    name: 'Gulf Prestige',
    tagline: 'Sovereign UAE Emerald & Gold',
    description: 'Distinguished regional enterprise styling with emerald borders, warm gold accents, bilingual header, and official certification seal.',
    badge: 'UAE Enterprise',
    accentColor: '#059669',
    textColor: '#064e3b',
    borderColor: '#d97706',
    icon: 'crown',
    bestFor: 'UAE government entities, sovereign wealth funds, and regional holding companies'
  },
  {
    id: 'technical',
    name: 'Technical Blueprint',
    tagline: 'High-Density Engineering Spec',
    description: 'Precision engineering layout with monospace SKUs, infrastructure deployment SLA matrix, and DevOps architecture verification.',
    badge: 'Technical Spec',
    accentColor: '#0284c7',
    textColor: '#0f172a',
    borderColor: '#0284c7',
    icon: 'cpu',
    bestFor: 'Heavy industry, manufacturing, telecommunications, and engineering procurements'
  },
  {
    id: 'classic',
    name: 'Classic Commercial',
    tagline: 'Formal ADGM Tender Letterhead',
    description: 'Traditional corporate letterhead with registered ADGM entity details, formal recipient block, milestone payment schedule, and corporate seal.',
    badge: 'Formal Tender',
    accentColor: '#475569',
    textColor: '#1e293b',
    borderColor: '#cbd5e1',
    icon: 'scroll',
    bestFor: 'Financial institutions, banking, legal compliance, and formal commercial tenders'
  }
];

export function getTemplateById(templateId) {
  return TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
}

// Format numbers as currency
export function formatCurrency(amount, currency = 'USD') {
  if (typeof amount !== 'number') amount = Number(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format dates nicely
export function formatDate(dateStr) {
  if (!dateStr) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

// Normalizes quote data to ensure line items, totals, and client meta exist
export function getQuoteDetails(quote) {
  if (!quote) return null;

  // If structured items are provided
  if (Array.isArray(quote.items) && quote.items.length > 0) {
    return {
      ...quote,
      templateId: quote.templateId || 'executive'
    };
  }

  // Derive items from modules text or defaults
  const modulesText = quote.modules || quote.markdown || '';
  const lower = modulesText.toLowerCase();

  const items = [];
  const discountRate = quote.tier?.includes("25%") ? 0.25 : quote.tier?.includes("20%") ? 0.20 : quote.tier?.includes("10%") ? 0.10 : 0.15;
  const discountLabel = `${Math.round(discountRate * 100)}%`;

  const hasERP = lower.includes("erp") || lower.includes("license") || lower.includes("core");
  const hasHR = lower.includes("hr") || lower.includes("payroll");
  const hasSCM = lower.includes("supply") || lower.includes("logistics") || lower.includes("scm");

  if (hasERP || (!hasHR && !hasSCM)) {
    const listPrice = 10000;
    const itemDisc = Math.round(listPrice * discountRate);
    items.push({
      sku: "ERP-CORE",
      name: "Enterprise ERP License",
      term: "Annual Subscription",
      price: listPrice,
      discount: itemDisc,
      discountRate: discountLabel,
      net: listPrice - itemDisc,
      desc: "Core multi-tenant ERP platform, financial ledger & UAE WPS automated compliance suite."
    });
  }

  if (hasHR) {
    const listPrice = 5000;
    const itemDisc = Math.round(listPrice * discountRate);
    items.push({
      sku: "MOD-HR",
      name: "HR Module Add-on",
      term: "Annual Subscription",
      price: listPrice,
      discount: itemDisc,
      discountRate: discountLabel,
      net: listPrice - itemDisc,
      desc: "Automated UAE WPS payroll generation, workforce leave tracking & visa renewal alerts."
    });
  }

  if (hasSCM) {
    const listPrice = 7500;
    const itemDisc = Math.round(listPrice * discountRate);
    items.push({
      sku: "MOD-SCM",
      name: "Supply Chain & Logistics",
      term: "Annual Subscription",
      price: listPrice,
      discount: itemDisc,
      discountRate: discountLabel,
      net: listPrice - itemDisc,
      desc: "Multi-warehouse stock valuation, automated PO replenishment & supplier portal."
    });
  }

  const implFee = quote.implFee !== undefined ? quote.implFee : 2000;
  items.push({
    sku: "SVC-IMPL",
    name: "Implementation & Cloud Setup",
    term: "One-Time Flat",
    price: implFee,
    discount: 0,
    discountRate: "Waived Setup Consultation",
    net: implFee,
    desc: "Dedicated UAE sovereign tenant provisioning, schema migration & enterprise onboarding."
  });

  const basePrice = items.filter(i => i.sku !== "SVC-IMPL").reduce((acc, it) => acc + it.price, 0);
  const discountAmount = items.filter(i => i.sku !== "SVC-IMPL").reduce((acc, it) => acc + it.discount, 0);
  const calculatedTotal = basePrice - discountAmount + implFee;

  return {
    ...quote,
    items,
    basePrice: quote.basePrice || basePrice,
    discountAmount: quote.discountAmount !== undefined ? quote.discountAmount : discountAmount,
    implFee: implFee,
    total: quote.total || calculatedTotal,
    templateId: quote.templateId || 'executive'
  };
}
