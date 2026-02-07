
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Phone, PhoneOff, Volume2, ShieldAlert, Loader2 } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { base64ToUint8Array, arrayBufferToBase64, decodeAudioData, float32To16BitPCM } from '../utils/audioUtils';
import { motion, AnimatePresence } from 'framer-motion';

const LiveExpert: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [volume, setVolume] = useState(0);

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
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      inputContextRef.current = new AudioContextClass({ sampleRate: 16000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            // Using Fenrir for a friendly masculine expert voice
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
          },
          systemInstruction: "You are Matt Russ Fyburs, a co-founder of mattressfiberglass.org and lead admin of the Facebook support group. You are a compassionate, masculine safety expert. You are on a real phone call with a victim of fiberglass contamination. Speak naturally, empathize with their fear, but remain professional and focused on protocols. If they sound panicked, calm them down first. Protocols: 1. Isolate HVAC. 2. N95 immediately. 3. No moving items. 4. No standard vacuums. Use your knowledge to guide them through their specific room setup.",
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            if (!inputContextRef.current || !streamRef.current) return;
            
            const source = inputContextRef.current.createMediaStreamSource(streamRef.current);
            const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
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
            processor.connect(inputContextRef.current.destination);
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
            console.error("Live Session Error:", e);
            cleanup();
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error("Call Setup Error:", e);
      cleanup();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center items-center px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-display text-white uppercase tracking-tighter mb-2">SafeGuard Live Nexus</h1>
        <p className="text-muted font-semibold uppercase tracking-widest text-xs">Direct Audio Link to Matt Russ Fyburs</p>
      </div>

      <motion.div 
        layout
        className="glass-card p-12 w-full max-w-2xl text-center relative overflow-hidden shadow-2xl border-primary/20"
      >
        {/* Background Pulsing */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[100px] -z-10" />
        
        <div className="relative mb-12">
          <AnimatePresence>
            {isConnected && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.8 + (volume / 8)], 
                      opacity: [0.3, 0],
                    }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.6 }}
                    className="absolute w-48 h-48 rounded-full border border-primary/30"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center transition-all duration-700 relative z-10 ${
            isConnected ? 'bg-primary shadow-[0_0_80px_rgba(99,102,241,0.6)] scale-110' : 'bg-surface border border-white/10'
          }`}>
            {isConnecting ? (
              <Loader2 className="w-16 h-16 text-white animate-spin" />
            ) : isConnected ? (
              <Volume2 className="w-16 h-16 text-white" />
            ) : (
              <Mic className="w-16 h-16 text-muted" />
            )}
          </div>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="space-y-2">
            <h3 className="text-white font-display text-2xl uppercase tracking-wider">
              {isConnecting ? 'Initializing Neural Link...' : isConnected ? 'Active Voice Session' : 'Encrypted Line Ready'}
            </h3>
            <div className="flex justify-center items-center gap-4 py-2">
              <div className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-muted'}`} />
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted">
                {isConnected ? 'Voice Activity Detected' : 'Standby Mode'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {isConnected ? (
              <button 
                onClick={cleanup} 
                className="neuro-btn bg-danger hover:bg-danger/80 text-white px-12 py-5 rounded-3xl font-bold text-xl flex items-center gap-4 mx-auto shadow-xl group"
              >
                <PhoneOff size={24} /> DISCONNECT
              </button>
            ) : (
              <button 
                onClick={startCall} 
                disabled={isConnecting}
                className="neuro-btn bg-primary hover:bg-primary/80 text-white px-12 py-5 rounded-3xl font-bold text-xl flex items-center gap-4 mx-auto shadow-[0_10px_50px_rgba(99,102,241,0.4)] disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
              >
                <Phone size={24} className={isConnecting ? '' : 'animate-bounce'} /> 
                {isConnecting ? 'CONNECTING...' : 'CALL MATT RUSS FYBURS'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-6">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
              <p className="text-[10px] text-muted font-bold uppercase">Latencey</p>
              <p className="text-accent text-sm font-display">80ms</p>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
              <p className="text-[10px] text-muted font-bold uppercase">Encoding</p>
              <p className="text-accent text-sm font-display">PCM-16</p>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
              <p className="text-[10px] text-muted font-bold uppercase">Persona</p>
              <p className="text-accent text-sm font-display">M-EXPERT</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <p className="mt-8 text-muted text-[10px] max-w-md text-center uppercase tracking-tighter">
        Caution: This is a live AI interface for emergency guidance. Do not touch contaminated surfaces during the call.
      </p>
    </div>
  );
};

export default LiveExpert;
