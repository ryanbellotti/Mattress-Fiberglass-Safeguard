import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, HelpCircle, ExternalLink, Loader2, ShieldCheck, Database } from 'lucide-react';
import { checkBrandWithSearch } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

// Sample data derived from the provided CSV for instant hits
const LOCAL_DATABASE = [
  { brand: "Tulo", risk: "high", fg: true },
  { brand: "Zinus", risk: "medium", fg: false }, // Post-2024
  { brand: "Linenspa", risk: "high", fg: true },
  { brand: "Purple", risk: "none", fg: false },
  { brand: "Tempur-Pedic", risk: "medium", fg: true },
  { brand: "Casper", risk: "low", fg: false }
];

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
      // Logic: Check local first for "Instant Discovery", then fall back to Search Grounding
      const localMatch = LOCAL_DATABASE.find(item => item.brand.toLowerCase().includes(query.toLowerCase()));
      
      if (localMatch) {
         setResult({
           riskLevel: localMatch.risk,
           containsFiberglass: localMatch.fg,
           summary: `This brand was found in our verified local database. Risk Level: ${localMatch.risk.charAt(0).toUpperCase() + localMatch.risk.slice(1)}. Fiberglass Presence: ${localMatch.fg ? 'Confirmed' : 'Not Detected'}.`,
           sources: [],
           isLocalMatch: true
         });
      } else {
         const data = await checkBrandWithSearch(query);
         setResult(data);
      }
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
      case 'none': return 'text-success border-success/50 bg-success/10';
      default: return 'text-muted border-white/10 bg-white/5';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-display tracking-tight text-white uppercase">Brand Auditor</h1>
        <p className="text-muted text-sm max-w-xl mx-auto font-medium">
          Verify safety profiles instantly. We merge our <span className="text-white font-bold">Local Repository</span> with <span className="text-accent font-bold">Gemini Live Search Grounding</span> to give you the final word on any mattress.
        </p>
      </div>

      <div className="glass-card p-10 shadow-2xl border-white/5">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query brand or model name..."
              className="w-full neuro-inset px-8 py-5 text-lg bg-transparent text-white outline-none focus:ring-2 ring-primary/40 transition-all rounded-2xl"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/30">
              <Database size={20} />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="neuro-btn bg-primary hover:bg-primary/80 text-white px-10 rounded-2xl font-bold flex items-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
            AUDIT
          </button>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 relative overflow-hidden"
          >
            {result.isLocalMatch && (
              <div className="absolute top-0 right-0 bg-accent/20 text-accent px-4 py-1.5 text-[10px] font-bold uppercase rounded-bl-xl border-b border-l border-accent/30">
                 Database Verified
              </div>
            )}
            
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-display text-white uppercase tracking-wider">{query}</h2>
                <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold border ${getRiskColor(result.riskLevel)}`}>
                  {result.riskLevel === 'high' && <AlertTriangle size={18} />}
                  {result.riskLevel === 'medium' && <HelpCircle size={18} />}
                  {(result.riskLevel === 'low' || result.riskLevel === 'none') && <ShieldCheck size={18} />}
                  RISK RATING: {result.riskLevel?.toUpperCase()}
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <span className={`text-7xl font-display tracking-tighter ${result.containsFiberglass ? 'text-danger' : 'text-success'}`}>
                  {result.containsFiberglass ? 'DETECTION' : 'NEGATIVE'}
                </span>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Fiberglass Presence Protocol</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white/5 rounded-3xl p-8 border border-white/5 shadow-inner">
                <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Loader2 size={12} className="text-accent" /> AI Audit Summary
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">{result.summary}</p>
              </div>
              
              <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4">Uplink Sources</h3>
                <div className="space-y-3">
                  {result.sources && result.sources.length > 0 ? (
                    result.sources.map((source: string, i: number) => (
                      <a 
                        key={i} 
                        href={source} 
                        target="_blank" 
                        className="flex items-center gap-2 text-accent hover:text-white text-[10px] font-bold uppercase transition-colors truncate"
                      >
                        <ExternalLink size={12} /> VERIFIED LINK {i+1}
                      </a>
                    ))
                  ) : (
                    <p className="text-[10px] text-muted italic">No external grounding required.</p>
                  )}
                </div>
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MattressChecker;