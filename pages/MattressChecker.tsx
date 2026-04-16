import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, HelpCircle, ExternalLink, Loader2, ShieldCheck, Database } from 'lucide-react';
import { checkBrandWithSearch } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

// Sample data derived from the provided export
const LOCAL_DATABASE = [
  { brand: "Tulo", model: "", risk: "high", fg: true, history: "Known to use fiberglass" },
  { brand: "Sunrising Bedding", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Zoma", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Zenhaven", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Tempur-Pedic", model: "", risk: "medium", fg: true, history: "Uses woven silica yarn" },
  { brand: "Vesgantti", model: "", risk: "high", fg: true, history: "Multiple credible consumer complaints" },
  { brand: "Subrtex", model: "", risk: "high", fg: true, history: "Consumer reports suggest fiberglass" },
  { brand: "Vibe", model: "", risk: "medium", fg: false, history: "Models before March 2023 contained fiberglass" },
  { brand: "Wayfair Sleep", model: "", risk: "high", fg: true, history: "High number of consumer reports" },
  { brand: "WinkBeds", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Sweetnight", model: "", risk: "medium", fg: true, history: "Extensive consumer reports" },
  { brand: "Tuft & Needle Nod", model: "", risk: "high", fg: true, history: "Confirmed to contain fiberglass" },
  { brand: "Tuft & Needle", model: "Main Lines", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Zinus", model: "", risk: "medium", fg: false, history: "Older models extensively used fiberglass; Phasing out post-2024" },
  { brand: "Zinus", model: "Green Tea Memory Foam", risk: "high", fg: true, history: "Subject of major lawsuits" },
  { brand: "Casper", model: "", risk: "low", fg: false, history: "Discontinued Nova Hybrid contained fiberglass" },
  { brand: "Douglas (US)", model: "", risk: "high", fg: true, history: "Confirmed to contain fiberglass" },
  { brand: "Mainstays (Walmart)", model: "", risk: "high", fg: true, history: "Confirmed to use fiberglass" },
  { brand: "Allswell (Walmart)", model: "", risk: "high", fg: true, history: "Confirmed to contain fiberglass" },
  { brand: "Molecule Mattress", model: "", risk: "medium", fg: true, history: "Confirmed to have used fiberglass" },
  { brand: "Brooklyn Bedding", model: "All Models", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Full Moon Mattress (US)", model: "", risk: "high", fg: true, history: "Known to contain fiberglass" },
  { brand: "Novaform", model: "", risk: "low", fg: false, history: "Original collections contained fiberglass; post-2024 free" },
  { brand: "Siena", model: "", risk: "low", fg: false, history: "Earliest versions had fiberglass" },
  { brand: "Eight Sleep", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Sleep Innovations", model: "", risk: "high", fg: true, history: "Confirmed to use fiberglass" },
  { brand: "Sleep Number", model: "", risk: "low", fg: false, history: "Older models may have contained fiberglass" },
  { brand: "Sleepy's", model: "", risk: "medium", fg: true, history: "Mixed and unclear history" },
  { brand: "Lucid", model: "", risk: "high", fg: true, history: "Widely reported to contain fiberglass" },
  { brand: "Olee Sleep", model: "", risk: "high", fg: true, history: "Consumer reports confirm fiberglass" },
  { brand: "GhostBed", model: "", risk: "low", fg: false, history: "Early models had reports" },
  { brand: "Linenspa", model: "", risk: "high", fg: true, history: "Notorious for containing fiberglass" },
  { brand: "Puffy", model: "", risk: "low", fg: false, history: "Discontinued models contained fiberglass" },
  { brand: "Bear Mattress", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Birch", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Home Life", model: "", risk: "medium", fg: false, history: "Older models contained fiberglass" },
  { brand: "Bedstory", model: "", risk: "medium", fg: true, history: "Frequently cited in consumer complaints" },
  { brand: "Avenco Hybrid", model: "", risk: "high", fg: true, history: "Numerous consumer reports" },
  { brand: "Ashley Furniture", model: "Chime", risk: "high", fg: true, history: "Chime Series contains fiberglass" },
  { brand: "DreamCloud", model: "", risk: "low", fg: false, history: "Early reports existed" },
  { brand: "Purple", model: "", risk: "none", fg: false, history: "Never used woven fiberglass" },
  { brand: "Classic Brands", model: "", risk: "high", fg: true, history: "Confirmed to use fiberglass" },
  { brand: "Lull", model: "", risk: "low", fg: false, history: "Some early models had reports" },
  { brand: "Serta", model: "", risk: "low", fg: false, history: "Older models used fiberglass" },
  { brand: "Loom & Leaf", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Novilla", model: "", risk: "high", fg: true, history: "Many consumer reports" },
  { brand: "NapQueen", model: "", risk: "high", fg: true, history: "Multiple consumer reports" },
  { brand: "Avocado", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Awara", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "IKEA", model: "", risk: "low", fg: false, history: "Only Amsosen model confirmed" },
  { brand: "Emma", model: "", risk: "low", fg: false, history: "Older European models had issues" },
  { brand: "Helix Sleep", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Big Fig", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Brentwood Home", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Layla", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Milliard", model: "", risk: "high", fg: true, history: "Consumer reports exist" },
  { brand: "PrimaSleep", model: "", risk: "high", fg: true, history: "Reports of fiberglass" },
  { brand: "Crystli", model: "", risk: "high", fg: true, history: "High number of consumer reports" },
  { brand: "Amerisleep", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Nectar", model: "", risk: "none", fg: false, history: "Never used in current models" },
  { brand: "Nest Bedding", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Posh & Lavish", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Silk & Snow (US)", model: "", risk: "high", fg: true, history: "Confirmed to contain fiberglass" },
  { brand: "Best Price Mattress", model: "", risk: "high", fg: true, history: "Confirmed to contain fiberglass" },
  { brand: "Saatva", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Sealy", model: "", risk: "medium", fg: true, history: "All-foam models often contain fiberglass" },
  { brand: "Kingsdown", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Leesa", model: "", risk: "medium", fg: false, history: "Pre-2023 models contained fiberglass" },
  { brand: "Perfect Cloud", model: "", risk: "high", fg: true, history: "Confirmed to have used fiberglass" },
  { brand: "Stearns & Foster", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "Nolah", model: "", risk: "none", fg: false, history: "Never used fiberglass" },
  { brand: "AmazonBasics", model: "", risk: "high", fg: true, history: "Widely reported by consumers" },
  { brand: "Molblly", model: "", risk: "high", fg: true, history: "Confirmed by many consumers" },
  { brand: "Beautyrest", model: "", risk: "low", fg: false, history: "Some older/budget models reported" },
  { brand: "Kirkland Signature", model: "", risk: "none", fg: false, history: "Never used fiberglass" }
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
      const lowerQuery = query.toLowerCase();
      const localMatch = LOCAL_DATABASE.find(item => 
        item.brand.toLowerCase().includes(lowerQuery) ||
        (item.model && item.model.toLowerCase().includes(lowerQuery))
      );
      
      if (localMatch) {
         setResult({
           summary: `${localMatch.history}. Risk Level: ${localMatch.risk.toUpperCase()}.`,
           riskLevel: localMatch.risk,
           containsFiberglass: localMatch.fg,
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
          Verify safety profiles instantly. We merge our <span className="text-white font-bold">Local Repository (60+ Brands)</span> with <span className="text-accent font-bold">Gemini Live Search Grounding</span> to give you the final word on any mattress.
        </p>
      </div>

      <div className="glass-card p-10 shadow-2xl border-white/5">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query brand or model name (e.g. Zinus, Nectar)..."
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
                 Verified Database Match
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
                  {result.containsFiberglass ? 'POSITIVE' : 'NEGATIVE'}
                </span>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Fiberglass Presence Protocol</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white/5 rounded-3xl p-8 border border-white/5 shadow-inner">
                <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Loader2 size={12} className="text-accent" /> Audit Summary
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
                    <p className="text-[10px] text-muted italic">Internal Database Record.</p>
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