import React, { useState, useRef } from 'react';
import { Camera, Video, Upload, Check, AlertTriangle, Loader2, PlayCircle, ShieldCheck } from 'lucide-react';
import { analyzeSafetyMedia } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const Visualizer: React.FC = () => {
  const [media, setMedia] = useState<{url: string, type: string, base64: string} | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setMedia({
        url: URL.createObjectURL(file),
        type: file.type,
        base64: base64.split(',')[1]
      });
      runAnalysis(base64.split(',')[1], file.type);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async (base64: string, type: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const prompt = `Perform a high-level safety audit of this ${type.startsWith('video') ? 'video' : 'photo'}. 
      Identify any mattress tags, exposed fiberglass 'shimmer', or high-risk items in the room (carpets, soft toys, electronics).
      Return a severity-based remediation plan. Focus on how fiberglass interacts with everything seen.`;
      
      const result = await analyzeSafetyMedia(base64, type, prompt);
      setAnalysis(result);
    } catch (error) {
      alert("Analysis engine failure.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-display tracking-tight text-white uppercase">Multi-Modal Lab</h1>
        <p className="text-accent text-xs font-bold uppercase tracking-[0.3em]">Vision & Video Analysis Engine</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`glass-card border-2 border-dashed h-[450px] flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all relative overflow-hidden ${media ? 'border-primary/30' : 'border-white/10'}`}
          >
            {media ? (
              media.type.startsWith('video') ? (
                <video src={media.url} className="w-full h-full object-cover" controls />
              ) : (
                <img src={media.url} className="w-full h-full object-cover" />
              )
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
                  <Upload size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-white font-bold uppercase">Upload Photo or Video</p>
                  <p className="text-muted text-xs">Analyze tags or contamination spread</p>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="neuro-btn py-4 text-xs font-bold text-white flex items-center justify-center gap-2 bg-white/5 border border-white/10">
              <Camera size={16} /> LIVE CAMERA
            </button>
            <button className="neuro-btn py-4 text-xs font-bold text-white flex items-center justify-center gap-2 bg-white/5 border border-white/10">
              <Video size={16} /> RECORD VIDEO
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!media ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center p-12 glass-card opacity-40 grayscale">
                <ShieldCheck size={64} className="mb-4 text-muted" />
                <p className="text-sm font-bold uppercase tracking-widest">Waiting for Input Data</p>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center p-12 glass-card">
                <Loader2 className="animate-spin text-primary mb-6" size={48} />
                <div className="space-y-2">
                  <p className="text-xl font-display text-white uppercase tracking-wider animate-pulse">Processing Multi-Modal Data</p>
                  <p className="text-xs text-muted font-bold uppercase tracking-tighter">Gemini 3 Pro Analysing Frame Sequence...</p>
                </div>
              </motion.div>
            ) : analysis && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className={`p-6 rounded-3xl border-2 flex items-center gap-6 ${
                  analysis.severity === 'extreme' ? 'bg-danger/10 border-danger shadow-[0_0_40px_rgba(244,63,94,0.2)]' : 'bg-primary/10 border-primary/40'
                }`}>
                  <div className="w-16 h-16 rounded-2xl bg-black/40 flex items-center justify-center text-white font-display text-2xl">
                    {analysis.severity?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-bold uppercase tracking-widest text-lg">Severity: {analysis.severity}</h3>
                    <p className="text-xs text-muted uppercase font-bold">Risk Assessment Level</p>
                  </div>
                </div>

                <div className="glass-card p-6 space-y-4">
                  <h4 className="text-xs font-bold text-accent uppercase tracking-widest border-b border-white/5 pb-2">Detected Risk Factors</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.detections?.map((d: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-white border border-white/10 uppercase font-bold">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6 space-y-4">
                  <h4 className="text-xs font-bold text-secondary uppercase tracking-widest border-b border-white/5 pb-2">Remediation Plan</h4>
                  <div className="space-y-3">
                    {analysis.remediationPlan?.map((step: string, i: number) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-5 h-5 rounded bg-secondary/20 flex items-center justify-center shrink-0 text-secondary text-[10px] font-bold">
                          {i + 1}
                        </div>
                        <p className="text-sm text-gray-300 leading-snug">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-xs text-gray-400 italic">"Summary: {analysis.summary}"</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;