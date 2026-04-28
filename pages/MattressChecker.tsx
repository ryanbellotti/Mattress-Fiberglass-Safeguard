import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, HelpCircle, ExternalLink, Loader2, ShieldCheck, Database, Info } from 'lucide-react';
import { checkBrandWithSearch } from '@/services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

// Updated full local database from user provided list
const LOCAL_DATABASE = [
  { brand: "Tulo", risk: "high", fg: true, notes: "Known to use fiberglass" },
  { brand: "Sunrising Bedding", risk: "none", fg: false, notes: "States it has never used fiberglass" },
  { brand: "Zoma", risk: "none", fg: false, notes: "An Amerisleep brand, no fiberglass" },
  { brand: "Zenhaven", risk: "none", fg: false, notes: "A Saatva brand, uses wool/cotton" },
  { brand: "Tempur-Pedic", risk: "medium", fg: true, notes: "Uses woven silica yarn" },
  { brand: "Vesgantti", risk: "high", fg: true, notes: "Multiple credible reports of fiberglass" },
  { brand: "Subrtex", risk: "high", fg: true, notes: "Consumer reports state fiberglass presence" },
  { brand: "Vibe", risk: "medium", fg: false, notes: "Models before 2024 likely had fiberglass" },
  { brand: "Wayfair Sleep", risk: "high", fg: true, notes: "High number of consumer reports" },
  { brand: "WinkBeds", risk: "none", fg: false, notes: "Uses a rayon-based flame barrier" },
  { brand: "Sweetnight", risk: "medium", fg: true, notes: "Extensive consumer reports" },
  { brand: "Tuft & Needle Nod", risk: "high", fg: true, notes: "Confirmed to contain fiberglass" },
  { brand: "Swiss Ortho Sleep", risk: "high", fg: true, notes: "Reports from consumers" },
  { brand: "Tuft & Nee Main Line", risk: "none", fg: false, notes: "Never used fiberglass" },
  { brand: "Zinus", risk: "medium", fg: false, notes: "Older models had fiberglass. Currently phasing out." },
  { brand: "My Green Mattress", risk: "none", fg: false, notes: "Uses organic materials" },
  { brand: "Novosbed", risk: "none", fg: false, notes: "Owned by GoodMorning.com" },
  { brand: "Casper", risk: "low", fg: false, notes: "Current models use a rayon barrier" },
  { brand: "Douglas (US)", risk: "high", fg: true, notes: "Confirmed to contain fiberglass" },
  { brand: "Mainstays", risk: "high", fg: true, notes: "Confirmed to use fiberglass" },
  { brand: "Allswell", risk: "high", fg: true, notes: "Confirmed to use fiberglass" },
  { brand: "Molecule Mattress", risk: "medium", fg: true, notes: "Confirmed to have used fiberglass" },
  { brand: "Brooklyn Bedding", risk: "none", fg: false, notes: "Never used fiberglass" },
  { brand: "Full Moon Mattress", risk: "high", fg: true, notes: "Known to contain fiberglass" },
  { brand: "Novaform", risk: "low", fg: false, notes: "All models since 2020 are fiberglass free" },
  { brand: "Siena", risk: "low", fg: false, notes: "Current versions use a rayon barrier" },
  { brand: "Eight Sleep", risk: "none", fg: false, notes: "Never used fiberglass" },
  { brand: "Sleep Innovations", risk: "high", fg: true, notes: "Confirmed to use fiberglass" },
  { brand: "Sleep Number", risk: "low", fg: false, notes: "Company states they do not use it currently" },
  { brand: "Sleepy's", risk: "medium", fg: true, notes: "Mixed and unclear history" },
  { brand: "Bedinabox", risk: "none", fg: false, notes: "Never used fiberglass" },
  { brand: "Lucid", risk: "high", fg: true, notes: "Widely reported to contain fiberglass" },
  { brand: "Olee Sleep", risk: "high", fg: true, notes: "Consumer reports confirm fiberglass" },
  { brand: "GhostBed", risk: "low", fg: false, notes: "Company states current models are fiberglass free" },
  { brand: "Linenspa", risk: "high", fg: true, notes: "Notorious for containing fiberglass" },
  { brand: "Puffy", risk: "low", fg: false, notes: "Current models use alternative barriers" },
  { brand: "Bear Mattress", risk: "none", fg: false, notes: "Uses a fire sock made of rayon/cotton" },
  { brand: "Birch", risk: "none", fg: false, notes: "Owned by Helix, uses natural materials" },
  { brand: "Home Life", risk: "medium", fg: false, notes: "Budget brand, older models suspect" },
  { brand: "Bedstory", risk: "medium", fg: true, notes: "Frequently cited in consumer reports" },
  { brand: "Avenco Hybrid", risk: "high", fg: true, notes: "Numerous consumer reports" },
  { brand: "Ashley Furniture", risk: "medium", fg: false, notes: "Post-2024 models appear fiberglass free" },
  { brand: "DreamCloud", risk: "low", fg: false, notes: "Owned by Resident Home, uses rayon" },
  { brand: "Classic Brands", risk: "high", fg: true, notes: "Confirmed to use fiberglass" },
  { brand: "Lull", risk: "low", fg: false, notes: "Company states they do not use fiberglass" },
  { brand: "Serta", risk: "low", fg: false, notes: "Major brand, largely transitioned away" },
  { brand: "Loom & Leaf", risk: "none", fg: false, notes: "A Saatva brand, uses wool" },
  { brand: "Novilla", risk: "high", fg: true, notes: "Many consumer reports" },
  { brand: "NapQueen", risk: "high", fg: true, notes: "Treat as high risk" },
  { brand: "Avocado", risk: "none", fg: false, notes: "Uses GOTS certified wool" },
  { brand: "Awara", risk: "none", fg: false, notes: "Never used fiberglass" },
  { brand: "IKEA", risk: "low", fg: false, notes: "Vast majority of mattresses use rayon/polyester" },
  { brand: "Emma", risk: "low", fg: false, notes: "European company, generally avoids fiberglass" },
  { brand: "Signature Sleep", risk: "medium", fg: false, notes: "Newer models claim fiberglass free" },
  { brand: "Helix Sleep", risk: "none", fg: false, notes: "Uses a rayon-based fire barrier" },
  { brand: "Big Fig", risk: "none", fg: false, notes: "Never used fiberglass" },
  { brand: "Brentwood Home", risk: "none", fg: false, notes: "Sister brand to Avocado" },
  { brand: "Layla", risk: "none", fg: false, notes: "Never used fiberglass" },
  { brand: "Milliard", risk: "high", fg: true, notes: "Consumer reports confirm fiberglass" },
  { brand: "PrimaSleep", risk: "high", fg: true, notes: "Reports of fiberglass presence" },
  { brand: "Crystli", risk: "high", fg: true, notes: "High number of consumer reports" },
  { brand: "Amerisleep", risk: "none", fg: false, notes: "Consistent history of avoiding fiberglass" },
  { brand: "Diamond Mattress", risk: "none", fg: false, notes: "Uses alternative barriers" },
  { brand: "Nectar", risk: "none", fg: false, notes: "Owned by Resident, current models are free" },
  { brand: "Nest Bedding", risk: "none", fg: false, notes: "Never used fiberglass" },
  { brand: "Posh & Lavish", risk: "none", fg: false, notes: "Luxury brand, natural materials" },
  { brand: "Silk & Snow", risk: "high", fg: true, notes: "Confirmed to contain fiberglass in some US versions" },
  { brand: "Best Price Mattress", risk: "high", fg: true, notes: "Confirmed to contain fiberglass" },
  { brand: "Saatva", risk: "none", fg: false, notes: "Uses natural thistle or wool" },
  { brand: "Sealy", risk: "medium", fg: false, notes: "Major brand, some older models suspect" },
  { brand: "Kingsdown", risk: "none", fg: false, notes: "States use of alternative barriers" },
  { brand: "Leesa", risk: "medium", fg: false, notes: "Models before Sept 2023 may have fiberglass" },
  { brand: "Perfect Cloud", risk: "high", fg: true, notes: "Confirmed to have used fiberglass" },
  { brand: "5 Little Monkeys", risk: "none", fg: false, notes: "Never contained fiberglass" },
  { brand: "Stearns & Foster", risk: "none", fg: false, notes: "Luxury brand, uses alternative materials" },
  { brand: "Nolah", risk: "none", fg: false, notes: "Uses a rayon barrier" },
  { brand: "AmazonBasics", risk: "high", fg: true, notes: "Widely reported by consumers" },
  { brand: "Molblly", risk: "high", fg: true, notes: "Confirmed by many consumer reports" },
  { brand: "Beautyrest", risk: "low", fg: false, notes: "Main lines avoid fiberglass" },
  { brand: "Kirkland Signature", risk: "low", fg: false, notes: "Made by Stearns & Foster typically" }
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
      const lowerQuery = query.toLowerCase();
      const localMatch = LOCAL_DATABASE.find(item => item.brand.toLowerCase().includes(lowerQuery));

      let data = null;
      try {
        data = await checkBrandWithSearch(query);
      } catch(e) {
        console.error("Gemini fallback failed", e);
      }
      
      if (localMatch) {
         setResult({
           ...data,
           riskLevel: localMatch.risk,
           containsFiberglass: localMatch.fg,
           summary: localMatch.notes + (data ? `\n\nAI Additional Context: ${data.summary}` : ''),
           isLocalMatch: true,
           sources: data ? data.sources : []
         });
      } else if (data) {
         setResult(data);
      } else {
         setResult({
            riskLevel: 'medium',
            containsFiberglass: false,
            summary: "No local data found and AI search failed. Proceed with caution.",
            isLocalMatch: false,
            sources: []
         });
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
              <div className="absolute top-0 right-0 bg-accent/20 text-accent px-4 py-1.5 text-[10px] font-bold uppercase rounded-bl-xl border-b border-l border-accent/30 flex items-center gap-1">
                 <ShieldCheck size={12} /> Database Verified
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
                  <Info size={12} className="text-accent" /> Audit Summary
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">{result.summary}</p>
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
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-accent hover:text-white text-[10px] font-bold uppercase transition-colors truncate"
                      >
                        <ExternalLink size={12} /> VERIFIED LINK {i+1}
                      </a>
                    ))
                  ) : (
                    <p className="text-[10px] text-muted italic">No external grounding required or available.</p>
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
