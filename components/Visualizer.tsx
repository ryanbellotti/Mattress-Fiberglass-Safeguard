import React, { useState, useRef } from 'react';
import { Camera, Video, Upload, Check, AlertTriangle, Loader2, PlayCircle, ShieldCheck, X, ScanLine, Search } from 'lucide-react';
import { analyzeSafetyMedia } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

const Visualizer: React.FC = () => {
  const [media, setMedia] = useState<{url: string, type: string, base64: string} | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const startCamera = async () => {
    setIsCameraOpen(true);
    setMedia(null);
    setAnalysis(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const MAX_SIZE = 1024;
      let width = videoRef.current.videoWidth;
      let height = videoRef.current.videoHeight;

      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64 = dataUrl.split(',')[1];
        setMedia({
          url: dataUrl,
          type: 'image/jpeg',
          base64: base64
        });
        stopCamera();
        runAnalysis(base64, 'image/jpeg');
      }
    }
  };

  const runAnalysis = async (base64: string, type: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      // Enhanced prompt for specific fiberglass detection
      const prompt = `Analyze this ${type.startsWith('video') ? 'video' : 'photo'} for mattress safety.
      1. Look for specific text on mattress tags like "Glass Fiber", "Fiberglass", "Modacrylic", "Silica", or "Made in China" (often associated with fiberglass brands).
      2. Look for "shimmering" or "sparkling" particles on surfaces, dark fabric, or skin, which indicates fiberglass contamination.
      3. Identify if a mattress cover zipper is visible or open.
      
      Return a structured JSON with:
      - severity (low, medium, high, extreme)
      - detections (list of strings, e.g., "Shiny particles on flashlight beam", "Tag says 60% Glass Fiber")
      - remediationPlan (4 actionable steps)
      - summary (concise explanation)`;
      
      const result = await analyzeSafetyMedia(base64, type, prompt);
      setAnalysis(result);
    } catch (error) {
      alert("Analysis engine failure. Please try a different image.");
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
            className={`glass-card border-2 h-[450px] flex flex-col items-center justify-center transition-all relative overflow-hidden ${media || isCameraOpen ? 'border-primary/30' : 'border-dashed border-white/10'}`}
          >
            {isCameraOpen ? (
              <div className="relative w-full h-full bg-black">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 pointer-events-none border-2 border-primary/30 m-4 rounded-xl flex items-center justify-center">
                   <ScanLine className="text-primary w-full h-8 animate-pulse opacity-50 absolute top-1/2 -translate-y-1/2" />
                </div>
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
                   <button onClick={capturePhoto} className="w-16 h-16 rounded-full bg-white border-4 border-primary shadow-lg flex items-center justify-center hover:scale-105 transition-transform" />
                   <button onClick={stopCamera} className="w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"><X size={20} /></button>
                </div>
              </div>
            ) : media ? (
              media.type.startsWith('video') ? (
                <video src={media.url} className="w-full h-full object-cover" controls />
              ) : (
                <img src={media.url} className="w-full h-full object-cover" />
              )
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="text-center space-y-4 cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-white/5 transition-colors"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
                  <Upload size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-white font-bold uppercase">Upload Photo or Video</p>
                  <p className="text-muted text-xs">Analyze tags, surfaces, or damage</p>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={startCamera}
              className="neuro-btn py-4 text-xs font-bold text-white flex items-center justify-center gap-2 bg-primary/20 border border-primary/30 hover:bg-primary/30"
            >
              <Camera size={16} /> SCAN OBJECT
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="neuro-btn py-4 text-xs font-bold text-white flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10"
            >
              <Upload size={16} /> UPLOAD MEDIA
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!media && !isCameraOpen ? (
              <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center p-12 glass-card opacity-40 grayscale">
                <ShieldCheck size={64} className="mb-4 text-muted" />
                <p className="text-sm font-bold uppercase tracking-widest">Waiting for Visual Input</p>
                <p className="text-xs text-muted mt-2 max-w-xs">Upload a clear photo of your mattress law tag or a flashlight test on a dark surface.</p>
              </MotionDiv>
            ) : isAnalyzing ? (
              <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center p-12 glass-card">
                <Loader2 className="animate-spin text-primary mb-6" size={48} />
                <div className="space-y-2">
                  <p className="text-xl font-display text-white uppercase tracking-wider animate-pulse">Running Neural Vision</p>
                  <p className="text-xs text-muted font-bold uppercase tracking-tighter">Scanning for fibers & text...</p>
                </div>
              </MotionDiv>
            ) : analysis && (
              <MotionDiv initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className={`p-6 rounded-3xl border-2 flex items-center gap-6 ${
                  analysis.severity === 'extreme' || analysis.severity === 'high' ? 'bg-danger/10 border-danger shadow-[0_0_40px_rgba(244,63,94,0.2)]' : 'bg-primary/10 border-primary/40'
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
                  <h4 className="text-xs font-bold text-accent uppercase tracking-widest border-b border-white/5 pb-2">Vision Detections</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.detections?.map((d: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-white border border-white/10 uppercase font-bold flex items-center gap-2">
                        <Search size={10} /> {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6 space-y-4">
                  <h4 className="text-xs font-bold text-secondary uppercase tracking-widest border-b border-white/5 pb-2">AI Findings</h4>
                  <p className="text-sm text-gray-300 leading-relaxed italic">"{analysis.summary}"</p>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
