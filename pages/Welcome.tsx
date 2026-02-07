import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, MessageSquare, ChevronRight } from 'lucide-react';

const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-display font-bold gradient-text leading-tight">
            Mattress<br />Fiberglass<br />SafeGuard
          </h1>
          <p className="text-xl text-muted max-w-2xl">
            AI-powered safety companion powered by Gemini 3 Vision. Detect mattress fiberglass contamination with conversational empathy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6 hover:border-primary/50 transition-all cursor-pointer">
            <Shield className="text-primary mb-3" size={24} />
            <h3 className="font-semibold mb-2">Smart Detection</h3>
            <p className="text-sm text-muted">Advanced AI vision analysis</p>
          </div>
          <div className="glass-card p-6 hover:border-secondary/50 transition-all cursor-pointer">
            <Zap className="text-secondary mb-3" size={24} />
            <h3 className="font-semibold mb-2">Instant Results</h3>
            <p className="text-sm text-muted">Real-time contamination check</p>
          </div>
          <div className="glass-card p-6 hover:border-accent/50 transition-all cursor-pointer">
            <MessageSquare className="text-accent mb-3" size={24} />
            <h3 className="font-semibold mb-2">Expert Support</h3>
            <p className="text-sm text-muted">Empathetic AI assistance</p>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <Link to="/checker" className="neuro-btn px-8 py-3 font-semibold text-primary hover:bg-primary/20 flex items-center gap-2">
            Start Check <ChevronRight size={20} />
          </Link>
          <Link to="/assistant" className="glass-card px-8 py-3 font-semibold hover:border-accent/50 text-accent flex items-center gap-2">
            Chat with AI <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
