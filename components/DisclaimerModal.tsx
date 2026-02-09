import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

const MotionDiv = motion.div as any;

interface DisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onAccept }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/90 backdrop-blur-xl"
          />
          
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative glass-card max-w-2xl w-full p-8 md:p-12 shadow-[0_0_50px_rgba(99,102,241,0.2)] border-primary/20 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-primary via-accent to-secondary animate-pulse" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Cpu size={32} className="animate-pulse" />
              </div>
              <div>
                <h2 className="text-3xl font-display text-white uppercase tracking-tight">Protocol Initiation</h2>
                <p className="text-accent text-xs font-bold tracking-widest uppercase">Safety Verification Required</p>
              </div>
            </div>

            <div className="space-y-6 text-gray-300">
              <div className="p-4 bg-white/5 rounded-xl border-l-4 border-accent">
                <p className="text-sm leading-relaxed">
                  <span className="text-white font-bold block mb-1">EDUCATIONAL & INFORMATIONAL NEXUS</span>
                  The SafeGuard system is a community-driven advocacy tool forged from first-hand survivor data and collective research. We are the bridge in the gap left by industry silence.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div className="flex gap-3">
                  <ShieldAlert className="text-danger shrink-0" size={18} />
                  <p>We are <span className="text-white font-bold">NOT</span> medical professionals, legal counsel, or certified environmental scientists.</p>
                </div>
                <div className="flex gap-3">
                  <AlertTriangle className="text-secondary shrink-0" size={18} />
                  <p>Consult <span className="text-white font-bold">LICENSED ABATEMENT</span> experts for actual physical cleanup or home remediation.</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-sm italic text-muted">
                  By initializing this interface, you synchronize with our collective knowledge and acknowledge that professional medical and legal consultation is your primary directive for specific emergency situations.
                </p>
                
                <button
                  onClick={onAccept}
                  className="w-full neuro-btn bg-primary hover:bg-primary/80 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CheckCircle2 size={24} /> I UNDERSTAND & INITIALIZE
                </button>
              </div>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DisclaimerModal;