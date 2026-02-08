import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, AlertTriangle, CheckCircle, ArrowRight, FileText, Zap, ExternalLink, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { DASHBOARD_RESOURCES } from '@/data/resources';

const MotionDiv = motion.div as any;

const Dashboard: React.FC = () => {
  const [assessment, setAssessment] = useState<any>(null);
  
  useEffect(() => {
    const data = localStorage.getItem('safeguard_assessment');
    if (data) setAssessment(JSON.parse(data));
  }, []);

  const getSeverityColor = (s: string) => {
    switch(s?.toLowerCase()) {
      case 'high': case 'extreme': return 'text-danger';
      case 'medium': return 'text-yellow-500';
      default: return 'text-success';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display tracking-wide text-white uppercase">My Command Center</h1>
          <p className="text-muted text-sm mt-1">Welcome back{assessment?.data?.name ? `, ${assessment.data.name}` : ''}</p>
        </div>
        <p className="text-xs font-bold text-muted uppercase tracking-widest">Case ID: {assessment ? '883-XC' : 'N/A'}</p>
      </div>

      {!assessment ? (
        <div className="glass-card p-12 text-center space-y-6">
           <Shield size={64} className="mx-auto text-primary opacity-50" />
           <h2 className="text-2xl font-display text-white uppercase">No Active Protocol</h2>
           <p className="text-muted">Initialize the Safety Ingress to generate your personalized dashboard.</p>
           <Link to="/assessment">
              <button className="neuro-btn bg-primary text-white px-8 py-4 rounded-xl font-bold mt-4">START ASSESSMENT</button>
           </Link>
        </div>
      ) : (
        <>
          {/* Top Stats Row */}
          <div className="grid md:grid-cols-4 gap-6">
             <MotionDiv initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-6 border-l-4 border-primary relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Shield size={64} />
                </div>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Current Status</p>
                <p className="text-xl font-display text-white uppercase">Assessment Complete</p>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle size={14} className="text-primary" />
                  <p className="text-xs text-gray-300">Analysis Finalized</p>
                </div>
             </MotionDiv>
             
             <MotionDiv initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 border-l-4 border-accent relative overflow-hidden">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Overall Progress</p>
                <div className="flex items-end gap-2 relative z-10">
                   <p className="text-4xl font-display text-accent">16</p>
                   <p className="text-xs font-bold text-accent mb-1 uppercase">Steps Completed</p>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                   <MotionDiv 
                     initial={{ width: 0 }}
                     animate={{ width: "64%" }}
                     transition={{ duration: 1, delay: 0.5 }}
                     className="h-full bg-accent relative"
                   >
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse" />
                   </MotionDiv>
                </div>
                <p className="text-[9px] text-right mt-1 text-muted">64% TOTAL COMPLETION</p>
             </MotionDiv>

             <MotionDiv initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6 border-l-4 border-danger">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Contamination Level</p>
                <p className={`text-4xl font-display uppercase ${getSeverityColor(assessment.result?.severity)}`}>
                  {assessment.result?.severity || 'MODERATE'}
                </p>
             </MotionDiv>

             <MotionDiv initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6 border-l-4 border-secondary">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Assessment Date</p>
                <p className="text-2xl font-display text-white uppercase">{new Date(assessment.date).toLocaleDateString()}</p>
                <p className="text-xs text-gray-400 mt-1">Protocol v3.1 Active</p>
             </MotionDiv>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
             {/* Main Content */}
             <div className="lg:col-span-2 space-y-8">
                {/* Personalized Tips */}
                <div className="glass-card p-8">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <Zap size={20} />
                      </div>
                      <h2 className="text-2xl font-display text-white uppercase">Personalized Safety Directives</h2>
                   </div>
                   
                   <div className="space-y-4">
                      {assessment.data?.coverRemoved && (
                        <MotionDiv initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-danger/10 border border-danger/30 rounded-xl flex gap-4">
                           <AlertTriangle className="text-danger shrink-0 mt-1" size={20} />
                           <div>
                              <p className="text-xs font-bold text-danger uppercase mb-1">CRITICAL ALERT: COVER REMOVED</p>
                              <p className="text-sm text-gray-300">You indicated the mattress cover was removed. This releases millions of shards. <span className="text-white font-bold">Do not re-enter the room without P100 respiratory protection.</span></p>
                           </div>
                        </MotionDiv>
                      )}
                      
                      {assessment.data?.symptoms?.length > 0 && (
                        <MotionDiv initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex gap-4">
                           <Activity className="text-yellow-500 shrink-0 mt-1" size={20} />
                           <div>
                              <p className="text-xs font-bold text-yellow-500 uppercase mb-1">HEALTH SYMPTOMS DETECTED</p>
                              <p className="text-sm text-gray-300">You reported symptoms including {assessment.data.symptoms.slice(0, 2).join(", ")}. Consult a medical professional specifically mentioning "particulate glass exposure".</p>
                           </div>
                        </MotionDiv>
                      )}

                      <MotionDiv initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="p-4 bg-white/5 border border-white/5 rounded-xl flex gap-4">
                         <CheckCircle className="text-success shrink-0 mt-1" size={20} />
                         <div>
                            <p className="text-xs font-bold text-success uppercase mb-1">RECOMMENDED ACTION: ISOLATION</p>
                            <p className="text-sm text-gray-300">Based on your location in {assessment.data?.location || 'your area'}, verify local waste disposal laws for hazardous fiber materials before disposing of the mattress.</p>
                         </div>
                      </MotionDiv>
                   </div>
                </div>

                {/* Integrated Resources Widget */}
                <div className="glass-card p-8 bg-gradient-to-br from-surface to-white/5">
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                          <Bookmark size={20} />
                        </div>
                        <h2 className="text-2xl font-display text-white uppercase">Command Resources</h2>
                      </div>
                      <Link to="/resources" className="text-xs font-bold text-primary flex items-center gap-1 hover:text-white transition-colors">VIEW ALL <ArrowRight size={14}/></Link>
                   </div>
                   
                   <div className="grid md:grid-cols-3 gap-4">
                      {DASHBOARD_RESOURCES.map((cat, i) => (
                        <div key={i} className="space-y-3">
                           <p className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-white/5 pb-2">{cat.category}</p>
                           <div className="space-y-2">
                              {cat.links.map((link, j) => (
                                <a 
                                  key={j} 
                                  href={link.url} 
                                  target="_blank" 
                                  className="block p-3 rounded-xl bg-black/40 border border-white/5 hover:border-primary/40 hover:bg-white/5 transition-all group"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-300 group-hover:text-white truncate">{link.label}</span>
                                    <ExternalLink size={10} className="text-muted group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                                  </div>
                                  <p className="text-[9px] text-muted mt-0.5">{link.sub}</p>
                                </a>
                              ))}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Right Column */}
             <div className="space-y-6">
                <div className="glass-card p-6">
                  <h2 className="text-xl font-display text-white uppercase mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                     <Link to="/checker" className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group">
                        <span className="font-bold text-xs text-gray-200 uppercase">Check Mattress Brand</span>
                        <Shield size={16} className="text-secondary group-hover:scale-110 transition-transform" />
                     </Link>
                     <Link to="/scan" className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group">
                        <span className="font-bold text-xs text-gray-200 uppercase">Scan Room</span>
                        <Activity size={16} className="text-primary group-hover:scale-110 transition-transform" />
                     </Link>
                     <Link to="/cleanup" className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group">
                        <span className="font-bold text-xs text-gray-200 uppercase">Emergency Cleanup</span>
                        <AlertTriangle size={16} className="text-danger group-hover:scale-110 transition-transform" />
                     </Link>
                     <Link to="/resources" className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group">
                        <span className="font-bold text-xs text-gray-200 uppercase">Knowledge Base</span>
                        <FileText size={16} className="text-accent group-hover:scale-110 transition-transform" />
                     </Link>
                  </div>
                </div>

                <div className="p-6 bg-danger/10 border border-danger/20 rounded-3xl">
                   <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="text-danger" size={18} />
                      <h3 className="text-xs font-bold text-danger uppercase tracking-widest">Important Safety Reminder</h3>
                   </div>
                   <p className="text-xs text-gray-300 leading-relaxed">
                      If you're experiencing severe health symptoms or suspect serious contamination, seek immediate medical attention and consider professional remediation services. Document everything with photos.
                   </p>
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;