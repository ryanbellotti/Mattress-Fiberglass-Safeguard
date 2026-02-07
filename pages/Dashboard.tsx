import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-display tracking-wide text-white">My Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="neuro-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
             <Link to="/checker" className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between">
                <span className="font-medium text-gray-200">Check Mattress Brand</span>
                <Shield size={18} className="text-secondary" />
             </Link>
             <Link to="/scan" className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between">
                <span className="font-medium text-gray-200">Scan Label Photo</span>
                <Activity size={18} className="text-primary" />
             </Link>
             <Link to="/cleanup" className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between">
                <span className="font-medium text-gray-200">Emergency Cleanup</span>
                <AlertTriangle size={18} className="text-danger" />
             </Link>
          </div>
        </div>

        <div className="neuro-card p-6 bg-gradient-to-br from-primary/20 to-surface border-primary/20">
          <h2 className="text-xl font-bold text-white mb-2">Did you know?</h2>
          <p className="text-gray-300 leading-relaxed">
            Removing the outer cover of a mattress containing fiberglass is the #1 cause of contamination events. Always check the label for "Do Not Remove Cover" warnings, even if there is a zipper.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
