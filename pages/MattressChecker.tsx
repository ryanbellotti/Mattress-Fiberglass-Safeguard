import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, HelpCircle, ExternalLink, Loader2 } from 'lucide-react';
import { checkBrandWithSearch } from '../services/geminiService';

const MattressChecker: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const data = await checkBrandWithSearch(query);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-danger border-danger/50 bg-danger/10';
      case 'medium': return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
      case 'low': return 'text-success border-success/50 bg-success/10';
      default: return 'text-muted border-white/10 bg-white/5';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display tracking-wide text-white">Fiberglass Checker</h1>
        <p className="text-muted max-w-xl mx-auto">
          Enter a brand or model name. We use <strong>Gemini Search Grounding</strong> to scour the web for the latest reports, lawsuits, and ingredient lists.
        </p>
      </div>

      <div className="neuro-card p-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Zinus Green Tea, Nectar, Ashley Chime..."
            className="flex-1 neuro-inset px-6 py-4 text-lg bg-transparent text-white outline-none focus:ring-2 ring-primary/50 transition-all"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="neuro-btn neuro-btn-primary px-8 py-4 font-bold flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
            Check
          </button>
        </form>
      </div>

      {result && (
        <div className="neuro-card p-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 capitalize">{query}</h2>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border ${getRiskColor(result.riskLevel)}`}>
                {result.riskLevel === 'high' && <AlertTriangle size={16} />}
                {result.riskLevel === 'medium' && <HelpCircle size={16} />}
                {result.riskLevel === 'low' && <CheckCircle size={16} />}
                Risk Level: {result.riskLevel?.toUpperCase()}
              </div>
            </div>
            
            <div className="text-right">
              <span className={`text-4xl font-display ${result.containsFiberglass ? 'text-danger' : 'text-success'}`}>
                {result.containsFiberglass ? 'YES' : 'LIKELY NO'}
              </span>
              <p className="text-xs text-muted uppercase tracking-wider">Fiberglass Detected</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-2">AI Analysis Summary</h3>
            <p className="text-gray-200 leading-relaxed">{result.summary}</p>
          </div>

          {result.sources && result.sources.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">Sources (Google Search)</h3>
              <ul className="space-y-2">
                {result.sources.map((source: string, i: number) => (
                  <li key={i}>
                    <a 
                      href={source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:underline text-sm truncate"
                    >
                      <ExternalLink size={14} />
                      {source}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MattressChecker;
