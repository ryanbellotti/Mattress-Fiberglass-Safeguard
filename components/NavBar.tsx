import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, MessageCircle, Search, Sparkles, Camera, Shield, Phone } from 'lucide-react';
import { clsx } from 'clsx';

const NavBar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Home, color: 'text-primary' },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'text-secondary' },
    { label: 'Live Expert', path: '/live', icon: Phone, color: 'text-danger' }, // New Feature Highlight
    { label: 'AI Chat', path: '/assistant', icon: MessageCircle, color: 'text-accent' },
    { label: 'Checker', path: '/checker', icon: Search, color: 'text-success' },
    { label: 'Scanner', path: '/scan', icon: Camera, color: 'text-primary' },
    { label: 'Guide', path: '/cleanup', icon: Sparkles, color: 'text-secondary' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-16 md:w-64 bg-surface border-r border-white/5 flex flex-col z-50 transition-all duration-300">
      <div className="p-4 flex items-center justify-center md:justify-start gap-3 border-b border-white/5 h-20">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
          <Shield size={24} />
        </div>
        <div className="hidden md:block">
          <h1 className="font-display text-xl tracking-wider text-white">SafeGuard</h1>
          <p className="text-xs text-muted">Fiberglass Helper</p>
        </div>
      </div>

      <div className="flex-1 py-6 space-y-2 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive ? "bg-black/20 shadow-inner" : "hover:bg-white/5"
              )}
            >
              <div className={clsx(
                "p-2 rounded-lg transition-colors",
                isActive ? "bg-white/5 text-white" : item.color
              )}>
                <item.icon size={20} />
              </div>
              <span className={clsx(
                "hidden md:block font-medium transition-colors",
                isActive ? "text-white" : "text-muted group-hover:text-white"
              )}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="neuro-inset p-3 rounded-xl hidden md:block">
          <p className="text-xs text-muted text-center">Powered by<br/><span className="text-primary font-bold">Gemini 3 Pro</span></p>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
