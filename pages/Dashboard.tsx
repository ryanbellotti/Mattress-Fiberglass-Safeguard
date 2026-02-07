import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Mattresses Checked', value: '2,341', icon: BarChart3, color: 'text-primary' },
    { label: 'Contaminations Found', value: '187', icon: AlertTriangle, color: 'text-danger' },
    { label: 'Success Rate', value: '98.5%', icon: CheckCircle, color: 'text-success' },
    { label: 'Active Users', value: '1,203', icon: TrendingUp, color: 'text-accent' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-muted">System overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-6 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`${stat.color}`} size={24} />
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-primary to-secondary"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4 text-accent">Recent Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">Mattress Check #{i}</p>
                <p className="text-sm text-muted">2 hours ago</p>
              </div>
              <span className="text-success text-sm font-semibold">Clean</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;