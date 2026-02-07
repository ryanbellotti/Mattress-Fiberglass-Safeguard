import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Wand2, Download, Loader2, Sparkles, Sliders, ChevronDown, Camera, AlertTriangle } from 'lucide-react';
import { generateSafetyGraphic } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const SafetyLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const img = await generateSafetyGraphic(prompt, size);
      setGeneratedImage(img);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-display text-white uppercase tracking-tighter">Safety Imaging Lab</h1>
        <p className="text-accent text-xs font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3">
           <Sparkles size={14} /> Nano Banana Pro Visual Nexus
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-2">
                <Wand2 size={14} className="text-primary" /> Visual Prompt
              </label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A high-resolution 3D diagram showing cross-section of a mattress fire barrier with fiberglass shards..."
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white placeholder-muted outline-none focus:ring-1 ring-primary/50 h-40 resize-none transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-2">
                <Sliders size={14} className="text-primary" /> Resolution Matrix
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['1K', '2K', '4K'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      size === s ? 'bg-primary/20 border-primary text-white' : 'bg-white/5 border-white/5 text-muted hover:border-white/20'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full neuro-btn bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(99,102,241,0.3)] disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {isGenerating ? 'SYNTHESIZING...' : 'INITIALIZE GENERATION'}
            </button>
          </div>

          <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-3xl">
             <div className="flex gap-4 items-start">
                <AlertTriangle className="text-secondary shrink-0" size={20} />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-secondary uppercase">Generative Guidance</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">Images generated here are AI reconstructions for safety documentation and advocacy visualization.</p>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="glass-card aspect-square w-full relative overflow-hidden flex items-center justify-center border-2 border-dashed border-white/5 group">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="text-center space-y-6"
                >
                  <div className="relative w-32 h-32 mx-auto">
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="absolute inset-0 border-2 border-t-primary border-transparent rounded-full"
                    />
                    <div className="absolute inset-4 bg-primary/10 rounded-full flex items-center justify-center">
                       <Sparkles size={32} className="text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-display text-white uppercase tracking-widest animate-pulse">Forging Pixels...</p>
                    <p className="text-[10px] text-muted font-bold uppercase">Scaling Neural Tensors to {size}</p>
                  </div>
                </motion.div>
              ) : generatedImage ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full relative group"
                >
                  <img src={generatedImage} className="w-full h-full object-cover" alt="Generated Safety Documentation" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                    <a 
                      href={generatedImage} 
                      download="safeguard-doc.png"
                      className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white hover:scale-110 transition-transform shadow-2xl"
                    >
                      <Download size={32} />
                    </a>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                     <p className="text-[10px] text-white/80 line-clamp-2 italic">"{prompt}"</p>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center opacity-30 space-y-4">
                  <ImageIcon size={64} className="mx-auto text-muted" />
                  <p className="text-xs font-bold uppercase tracking-widest">Visual Matrix Awaiting Input</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyLab;