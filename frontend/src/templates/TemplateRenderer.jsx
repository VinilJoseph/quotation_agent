import ExecutiveTemplate from './ExecutiveTemplate';
import GulfPrestigeTemplate from './GulfPrestigeTemplate';
import TechnicalBlueprintTemplate from './TechnicalBlueprintTemplate';
import ClassicCommercialTemplate from './ClassicCommercialTemplate';
import { getQuoteDetails } from './templateRegistry';

export default function TemplateRenderer({ quote, templateId, printMode = false }) {
  if (!quote) return null;

  const normalizedQuote = getQuoteDetails(quote);
  const selectedTemplate = templateId || normalizedQuote.templateId || 'executive';

  switch (selectedTemplate) {
    case 'prestige':
      return <GulfPrestigeTemplate quote={normalizedQuote} printMode={printMode} />;
    case 'technical':
      return <TechnicalBlueprintTemplate quote={normalizedQuote} printMode={printMode} />;
    case 'classic':
      return <ClassicCommercialTemplate quote={normalizedQuote} printMode={printMode} />;
    case 'executive':
    default:
      return <ExecutiveTemplate quote={normalizedQuote} printMode={printMode} />;
  }
}
