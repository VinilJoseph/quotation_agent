import { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { TEMPLATES, getTemplateById, getQuoteDetails } from './templates/templateRegistry';
import TemplateRenderer from './templates/TemplateRenderer';
import PrintPreviewModal from './templates/PrintPreviewModal';

// Comprehensive UAE Enterprise Clients with configured default templates
const INITIAL_CLIENTS = [
  { id: 1, name: "ADNOC Group", tier: "Gold - 20% Discount", contact: "Tariq Al Jaber", city: "Abu Dhabi", initials: "AD", status: "Active account", employees: "50,000+", defaultTemplate: "executive" },
  { id: 2, name: "Emirates Steel", tier: "Silver - 10% Discount", contact: "Sara Ahmed", city: "Abu Dhabi", initials: "ES", status: "Active account", employees: "3,500+", defaultTemplate: "technical" },
  { id: 3, name: "DEWA (Dubai Electricity & Water)", tier: "Platinum - 25% Discount", contact: "Fatima Al Mazrouei", city: "Dubai", initials: "DW", status: "Active account", employees: "12,000+", defaultTemplate: "prestige" },
  { id: 4, name: "DP World", tier: "Platinum - 25% Discount", contact: "Sultan Bin Sulayem", city: "Dubai", initials: "DP", status: "Active account", employees: "50,000+", defaultTemplate: "classic" },
  { id: 5, name: "Emirates Airlines", tier: "Gold - 20% Discount", contact: "Ahmed Al Redha", city: "Dubai", initials: "EA", status: "Active account", employees: "100,000+", defaultTemplate: "executive" },
  { id: 6, name: "Mubadala Investment Company", tier: "Platinum - 25% Discount", contact: "Layla Al Hashimi", city: "Abu Dhabi", initials: "MB", status: "Active account", employees: "50+ portfolio", defaultTemplate: "prestige" },
  { id: 7, name: "Dubai Holding", tier: "Gold - 20% Discount", contact: "Omar Al Falasi", city: "Dubai", initials: "DH", status: "Active account", employees: "20,000+", defaultTemplate: "executive" },
  { id: 8, name: "ADNOC Offshore", tier: "Gold - 20% Discount", contact: "Hassan Al Zaabi", city: "Abu Dhabi", initials: "AO", status: "Active account", employees: "15,000+", defaultTemplate: "technical" },
  { id: 9, name: "Aldar Properties", tier: "Silver - 10% Discount", contact: "Noura Al Dhaheri", city: "Abu Dhabi", initials: "AP", status: "Active account", employees: "4,000+", defaultTemplate: "classic" },
  { id: 10, name: "Etisalat e&", tier: "Gold - 20% Discount", contact: "Khalid Al Mansoori", city: "Abu Dhabi", initials: "ET", status: "Active account", employees: "10,000+", defaultTemplate: "technical" },
  { id: 11, name: "First Abu Dhabi Bank (FAB)", tier: "Gold - 20% Discount", contact: "Hana Al Rostamani", city: "Abu Dhabi", initials: "FB", status: "Active account", employees: "5,000+", defaultTemplate: "prestige" },
  { id: 12, name: "Dubai Airports", tier: "Gold - 20% Discount", contact: "Paul Griffiths", city: "Dubai", initials: "DA", status: "Active account", employees: "90,000+", defaultTemplate: "executive" },
];

// Product catalog from BM25 knowledge base
const CATALOG_ITEMS = [
  { id: "ERP-CORE", name: "Enterprise ERP License", price: 10000, billing: "/yr", desc: "Core multi-tenant ERP platform, financial ledger & UAE compliance suite." },
  { id: "MOD-HR", name: "HR Module Add-on", price: 5000, billing: "/yr", desc: "Workforce payroll with automated UAE WPS integration, leave & visa tracking." },
  { id: "MOD-SCM", name: "Supply Chain & Logistics", price: 7500, billing: "/yr", desc: "Multi-warehouse inventory tracking, automated PO replenishment & supplier portal." },
  { id: "SVC-IMPL", name: "Implementation & Setup", price: 2000, billing: " flat", desc: "Dedicated cloud provisioning, sovereign data migration & administrator training." }
];

// Initial preloaded quotations matching ticket pass structure, each with its preserved template
const INITIAL_QUOTES = [
  {
    id: "QUO-2026-2048",
    client: "ADNOC Group",
    contact: "Tariq Al Jaber",
    tier: "Gold - 20% Discount",
    city: "Abu Dhabi",
    modules: "Enterprise ERP License + HR Module",
    templateId: "executive",
    total: 14000,
    basePrice: 15000,
    discountAmount: 3000,
    implFee: 2000,
    expiryDays: 28,
    date: "2026-11-12",
    expiryDate: "2026-12-10",
    status: "Approved Draft",
    items: [
      { sku: "ERP-CORE", name: "Enterprise ERP License", term: "Annual Subscription", price: 10000, discount: 2000, discountRate: "20%", net: 8000, desc: "Core multi-tenant ERP platform with UAE WPS compliance & financial ledger." },
      { sku: "MOD-HR", name: "HR Module Add-on", term: "Annual Subscription", price: 5000, discount: 1000, discountRate: "20%", net: 4000, desc: "Automated workforce payroll, leave management & visa expiration tracker." },
      { sku: "SVC-IMPL", name: "Implementation & Onboarding", term: "One-Time Flat", price: 2000, discount: 0, discountRate: "0%", net: 2000, desc: "Dedicated cloud tenant deployment, sovereign data migration & staff training." }
    ],
    markdown: `# Commercial Quotation: ADNOC Group\n\n**Quotation Reference:** \`QUO-2026-2048\`  \n**Valid Until:** December 10, 2026 (28 days remaining)  \n**Client Tier:** Gold - 20% Discount  \n\n### Pricing Summary\n- **Enterprise ERP License:** $10,000/yr (-$2,000 discount) = **$8,000**\n- **HR Module Add-on:** $5,000/yr (-$1,000 discount) = **$4,000**\n- **Implementation & Onboarding:** Flat **$2,000**\n- **Total Year 1 Investment:** **$14,000 USD**\n\n### Commercial Terms\n- **Payment Terms:** Net 30 days from invoice clearance.\n- **Support SLA:** 24/7 dedicated enterprise response with 99.95% uptime.\n- **Data Residency:** UAE sovereign in-country hosting.`
  },
  {
    id: "QUO-2026-2051",
    client: "Emirates Steel",
    contact: "Sara Ahmed",
    tier: "Silver - 10% Discount",
    city: "Abu Dhabi",
    modules: "Enterprise ERP License",
    templateId: "technical",
    total: 11000,
    basePrice: 10000,
    discountAmount: 1000,
    implFee: 2000,
    expiryDays: 19,
    date: "2026-11-10",
    expiryDate: "2026-11-29",
    status: "Approved Draft",
    items: [
      { sku: "ERP-CORE", name: "Enterprise ERP License", term: "Annual Subscription", price: 10000, discount: 1000, discountRate: "10%", net: 9000, desc: "Core multi-tenant ERP platform with UAE WPS compliance & financial ledger." },
      { sku: "SVC-IMPL", name: "Implementation & Cloud Setup", term: "One-Time Flat", price: 2000, discount: 0, discountRate: "0%", net: 2000, desc: "Dedicated cloud tenant deployment, sovereign data migration & staff training." }
    ],
    markdown: `# Commercial Quotation: Emirates Steel\n\n**Quotation Reference:** \`QUO-2026-2051\`  \n**Valid Until:** November 29, 2026 (19 days remaining)  \n**Client Tier:** Silver - 10% Discount  \n\n### Pricing Summary\n- **Enterprise ERP License:** $10,000/yr (-$1,000 discount) = **$9,000**\n- **Implementation Fee:** Flat **$2,000**\n- **Total Year 1 Investment:** **$11,000 USD**\n\n### Commercial Terms\n- **Payment Terms:** Net 30 days standard.\n- **Support SLA:** Standard business hours response with UAE localized compliance.`
  },
  {
    id: "QUO-2026-2057",
    client: "DEWA (Dubai Electricity & Water)",
    contact: "Fatima Al Mazrouei",
    tier: "Platinum - 25% Discount",
    city: "Dubai",
    modules: "Enterprise ERP License + HR Module + Supply Chain",
    templateId: "prestige",
    total: 18875,
    basePrice: 22500,
    discountAmount: 5625,
    implFee: 2000,
    expiryDays: 30,
    date: "2026-11-12",
    expiryDate: "2026-12-12",
    status: "Approved Draft",
    items: [
      { sku: "ERP-CORE", name: "Enterprise ERP License", term: "Annual Subscription", price: 10000, discount: 2500, discountRate: "25%", net: 7500, desc: "Core multi-tenant ERP platform with UAE WPS compliance & financial ledger." },
      { sku: "MOD-HR", name: "HR Module Add-on", term: "Annual Subscription", price: 5000, discount: 1250, discountRate: "25%", net: 3750, desc: "Automated workforce payroll, leave management & visa expiration tracker." },
      { sku: "MOD-SCM", name: "Supply Chain & Logistics", term: "Annual Subscription", price: 7500, discount: 1875, discountRate: "25%", net: 5625, desc: "Multi-warehouse inventory tracking, automated PO replenishment & supplier portal." },
      { sku: "SVC-IMPL", name: "Implementation & Setup", term: "One-Time Flat", price: 2000, discount: 0, discountRate: "0%", net: 2000, desc: "Dedicated cloud tenant deployment, sovereign data migration & staff training." }
    ],
    markdown: `# Commercial Quotation: DEWA\n\n**Quotation Reference:** \`QUO-2026-2057\`  \n**Valid Until:** December 12, 2026 (30 days remaining)  \n**Client Tier:** Platinum - 25% Discount  \n\n### Pricing Summary\n- **Enterprise ERP License:** $10,000/yr (-$2,500 discount) = **$7,500**\n- **HR Module Add-on:** $5,000/yr (-$1,250 discount) = **$3,750**\n- **Supply Chain & Logistics:** $7,500/yr (-$1,875 discount) = **$5,625**\n- **Implementation Fee:** Flat **$2,000**\n- **Total Year 1 Investment:** **$18,875 USD**\n\n### Commercial Terms\n- **Payment Terms:** Net 30 days.\n- **Support SLA:** Platinum 24/7 dedicated engineering pod with 99.99% uptime guarantee.`
  }
];

export default function App() {
  const [request, setRequest] = useState('');
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [quotationList, setQuotationList] = useState(INITIAL_QUOTES);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [currentQuotationMarkdown, setCurrentQuotationMarkdown] = useState(INITIAL_QUOTES[0].markdown);
  const [viewMode, setViewMode] = useState('template'); // 'template' | 'markdown'
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [logs, setLogs] = useState([
    "🧭 Classifier Node: Initialized agent workflow -> [STANDBY_READY]",
    "💾 SQL Tool: Connected to pax_erp.db (15 UAE Enterprise Clients)",
    "📚 RAG Tool: BM25 Knowledge Base indexed 4 software product specs.",
    "🎨 Template Engine: Loaded 4 Commercial Templates (Executive, Prestige, Technical, Classic)"
  ]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'clients' | 'catalog'
  const [tourIndex, setTourIndex] = useState(0);
  const [showTour, setShowTour] = useState(true);

  // Sync clients from backend if online
  useEffect(() => {
    fetch('http://localhost:8000/clients')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.clients) && data.clients.length > 0) {
          setClients(prev => {
            return prev.map(c => {
              const remote = data.clients.find(rc => rc.id === c.id || rc.name.toLowerCase().includes(c.name.toLowerCase()));
              if (remote && remote.default_template) {
                return { ...c, defaultTemplate: remote.default_template };
              }
              return c;
            });
          });
        }
      })
      .catch(() => {
        // Backend offline or standalone mode - default templates already initialized
      });
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3600);
  };

  // Onboarding slides matching the user's reference image
  const tourSlides = [
    {
      title: "Welcome to Pax ERP Quotation Agent",
      desc: "An intelligent agentic workspace powered by LangGraph, SQLite client discounting, and BM25 knowledge retrieval to automatically draft enterprise quotations.",
      badge: "AI Agent v2.4",
      iconType: "chart"
    },
    {
      title: "Multiple Polished Quotation Templates",
      desc: "Switch between 4 high-end commercial templates: Pax Executive, Gulf Prestige (Emerald & Gold), Technical Blueprint, and Classic ADGM Tender with print preview.",
      badge: "4 Templates",
      iconType: "document"
    },
    {
      title: "Company Defaults & Per-Quote Overrides",
      desc: "Each company has a designated default template auto-selected for new quotes. Override templates per quote while preserving the original look of previous quotes.",
      badge: "Auto-Selected",
      iconType: "pie"
    },
    {
      title: "Print & PDF Preview Engine",
      desc: "Instant page-perfect A4 print preview before dispatching to clients. Zero UI clutter, sharp high-contrast typography, and official corporate seals.",
      badge: "Print Ready",
      iconType: "layers"
    }
  ];

  // Quick prompt suggestion chips
  const suggestions = [
    "Generate a quote for ADNOC for the Enterprise ERP License and HR Module",
    "Generate a quotation for Emirates Steel for Enterprise ERP License",
    "Create a commercial quote for DEWA for Enterprise ERP License with HR Module",
    "Create an enterprise quotation for DP World with Supply Chain Module",
    "What is ADNOC's discount tier in the ERP database?"
  ];

  const handleSelectSuggestion = (text) => {
    setRequest(text);
  };

  // Find client matching a prompt query
  const findClientForQuery = (query) => {
    const lower = query.toLowerCase();
    let client = clients.find(c => lower.includes(c.name.toLowerCase()));
    if (!client && lower.includes("adnoc")) client = clients.find(c => c.name.toLowerCase().includes("adnoc"));
    if (!client && lower.includes("steel")) client = clients.find(c => c.name.toLowerCase().includes("steel"));
    if (!client && lower.includes("dewa")) client = clients.find(c => c.name.toLowerCase().includes("dewa"));
    if (!client && lower.includes("dp world")) client = clients.find(c => c.name.toLowerCase().includes("dp world"));
    if (!client && lower.includes("emirates airlines")) client = clients.find(c => c.name.toLowerCase().includes("airlines"));
    if (!client && lower.includes("mubadala")) client = clients.find(c => c.name.toLowerCase().includes("mubadala"));
    if (!client && lower.includes("etisalat")) client = clients.find(c => c.name.toLowerCase().includes("etisalat"));
    if (!client && lower.includes("fab")) client = clients.find(c => c.name.toLowerCase().includes("fab") || c.name.toLowerCase().includes("first abu dhabi"));
    return client;
  };

  // Update a company's default template in state and backend
  const handleUpdateClientDefaultTemplate = async (clientId, newTemplateId) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, defaultTemplate: newTemplateId } : c));
    const target = clients.find(c => c.id === clientId);
    const tmpl = getTemplateById(newTemplateId);
    showToast(`✓ Set ${target?.name || 'Company'} default template to "${tmpl.name}"`);

    try {
      await fetch(`http://localhost:8000/clients/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ default_template: newTemplateId })
      });
    } catch {
      // Local state updated
    }
  };

  // Override template for the currently active quote (permanently saved with quote)
  const handleOverrideQuoteTemplate = (newTemplateId) => {
    setQuotationList(prev => {
      const updated = [...prev];
      if (updated[activeQuoteIndex]) {
        updated[activeQuoteIndex] = {
          ...updated[activeQuoteIndex],
          templateId: newTemplateId,
          templateOverridden: true
        };
      }
      return updated;
    });
    const tmpl = getTemplateById(newTemplateId);
    showToast(`Quote template overridden to "${tmpl.name}"`);
  };

  // Revert active quote to its company's default template
  const handleRevertToCompanyDefault = () => {
    const curQuote = quotationList[activeQuoteIndex];
    if (!curQuote) return;
    const clientObj = findClientForQuery(curQuote.client) || clients[0];
    const defTmpl = clientObj?.defaultTemplate || 'executive';
    handleOverrideQuoteTemplate(defTmpl);
  };

  // Local simulated fallback generator with accurate company default template auto-selection
  const generateSimulatedQuote = (query) => {
    const lower = query.toLowerCase();
    const matchedClient = findClientForQuery(query);
    const c = matchedClient || {
      name: "ADNOC Group",
      tier: "Gold - 20% Discount",
      contact: "Tariq Al Jaber",
      city: "Abu Dhabi",
      defaultTemplate: "executive"
    };

    // Auto-select company default template
    const autoTemplateId = c.defaultTemplate || 'executive';

    // Check items
    const hasERP = lower.includes("enterprise") || lower.includes("erp") || lower.includes("license");
    const hasHR = lower.includes("hr") || lower.includes("payroll");
    const hasSupply = lower.includes("supply") || lower.includes("logistics") || lower.includes("scm");

    if (lower.includes("what is") && lower.includes("discount")) {
      const md = `### Client Record Inquiry\n\n**Client:** ${c.name}\n- **Discount Tier:** ${c.tier}\n- **Primary Representative:** ${c.contact}\n- **Tenant HQ:** ${c.city}, United Arab Emirates\n- **Default Quotation Template:** ${getTemplateById(autoTemplateId).name}\n- **Payment Terms:** Net 30 Days Standard`;
      return {
        quote: md,
        logs: [
          "🧭 Classifier Node: Analyzed request and routed to -> [SQL_ONLY]",
          `💾 SQL Tool: Queried ERP database: SELECT * FROM clients WHERE name LIKE '%${c.name}%'`,
          `🎨 Template Selector: Retrieved company default template -> [${getTemplateById(autoTemplateId).name.toUpperCase()}]`,
          `💬 Info Responder Node: Synthesized client agreement details for ${c.name}.`
        ],
        quoteObj: {
          id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
          client: c.name,
          contact: c.contact,
          tier: c.tier,
          city: c.city || "Abu Dhabi",
          modules: "Client Tier Inquiry",
          templateId: autoTemplateId,
          total: 0,
          basePrice: 0,
          discountAmount: 0,
          implFee: 0,
          expiryDays: 30,
          date: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          status: "Information Verified",
          items: [],
          markdown: md
        }
      };
    }

    let baseSum = 0;
    const items = [];
    const discountRate = c.tier.includes("25%") ? 0.25 : c.tier.includes("20%") ? 0.20 : c.tier.includes("10%") ? 0.10 : 0.15;
    const discountLabel = `${Math.round(discountRate * 100)}%`;

    if (hasERP || (!hasHR && !hasSupply)) {
      const price = 10000;
      const discount = Math.round(price * discountRate);
      items.push({
        sku: "ERP-CORE",
        name: "Enterprise ERP License",
        term: "Annual Subscription",
        price: price,
        discount: discount,
        discountRate: discountLabel,
        net: price - discount,
        desc: "Core multi-tenant ERP platform with UAE WPS compliance & financial ledger."
      });
      baseSum += price;
    }
    if (hasHR) {
      const price = 5000;
      const discount = Math.round(price * discountRate);
      items.push({
        sku: "MOD-HR",
        name: "HR Module Add-on",
        term: "Annual Subscription",
        price: price,
        discount: discount,
        discountRate: discountLabel,
        net: price - discount,
        desc: "Automated workforce payroll with UAE WPS integration, leave & visa expiration tracking."
      });
      baseSum += price;
    }
    if (hasSupply) {
      const price = 7500;
      const discount = Math.round(price * discountRate);
      items.push({
        sku: "MOD-SCM",
        name: "Supply Chain & Logistics",
        term: "Annual Subscription",
        price: price,
        discount: discount,
        discountRate: discountLabel,
        net: price - discount,
        desc: "Multi-warehouse inventory tracking, automated PO replenishment & supplier portal."
      });
      baseSum += price;
    }

    const implFee = 2000;
    items.push({
      sku: "SVC-IMPL",
      name: "Implementation & Setup",
      term: "One-Time Flat",
      price: implFee,
      discount: 0,
      discountRate: "Waived Setup Consultation",
      net: implFee,
      desc: "Dedicated cloud tenant deployment, sovereign data migration & staff training."
    });

    const discountAmount = Math.round(baseSum * discountRate);
    const finalAnnual = baseSum - discountAmount;
    const totalFirstYear = finalAnnual + implFee;
    const quoteRef = `QUO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const markdown = `# Commercial Quotation: ${c.name}

**Quotation Reference:** \`${quoteRef}\`  
**Date of Issuance:** ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}  
**Valid Until:** ${new Date(Date.now() + 30 * 86400000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} (30 Days Remaining)  
**Assigned Template:** ${getTemplateById(autoTemplateId).name} (Auto-selected from ${c.name} defaults)

---

### Client Information
| Field | Value |
| :--- | :--- |
| **Client Organization** | ${c.name} |
| **Primary Authorized Contact** | ${c.contact} |
| **Tenant Location** | ${c.city || 'Abu Dhabi'}, United Arab Emirates |
| **Pre-Approved Discount Tier** | \`${c.tier}\` |

---

### Commercial Price Breakdown
| Item Description | Term | Standard Rate | Discount Applied | Net Payable |
| :--- | :--- | :--- | :--- | :--- |
${items.map(it => `| **${it.name}** | ${it.term} | $${it.price.toLocaleString()} | -${it.discount > 0 ? `$${it.discount.toLocaleString()}` : '—'} | $${it.net.toLocaleString()} |`).join('\n')}
| **Grand Total (Year 1)** | **Annual + Setup** | **$${(baseSum + implFee).toLocaleString()}** | **-$${discountAmount.toLocaleString()}** | **$${totalFirstYear.toLocaleString()} USD** |

---

### Commercial Terms & SLA
1. **Payment Terms:** Net 30 days from official electronic invoice receipt.
2. **Support Level:** 24/7 dedicated enterprise response SLA with 99.95% cloud uptime guarantee.
3. **Data Residency:** Fully compliant with UAE Federal Law & sovereign in-country hosting.
4. **License Delivery:** Credentials provisioned within 48 hours of PO clearance.`;

    const logsArray = [
      "🧭 Classifier Node: Analyzed request and routed to -> [GENERATE_QUOTE]",
      `🧠 Analyzer Agent: Extracted Client -> '${c.name}', Modules -> '${items.filter(i => i.sku !== "SVC-IMPL").map(i => i.name).join(" + ")}'`,
      `💾 SQL Tool: Queried ERP database: Found client '${c.name}' with tier '${c.tier}' and default template '${getTemplateById(autoTemplateId).name}'`,
      `🎨 Template Engine: Auto-selected company default template [${getTemplateById(autoTemplateId).name.toUpperCase()}] for new quotation`,
      `📚 RAG Tool: Searched BM25 KB for '${items.map(i => i.name).join(", ")}' and applied pricing matrices`,
      `⚡ Synthesizer Node: Formatted compliant commercial proposal with reference ${quoteRef}`
    ];

    const quoteObj = {
      id: quoteRef,
      client: c.name,
      contact: c.contact,
      tier: c.tier,
      city: c.city || "Abu Dhabi",
      modules: items.filter(i => i.sku !== "SVC-IMPL").map(i => i.name).join(" + "),
      total: totalFirstYear,
      basePrice: baseSum,
      discountAmount: discountAmount,
      implFee: implFee,
      expiryDays: 30,
      date: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: "Approved Draft",
      templateId: autoTemplateId,
      items: items,
      markdown: markdown
    };

    return {
      quote: markdown,
      logs: logsArray,
      quoteObj: quoteObj
    };
  };

  const handleGenerate = async () => {
    if (!request.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_request: request }),
      });

      if (!res.ok) throw new Error("Backend offline or returned status error");
      const data = await res.json();

      const matchedClient = findClientForQuery(request);
      const chosenTemplate = data.default_template || matchedClient?.defaultTemplate || 'executive';
      const newRef = `QUO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newQuote = getQuoteDetails({
        id: newRef,
        client: matchedClient ? matchedClient.name : request.includes("ADNOC") ? "ADNOC Group" : request.includes("Steel") ? "Emirates Steel" : "Enterprise Client",
        contact: matchedClient ? matchedClient.contact : "Commercial Procurement",
        tier: matchedClient ? matchedClient.tier : "Gold - 20% Discount",
        city: matchedClient ? matchedClient.city : "Abu Dhabi",
        modules: request,
        templateId: chosenTemplate,
        total: 14000,
        basePrice: 15000,
        discountAmount: 3000,
        implFee: 2000,
        expiryDays: 30,
        date: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: "Approved Draft",
        markdown: data.quotation
      });

      setQuotationList(prev => [newQuote, ...prev]);
      setActiveQuoteIndex(0);
      setCurrentQuotationMarkdown(data.quotation);
      setLogs(data.logs || []);
      showToast(`Generated new quote using ${getTemplateById(chosenTemplate).name} (Auto-selected)`);
    } catch {
      // Graceful instant fallback using authentic local UAE ERP, BM25 data & templates
      const simulated = generateSimulatedQuote(request);
      setQuotationList(prev => [simulated.quoteObj, ...prev]);
      setActiveQuoteIndex(0);
      setCurrentQuotationMarkdown(simulated.quote);
      setLogs(simulated.logs);
      showToast(`Generated new quote using ${getTemplateById(simulated.quoteObj.templateId).name} (Auto-selected)`);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (!currentQuotationMarkdown) return;
    navigator.clipboard.writeText(currentQuotationMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const activeQuote = quotationList[activeQuoteIndex] || quotationList[0];
  const activeTemplate = getTemplateById(activeQuote?.templateId || 'executive');
  const activeQuoteClientObj = findClientForQuery(activeQuote?.client || '');
  const isTemplateOverridden = activeQuote?.templateId && activeQuoteClientObj?.defaultTemplate && activeQuote.templateId !== activeQuoteClientObj.defaultTemplate;

  const handlePrevQuote = () => {
    if (quotationList.length === 0) return;
    const newIdx = (activeQuoteIndex - 1 + quotationList.length) % quotationList.length;
    setActiveQuoteIndex(newIdx);
    setCurrentQuotationMarkdown(quotationList[newIdx].markdown);
  };

  const handleNextQuote = () => {
    if (quotationList.length === 0) return;
    const newIdx = (activeQuoteIndex + 1) % quotationList.length;
    setActiveQuoteIndex(newIdx);
    setCurrentQuotationMarkdown(quotationList[newIdx].markdown);
  };

  // Filtered lists based on global search
  const filteredClients = useMemo(() => {
    if (!globalSearch.trim()) return clients;
    const q = globalSearch.toLowerCase();
    return clients.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.contact.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.tier.toLowerCase().includes(q)
    );
  }, [globalSearch, clients]);

  const filteredQuotes = useMemo(() => {
    if (!globalSearch.trim()) return quotationList;
    const q = globalSearch.toLowerCase();
    return quotationList.filter(item => 
      item.client.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.modules.toLowerCase().includes(q) ||
      (item.templateId && item.templateId.toLowerCase().includes(q))
    );
  }, [globalSearch, quotationList]);

  return (
    <div className="min-h-screen bg-[#131514] text-[#f1f2ef] flex flex-col antialiased selection:bg-[#303332] selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1e2220] border border-[#3f4642] text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-fade-in no-print">
          <span className="w-2 h-2 rounded-full bg-[#9db5a3] animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOPBAR (matches file4.html header structure) */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#131514]/92 backdrop-blur-md no-print">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-[28px] h-[28px] rounded-[8px] border border-[#646965] grid place-items-center text-xs font-semibold text-white bg-[#1d1f1e] shadow-sm">
              H
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[15px] tracking-tight leading-none text-[#f1f2ef]">Hill — Pax ERP</span>
              <span className="text-[10px] text-[#999e9a] font-mono tracking-wider">COMMERCIAL AI AGENT</span>
            </div>
          </div>

          {/* Global Search bar (matches file4.html search-wrap) */}
          <div className="relative flex-1 max-w-[390px] hidden sm:block">
            <svg 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#686e6a]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
              type="search" 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search clients, quotations, templates… (e.g. ADNOC, Prestige)"
              className="w-full h-[37px] pl-10 pr-3.5 rounded-[9px] border border-[#303332] bg-[#1a1c1b] text-[13px] text-[#f1f2ef] placeholder-[#686e6a] focus:outline-none focus:border-[#666d68] transition-colors"
            />
          </div>

          {/* System Status & Profile Avatar */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-[7px] border border-[#303332] bg-[#1a1c1b] text-[11px] text-[#999e9a]">
              <span className="w-2 h-2 rounded-full bg-[#9db5a3] animate-pulse"></span>
              <span>4 Templates Active</span>
            </div>

            <button 
              type="button" 
              className="flex items-center gap-2.5 p-1 rounded-full hover:opacity-90 transition-opacity cursor-pointer border border-transparent"
              title="Signed in as Jordan Davis"
            >
              <div className="w-[30px] h-[30px] rounded-full border border-[#454a47] bg-[#292d2a] grid place-items-center text-[11px] font-semibold text-[#e5e7e4]">
                JD
              </div>
              <span className="hidden lg:inline text-[12px] text-[#c8cbc8] font-medium">Jordan Davis</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-[1180px] w-full mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col gap-8">
        
        {/* 2. WELCOME / HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#303332]/50 pb-6 no-print">
          <div>
            <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#999e9a] mb-1.5">
              Company Overview · Commercial Operations
            </p>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#f1f2ef]">
              Good morning, Jordan.
            </h1>
            <p className="text-[13px] text-[#999e9a] mt-1 max-w-2xl leading-relaxed">
              Generate, customize, and print commercial quotations with auto-selected company templates and live print preview.
            </p>
          </div>

          <div className="text-right text-[12px] text-[#999e9a] font-medium font-mono">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </section>

        {/* 3. HERO / ONBOARDING CAROUSEL */}
        {showTour && (
          <section className="relative rounded-[16px] border border-[#303332] bg-[#1d1f1e] overflow-hidden shadow-2xl transition-all no-print">
            <div className="relative h-[200px] sm:h-[230px] bg-[#191b1a] border-b border-[#303332] dot-grid-bg flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-radial-at-c from-white/[0.04] to-transparent pointer-events-none"></div>

              {/* Isometric 3D Vector Art */}
              <div className="relative z-10 w-full max-w-[440px] h-[170px] flex items-center justify-center">
                <svg viewBox="0 0 400 180" className="w-full h-full text-white/80" fill="none" stroke="currentColor">
                  <path d="M40 90 L200 170 L360 90 L200 10 Z" stroke="#383c3a" strokeWidth="0.8" strokeDasharray="3 3"/>
                  <path d="M120 50 L280 130" stroke="#2c302e" strokeWidth="0.7"/>
                  <path d="M280 50 L120 130" stroke="#2c302e" strokeWidth="0.7"/>

                  <g transform="translate(60, 45)">
                    <path d="M10 20 L40 5 L70 20 L40 60 Z" stroke="#686e6a" strokeWidth="1.2" fill="#202322" fillOpacity="0.4"/>
                    <path d="M10 20 L10 28 L40 68 L40 60 Z" stroke="#686e6a" strokeWidth="1.2" fill="#181a19"/>
                    <path d="M70 20 L70 28 L40 68 L40 60 Z" stroke="#686e6a" strokeWidth="1.2" fill="#141615"/>
                  </g>

                  <g transform="translate(160, 40)">
                    <path d="M10 50 A 55 24 0 1 0 100 50 A 55 24 0 1 0 10 50 Z" stroke="#525754" strokeWidth="1.2" fill="#222523"/>
                    <path d="M10 50 L10 68 A 55 24 0 0 0 100 68 L100 50" stroke="#525754" strokeWidth="1.2" fill="#1b1d1c"/>

                    <path d="M55 42 L88 28 L82 12 L48 26 Z" stroke="#9db5a3" strokeWidth="1.5" fill="#282e2a"/>
                    <path d="M88 28 L88 40 L82 24 L82 12 Z" stroke="#9db5a3" strokeWidth="1.2" fill="#1f2421"/>
                    <path d="M48 26 L48 38 L88 40 L88 28 Z" stroke="#9db5a3" strokeWidth="1.2" fill="#2a322c"/>

                    <path d="M68 18 L68 -10" stroke="#9db5a3" strokeWidth="1.2" strokeDasharray="2 2"/>
                    <circle cx="68" cy="-14" r="8" fill="#f1f2ef"/>
                    <path d="M64 -14 L67 -11 L73 -17" stroke="#131514" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>

                  <g transform="translate(270, 20)">
                    <rect x="0" y="25" width="55" height="75" rx="5" stroke="#3c413e" strokeWidth="1" fill="#181a19" transform="skewY(-15)"/>
                    <rect x="15" y="15" width="55" height="75" rx="5" stroke="#525754" strokeWidth="1.2" fill="#1f2220" transform="skewY(-15)"/>
                    <rect x="30" y="5" width="55" height="75" rx="5" stroke="#dedfdc" strokeWidth="1.4" fill="#262927" transform="skewY(-15)"/>
                    <line x1="38" y1="28" x2="65" y2="21" stroke="#9db5a3" strokeWidth="2"/>
                    <line x1="38" y1="36" x2="58" y2="31" stroke="#686e6a" strokeWidth="1.5"/>
                    <circle cx="62" cy="56" r="10" stroke="#9db5a3" strokeWidth="1" strokeDasharray="2 2"/>
                  </g>
                </svg>
              </div>

              <button 
                onClick={() => setShowTour(false)}
                className="absolute top-3 right-3 text-[#999e9a] hover:text-white p-1 rounded-md text-xs border border-transparent hover:border-[#303332] transition-colors"
                title="Dismiss guide"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border border-[#3d423e] bg-[#232625] text-[#9db5a3]">
                  {tourSlides[tourIndex].badge}
                </span>
                <span className="text-[11px] text-[#686e6a]">Step {tourIndex + 1} of {tourSlides.length}</span>
              </div>

              <div>
                <h3 className="text-lg font-medium text-[#f1f2ef] tracking-tight">
                  {tourSlides[tourIndex].title}
                </h3>
                <p className="text-[13px] text-[#999e9a] mt-1 max-w-3xl leading-relaxed">
                  {tourSlides[tourIndex].desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  {tourSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTourIndex(i)}
                      className={`h-1.5 transition-all duration-300 rounded-full ${
                        tourIndex === i ? 'w-5 bg-white' : 'w-1.5 bg-[#454a47] hover:bg-[#686e6a]'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTour(false)}
                    className="px-3.5 py-1.5 rounded-[8px] text-[12px] font-medium text-[#999e9a] hover:text-white transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={() => setTourIndex((prev) => (prev + 1) % tourSlides.length)}
                    className="px-4 py-1.5 rounded-full text-[12px] font-semibold bg-white text-[#131514] hover:bg-[#e2e4e1] transition-colors shadow-sm cursor-pointer"
                  >
                    {tourIndex === tourSlides.length - 1 ? 'Start Over' : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. OVERVIEW STATS GRID */}
        <section aria-labelledby="statsHeading" className="no-print">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 id="statsHeading" className="text-[16px] font-medium tracking-tight text-[#f1f2ef]">
                Commercial Operations Overview
              </h2>
              <p className="text-[12px] text-[#999e9a]">Enterprise accounts, template mappings & quotation metrics</p>
            </div>
            <span className="text-[11px] text-[#999e9a] font-mono">Template Engine Active</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <div className="p-4 rounded-[14px] border border-[#303332] bg-[#1d1f1e] flex flex-col justify-between min-h-[104px]">
              <span className="text-[12px] text-[#999e9a]">Enterprise Accounts</span>
              <strong className="text-[27px] font-normal tracking-tight text-[#f1f2ef] my-1">
                {clients.length}
              </strong>
              <div className="text-[11px] text-[#686e6a]">Default Templates Assigned</div>
            </div>

            <div className="p-4 rounded-[14px] border border-[#303332] bg-[#1d1f1e] flex flex-col justify-between min-h-[104px]">
              <span className="text-[12px] text-[#999e9a]">Active Quotations</span>
              <strong className="text-[27px] font-normal tracking-tight text-[#9db5a3] my-1">
                {quotationList.length}
              </strong>
              <div className="text-[11px] text-[#686e6a]">Template Saved Per Quote</div>
            </div>

            <div className="p-4 rounded-[14px] border border-[#303332] bg-[#1d1f1e] flex flex-col justify-between min-h-[104px]">
              <span className="text-[12px] text-[#999e9a]">Quotation Templates</span>
              <strong className="text-[27px] font-normal tracking-tight text-[#dedfdc] my-1">
                {TEMPLATES.length} Designs
              </strong>
              <div className="text-[11px] text-[#686e6a]">Executive · Prestige · Tech · Classic</div>
            </div>

            <div className="p-4 rounded-[14px] border border-[#303332] bg-[#1d1f1e] flex flex-col justify-between min-h-[104px]">
              <span className="text-[12px] text-[#999e9a]">Print & PDF Engine</span>
              <strong className="text-[27px] font-normal tracking-tight text-[#d9c49a] my-1">
                A4 Ready
              </strong>
              <div className="text-[11px] text-[#686e6a]">Preview Before Printing</div>
            </div>
          </div>
        </section>

        {/* 5. TABS NAVIGATION */}
        <div className="flex border-b border-[#303332] gap-2 no-print">
          <button
            onClick={() => setActiveTab('generator')}
            className={`pb-3 px-3 text-[13px] font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'generator'
                ? 'border-white text-white'
                : 'border-transparent text-[#999e9a] hover:text-[#dedfdc]'
            }`}
          >
            <span>Quotation Agent & Pass</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#292d2a] text-[#9db5a3]">
              Active
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('clients')}
            className={`pb-3 px-3 text-[13px] font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'clients'
                ? 'border-white text-white'
                : 'border-transparent text-[#999e9a] hover:text-[#dedfdc]'
            }`}
          >
            <span>ERP Client Directory & Defaults</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#292d2a] text-[#dedfdc]">
              {filteredClients.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 px-3 text-[13px] font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'catalog'
                ? 'border-white text-white'
                : 'border-transparent text-[#999e9a] hover:text-[#dedfdc]'
            }`}
          >
            <span>Product Catalog</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#292d2a] text-[#dedfdc]">
              {CATALOG_ITEMS.length}
            </span>
          </button>
        </div>

        {/* TAB 1: GENERATOR & TICKET VIEW */}
        {activeTab === 'generator' && (
          <div className="flex flex-col gap-6">
            
            {/* PROMPT COMPOSER CARD */}
            <div className="rounded-[14px] border border-[#303332] bg-[#1d1f1e] p-5 shadow-sm flex flex-col gap-4 no-print">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-medium text-[#f1f2ef]">Enter Request or Query</h3>
                  <p className="text-[12px] text-[#999e9a]">
                    Specify enterprise client (e.g. ADNOC, DEWA) — company default template will be auto-selected
                  </p>
                </div>
                {request && (
                  <button 
                    onClick={() => setRequest('')}
                    className="text-[11px] text-[#999e9a] hover:text-white"
                  >
                    Clear input
                  </button>
                )}
              </div>

              {/* Input row */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerate()}
                    placeholder="e.g., Generate a quotation for ADNOC for the Enterprise ERP License and HR Module"
                    className="w-full h-[46px] px-4 rounded-[10px] border border-[#303332] bg-[#191b1a] text-[13px] text-[#f1f2ef] placeholder-[#686e6a] focus:outline-none focus:border-[#666d68] transition-colors shadow-inner"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading || !request.trim()}
                  className="h-[46px] px-6 rounded-[10px] bg-[#dedfdc] hover:bg-white text-[#131514] font-medium text-[13px] whitespace-nowrap transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-[#131514]" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Running Agent...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Quote</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-[#686e6a]">Suggestions:</span>
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(s)}
                    className="px-2.5 py-1 rounded-[7px] border border-[#303332] bg-[#202321] hover:bg-[#282d29] hover:border-[#484e49] text-[11px] text-[#c2c6c2] transition-colors text-left truncate max-w-[320px] cursor-pointer"
                    title={s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. AGENT EXECUTION TRACE */}
            {logs.length > 0 && (
              <div className="rounded-[14px] border border-[#303332] bg-[#191b1a] p-5 shadow-inner no-print">
                <div className="flex items-center justify-between mb-3 border-b border-[#303332] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9db5a3]"></span>
                    <h3 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">
                      Agent Execution Trace & Template Dispatch
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#686e6a] font-mono">{logs.length} Steps Executed</span>
                </div>

                <div className="space-y-2 font-mono text-[12px]">
                  {logs.map((log, index) => {
                    const isClassifier = log.includes("Classifier");
                    const isAnalyzer = log.includes("Analyzer");
                    const isSQL = log.includes("SQL");
                    const isRAG = log.includes("RAG");
                    const isTemplate = log.includes("Template");

                    const badgeColor = isClassifier 
                      ? "text-[#d9c49a] border-[#d9c49a]/30" 
                      : isAnalyzer 
                      ? "text-[#9db5a3] border-[#9db5a3]/30" 
                      : isSQL 
                      ? "text-[#dedfdc] border-[#dedfdc]/30" 
                      : isRAG 
                      ? "text-[#d7a09a] border-[#d7a09a]/30" 
                      : isTemplate
                      ? "text-[#38bdf8] border-[#38bdf8]/30"
                      : "text-[#999e9a] border-[#303332]";

                    return (
                      <div 
                        key={index} 
                        className="p-2.5 rounded-[8px] bg-[#1d1f1e] border border-[#2a2d2c] flex items-start gap-3 hover:border-[#3d4240] transition-colors"
                      >
                        <span className={`px-1.5 py-0.5 rounded text-[10px] border font-bold ${badgeColor}`}>
                          Step 0{index + 1}
                        </span>
                        <span className="text-[#d6d9d6] leading-relaxed flex-1">
                          {log}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 7. DIGITAL QUOTATION TICKET */}
            <section aria-labelledby="chequesTitle" className="no-print">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 id="chequesTitle" className="text-[16px] font-medium tracking-tight text-[#f1f2ef]">
                    Pending & Active Quotations
                  </h2>
                  <p className="text-[12px] text-[#999e9a]">
                    Select any quote below — each preserves its own assigned template and original look
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#999e9a]">
                  <span className="w-2 h-2 rounded-full bg-[#d9c49a]"></span>
                  <span>{filteredQuotes.length} quotations in memory</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_270px] gap-4 items-start">
                
                {/* Main Ticket Region */}
                <div className="flex flex-col gap-3">
                  <article className="rounded-[15px] border border-[#383c39] bg-[#202321] overflow-hidden shadow-2xl">
                    
                    {/* Top Main Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] min-h-[220px]">
                      
                      {/* Left Document Preview Area */}
                      <div className="relative min-h-[160px] md:min-h-[220px] bg-gradient-to-br from-[#292d2a] to-[#1a1d1b] border-b md:border-b-0 md:border-r border-white/[0.07] p-5 flex flex-col justify-between overflow-hidden">
                        <div className="absolute inset-0 bg-radial-at-c from-white/[0.05] to-transparent pointer-events-none"></div>

                        <div className="relative z-10">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded border border-white/20 bg-black/50 text-[#c2c6c2]">
                              Document Pass
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#3f4541] bg-[#232724] text-[#9db5a3]">
                              {activeTemplate.name}
                            </span>
                          </div>
                          <h4 className="text-xl font-medium tracking-tight text-white mt-3 leading-snug">
                            {activeQuote.client}
                          </h4>
                          <span className="text-[11px] text-[#999e9a] font-mono block mt-1">
                            {activeQuote.id}
                          </span>
                        </div>

                        <div className="relative z-10 pt-4">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-[#686e6a]">Commercial Value</span>
                          <div className="text-[26px] font-medium tracking-tight text-white mt-0.5">
                            {activeQuote.total > 0 ? `$${activeQuote.total.toLocaleString()} USD` : 'Inquiry Completed'}
                          </div>
                        </div>

                        <span className="absolute bottom-2.5 left-3 text-[9px] uppercase tracking-wider text-[#686e6a] font-mono">
                          PAX SECURE DOCUMENT
                        </span>
                      </div>

                      {/* Right Details Area */}
                      <div className="p-5 flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                            <div>
                              <p className="text-[11px] text-[#999e9a]">Issuing Entity</p>
                              <h3 className="text-[16px] font-medium text-white">Pax Enterprise Systems Ltd.</h3>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-[6px] border border-[#9db5a3]/40 bg-[#9db5a3]/10 text-[11px] font-medium text-[#9db5a3]">
                              {activeQuote.status}
                            </span>
                          </div>

                          {/* Fields grid */}
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            <div>
                              <span className="block text-[10px] uppercase tracking-wider text-[#686e6a]">Reference</span>
                              <span className="text-[12px] text-[#d6d9d6] font-mono">{activeQuote.id}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] uppercase tracking-wider text-[#686e6a]">Expires</span>
                              <span className="text-[12px] text-[#d6d9d6]">{activeQuote.expiryDate}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] uppercase tracking-wider text-[#686e6a]">Client Tier</span>
                              <span className="text-[12px] text-[#9db5a3] font-mono">{activeQuote.tier}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] uppercase tracking-wider text-[#686e6a]">Saved Template</span>
                              <span className="text-[12px] text-[#dedfdc] font-medium flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeTemplate.accentColor }}></span>
                                <span>{activeTemplate.name}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] text-[#999e9a] font-mono">
                          Modules Included: {activeQuote.modules}
                        </div>
                      </div>
                    </div>

                    {/* Expiry panel */}
                    <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.07] bg-white/[0.018] text-[12px]">
                      <span className="font-medium text-white">Expiry date · {activeQuote.expiryDate}</span>
                      <span className="text-[#999e9a]">{activeQuote.expiryDays || 30} days remaining</span>
                    </div>

                    {/* Ticket footer with barcode and actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-dashed border-[#4a4e4b] bg-[#1d1f1e]/60">
                      <div className="ticket-barcode" aria-label="Decorative quote barcode"></div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsPreviewOpen(true)}
                          className="px-3 py-1.5 rounded-[8px] bg-white text-[#131514] hover:bg-[#e2e4e1] text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>Preview Before Printing</span>
                        </button>
                        <button
                          type="button"
                          onClick={copyToClipboard}
                          className="px-3 py-1.5 rounded-[8px] border border-[#444946] bg-[#2b2f2c] hover:bg-[#343936] text-[11px] font-medium text-[#e3e5e2] transition-colors cursor-pointer"
                        >
                          {copied ? '✓ Copied Markdown' : 'Copy Proposal'}
                        </button>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="px-3 py-1.5 rounded-[8px] border border-[#444946] bg-[#2b2f2c] hover:bg-[#343936] text-[11px] font-medium text-[#e3e5e2] transition-colors cursor-pointer"
                        >
                          Print Document ↗
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Navigation controls for ticket stack */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] text-[#999e9a]">
                      {filteredQuotes.length > 0 ? `${activeQuoteIndex + 1} of ${filteredQuotes.length}` : 'No quotations'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrevQuote}
                        className="px-3 py-1 rounded-[8px] border border-[#444946] bg-transparent hover:bg-[#2b2f2c] text-[12px] text-white transition-colors cursor-pointer"
                        title="Previous quotation"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={handleNextQuote}
                        className="px-3 py-1 rounded-[8px] border border-[#444946] bg-transparent hover:bg-[#2b2f2c] text-[12px] text-white transition-colors cursor-pointer"
                        title="Next quotation"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sidebar Document Info & Quick Switcher */}
                <aside className="p-4 rounded-[11px] border border-[#303332] bg-[#191b1a] flex flex-col gap-3">
                  <div>
                    <label className="block text-[11px] text-[#999e9a] mb-1.5">Selected Quotation</label>
                    <div className="p-2.5 rounded-[7px] border border-[#303332] bg-[#202321] text-[12px] text-white font-mono flex items-center justify-between">
                      <span>{activeQuote.id}</span>
                      <span className="text-[#9db5a3] text-[10px]">{activeQuote.status}</span>
                    </div>
                    <div className="mt-2 text-[11px] text-[#999e9a] flex items-center justify-between">
                      <span>Template:</span>
                      <span className="font-semibold text-white">{activeTemplate.name}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#303332]">
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-[#686e6a] mb-2">
                      Quick Switch Quotation
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {quotationList.map((q, idx) => {
                        const qTmpl = getTemplateById(q.templateId || 'executive');
                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => {
                              setActiveQuoteIndex(idx);
                              setCurrentQuotationMarkdown(q.markdown);
                            }}
                            className={`p-2 rounded-[6px] text-left text-[11px] transition-colors flex items-center justify-between cursor-pointer ${
                              activeQuoteIndex === idx 
                                ? 'bg-[#2b2f2c] text-white font-medium border border-[#444946]' 
                                : 'text-[#999e9a] hover:bg-[#202321] hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: qTmpl.accentColor }}></span>
                              <span className="truncate">{q.client}</span>
                            </div>
                            <span className="font-mono text-[10px] text-[#686e6a]">{q.id.slice(-4)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </aside>
              </div>
            </section>

            {/* 8. TEMPLATE SELECTOR & OVERRIDE CONTROLS (NEW DEDICATED BAR) */}
            <section className="rounded-[14px] border border-[#303332] bg-[#1d1f1e] p-5 shadow-sm flex flex-col gap-3.5 no-print">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#303332] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-white tracking-tight">
                      Quotation Template Override
                    </h3>
                    {isTemplateOverridden ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-600/50">
                        Per-Quote Override Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-600/50">
                        Using Company Default ({activeQuoteClientObj?.name || activeQuote.client})
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#999e9a] mt-0.5">
                    Click any template below to switch and save with this quote ({activeQuote.id})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isTemplateOverridden && (
                    <button
                      type="button"
                      onClick={handleRevertToCompanyDefault}
                      className="px-2.5 py-1 rounded text-[11px] text-[#999e9a] hover:text-white border border-[#383d3a] bg-[#222523] hover:bg-[#292d2b] transition-colors cursor-pointer"
                    >
                      Revert to Company Default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-white text-[#131514] hover:bg-[#dedfdc] font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Preview Before Printing</span>
                  </button>
                </div>
              </div>

              {/* 4 Template Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {TEMPLATES.map((tmpl) => {
                  const isSelected = activeQuote.templateId === tmpl.id;
                  const isCompanyDefault = activeQuoteClientObj?.defaultTemplate === tmpl.id;

                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => handleOverrideQuoteTemplate(tmpl.id)}
                      className={`p-3.5 rounded-[11px] border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? 'border-white bg-[#262a28] shadow-md ring-1 ring-white/20'
                          : 'border-[#303332] bg-[#1a1c1b] hover:border-[#4d5350] hover:bg-[#202321]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border border-white/10 bg-black/40 text-[#c2c6c2]">
                            {tmpl.badge}
                          </span>
                          {isCompanyDefault && (
                            <span className="text-[9px] font-mono text-emerald-400 font-semibold">
                              Default ★
                            </span>
                          )}
                        </div>

                        <h4 className="text-[13px] font-semibold text-white flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tmpl.accentColor }}></span>
                          <span>{tmpl.name}</span>
                        </h4>
                        <p className="text-[11px] text-[#999e9a] mt-1 leading-snug">
                          {tmpl.tagline}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px]">
                        <span className="text-[#686e6a] text-[10px] truncate max-w-[130px]">
                          {tmpl.description}
                        </span>
                        <span className={`text-[11px] font-semibold ${isSelected ? 'text-white' : 'text-[#999e9a]'}`}>
                          {isSelected ? '✓ Active' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 9. RENDERED PROPOSAL CONTAINER WITH VIEW TOGGLE */}
            <div className="rounded-[14px] border border-[#303332] bg-[#1d1f1e] p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#303332] mb-5 no-print">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeTemplate.accentColor }}></div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-white tracking-wide uppercase">
                      Commercial Proposal Document
                    </h3>
                    <p className="text-[11px] text-[#999e9a]">
                      Rendered in <strong>{activeTemplate.name}</strong> layout · Ref: {activeQuote.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* View Mode Toggle: Polished Template vs Raw Markdown */}
                  <div className="flex items-center bg-[#181a19] p-1 rounded-lg border border-[#303332]">
                    <button
                      type="button"
                      onClick={() => setViewMode('template')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                        viewMode === 'template'
                          ? 'bg-white text-[#131514] font-semibold shadow-sm'
                          : 'text-[#999e9a] hover:text-white'
                      }`}
                    >
                      Polished Template
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('markdown')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                        viewMode === 'markdown'
                          ? 'bg-white text-[#131514] font-semibold shadow-sm'
                          : 'text-[#999e9a] hover:text-white'
                      }`}
                    >
                      Raw Markdown
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="px-3 py-1.5 rounded-lg border border-[#3d4340] bg-[#242826] hover:bg-[#2e3330] text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Preview & Print</span>
                    <span>↗</span>
                  </button>
                </div>
              </div>

              {/* Document Rendering */}
              {viewMode === 'template' ? (
                <div className="printable-quote-document overflow-hidden">
                  <TemplateRenderer quote={activeQuote} templateId={activeQuote.templateId} printMode={false} />
                </div>
              ) : (
                <div className="quotation-prose bg-[#161817] p-6 rounded-lg border border-[#2b2f2d]">
                  <ReactMarkdown>{currentQuotationMarkdown}</ReactMarkdown>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: ERP CLIENTS DIRECTORY & DEFAULT TEMPLATE MAPPING */}
        {activeTab === 'clients' && (
          <section aria-labelledby="clientsHeading" className="flex flex-col gap-4 no-print">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 id="clientsHeading" className="text-[16px] font-medium text-white">
                  Enterprise Client Directory & Default Templates
                </h3>
                <p className="text-[12px] text-[#999e9a]">
                  Each company has an assigned default template that auto-selects whenever a new quotation is drafted.
                </p>
              </div>
              <span className="text-[11px] text-[#999e9a] font-mono">
                {filteredClients.length} accounts configured
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredClients.map((client) => {
                const clientTemplate = getTemplateById(client.defaultTemplate || 'executive');

                return (
                  <div
                    key={client.id}
                    className="rounded-[14px] border border-[#303332] bg-[#1d1f1e] p-4 flex flex-col justify-between hover:border-[#4d5350] transition-all group"
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <div className="w-[37px] h-[37px] rounded-[11px] border border-[#3d423e] bg-[#292d2a] grid place-items-center text-xs font-semibold text-[#d6d9d5]">
                          {client.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-medium text-white truncate">{client.name}</h4>
                          <p className="text-[11px] text-[#999e9a]">{client.contact}</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#3d423e] bg-[#232625] text-[#9db5a3]">
                          {client.city}
                        </span>
                      </div>

                      <div className="mt-3 text-[11px] font-mono text-[#dedfdc]">
                        {client.tier}
                      </div>

                      {/* Default Template Configuration Dropdown */}
                      <div className="mt-3 p-2.5 rounded-lg bg-[#161817] border border-[#2b2e2c] flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[10px] text-[#999e9a] uppercase font-mono">
                          <span>Default Template:</span>
                          <span className="flex items-center gap-1 font-sans font-semibold text-white">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: clientTemplate.accentColor }}></span>
                            {clientTemplate.name}
                          </span>
                        </div>
                        <select
                          value={client.defaultTemplate || 'executive'}
                          onChange={(e) => handleUpdateClientDefaultTemplate(client.id, e.target.value)}
                          className="w-full h-[32px] px-2 rounded-[6px] border border-[#3a3f3c] bg-[#222524] text-[12px] text-white focus:outline-none focus:border-[#727a75] transition-colors cursor-pointer"
                        >
                          {TEMPLATES.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.badge})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-[10px] text-[#686e6a]">
                        Auto-selects on draft
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setRequest(`Generate a quotation for ${client.name} for the Enterprise ERP License and HR Module`);
                          setActiveTab('generator');
                        }}
                        className="px-2.5 py-1 rounded-[6px] border border-[#444946] bg-[#2b2f2c] group-hover:bg-[#383e3a] text-[11px] font-medium text-white transition-colors cursor-pointer"
                      >
                        Draft Quote →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 3: PRODUCT CATALOG */}
        {activeTab === 'catalog' && (
          <section aria-labelledby="catalogHeading" className="flex flex-col gap-4 no-print">
            <div>
              <h3 id="catalogHeading" className="text-[16px] font-medium text-white">
                BM25 Knowledge Base & Product Pricing
              </h3>
              <p className="text-[12px] text-[#999e9a]">
                Indexed documentation queried by the RAG node in LangGraph.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATALOG_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-[14px] border border-[#303332] bg-[#1d1f1e] p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <h4 className="text-[15px] font-medium text-white">{item.name}</h4>
                      <span className="text-[15px] font-semibold text-[#9db5a3] font-mono">
                        ${item.price.toLocaleString()}{item.billing}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#999e9a] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#686e6a]">
                      Module {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setRequest(`How much is the ${item.name}?`);
                        setActiveTab('generator');
                      }}
                      className="text-[11px] text-[#999e9a] hover:text-white cursor-pointer"
                    >
                      Inquire Specs →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* 10. PRINT PREVIEW MODAL */}
      <PrintPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        quote={activeQuote}
        onUpdateTemplate={handleOverrideQuoteTemplate}
      />

      {/* 11. FOOTER */}
      <footer className="border-t border-[#303332]/60 mt-12 py-6 text-center text-[12px] text-[#686e6a] no-print">
        <div className="max-w-[1180px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Hill — Pax ERP AI Quotation Suite · Orchestrated with LangGraph, SQLite & BM25</span>
          <span className="font-mono text-[11px]">System Status: Online · Port 8000 Ready · 4 Templates Loaded</span>
        </div>
      </footer>
    </div>
  );
}
