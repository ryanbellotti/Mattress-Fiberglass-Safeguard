import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, MessageSquare, Smartphone, Droplet, Eye, Phone } from 'lucide-react';

const NavBar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/assistant', label: 'AI Chat', icon: MessageSquare },
    { path: '/checker', label: 'Checker', icon: Smartphone },
    { path: '/cleanup', label: 'Cleanup', icon: Droplet },
    { path: '/scan', label: 'Scan', icon: Eye },
    { path: '/live', label: 'Live Expert', icon: Phone },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-16 md:w-64 bg-surface border-r border-white/10 flex flex-col p-4 z-50">
      <div className="mb-8">
        <h1 className="hidden md:block gradient-text font-display text-2xl font-bold">MFS</h1>
        <div className="md:hidden text-accent text-2xl">⚔️</div>
      </div>
      
      <div className="space-y-4 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
              isActive(item.path)
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-muted hover:text-text hover:bg-surface-light/50'
            }`}
          >
            <item.icon size={20} />
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="text-xs text-muted hidden md:block">v1.0 Beta</div>
      </div>
    </nav>
  );
};

export default NavBar;