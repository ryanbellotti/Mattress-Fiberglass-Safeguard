import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, User, Bot, Loader2, Search, ExternalLink, 
  Bookmark, Trash2, History, Shield, Brain, Globe, 
  FileText, Zap, ChevronRight, ClipboardList, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendAdvancedChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';

type SidebarTab = 'evidence' | 'sources' | 'protocols';

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<SidebarTab>('evidence');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Nexus Online. I am Matt Russ Fyburs. I've activated Deep Thinking and Live Search protocols. How can I assist with your safety audit today?",
      timestamp: new Date()
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [notes, setNotes] = useState<{id: string, text: string, type: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('fiberglass_vault_notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isThinking]);

  const saveNote = (text: string, type: string = 'General') => {
    const newNote = { id: Date.now().toString(), text, type };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('fiberglass_vault_notes', JSON.stringify(updatedNotes));
  };

  const handleSend = async (overrideInput?: string) => {
    const messageToSend = overrideInput || input;
    if (!messageToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const { text, sources } = await sendAdvancedChatMessage(history, userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: text || "Nexus timeout. Please re-initialize.",
        timestamp: new Date(),
        sources: sources
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Error in safety nexus. Protocol interrupted.",
        timestamp: new Date()
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const directives = [
    { label: "State Laws", prompt: "What are the fiberglass mattress laws in my state? Please search for consumer protection acts." },
    { label: "Recall Check", prompt: "Search for the most recent mattress fiberglass recalls or ongoing class action lawsuits." },
    { label: "Cross-Contamination", prompt: "Explain how fiberglass travels through an HVAC system and how to neutralize it." }
  ];

  return (
    <div className="max-w-[1500px] mx-auto h-[calc(100vh-120px)] flex gap-6 overflow-hidden">
      {/* Sidebar: The Safety Vault */}
      <div className="hidden xl:flex flex-col w-96 bg-surface border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-6 bg-white/5 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-xl font-display uppercase tracking-wider text-white">Safety Vault</h2>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Case ID: {Date.now().toString().slice(-6)}</p>
            </div>
          </div>
          
          <div className="flex p-1 bg-black/40 rounded-xl">
            {(['evidence', 'sources', 'protocols'] as SidebarTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-tighter rounded-lg transition-all ${
                  activeTab === tab ? 'bg-white/10 text-white shadow-lg' : 'text-muted hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {activeTab === 'evidence' && (
            notes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 p-8">
                <FileText size={48} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Vault Empty</p>
                <p className="text-[10px] mt-2">Save findings from your chat to build your safety case.</p>
              </div>
            ) : (
              notes.map((note) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  key={note.id} 
                  className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px] leading-relaxed relative group hover:border-primary/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[8px] font-bold uppercase">{note.type}</span>
                    <button 
                      onClick={() => {
                        const n = notes.filter(x => x.id !== note.id); 
                        setNotes(n);
                        localStorage.setItem('fiberglass_vault_notes', JSON.stringify(n));
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-danger"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className="text-gray-300 line-clamp-6">{note.text}</p>
                </motion.div>
              ))
            )
          )}
          
          {activeTab === 'sources' && (
            <div className="space-y-3">
               <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4">Live Discovery Links</p>
               {messages.flatMap(m => m.sources || []).map((src: any, idx) => (
                 <a 
                  key={idx} 
                  href={src.uri} 
                  target="_blank" 
                  className="block p-3 bg-accent/5 border border-accent/10 rounded-xl hover:bg-accent/10 transition-colors"
                 >
                   <p className="text-accent text-[10px] font-bold uppercase truncate">{src.title || 'Nexus Source'}</p>
                   <p className="text-[9px] text-muted truncate mt-1">{src.uri}</p>
                 </a>
               ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Command Center */}
      <div className="flex-1 flex flex-col bg-surface border border-white/5 rounded-[32px] overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <Zap size={24} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-display tracking-wide text-white">Nexus Command</h1>
              <div className="flex items-center gap-3">
                <span className="text-accent text-[9px] font-bold uppercase flex items-center gap-1.5 bg-accent/10 px-2 py-0.5 rounded">
                  <Globe size={10} /> Live Grounding
                </span>
                <span className="text-primary text-[9px] font-bold uppercase flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded">
                  <Brain size={10} /> 32K Thinking
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="h-10 px-4 flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl">
               <div className="w-2 h-2 rounded-full bg-success animate-ping" />
               <span className="text-[10px] font-bold text-muted uppercase">System Nominal</span>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg ${
                  msg.role === 'user' ? 'bg-primary text-white border-primary/50' : 'bg-surface text-accent border-white/10'
                }`}>
                  {msg.role === 'user' ? <User size={28} /> : <Bot size={28} />}
                </div>
                
                <div className={`max-w-[80%] space-y-4`}>
                  <div className={`p-6 rounded-[2rem] text-sm leading-relaxed shadow-xl ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/5 backdrop-blur-sm'
                  }`}>
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className="mb-3 last:mb-0">{line}</p>
                    ))}
                    
                    {msg.role === 'model' && (
                      <div className="mt-6 pt-4 border-t border-white/10 flex gap-4">
                        <button 
                          onClick={() => saveNote(msg.text, 'Evidence')}
                          className="text-[9px] uppercase font-bold text-primary hover:text-white flex items-center gap-1.5 transition-colors"
                        >
                          <Bookmark size={12} /> Log as Evidence
                        </button>
                        <button 
                          onClick={() => saveNote(msg.text, 'Cleanup')}
                          className="text-[9px] uppercase font-bold text-accent hover:text-white flex items-center gap-1.5 transition-colors"
                        >
                          <ClipboardList size={12} /> Extract Protocol
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <p className="w-full text-[9px] font-bold text-muted uppercase mb-1 flex items-center gap-2">
                        <Info size={10} /> Verified Grounding Sources:
                      </p>
                      {msg.sources.map((src: any, i: number) => (
                        <a 
                          key={i} 
                          href={src.uri} 
                          target="_blank" 
                          className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-[9px] font-bold text-accent flex items-center gap-2 transition-all"
                        >
                          {src.title || "Nexus Data Point"} <ExternalLink size={10} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
              <div className="w-14 h-14 rounded-2xl bg-surface border border-white/10 flex items-center justify-center shrink-0 text-accent">
                <Loader2 className="animate-spin" size={28} />
              </div>
              <div className="bg-white/5 p-6 rounded-[2rem] rounded-tl-none border border-white/10 flex items-center gap-6 backdrop-blur-md">
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ scaleY: [1, 2, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      className="w-1 h-6 bg-accent rounded-full"
                    />
                  ))}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Neural Logic Processing</p>
                  <p className="text-[10px] text-muted uppercase font-semibold">Synthesizing Search Grounds & Cross-Contamination Vectors...</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input & Directives */}
        <div className="p-8 bg-white/5 border-t border-white/5 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-wrap justify-center gap-3">
              {directives.map((d, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(d.prompt)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-muted hover:text-white hover:border-primary/50 transition-all flex items-center gap-2 group"
                >
                  <Search size={12} className="group-hover:text-primary" /> {d.label}
                </button>
              ))}
            </div>

            <div className="neuro-inset flex items-center p-2 pr-6 rounded-[2rem] bg-black/60 shadow-2xl border border-white/5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Initialize nexus query..."
                className="flex-1 bg-transparent border-none outline-none px-8 py-5 text-white placeholder-muted font-medium text-base"
              />
              <button
                onClick={() => handleSend()}
                disabled={isThinking || !input.trim()}
                className="w-14 h-14 bg-primary hover:bg-primary/90 rounded-2xl flex items-center justify-center text-white transition-all shadow-[0_10px_30px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95"
              >
                <Send size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;