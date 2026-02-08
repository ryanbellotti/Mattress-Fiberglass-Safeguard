import React from 'react';
import { ExternalLink, Shield, BookOpen, Users, AlertCircle, FileText, AlertTriangle } from 'lucide-react';

const Resources: React.FC = () => {
  const categories = [
    {
      title: "Official Information",
      icon: Shield,
      color: "text-primary",
      links: [
        { title: "Mattress Fiberglass Organization", desc: "Main website with comprehensive info", url: "https://mattressfiberglass.org" },
        { title: "California Dept of Public Health", desc: "Official fact sheet about fiberglass", url: "https://cdph.ca.gov" },
        { title: "NIH - Fiberglass Exposure", desc: "Scientific research on health impacts", url: "https://nih.gov" }
      ]
    },
    {
      title: "Safety & Identification",
      icon: BookOpen,
      color: "text-accent",
      links: [
        { title: "Fiberglass-Free Brands Guide", desc: "Comprehensive safe list", url: "#" },
        { title: "Sleep Advisor Guide", desc: "Identifying and avoiding fiberglass", url: "https://sleepadvisor.org" },
        { title: "Poison Control Info", desc: "Expert info from specialists", url: "https://poison.org" }
      ]
    },
    {
      title: "Community & Support",
      icon: Users,
      color: "text-secondary",
      links: [
        { title: "Facebook - Do Not Remove Cover", desc: "Follow for updates", url: "https://facebook.com" },
        { title: "Facebook Group - Support", desc: "Join community for shared experiences", url: "https://facebook.com" }
      ]
    },
    {
      title: "Report Your Incident",
      icon: AlertCircle,
      color: "text-danger",
      links: [
        { title: "SaferProducts.gov", desc: "Report product safety issues to US Gov", url: "https://saferproducts.gov" }
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-display text-white uppercase tracking-tighter">Knowledge Nexus</h1>
        <p className="text-muted text-sm font-medium uppercase tracking-widest">Verified Intelligence & Support Channels</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {categories.map((cat, i) => (
          <div key={i} className="glass-card p-8 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${cat.color}`}>
                <cat.icon size={24} />
              </div>
              <h2 className="text-2xl font-display text-white uppercase">{cat.title}</h2>
            </div>
            <div className="space-y-4">
              {cat.links.map((link, j) => (
                <a 
                  key={j} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl bg-black/40 border border-white/5 hover:border-primary/40 hover:bg-white/5 transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{link.title}</p>
                      <p className="text-xs text-muted mt-1">{link.desc}</p>
                    </div>
                    <ExternalLink size={14} className="text-muted group-hover:text-white transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-danger/10 border border-danger/20 rounded-3xl text-center space-y-4">
         <div className="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center mx-auto text-danger mb-2">
            <AlertTriangle size={32} />
         </div>
         <h3 className="text-2xl font-display text-white uppercase">Important Safety Reminder</h3>
         <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            If you're experiencing severe health symptoms or suspect serious contamination, seek immediate medical attention and consider professional remediation services. Document everything with photos and keep all records for potential insurance claims or legal action.
         </p>
      </div>
    </div>
  );
};

export default Resources;