import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const Visualizer: React.FC = () => {
  const [isScanningActive, setIsScanningActive] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">3D Mattress Scanner</h1>
        <p className="text-muted">Visualize potential fiberglass contamination areas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card p-8 aspect-video flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-muted">3D Model Visualization Area</p>
              <p className="text-sm text-muted/60 mt-2">Upload or scan a mattress to view</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-4">
            <h3 className="font-semibold text-accent mb-4">Scan Controls</h3>
            <button
              onClick={() => setIsScanningActive(!isScanningActive)}
              className="w-full neuro-btn py-3 px-4 text-primary font-semibold mb-3 hover:bg-primary/20"
            >
              {isScanningActive ? '⏹ Stop Scan' : '▶ Start Scan'}
            </button>
          </div>

          <div className="glass-card p-4 space-y-3">
            <h4 className="font-semibold text-text">Safety Status</h4>
            <div className="flex items-center gap-2 text-success">
              <CheckCircle size={18} />
              <span className="text-sm">No threats detected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;