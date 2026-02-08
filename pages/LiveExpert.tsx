import React, { useState, useRef, useEffect } from 'react';
import { Mic, Phone, PhoneOff, Volume2, ShieldAlert, Loader2, Signal, Radio } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { base64ToUint8Array, arrayBufferToBase64, decodeAudioData, float32To16BitPCM } from '../utils/audioUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { SYSTEM_INSTRUCTIONS } from '../constants/prompts';

const MotionDiv = motion.div as any;

const LiveExpert: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const cleanup = () => {
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e) {}
      sessionRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setVolume(0);
    nextStartTimeRef.current = 0;
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  const startCall = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    setError(null);
    
    try {
      // 1. Permission Check
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2. Init AI
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      inputContextRef.current = new AudioContextClass({ sampleRate: 16000 });

      // 3. Connect Session
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
          },
          systemInstruction: SYSTEM_INSTRUCTIONS.LIVE_EXPERT,
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            
            const source = inputContextRef.current!.createMediaStreamSource(streamRef.current!);
            const processor = inputContextRef.current!.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += Math.abs(inputData[i]);
              setVolume((sum / inputData.length) * 100);

              const pcm16 = float32To16BitPCM(inputData);
              const base64 = arrayBufferToBase64(pcm16.buffer);
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: { mimeType: 'audio/pcm;rate=16000', data: base64 }
                });
              });
            };
            
            source.connect(processor);
            processor.connect(inputContextRef.current!.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
               const buffer = await decodeAudioData(base64ToUint8Array(audioData), audioContextRef.current, 24000, 1);
               const source = audioContextRef.current.createBufferSource();
               source.buffer = buffer;
               source.connect(audioContextRef.current.destination);
               
               const now = audioContextRef.current.currentTime;
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, now);
               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += buffer.duration;
               
               sourcesRef.current.add(source);
               source.onended = () => sourcesRef.current.delete(source);
            }

            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => cleanup(),
          onerror: (e) => {
            console.error("Session Error:", e);
            setError("The neural link was severed. Please check your connection.");
            cleanup();
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (e: any) {
      console.error("Call Error:", e);
      setError(e.message || "Could not initialize link.");
      cleanup();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center items-center px-4 py-8">
      <MotionDiv initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-6xl font-display text-white uppercase tracking-tighter mb-2">Emergency Voice Link</h1>
        <p className="text-accent font-bold uppercase tracking-[0.3em] text-[10px]">Direct Encryption to Matt Russ Fyburs</p>
      </MotionDiv>

      <div className="glass-card p-12 w-full max-w-xl text-center relative overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.2)]">
        {isConnected && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Signal size={14} className="text-success animate-pulse" />
            <span className="text-[10px] font-bold text-success uppercase">Secured</span>
          </div>
        )}

        <div className="mb-12 relative">
          <AnimatePresence>
            {isConnected && (
              <MotionDiv className="absolute inset-0 flex items-center justify-center">
                {[...Array(3)].map((_, i) => (
                  <MotionDiv
                    key={i}
                    animate={{ scale: [1, 2 + (volume / 10)], opacity: [0.2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.5 }}
                    className="absolute w-40 h-40 rounded-full border-2 border-primary/20"
                  />
                ))}
              </MotionDiv>
            )}
          </AnimatePresence>

          <div className={`w-32 h-32 mx-auto rounded-3xl flex items-center justify-center transition-all duration-500 relative z-10 ${
            isConnected ? 'bg-primary shadow-[0_0_50px_rgba(99,102,241,0.5)] rotate-45' : 'bg-surface border border-white/10'
          }`}>
            <div className={isConnected ? '-rotate-45' : ''}>
              {isConnecting ? <Loader2 className="w-12 h-12 text-white animate-spin" /> : <Radio className={`w-12 h-12 ${isConnected ? 'text-white' : 'text-muted'}`} />}
            </div>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-display text-white uppercase tracking-wider">
              {isConnecting ? 'Establishing Uplink...' : isConnected ? 'Expert Online' : 'Encryption Standby'}
            </h2>
            <p className="text-xs text-muted font-medium px-8 leading-relaxed">
              {isConnected 
                ? "The line is clear. You are now speaking with Matt. He can hear you and provide real-time guidance." 
                : "Initialize a high-fidelity voice session for immediate, hands-free safety protocols."}
            </p>
          </div>

          {error && <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-[10px] font-bold uppercase">{error}</div>}

          <div className="pt-4">
            {isConnected ? (
              <button onClick={cleanup} className="neuro-btn bg-danger hover:bg-danger/80 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 mx-auto transition-all active:scale-95">
                <PhoneOff size={20} /> TERMINATE CALL
              </button>
            ) : (
              <button 
                onClick={startCall} 
                disabled={isConnecting}
                className="neuro-btn bg-primary hover:bg-primary/80 text-white px-12 py-5 rounded-2xl font-bold flex items-center gap-3 mx-auto shadow-2xl transition-all active:scale-95 disabled:opacity-50"
              >
                <Mic size={20} /> {isConnecting ? 'CONNECTING...' : 'INITIATE NEURAL LINK'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-xl">
        <div className="glass-card p-4 flex items-center gap-4 bg-white/5 border-white/5">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent"><ShieldAlert size={20} /></div>
          <div><p className="text-[10px] font-bold uppercase text-white">Safety Warning</p><p className="text-[9px] text-muted">Do not remove cover</p></div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4 bg-white/5 border-white/5">
          <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary"><Volume2 size={20} /></div>
          <div><p className="text-[10px] font-bold uppercase text-white">Speaker Mode</p><p className="text-[9px] text-muted">Hands-free active</p></div>
        </div>
      </div>
    </div>
  );
};

export default LiveExpert;