import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, CheckCircle, Circle, AlertTriangle, ArrowRight, Shield, Volume2, Loader2, Sparkles, Wind, Info, X, Check, Activity } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { base64ToUint8Array, decodeAudioData } from '../utils/audioUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { CLEANUP_PROTOCOLS } from './cleanupProtocols';

const MotionDiv = motion.div as any;

const CleanupGuide: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<keyof typeof CLEANUP_PROTOCOLS>('moderate');
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('safeguard_assessment');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const severity = parsed.result?.severity?.toLowerCase();
        let level: keyof typeof CLEANUP_PROTOCOLS = 'moderate';
        if (severity === 'low') level = 'mild';
        else if (severity === 'medium') level = 'moderate';
        else if (severity === 'high' || severity === 'extreme') level = 'severe';
        
        setCurrentLevel(level);
        
        // Load progress
        const progress = localStorage.getItem(`cleanup_progress_${level}`);
        if (progress) {
          setCompletedSteps(JSON.parse(progress));
        }
      } catch (e) {
        console.error("Failed to parse assessment data", e);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (sourceRef.current) sourceRef.current.stop();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const protocol = CLEANUP_PROTOCOLS[currentLevel];
  const steps = protocol.steps;
  const activeProtocolStep = steps[activeStep];

  const toggleStepCompletion = (index: number) => {
    const newCompleted = completedSteps.includes(index)
      ? completedSteps.filter(i => i !== index)
      : [...completedSteps, index];
    
    setCompletedSteps(newCompleted);
    localStorage.setItem(`cleanup_progress_${currentLevel}`, JSON.stringify(newCompleted));
  };

  const handlePlayAudio = async () => {
    if (isPlaying) {
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    const text = `${activeProtocolStep.title}. ${activeProtocolStep.action}. ${activeProtocolStep.desc}`;
    setIsLoadingAudio(true);
    try {
      const base64Audio = await generateSpeech(text);
      if (base64Audio) {
        if (!audioContextRef.current) {
          const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
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
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      {/* Disclaimer Modal */}
      <AnimatePresence>
        {showDisclaimer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDisclaimer(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-sm"
            />
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass-card p-8 border-danger/50 shadow-[0_0_50px_rgba(239,68,68,0.2)] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3 text-danger">
                  <AlertTriangle size={32} />
                  <h2 className="text-3xl font-display uppercase tracking-tighter">Critical Warning: DIY Cleanup Risks</h2>
                </div>
                <button onClick={() => setShowDisclaimer(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} className="text-muted" />
                </button>
              </div>

              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div className="p-4 bg-danger/10 border border-danger/20 rounded-2xl">
                  <p className="font-bold text-white uppercase text-xs tracking-widest mb-2">For Harm Reduction Only</p>
                  <p className="text-sm">The information in this guide is provided for educational purposes only, based on the principle of harm reduction. It is intended for individuals who, after exhausting all other options, feel they have no choice but to attempt a personal cleanup effort.</p>
                </div>

                <p className="text-lg font-bold text-white">The ONLY recommended safe and effective method for fiberglass decontamination is to hire a certified, professional remediation company.</p>

                <div className="space-y-4">
                  <p className="font-bold text-white uppercase text-xs tracking-widest">Major Hazards:</p>
                  <div className="grid gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="font-bold text-danger text-xs uppercase mb-1">Permanent Contamination</p>
                      <p className="text-xs">Using improper equipment (like standard household vacuums) will blast microscopic glass fibers throughout your home, making it 10x worse.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="font-bold text-danger text-xs uppercase mb-1">Incomplete Removal</p>
                      <p className="text-xs">It is practically impossible to remove all microscopic fibers without professional equipment and expertise.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="font-bold text-danger text-xs uppercase mb-1">HVAC Destruction</p>
                      <p className="text-xs">Fiberglass in your HVAC can spread to every room. Systems often require full, costly replacement if contaminated.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                   <p className="font-bold text-white uppercase text-xs tracking-widest">Acknowledge Liability:</p>
                   <ul className="text-xs space-y-2 list-disc list-inside opacity-70">
                     <li>This guide is NOT a recommendation to perform DIY cleanup.</li>
                     <li>You assume all liability for damages, injuries, or worsening contamination.</li>
                     <li>There is no guarantee of safety or effectiveness.</li>
                     <li>You will continue seeking professional help.</li>
                   </ul>
                </div>

                <button 
                  onClick={() => setShowDisclaimer(false)}
                  className="w-full neuro-btn bg-danger py-4 rounded-2xl font-bold text-white uppercase tracking-widest shadow-lg hover:shadow-danger/20 transition-all"
                >
                  I Understand & Accept the Risks
                </button>
              </div>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-6xl font-display text-white uppercase tracking-tighter">Remediation Nexus</h1>
          <p className="text-accent text-[10px] font-bold uppercase tracking-[0.4em] mt-2">{protocol.label} v3.1</p>
        </div>
        <div className="flex gap-4">
           <div className="glass-card px-6 py-3 flex items-center gap-3" style={{ borderColor: `${protocol.color}44`, backgroundColor: `${protocol.color}11` }}>
              <Wind size={18} style={{ color: protocol.color }} />
              <div><p className="text-[10px] font-bold text-white uppercase">HVAC STATUS</p><p className="text-[9px] font-bold" style={{ color: protocol.color }}>DISCONNECTED</p></div>
           </div>
           <div className="glass-card px-6 py-3 flex items-center gap-3" style={{ borderColor: 'rgba(34, 211, 238, 0.3)', backgroundColor: 'rgba(34, 211, 238, 0.05)' }}>
              <Shield size={18} className="text-accent" />
              <div><p className="text-[10px] font-bold text-white uppercase">PPE RATING</p><p className="text-accent text-[9px] font-bold">P100 REQUIRED</p></div>
           </div>
        </div>
      </div>

      {protocol.showDIYDisclaimer && (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 glass-card border-danger/30 bg-danger/5 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-danger/20 flex items-center justify-center text-danger shrink-0">
             <AlertTriangle size={32} />
          </div>
          <div className="space-y-2 flex-grow">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Severe Contamination Detected</h3>
            <p className="text-sm text-gray-400">Professional remediation is the only safe method for severe cases. If you must proceed DIY, read the critical disclaimer.</p>
          </div>
          <button 
            onClick={() => setShowDisclaimer(true)}
            className="neuro-btn bg-danger/20 text-danger border border-danger/30 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2"
          >
            <Info size={16} /> READ CRITICAL DISCLAIMER
          </button>
        </MotionDiv>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
          {steps.map((p, i) => (
            <MotionDiv 
              key={i}
              onClick={() => setActiveStep(i)}
              whileHover={{ x: 5 }}
              className={`p-6 rounded-3xl cursor-pointer border transition-all relative overflow-hidden ${
                activeStep === i 
                ? 'bg-primary/20 border-primary shadow-[0_0_30px_rgba(99,102,241,0.2)]' 
                : 'bg-surface border-white/5 hover:border-white/20'
              }`}
              style={activeStep === i ? { borderColor: protocol.color, boxShadow: `0 0 30px ${protocol.color}33` } : {}}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold tracking-widest ${activeStep === i ? 'text-white' : 'text-muted'}`}>PHASE {String(i + 1).padStart(2, '0')}</span>
                  {completedSteps.includes(i) && <Check size={12} className="text-success" />}
                </div>
                {activeStep === i && <Sparkles size={14} style={{ color: protocol.color }} className="animate-pulse" />}
              </div>
              <h3 className={`font-display text-xl uppercase tracking-wide ${activeStep === i ? 'text-white' : 'text-muted'}`}>{p.title}</h3>
              {activeStep === i && <MotionDiv layoutId="guide-indicator" className="absolute left-0 top-0 w-1 h-full" style={{ backgroundColor: protocol.color }} />}
            </MotionDiv>
          ))}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <MotionDiv 
              key={activeStep + currentLevel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-12 h-full flex flex-col justify-between border-white/10 shadow-2xl"
              style={{ borderColor: `${protocol.color}33`, background: `linear-gradient(to bottom right, ${protocol.color}11, transparent)` }}
            >
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                   <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-display text-4xl" style={{ backgroundColor: `${protocol.color}33` }}>
                     {activeStep + 1}
                   </div>
                   <div className="flex gap-4">
                     <button 
                      onClick={() => toggleStepCompletion(activeStep)}
                      className={`p-3 rounded-xl border transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${
                        completedSteps.includes(activeStep) 
                        ? 'bg-success/20 border-success text-success' 
                        : 'bg-white/5 border-white/10 text-muted hover:border-white/30'
                      }`}
                     >
                        {completedSteps.includes(activeStep) ? <CheckCircle size={16} /> : <Circle size={16} />}
                        {completedSteps.includes(activeStep) ? 'Completed' : 'Mark Complete'}
                     </button>
                     <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                        <Volume2 size={16} className="text-accent" />
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">TTS Active</span>
                     </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-5xl font-display text-white uppercase tracking-tight leading-none">{activeProtocolStep.title}</h2>
                  <p className="text-2xl text-gray-300 leading-relaxed font-light whitespace-pre-line">{activeProtocolStep.desc}</p>
                </div>

                <div className="p-6 border-l-4 rounded-xl" style={{ backgroundColor: `${protocol.color}11`, borderLeftColor: protocol.color }}>
                   <div className="flex gap-4 items-start">
                      <AlertTriangle style={{ color: protocol.color }} shrink-0 mt-1 size={20} />
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: protocol.color }}>Critical Intelligence</p>
                        <p className="text-sm text-gray-400 italic leading-snug">{activeProtocolStep.action}</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="pt-12 flex flex-col gap-4">
                 <button 
                  onClick={handlePlayAudio}
                  disabled={isLoadingAudio}
                  className={`w-full neuro-btn py-5 rounded-3xl font-bold flex items-center justify-center gap-4 text-xl shadow-2xl transition-all active:scale-[0.98] ${
                    isPlaying ? 'bg-accent text-white' : 'text-white'
                  }`}
                  style={!isPlaying ? { backgroundColor: protocol.color } : {}}
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
      
      {/* Footer Info Sections */}
      <div className="grid md:grid-cols-2 gap-8 pt-12">
        <MotionDiv initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="glass-card p-8 border-white/5 bg-white/[0.02]">
          <h3 className="text-xl font-display text-white uppercase tracking-widest mb-6 flex items-center gap-3">
            <Shield className="text-accent" /> Important Safety Guidelines
          </h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex gap-4"><Check className="text-accent shrink-0" size={18} /> <span>Always wear proper protective equipment (N95 mask minimum, P100 respirator preferred for severe cases)</span></li>
            <li className="flex gap-4"><Check className="text-accent shrink-0" size={18} /> <span>Use HEPA-filter vacuums ONLY - regular vacuums spread fiberglass and make it worse</span></li>
            <li className="flex gap-4"><Check className="text-accent shrink-0" size={18} /> <span>Never use compressed air, leaf blowers, or shake contaminated items</span></li>
            <li className="flex gap-4"><Check className="text-accent shrink-0" size={18} /> <span>Wet cleaning captures fibers - damp cloths, not dry dusting</span></li>
            <li className="flex gap-4"><Check className="text-accent shrink-0" size={18} /> <span>Dispose of contaminated materials properly in sealed heavy-duty bags</span></li>
            <li className="flex gap-4"><Check className="text-accent shrink-0" size={18} /> <span>Turn off HVAC immediately to prevent spreading through air ducts</span></li>
            <li className="flex gap-4"><Check className="text-accent shrink-0" size={18} /> <span>Consult licensed professionals for severe cases, health concerns, or HVAC cleaning</span></li>
          </ul>
        </MotionDiv>
        <MotionDiv initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="glass-card p-8 border-white/5 bg-white/[0.02]">
          <h3 className="text-xl font-display text-white uppercase tracking-widest mb-6 flex items-center gap-3">
            <Activity className="text-primary" /> Post-Cleanup Monitoring & Prevention
          </h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex gap-4"><Check className="text-primary shrink-0" size={18} /> <span><div><strong className="text-white">Continue Regular Cleaning:</strong> Use HEPA vacuum regularly, damp dust surfaces frequently, change HVAC filters often (after professional cleaning)</div></span></li>
            <li className="flex gap-4"><Check className="text-primary shrink-0" size={18} /> <span><div><strong className="text-white">Monitor for Reappearance:</strong> Periodically inspect with flashlight (corners, under furniture, vents) for any fiber reappearance</div></span></li>
            <li className="flex gap-4"><Check className="text-primary shrink-0" size={18} /> <span><div><strong className="text-white">Track Your Health:</strong> Monitor for persistent skin, eye, or respiratory symptoms. Keep symptom journal. Consult doctor for ongoing concerns</div></span></li>
            <li className="flex gap-4"><Check className="text-primary shrink-0" size={18} /> <span><div><strong className="text-white">Future Prevention:</strong> Research before buying new mattress. Ask about fiberglass content. Check law tag. Read reviews mentioning fiberglass. NEVER remove mattress cover</div></span></li>
          </ul>
        </MotionDiv>
      </div>
    </div>
  );
};

export default CleanupGuide;
