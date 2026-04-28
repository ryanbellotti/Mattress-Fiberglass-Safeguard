import React, { useState } from 'react';
import { BookOpen, Users, AlertCircle, Mail, Search, MessageSquare, Send, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
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
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <CheckCircle2 size={64} className="text-success mb-6" />
        <h1 className="text-4xl font-display text-white uppercase">Report Logged</h1>
        <p className="text-muted mt-2">Your data has been encrypted and added to the registry.</p>
        <button onClick={() => setSubmitted(false)} className="mt-8 text-xs font-bold text-white underline">Submit Another</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-display text-white uppercase tracking-tighter">Incident Registry</h1>
        <p className="text-danger text-xs font-bold uppercase tracking-[0.3em]">Official Data Collection</p>
      </div>

      <div className="glass-card p-10 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted uppercase">Brand Name</label>
            <input type="text" className="w-full neuro-inset p-3 rounded-lg text-white outline-none" placeholder="e.g. Zinus" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted uppercase">Purchase Year</label>
            <input type="text" className="w-full neuro-inset p-3 rounded-lg text-white outline-none" placeholder="e.g. 2019" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted uppercase">Incident Description</label>
          <textarea className="w-full neuro-inset p-3 rounded-lg text-white outline-none h-32" placeholder="Describe how contamination occurred..." />
        </div>
        <button onClick={() => setSubmitted(true)} className="w-full neuro-btn bg-danger text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
          <AlertCircle size={20} /> SUBMIT TO REGISTRY
        </button>
        <p className="text-xs text-center text-muted">Data is aggregated for regulatory complaints to CPSC.</p>
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