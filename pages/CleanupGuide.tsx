import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, CheckCircle, Circle, AlertTriangle, ArrowRight, Shield, Volume2, Loader2, Sparkles, Wind, ExternalLink, Image } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { base64ToUint8Array, decodeAudioData } from '../utils/audioUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { CLEANUP_PROTOCOLS } from '../data/cleanupProtocols';

const MotionDiv = motion.div as any;

const CleanupGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Load Assessment Data and Saved Progress
  useEffect(() => {
    const savedAssessment = localStorage.getItem('safeguard_assessment');
    if (savedAssessment) {
      try {
        const parsed = JSON.parse(savedAssessment);
        const resultSev = parsed.result?.severity?.toLowerCase();
        if (resultSev?.includes('mild') || resultSev?.includes('low')) setSeverity('mild');
        else if (resultSev?.includes('severe') || resultSev?.includes('high') || resultSev?.includes('extreme')) setSeverity('severe');
        else setSeverity('moderate');
      } catch (e) { console.error(e); }
    }

    const savedProgress = localStorage.getItem('cleanup_progress_v2');
    if (savedProgress) setCompletedSteps(JSON.parse(savedProgress));
  }, []);

  const protocol = CLEANUP_PROTOCOLS[severity];

  const toggleStep = (stepTitle: string) => {
    const isCompleted = completedSteps.includes(stepTitle);
    const newSteps = isCompleted 
      ? completedSteps.filter(s => s !== stepTitle)
      : [...completedSteps, stepTitle];
    
    setCompletedSteps(newSteps);
    localStorage.setItem('cleanup_progress_v2', JSON.stringify(newSteps));
  };

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

    const currentStepData = protocol.steps[activeStep];
    const text = `Step ${activeStep + 1}: ${currentStepData.title}. ${currentStepData.description}. Details: ${currentStepData.details}`;
    setIsLoadingAudio(true);
    
    try {
      const base64Audio = await generateSpeech(text);
      if (base64Audio) {
        if (!audioContextRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
        }
        const audioData = base64ToUint8Array(base64Audio);
        const buffer = await decodeAudioData(audioData, audioContextRef.current, 24000, 1);
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
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-12">
      {/* Header with MFSAG Branding */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-6xl font-display text-white uppercase tracking-tighter">Remediation Nexus</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <p className={`text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded border ${protocol.color} ${protocol.borderColor} ${protocol.bgColor}`}>
              {protocol.title}
            </p>
            <p className="text-muted text-[10px] uppercase tracking-widest">
              Brought to you by <a href="https://www.mattressfiberglass.org" target="_blank" className="text-primary hover:underline">MFSAG</a>
            </p>
          </div>
        </div>
        <div className="flex gap-4">
           <a href="https://facebook.com/donotremovethecover" target="_blank" className="glass-card px-6 py-3 border-secondary/30 bg-secondary/5 flex items-center gap-3 hover:bg-secondary/10 transition-colors">
              <Shield size={18} className="text-secondary" />
              <div><p className="text-[10px] font-bold text-white uppercase">Community Support</p><p className="text-secondary text-[9px] font-bold">JOIN FACEBOOK GROUP</p></div>
           </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Step List */}
        <div className="lg:col-span-4 space-y-3 h-[600px] overflow-y-auto pr-2 scrollbar-hide">
          {protocol.steps.map((p, i) => {
            const isCompleted = completedSteps.includes(p.title);
            return (
              <MotionDiv 
                key={i}
                onClick={() => setActiveStep(i)}
                whileHover={{ x: 5 }}
                className={`p-4 rounded-2xl cursor-pointer border transition-all relative overflow-hidden group ${
                  activeStep === i 
                  ? `${protocol.bgColor} ${protocol.borderColor} shadow-lg` 
                  : 'bg-surface border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold tracking-widest uppercase ${activeStep === i ? 'text-white' : 'text-muted'}`}>Step {i + 1}</span>
                      {isCompleted && <CheckCircle size={12} className="text-success" />}
                    </div>
                    <h3 className={`font-display text-lg uppercase tracking-wide leading-none ${activeStep === i ? 'text-white' : 'text-muted group-hover:text-gray-300'} ${isCompleted ? 'line-through opacity-50' : ''}`}>
                      {p.title}
                    </h3>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleStep(p.title); }}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isCompleted ? 'bg-success border-success text-black' : 'border-white/20 hover:border-white'}`}
                  >
                    {isCompleted && <CheckCircle size={14} />}
                  </button>
                </div>
                {activeStep === i && <MotionDiv layoutId="guide-indicator" className={`absolute left-0 top-0 w-1 h-full ${protocol.color.replace('text-', 'bg-')}`} />}
              </MotionDiv>
            );
          })}
        </div>

        {/* Active Step Detail View */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <MotionDiv 
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8 md:p-12 h-full flex flex-col relative overflow-hidden"
            >
              {/* Background Ambient Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 ${protocol.bgColor.replace('/10', '/5')} rounded-full blur-[100px] pointer-events-none`} />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                   <div className={`w-16 h-16 rounded-2xl ${protocol.bgColor} border ${protocol.borderColor} flex items-center justify-center ${protocol.color} font-display text-4xl shadow-lg`}>
                     {activeStep + 1}
                   </div>
                   <div className="flex gap-3">
                      <button 
                        onClick={() => toggleStep(protocol.steps[activeStep].title)}
                        className={`neuro-btn px-6 py-3 rounded-xl font-bold text-xs uppercase flex items-center gap-2 ${completedSteps.includes(protocol.steps[activeStep].title) ? 'bg-success text-black border-success' : 'hover:bg-white/5'}`}
                      >
                        {completedSteps.includes(protocol.steps[activeStep].title) ? 'STEP COMPLETED' : 'MARK COMPLETE'}
                        {completedSteps.includes(protocol.steps[activeStep].title) ? <CheckCircle size={16} /> : <Circle size={16} />}
                      </button>
                   </div>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-tight leading-[0.9] mb-4">
                      {protocol.steps[activeStep].title}
                    </h2>
                    <p className="text-xl text-white font-medium">{protocol.steps[activeStep].description}</p>
                  </div>

                  <div className="p-6 bg-black/40 border border-white/10 rounded-2xl leading-relaxed text-gray-300 text-sm md:text-base">
                    {protocol.steps[activeStep].details}
                  </div>

                  {/* Contextual Visual Aid (Mocked based on step) */}
                  <div className="h-48 w-full rounded-2xl overflow-hidden relative group">
                    <img 
                      src={
                        activeStep === 0 ? "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop" : // Flashlight/Inspection
                        activeStep === 1 ? "https://images.unsplash.com/photo-1581093583449-ed252134425b?q=80&w=2669&auto=format&fit=crop" : // HVAC
                        "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=2674&auto=format&fit=crop" // Cleaning/PPE
                      } 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      alt="Step Visualization"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded text-[10px] font-bold uppercase text-white flex items-center gap-2">
                      <Image size={12} /> Reference Visualization
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
                   <button 
                    onClick={handlePlayAudio}
                    disabled={isLoadingAudio}
                    className={`flex-1 neuro-btn py-4 rounded-xl font-bold flex items-center justify-center gap-3 text-sm shadow-xl transition-all active:scale-[0.98] ${
                      isPlaying ? 'bg-accent text-white' : 'bg-primary text-white'
                    }`}
                   >
                     {isLoadingAudio ? <Loader2 className="animate-spin" /> : isPlaying ? <Square fill="white" size={18} /> : <Play fill="white" size={18} />}
                     {isLoadingAudio ? 'SYNTHESIZING VOICE...' : isPlaying ? 'STOP AUDIO GUIDE' : 'LISTEN TO INSTRUCTIONS'}
                   </button>
                   
                   <div className="flex gap-2">
                     <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0} className="neuro-btn px-6 py-4 rounded-xl disabled:opacity-30"><ArrowRight className="rotate-180" /></button>
                     <button onClick={() => setActiveStep(Math.min(protocol.steps.length - 1, activeStep + 1))} disabled={activeStep === protocol.steps.length - 1} className="neuro-btn px-6 py-4 rounded-xl disabled:opacity-30"><ArrowRight /></button>
                   </div>
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