import React, { useState, useRef, useEffect } from 'react';
import { Mic, Phone, PhoneOff, Activity, Volume2, ShieldAlert, Loader2 } from 'lucide-react';
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
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: "You are Matt Russ Fyburs, a compassionate and expert advocate for mattress fiberglass safety. You are part of a support group and co-founder of mattressfiberglass.org. Your tone is empathetic but firm about safety. You are on a phone call. Keep responses concise and focused on immediate actions: 1. Isolate HVAC. 2. Wear N95. 3. Do not move furniture. Ask the user what they see or where they are.",
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
              // Simple volume visualization
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += Math.abs(inputData[i]);
              setVolume((sum / inputData.length) * 100);

              const pcm16 = float32To16BitPCM(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: { 
                    mimeType: 'audio/pcm;rate=16000', 
                    data: arrayBufferToBase64(pcm16.buffer) 
                  }
                });
              });
            };
            
            source.connect(processor);
            processor.connect(inputContextRef.current.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
               const buffer = await decodeAudioData(base64ToUint8Array(audioData), audioContextRef.current);
               const source = audioContextRef.current.createBufferSource();
               source.buffer = buffer;
               source.connect(audioContextRef.current.destination);
               
               const now = audioContextRef.current.currentTime;
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, now);
               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += buffer.duration;
            }

            if (msg.serverContent?.interrupted) {
              nextStartTimeRef.current = 0;
              // In a more complex app, we'd cancel pending audio buffers here
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
      alert("Microphone access is required to talk to Matt. Please ensure you've granted permissions.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center items-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 w-full text-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[100px] -z-10" />
        
        <div className="space-y-4 mb-12">
          <h1 className="text-5xl font-display tracking-tight text-white uppercase leading-none">Emergency Line</h1>
          <p className="text-accent font-bold tracking-[0.2em] text-sm uppercase">Secure Audio Link to Matt Russ Fyburs</p>
        </div>

        <div className="relative mb-16">
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
                      scale: [1, 1.5 + (volume / 10)], 
                      opacity: [0.4, 0],
                      borderWidth: ["1px", "4px"]
                    }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.6 }}
                    className="absolute w-48 h-48 rounded-full border border-primary/40"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`w-48 h-48 mx-auto rounded-full flex items-center justify-center transition-all duration-700 relative z-10 ${
            isConnected ? 'bg-primary shadow-[0_0_60px_rgba(99,102,241,0.5)] scale-110' : 'bg-surface border border-white/10'
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

        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">
              {isConnecting ? 'Establishing Secure Link...' : isConnected ? 'Live Connection Active' : 'Offline'}
            </h3>
            <p className="text-muted text-sm max-w-xs mx-auto">
              {isConnected 
                ? "Matt is listening. Speak clearly about your situation." 
                : "Initiate a low-latency voice session for immediate guidance."}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {isConnected ? (
              <button 
                onClick={cleanup} 
                className="neuro-btn bg-danger hover:bg-danger/80 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 mx-auto shadow-xl group transition-all"
              >
                <PhoneOff size={24} className="group-hover:rotate-12 transition-transform" /> 
                END EMERGENCY CALL
              </button>
            ) : (
              <button 
                onClick={startCall} 
                disabled={isConnecting}
                className="neuro-btn bg-primary hover:bg-primary/80 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 mx-auto shadow-[0_10px_40px_rgba(99,102,241,0.4)] disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
              >
                {isConnecting ? (
                  <>AUTHENTICATING...</>
                ) : (
                  <>
                    <Phone size={24} className="animate-pulse" /> 
                    START VOICE SESSION
                  </>
                )}
              </button>
            )}
          </div>

          <div className="pt-8 flex items-center justify-center gap-3 text-muted text-xs bg-black/30 py-3 px-6 rounded-2xl w-fit mx-auto border border-white/5">
            <ShieldAlert size={16} className="text-accent" />
            <span className="uppercase tracking-widest font-semibold">Fiberglass Protocol V3.1 Active</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveExpert;