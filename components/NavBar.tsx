import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { navigationGroups } from '../config/navigation';

const NavBar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed left-0 top-0 h-full w-16 md:w-64 bg-surface border-r border-white/5 flex flex-col z-50 transition-all duration-300">
      <div className="p-4 flex items-center justify-center md:justify-start gap-3 border-b border-white/5 h-20 shrink-0">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
          <Shield size={24} />
        </div>
        <div className="hidden md:block">
          <h1 className="font-display text-xl tracking-wider text-white">SafeGuard</h1>
          <p className="text-[10px] text-muted uppercase tracking-widest font-bold">V3.1 AI Nexus</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-6 px-2 scrollbar-hide">
        {navigationGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <h3 className="hidden md:block text-[10px] font-bold text-muted px-4 mb-2 tracking-[0.2em]">
              {group.title}
            </h3>
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                    isActive ? "bg-white/5 shadow-inner" : "hover:bg-white/5"
                  )}
                >
                  <div className={clsx(
                    "p-2 rounded-lg transition-colors",
                    isActive ? "bg-primary/20 text-white" : item.color
                  )}>
                    <item.icon size={18} />
                  </div>
                  <span className={clsx(
                    "hidden md:block text-xs font-semibold transition-colors truncate",
                    isActive ? "text-white" : "text-muted group-hover:text-white"
                  )}>
                    {item.label}
                  </span>
                  
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="neuro-inset p-3 rounded-xl hidden md:block">
          <p className="text-[10px] text-muted text-center uppercase tracking-tighter">
            System Online<br/>
            <span className="text-primary font-bold">GEMINI 3 MULTIMODAL</span>
          </p>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
