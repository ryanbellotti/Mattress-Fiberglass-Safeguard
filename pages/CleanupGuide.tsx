
import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, CheckCircle, Circle, AlertTriangle, ArrowRight } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { base64ToUint8Array, decodeAudioData } from '../utils/audioUtils';

const steps = [
  {
    title: "Immediate Containment",
    desc: "Stop moving! Turn off all HVAC/fans immediately. Close the door to the affected room. Put on an N95 mask if available.",
    detail: "Movement spreads particles. Airflow spreads particles. Isolation is your first priority."
  },
  {
    title: "Personal Protection",
    desc: "Do not touch the fiberglass with bare skin. Wear long sleeves, gloves, and eye protection.",
    detail: "Fiberglass splinters can embed in skin and eyes causing severe irritation."
  },
  {
    title: "Assess the Spread",
    desc: "Use a flashlight in a dark room. Shine it parallel to surfaces. Fiberglass sparkles like diamond dust.",
    detail: "Check surfaces up to 10 feet away from the mattress first, then check the floor."
  },
  {
    title: "Proper Removal",
    desc: "Do NOT use a standard vacuum unless it is a sealed HEPA unit. Standard vacuums blow particles back into the air.",
    detail: "Use damp paper towels to wipe up particles, folding them inwards. Use lint rollers for clothes."
  }
];

const CleanupGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Cleanup on unmount to prevent memory leaks and stop audio
  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        sourceRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handlePlayAudio = async (text: string) => {
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
      const base64Audio = await generateSpeech(text);
      if (base64Audio) {
        if (!audioContextRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
        }
        
        // Gemini TTS returns raw PCM audio data, which requires manual decoding
        const audioData = base64ToUint8Array(base64Audio);
        const buffer = await decodeAudioData(audioData, audioContextRef.current, 24000, 1);
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => {
          setIsPlaying(false);
          sourceRef.current = null;
        };
        source.start(0);
        sourceRef.current = source;
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio error", error);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 h-full">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display tracking-wide text-white mb-2">Cleanup Protocol</h1>
          <p className="text-muted">Follow these steps exactly. Use the audio guide for hands-free assistance.</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div 
              key={index}
              onClick={() => setActiveStep(index)}
              className={`neuro-card p-4 flex items-center gap-4 cursor-pointer transition-all ${
                activeStep === index ? 'border-primary bg-primary/5' : 'hover:bg-white/5'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                activeStep === index ? 'bg-primary text-white' : 'neuro-inset text-muted'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${activeStep === index ? 'text-white' : 'text-gray-400'}`}>
                  {step.title}
                </h3>
              </div>
              {activeStep === index && <ArrowRight className="text-primary" size={20} />}
            </div>
          ))}
        </div>
      </div>

      <div className="neuro-card p-8 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <div className="bg-danger/10 text-danger border border-danger/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <AlertTriangle size={12} /> CRITICAL
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-6">
          <h2 className="text-3xl font-display text-white">{steps[activeStep].title}</h2>
          <p className="text-xl text-gray-200 leading-relaxed">{steps[activeStep].desc}</p>
          <div className="bg-white/5 p-4 rounded-xl border-l-4 border-accent">
            <p className="text-muted text-sm">{steps[activeStep].detail}</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <button
            onClick={() => handlePlayAudio(`${steps[activeStep].title}. ${steps[activeStep].desc} ${steps[activeStep].detail}`)}
            className={`w-full neuro-btn py-4 flex items-center justify-center gap-3 font-bold transition-all ${
              isPlaying ? 'bg-accent text-white' : 'hover:bg-white/5 text-text'
            }`}
          >
            {isLoadingAudio ? (
              <span>Loading Audio...</span>
            ) : isPlaying ? (
              <>
                <Square size={20} fill="currentColor" /> Stop Reading
              </>
            ) : (
              <>
                <Play size={20} fill="currentColor" /> Read Instructions Aloud
              </>
            )}
          </button>
          <p className="text-center text-xs text-muted mt-3">Powered by Gemini 2.5 TTS</p>
        </div>
      </div>
    </div>
  );
};

export default CleanupGuide;
