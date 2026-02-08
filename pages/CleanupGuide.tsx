import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, CheckCircle, Circle, AlertTriangle, ArrowRight, Shield, Volume2, Loader2, Sparkles, Wind } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { base64ToUint8Array, decodeAudioData } from '../utils/audioUtils';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

const protocols = [
  {
    phase: "PHASE 01",
    title: "Containment & Airlock",
    desc: "Immediately isolate the zone. Disable all centralized climate controls (HVAC) and mechanical ventilation. Seal the door perimeter with tape.",
    critical: "Standard fans will disseminate microscopic glass shards across all porous surfaces."
  },
  {
    phase: "PHASE 02",
    title: "Hazard Protection",
    desc: "Equip N95 or P100 respiratory protection. Use full-body coverage (long sleeves) and non-latex gloves. Secure hair and eyes.",
    critical: "Dermal contact leads to embedding; inhalation causes chronic respiratory trauma."
  },
  {
    phase: "PHASE 03",
    title: "Visual Detection",
    desc: "Perform a 'Lumen Sweep'. Use a high-intensity flashlight parallel to surfaces in total darkness. Look for the distinct 'shimmer' of fibers.",
    critical: "Fiberglass is translucent and only visible via specific light refraction."
  },
  {
    phase: "PHASE 04",
    title: "Neutralization",
    desc: "Use ONLY sealed HEPA-rated vacuums. Wet-wipe surfaces with damp microfiber cloths, folding inwards after every pass.",
    critical: "Standard vacuums act as centrifugal spreaders, making contamination 10x worse."
  }
];

const CleanupGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCache = useRef<Map<number, AudioBuffer>>(new Map());

  useEffect(() => {
    return () => {
      if (sourceRef.current) sourceRef.current.stop();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const handlePlayAudio = async () => {
    if (isPlaying) {
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    setIsLoadingAudio(true);
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      }

      let buffer = audioCache.current.get(activeStep);

      if (!buffer) {
        const text = `${protocols[activeStep].title}. ${protocols[activeStep].desc}. Critical notice: ${protocols[activeStep].critical}`;
        const base64Audio = await generateSpeech(text);

        if (base64Audio) {
          const audioData = base64ToUint8Array(base64Audio);
          const newBuffer = await decodeAudioData(audioData, audioContextRef.current, 24000, 1);
          audioCache.current.set(activeStep, newBuffer);
          buffer = newBuffer;
        }
      }

      if (buffer) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => { setIsPlaying(false); sourceRef.current = null; };
        source.start(0);
        sourceRef.current = source;
        setIsPlaying(true);
      }
    } catch (e) { console.error(e); } finally { setIsLoadingAudio(false); }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-6xl font-display text-white uppercase tracking-tighter">Remediation Nexus</h1>
          <p className="text-accent text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Personalized Cleanup Protocol v3.1</p>
        </div>
        <div className="flex gap-4">
           <div className="glass-card px-6 py-3 border-danger/30 bg-danger/5 flex items-center gap-3">
              <Wind size={18} className="text-danger" />
              <div><p className="text-[10px] font-bold text-white uppercase">HVAC STATUS</p><p className="text-danger text-[9px] font-bold">DISCONNECTED</p></div>
           </div>
           <div className="glass-card px-6 py-3 border-accent/30 bg-accent/5 flex items-center gap-3">
              <Shield size={18} className="text-accent" />
              <div><p className="text-[10px] font-bold text-white uppercase">PPE RATING</p><p className="text-accent text-[9px] font-bold">P100 REQUIRED</p></div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {protocols.map((p, i) => (
            <MotionDiv 
              key={i}
              onClick={() => setActiveStep(i)}
              whileHover={{ x: 5 }}
              className={`p-6 rounded-3xl cursor-pointer border transition-all relative overflow-hidden ${
                activeStep === i 
                ? 'bg-primary/20 border-primary shadow-[0_0_30px_rgba(99,102,241,0.2)]' 
                : 'bg-surface border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-[10px] font-bold tracking-widest ${activeStep === i ? 'text-white' : 'text-muted'}`}>{p.phase}</span>
                {activeStep === i && <Sparkles size={14} className="text-primary animate-pulse" />}
              </div>
              <h3 className={`font-display text-2xl uppercase tracking-wide ${activeStep === i ? 'text-white' : 'text-muted'}`}>{p.title}</h3>
              {activeStep === i && <MotionDiv layoutId="guide-indicator" className="absolute left-0 top-0 w-1 h-full bg-primary" />}
            </MotionDiv>
          ))}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <MotionDiv 
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-12 h-full flex flex-col justify-between border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-2xl"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                   <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-display text-4xl">
                     {activeStep + 1}
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                      <Volume2 size={16} className="text-accent" />
                      <span className="text-[10px] font-bold text-muted uppercase tracking-widest">TTS Active</span>
                   </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-5xl font-display text-white uppercase tracking-tight">{protocols[activeStep].title}</h2>
                  <p className="text-2xl text-gray-300 leading-relaxed font-light">{protocols[activeStep].desc}</p>
                </div>

                <div className="p-6 bg-danger/10 border-l-4 border-danger rounded-xl">
                   <div className="flex gap-4 items-start">
                      <AlertTriangle className="text-danger shrink-0 mt-1" size={20} />
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-danger uppercase tracking-widest">Critical Intelligence</p>
                        <p className="text-sm text-gray-400 italic leading-snug">{protocols[activeStep].critical}</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="pt-12 flex flex-col gap-4">
                 <button 
                  onClick={handlePlayAudio}
                  disabled={isLoadingAudio}
                  className={`w-full neuro-btn py-5 rounded-3xl font-bold flex items-center justify-center gap-4 text-xl shadow-2xl transition-all active:scale-[0.98] ${
                    isPlaying ? 'bg-accent text-white' : 'bg-primary text-white'
                  }`}
                 >
                   {isLoadingAudio ? <Loader2 className="animate-spin" /> : isPlaying ? <Square fill="white" size={24} /> : <Play fill="white" size={24} />}
                   {isLoadingAudio ? 'PREPARING AUDIO NEURAL LINK...' : isPlaying ? 'HALT AUDIO UPLINK' : 'READ PHASE INSTRUCTIONS'}
                 </button>
                 <div className="flex justify-center items-center gap-2 opacity-30">
                    <Sparkles size={12} className="text-accent" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Voice Synthesis via Gemini 2.5 Flash</p>
                 </div>
              </div>
            </MotionDiv>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CleanupGuide;