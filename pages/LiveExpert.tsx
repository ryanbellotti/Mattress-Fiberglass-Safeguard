import React, { useState } from 'react';
import { Phone, Video, Clock, User } from 'lucide-react';

const LiveExpert: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'phone' | 'video' | null>(null);

  const handleConnect = (mode: 'phone' | 'video') => {
    setSelectedMode(mode);
    setIsConnecting(true);
    setTimeout(() => {
      alert(`Connecting via ${mode}... This is a demo interface.`);
      setIsConnecting(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Live Expert Support</h1>
        <p className="text-muted">Connect with our safety experts in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 text-center hover:border-primary/50 transition-all cursor-pointer"
             onClick={() => handleConnect('phone')}>
          <Phone className="mx-auto mb-4 text-primary" size={48} />
          <h3 className="text-2xl font-semibold mb-2">Phone Call</h3>
          <p className="text-muted mb-4">Talk directly with a safety expert</p>
          <div className="flex items-center justify-center gap-2 text-sm text-success mb-4">
            <Clock size={16} />
            <span>Average wait: 2 min</span>
          </div>
          <button
            onClick={() => handleConnect('phone')}
            disabled={isConnecting}
            className="neuro-btn px-6 py-2 text-primary font-semibold hover:bg-primary/20 disabled:opacity-50"
          >
            {isConnecting && selectedMode === 'phone' ? '📞 Connecting...' : 'Call Expert'}
          </button>
        </div>

        <div className="glass-card p-8 text-center hover:border-secondary/50 transition-all cursor-pointer"
             onClick={() => handleConnect('video')}>
          <Video className="mx-auto mb-4 text-secondary" size={48} />
          <h3 className="text-2xl font-semibold mb-2">Video Call</h3>
          <p className="text-muted mb-4">Show your mattress to an expert</p>
          <div className="flex items-center justify-center gap-2 text-sm text-success mb-4">
            <Clock size={16} />
            <span>Average wait: 3 min</span>
          </div>
          <button
            onClick={() => handleConnect('video')}
            disabled={isConnecting}
            className="neuro-btn px-6 py-2 text-secondary font-semibold hover:bg-secondary/20 disabled:opacity-50"
          >
            {isConnecting && selectedMode === 'video' ? '📹 Connecting...' : 'Video Call'}
          </button>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="text-accent" size={20} />
          Available Experts
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">Expert #{i}</p>
                <p className="text-sm text-muted">Specialty: Mattress Safety</p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 border-l-4 border-accent">
        <h3 className="font-semibold mb-2">Tips for Best Experience</h3>
        <ul className="space-y-2 text-sm text-muted">
          <li>✓ Ensure good lighting if using video call</li>
          <li>✓ Have your mattress details ready</li>
          <li>✓ Check your internet connection</li>
          <li>✓ Be specific about your concerns</li>
        </ul>
      </div>
    </div>
  );
};

export default LiveExpert;