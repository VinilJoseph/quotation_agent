import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [request, setRequest] = useState('');
  const [quotation, setQuotation] = useState('');
  const [logs, setLogs] = useState([]); // State to hold the tool logs
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setQuotation('');
    setLogs([]);
    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_request: request }),
      });
      const data = await res.json();
      setQuotation(data.quotation);
      setLogs(data.logs); // Save the logs from the backend
    } catch (error) {
      setQuotation("Error connecting to FastAPI backend.");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-2">Pax ERP - AI Quotation Agent</h1>
      <p className="text-gray-600 mb-6">Orchestrated with LangGraph, SQL, and BM25 RAG</p>
      
      <div className="flex gap-2 mb-6">
        <input 
          className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="e.g., Generate a quote for ADNOC for the Enterprise ERP License and HR Module" 
          value={request}
          onChange={(e) => setRequest(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium whitespace-nowrap transition-colors disabled:opacity-50" 
          onClick={handleGenerate}
          disabled={loading || !request}
        >
          {loading ? 'Running Agent...' : 'Generate Quote'}
        </button>
      </div>

      {/* RENDER THE TOOL USAGE LOGS HERE */}
      {logs.length > 0 && (
        <div className="mb-6 p-4 bg-gray-900 rounded-lg text-green-400 font-mono text-sm shadow-inner">
          <h3 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Agent Execution Trace</h3>
          <ul className="space-y-2">
            {logs.map((log, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-gray-500">[{index + 1}]</span>
                <span>{log}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {quotation && (
        <div className="border border-gray-200 p-8 bg-white rounded-lg shadow-sm prose">
          <ReactMarkdown>{quotation}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}