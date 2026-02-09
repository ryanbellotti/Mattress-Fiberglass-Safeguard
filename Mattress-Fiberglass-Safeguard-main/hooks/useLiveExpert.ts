import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { base64ToUint8Array, arrayBufferToBase64, decodeAudioData, float32To16BitPCM } from '../utils/audioUtils';

export const useLiveExpert = () => {
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
          systemInstruction: "You are Matt Russ Fyburs, the lead advocate at mattressfiberglass.org. You are on an emergency call with a user who suspects fiberglass contamination. You are empathetic, masculine, and authoritative. Your goal is to guide them through immediate safety measures. Be conversational, interruptible, and calm. Protocol: 1. Confirm cover is not removed. 2. Isolate HVAC. 3. Put on N95. 4. Evacuate pets/children.",
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

  return {
    isConnected,
    isConnecting,
    volume,
    error,
    startCall,
    endCall: cleanup
  };
};
