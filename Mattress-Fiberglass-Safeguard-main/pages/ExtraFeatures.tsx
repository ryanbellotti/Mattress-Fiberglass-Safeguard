import React, { useState } from 'react';
import { BookOpen, Users, AlertCircle, Mail, Search, MessageSquare, Send, CheckCircle2, Sparkles, Loader2, ShieldAlert, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const EducationHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const articles = [
    { title: "Understanding Modacrylic & Silica", category: "Materials", desc: "Why 'Glass Free' marketing can still mean hazardous fire barriers." },
    { title: "HVAC Contamination Dynamics", category: "Physics", desc: "How particles travel through ductwork and why filter changes aren't enough." },
    { title: "Legal Rights & Class Actions", category: "Legal", desc: "Current status of lawsuits against Zinus, Ashley Furniture, and others." },
    { title: "Health Impacts of Inhalation", category: "Medical", desc: "Differentiating between temporary irritation and chronic respiratory issues." }
  ];

  const handleDeepDive = async (topic: string) => {
    setIsLoading(true);
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Explain "${topic}" in the context of mattress fiberglass safety. Keep it concise (under 100 words) but highly technical and accurate.`
        });
        setActiveAnalysis(response.text || "Analysis unavailable.");
    } catch(e) {
        setActiveAnalysis("Neural uplink failed.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-display text-white uppercase tracking-tighter">Education Nexus</h1>
        <p className="text-accent text-xs font-bold uppercase tracking-[0.3em]">Deep Dive Intelligence</p>
      </div>
      
      <div className="glass-card p-6 flex items-center gap-4">
        <Search className="text-muted" />
        <input 
          type="text" 
          placeholder="Search knowledge base..." 
          className="bg-transparent border-none outline-none w-full text-white placeholder-muted"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {activeAnalysis && (
          <div className="p-6 bg-primary/10 border border-primary/30 rounded-2xl relative">
              <div className="absolute top-4 right-4 text-primary cursor-pointer hover:text-white" onClick={() => setActiveAnalysis(null)}>Close</div>
              <h3 className="text-primary font-bold uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                  <Sparkles size={12} /> Gemini 3 Analysis
              </h3>
              <p className="text-gray-200 text-sm leading-relaxed">{activeAnalysis}</p>
          </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())).map((article, i) => (
          <div key={i} className="glass-card p-8 hover:bg-white/5 transition-colors cursor-pointer group relative">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block">{article.category}</span>
            <h3 className="text-2xl font-display text-white uppercase mb-2 group-hover:text-accent transition-colors">{article.title}</h3>
            <p className="text-muted text-sm mb-4">{article.desc}</p>
            <button 
                onClick={(e) => { e.stopPropagation(); handleDeepDive(article.title); }}
                disabled={isLoading}
                className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-2 hover:text-white"
            >
                {isLoading ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                Ask AI to Explain
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CommunityForum: React.FC = () => {
  const [draftMode, setDraftMode] = useState(false);
  const [aiDraft, setAiDraft] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  const generateDraft = async () => {
      setIsDrafting(true);
      try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Draft a short, empathetic, and clear forum post for someone who just discovered fiberglass in their mattress. They are scared and need advice. Ask for help."
        });
        setAiDraft(response.text || "");
      } catch (e) {
          console.error(e);
      } finally {
          setIsDrafting(false);
      }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-center space-y-8">
      <div className="space-y-2">
        <h1 className="text-5xl font-display text-white uppercase tracking-tighter">Community Nexus</h1>
        <p className="text-secondary text-xs font-bold uppercase tracking-[0.3em]">Connect with 20,000+ Survivors</p>
      </div>

      <div className="glass-card p-12 space-y-6">
        <Users size={64} className="mx-auto text-secondary" />
        <h2 className="text-2xl text-white font-bold">The "Do Not Remove The Cover" Group</h2>
        <p className="text-gray-300 max-w-xl mx-auto">
          We partner directly with the largest advocacy group on Facebook. Share your story, get emotional support, and compare photos with thousands of others who understand exactly what you are going through.
        </p>
        <div className="flex justify-center gap-4">
            <a 
            href="https://facebook.com/donotremovethecover" 
            target="_blank" 
            rel="noopener noreferrer"
            className="neuro-btn bg-secondary text-white px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2"
            >
            <MessageSquare size={20} /> JOIN DISCUSSION
            </a>
            <button 
                onClick={() => { setDraftMode(!draftMode); if(!aiDraft) generateDraft(); }}
                className="neuro-btn border border-white/10 text-white px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-white/5"
            >
                <Sparkles size={20} className={isDrafting ? "animate-spin" : ""} /> {draftMode ? "Close Assistant" : "AI Draft Helper"}
            </button>
        </div>

        {draftMode && (
            <div className="text-left bg-black/40 p-6 rounded-2xl border border-white/10 mt-6">
                <p className="text-[10px] text-muted uppercase font-bold tracking-widest mb-2">Gemini Generated Draft:</p>
                <p className="text-sm text-gray-300 italic mb-4">{aiDraft}</p>
                <button className="text-xs text-secondary font-bold uppercase" onClick={() => navigator.clipboard.writeText(aiDraft)}>Copy to Clipboard</button>
            </div>
        )}
      </div>
    </div>
  );
};

export const ReportIncident: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-display text-white uppercase tracking-tighter">Incident Command</h1>
        <p className="text-danger text-xs font-bold uppercase tracking-[0.3em]">Submit Data & Notify Federal Authorities</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        
        {/* SECTION 1: USER FORM (Requested First) */}
        <div className="flex flex-col items-center space-y-4">
             <div className="glass-card p-2 bg-white rounded-[3rem] border-8 border-surface shadow-2xl relative">
                {/* iPhone-like Frame Element */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-surface rounded-b-2xl z-10"></div>
                <iframe
                    id="JotFormIFrame-253007406534147"
                    title="Mattress Fiberglass Leak Report"
                    allow="geolocation; microphone; camera"
                    src="https://www.jotform.com/app/253007406534147?appEmbedded=1"
                    style={{ height: '700px', width: '375px', border: 'none', borderRadius: '2rem' }}
                />
             </div>
             <p className="text-xs text-muted uppercase tracking-widest mt-4">SafeGuard Internal Advocate Registry</p>
        </div>

        {/* SECTION 2: FEDERAL REPORT (Predominant & Important) */}
        <div className="space-y-8 lg:sticky lg:top-24">
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-danger/20 to-danger/5 border border-danger/30 relative overflow-hidden shadow-[0_0_50px_rgba(244,63,94,0.15)]">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-danger">
                    <ShieldAlert size={140} />
                </div>
                
                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-danger text-white text-[10px] font-bold uppercase tracking-widest">
                        <AlertCircle size={12} /> Federal Action Required
                    </div>
                    
                    <h2 className="text-4xl font-display text-white uppercase leading-[0.9]">
                        File a CPSC Complaint <span className="text-danger">Immediately</span>
                    </h2>
                    
                    <p className="text-gray-200 text-sm leading-relaxed font-medium">
                        While our internal form collects data for advocacy, filing with <strong>SaferProducts.gov</strong> is the <span className="text-white underline decoration-danger underline-offset-4">only legal mechanism</span> that forces the U.S. Government to investigate and issue recalls.
                    </p>

                    <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2 mb-2">Why This Is Critical</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-xs text-gray-300">
                                <CheckCircle2 size={14} className="text-danger shrink-0 mt-0.5" />
                                <span>Creates a permanent federal record manufacturers cannot delete.</span>
                            </li>
                            <li className="flex items-start gap-3 text-xs text-gray-300">
                                <CheckCircle2 size={14} className="text-danger shrink-0 mt-0.5" />
                                <span>Triggers automatic investigation algorithms at the CPSC.</span>
                            </li>
                            <li className="flex items-start gap-3 text-xs text-gray-300">
                                <CheckCircle2 size={14} className="text-danger shrink-0 mt-0.5" />
                                <span>Publicly warns other families via the national database.</span>
                            </li>
                        </ul>
                    </div>

                    <a
                        href="https://www.saferproducts.gov/IncidentEntry"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group w-full py-5 rounded-2xl bg-danger hover:bg-red-500 text-white font-bold text-lg uppercase tracking-wide flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                        Launch Federal Report <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    
                    <p className="text-[10px] text-center text-white/40 uppercase tracking-widest">
                        Redirects to SaferProducts.gov (Official US Govt Site)
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export const ContactUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-center space-y-8">
      <div className="space-y-2">
        <h1 className="text-5xl font-display text-white uppercase tracking-tighter">Contact Nexus</h1>
        <p className="text-primary text-xs font-bold uppercase tracking-[0.3em]">Direct Line to MFSAG</p>
      </div>

      <div className="glass-card p-12 space-y-6 flex flex-col items-center">
        <Mail size={48} className="text-primary" />
        <p className="text-gray-300 max-w-lg">
          For press inquiries, partnership opportunities, or technical support with the SafeGuard tool, please reach out directly.
        </p>
        <a href="mailto:support@mattressfiberglass.org" className="text-2xl font-display text-white hover:text-primary transition-colors">
          support@mattressfiberglass.org
        </a>
      </div>
    </div>
  );
};

export const OrganizationResources = () => (
  <div className="max-w-4xl mx-auto py-10 px-4 text-center">
     <h1 className="text-4xl font-display text-white uppercase mb-6">Official Repository</h1>
     <iframe src="https://mattressfiberglass.org" className="w-full h-[800px] rounded-3xl border border-white/10 bg-white" title="Official Site"></iframe>
  </div>
);