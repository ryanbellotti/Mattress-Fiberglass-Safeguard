import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Activity, Search, Phone, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

const Welcome: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <MotionDiv 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 mb-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold tracking-widest uppercase mb-4">
          <Zap size={14} className="fill-current" /> Next-Gen AI Safety Tool
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display text-white uppercase leading-[0.85] tracking-tighter">
          Don't Let <br/>
          <span className="gradient-text">Fiberglass</span> <br/>
          Own Your Home.
        </h1>
        
        <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          The ultimate advocacy tool for mattress safety. Powered by Gemini 3 multimodal intelligence to detect, analyze, and remediate contamination instantly.
        </p>

        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link to="/live">
            <button className="neuro-btn bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(99,102,241,0.3)]">
              <Phone size={22} /> CALL MATT (LIVE)
            </button>
          </Link>
          <Link to="/checker">
            <button className="neuro-btn border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-white/5 transition-colors">
              AUDIT BRAND <Search size={22} />
            </button>
          </Link>
        </div>
      </MotionDiv>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Voice First",
            desc: "Hands-free emergency help using Gemini Live API. Just speak, Matt listens.",
            icon: Phone,
            color: "text-primary"
          },
          {
            title: "Search Grounded",
            desc: "Always up-to-date with live lawsuit data and manufacturer safety changes.",
            icon: Search,
            color: "text-secondary"
          },
          {
            title: "Vision Tag Scan",
            desc: "Proprietary tag analysis model trained to spot hidden industry synonyms for glass fiber.",
            icon: Activity,
            color: "text-accent"
          }
        ].map((f, i) => (
          <MotionDiv
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-10 hover:border-primary/50 transition-colors group cursor-default"
          >
            <div className={`w-14 h-14 rounded-2xl bg-surface border border-white/5 flex items-center justify-center mb-8 ${f.color} group-hover:scale-110 transition-transform`}>
              <f.icon size={28} />
            </div>
            <h3 className="text-2xl font-display text-white uppercase mb-4 tracking-wide">{f.title}</h3>
            <p className="text-muted leading-relaxed text-sm">{f.desc}</p>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};

export default Welcome;