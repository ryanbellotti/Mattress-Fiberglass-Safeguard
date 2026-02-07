import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Droplet } from 'lucide-react';
import { CleanupStep } from '../types';

const CleanupGuide: React.FC = () => {
  const [steps, setSteps] = useState<CleanupStep[]>([
    {
      id: 1,
      title: 'Prepare the Area',
      description: 'Ensure good ventilation. Open windows and use fans. Wear protective equipment including gloves and an N95 mask.',
      isCompleted: false,
    },
    {
      id: 2,
      title: 'Vacuum the Mattress',
      description: 'Use a HEPA filter vacuum to gently vacuum the mattress surface. Use slow, overlapping strokes to trap fiberglass particles.',
      isCompleted: false,
    },
    {
      id: 3,
      title: 'Use Wet Cleaning',
      description: 'Dampen a cloth with distilled water and wipe down the mattress. This helps capture remaining particles.',
      isCompleted: false,
    },
    {
      id: 4,
      title: 'Seal if Necessary',
      description: 'Consider using a mattress encasement to prevent future fiberglass release.',
      isCompleted: false,
    },
  ]);

  const toggleStep = (id: number) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, isCompleted: !step.isCompleted } : step
    ));
  };

  const completedCount = steps.filter(s => s.isCompleted).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Cleanup Guide</h1>
        <p className="text-muted">Step-by-step fiberglass cleanup process</p>
      </div>

      <div className="glass-card p-6 bg-gradient-to-r from-danger/10 to-secondary/10">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-danger flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold mb-1">Safety First</h3>
            <p className="text-sm text-muted">Always wear protective equipment (N95 mask, gloves) when dealing with fiberglass. Ensure proper ventilation throughout the process.</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">Progress</h3>
            <span className="text-accent font-bold">{completedCount}/{steps.length}</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                step.isCompleted
                  ? 'bg-success/10 border-success/30'
                  : 'bg-white/5 border-white/10 hover:border-primary/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  step.isCompleted
                    ? 'bg-success border-success'
                    : 'border-white/20'
                }`}> 
                  {step.isCompleted && <CheckCircle2 size={16} className="text-white" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="text-sm text-muted mt-1">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Droplet className="text-accent" size={20} />
          Additional Resources
        </h3>
        <ul className="space-y-2 text-sm text-muted">
          <li>• EPA guidelines on fiberglass safety</li>
          <li>• Contact a professional if you have concerns</li>
          <li>• Dispose of fiberglass materials properly</li>
          <li>• Monitor for any respiratory issues</li>
        </ul>
      </div>
    </div>
  );
};

export default CleanupGuide;