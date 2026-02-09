import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Users, AlertCircle, Mail, Search, MessageSquare, 
  Send, CheckCircle2, Sparkles, Loader2, ShieldAlert, ExternalLink,
  Heart, Share2, MoreHorizontal, User, Reply
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const EducationHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const articles = [
    { title: "Understanding Modacrylic & Silica", category: "Materials", desc: "Why 'Glass Free' marketing can still mean hazardous fire barriers." },
    { title: "HVAC Contamination Dynamics", category: "Physics", desc: "How particles travel through ductwork and why filter changes aren't enough." },
    { title: "Legal Rights & Class Actions", category: "Legal", desc: "Current status of lawsuits against Zinus, Ashley Furniture, and others." },
    { title: "Health Impacts of Inhalation", category: "Medical", desc: "Differentiating between temporary irritation and chronic respiratory issues." }
  ];

  const handleDeepDive = async (topic: string) => {
    setIsLoading(true);
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Explain "${topic}" in the context of mattress fiberglass safety. Keep it concise (under 100 words) but highly technical and accurate.`
        });
        setActiveAnalysis(response.text || "Analysis unavailable.");
    } catch(e) {
        setActiveAnalysis("Neural uplink failed.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-display text-white uppercase tracking-tighter">Education Nexus</h1>
        <p className="text-accent text-xs font-bold uppercase tracking-[0.3em]">Deep Dive Intelligence</p>
      </div>
      
      <div className="glass-card p-6 flex items-center gap-4">
        <Search className="text-muted" />
        <input 
          type="text" 
          placeholder="Search knowledge base..." 
          className="bg-transparent border-none outline-none w-full text-white placeholder-muted"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {activeAnalysis && (
          <div className="p-6 bg-primary/10 border border-primary/30 rounded-2xl relative">
              <div className="absolute top-4 right-4 text-primary cursor-pointer hover:text-white" onClick={() => setActiveAnalysis(null)}>Close</div>
              <h3 className="text-primary font-bold uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                  <Sparkles size={12} /> Gemini 3 Analysis
              </h3>
              <p className="text-gray-200 text-sm leading-relaxed">{activeAnalysis}</p>
          </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())).map((article, i) => (
          <div key={i} className="glass-card p-8 hover:bg-white/5 transition-colors cursor-pointer group relative">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block">{article.category}</span>
            <h3 className="text-2xl font-display text-white uppercase mb-2 group-hover:text-accent transition-colors">{article.title}</h3>
            <p className="text-muted text-sm mb-4">{article.desc}</p>
            <button 
                onClick={(e) => { e.stopPropagation(); handleDeepDive(article.title); }}
                disabled={isLoading}
                className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-2 hover:text-white"
            >
                {isLoading ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                Ask AI to Explain
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- FORUM TYPES & COMPONENTS ---

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface Post {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  category: 'General' | 'Story' | 'Advice' | 'Emergency';
}

export const CommunityForum: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [category, setCategory] = useState<Post['category']>('General');
  const [isDrafting, setIsDrafting] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  // Load posts from local storage on mount or seed with data
  useEffect(() => {
    const saved = localStorage.getItem('safeguard_forum_posts');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      setPosts([
        {
          id: '1',
          author: 'Sarah J.',
          text: 'Found shards in my daughter\'s room today. Verified with the flashlight test. We are evacuating to a hotel. Does anyone know a good abatement company in Chicago?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          likes: 14,
          comments: [
            { id: 'c1', author: 'Mike_SafeGuard', text: 'Check the resources page for certified lists. Do not try to vacuum it yourself! Standard vacuums will spread it.', timestamp: new Date(Date.now() - 1800000).toISOString() }
          ],
          category: 'Emergency'
        },
        {
          id: '2',
          author: 'David K.',
          text: 'Just realized my "Bamboo" mattress is actually 60% glass fiber. The tag was hidden under the zipper. Why is this legal?',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          likes: 32,
          comments: [],
          category: 'Story'
        }
      ]);
    }
  }, []);

  // Persist posts
  useEffect(() => {
    localStorage.setItem('safeguard_forum_posts', JSON.stringify(posts));
  }, [posts]);

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      author: 'Anonymous Survivor', // Placeholder for user system
      text: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      category
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleLike = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleComment = (postId: string) => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      text: newComment,
      timestamp: new Date().toISOString()
    };
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
    setNewComment('');
    setActiveCommentId(null); // Close comment input or keep open? Let's close for now or keep open to see result.
  };

  const generateDraft = async () => {
      setIsDrafting(true);
      try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Draft a short, empathetic, and clear forum post for someone who just discovered fiberglass in their mattress. They are scared and need advice. Ask for help."
        });
        setNewPost(response.text || "");
      } catch (e) {
          console.error(e);
      } finally {
          setIsDrafting(false);
      }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Emergency': return 'bg-danger/20 text-danger border-danger/50';
      case 'Advice': return 'bg-success/20 text-success border-success/50';
      case 'Story': return 'bg-primary/20 text-primary border-primary/50';
      default: return 'bg-white/10 text-muted border-white/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-display text-white uppercase tracking-tighter">Community Nexus</h1>
        <p className="text-secondary text-xs font-bold uppercase tracking-[0.3em]">Connect, Share, Survive</p>
      </div>

      {/* Create Post Widget */}
      <div className="glass-card p-6 space-y-4 shadow-[0_0_40px_rgba(99,102,241,0.1)]">
        <div className="flex gap-4">
           <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 border border-primary/30">
             <User size={20} />
           </div>
           <div className="flex-1 space-y-3">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your story or ask for help..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-muted focus:ring-1 focus:ring-secondary/50 outline-none resize-none h-24 transition-all"
              />
              <div className="flex flex-wrap justify-between items-center gap-3">
                 <div className="flex gap-2">
                    {(['General', 'Story', 'Advice', 'Emergency'] as const).map(c => (
                      <button 
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${category === c ? 'bg-secondary text-black border-secondary' : 'bg-transparent text-muted border-white/10 hover:border-white/30'}`}
                      >
                        {c}
                      </button>
                    ))}
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={generateDraft}
                      disabled={isDrafting}
                      className="text-xs font-bold text-accent flex items-center gap-2 hover:text-white transition-colors bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20"
                    >
                      <Sparkles size={14} className={isDrafting ? "animate-spin" : ""} /> {isDrafting ? 'Drafting...' : 'AI Assist'}
                    </button>
                    <button 
                      onClick={handlePost}
                      disabled={!newPost.trim()}
                      className="neuro-btn bg-primary text-white px-6 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      <Send size={14} /> POST
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="glass-card p-6 hover:border-white/20 transition-all">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm bg-white/10 border border-white/5`}>
                      {post.author[0]}
                   </div>
                   <div>
                      <p className="text-sm font-bold text-white">{post.author}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getCategoryColor(post.category)}`}>{post.category}</span>
                        <span className="text-[10px] text-muted">{new Date(post.timestamp).toLocaleDateString()}</span>
                      </div>
                   </div>
                </div>
                <MoreHorizontal size={16} className="text-muted cursor-pointer hover:text-white" />
             </div>
             
             <p className="text-gray-300 text-sm leading-relaxed mb-6 whitespace-pre-wrap">{post.text}</p>
             
             <div className="flex items-center gap-6 border-t border-white/5 pt-4">
                <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 text-xs font-bold text-muted hover:text-danger transition-colors group">
                   <Heart size={16} className={`group-hover:fill-danger ${post.likes > 0 ? 'fill-danger text-danger' : ''}`} /> {post.likes}
                </button>
                <button onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)} className="flex items-center gap-2 text-xs font-bold text-muted hover:text-primary transition-colors">
                   <MessageSquare size={16} /> {post.comments.length} Comments
                </button>
                <button className="flex items-center gap-2 text-xs font-bold text-muted hover:text-white transition-colors ml-auto">
                   <Share2 size={16} /> Share
                </button>
             </div>

             {/* Comments Section */}
             {activeCommentId === post.id && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-in slide-in-from-top-2">
                   {post.comments.length > 0 && post.comments.map(comment => (
                      <div key={comment.id} className="flex gap-3 pl-4 border-l-2 border-white/10">
                         <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-muted shrink-0">
                            {comment.author[0]}
                         </div>
                         <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                                <p className="text-xs font-bold text-white">{comment.author}</p>
                                <span className="text-[9px] text-muted">{new Date(comment.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-gray-400">{comment.text}</p>
                         </div>
                      </div>
                   ))}
                   
                   <div className="flex gap-2 mt-4">
                      <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                        placeholder="Write a supportive reply..."
                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary/50 placeholder-muted"
                      />
                      <button 
                        onClick={() => handleComment(post.id)}
                        className="p-2 bg-primary/20 rounded-lg text-primary hover:bg-primary/30 border border-primary/30 transition-colors"
                      >
                        <Send size={14} />
                      </button>
                   </div>
                </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ReportIncident: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <CheckCircle2 size={64} className="text-success mb-6" />
        <h1 className="text-4xl font-display text-white uppercase">Report Logged</h1>
        <p className="text-muted mt-2">Your data has been encrypted and added to the registry.</p>
        <button onClick={() => setSubmitted(false)} className="mt-8 text-xs font-bold text-white underline">Submit Another</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-display text-white uppercase tracking-tighter">Incident Command</h1>
        <p className="text-danger text-xs font-bold uppercase tracking-[0.3em]">Submit Data & Notify Federal Authorities</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        
        {/* SECTION 1: USER FORM (Requested First) */}
        <div className="flex flex-col items-center space-y-4">
             <div className="glass-card p-2 bg-white rounded-[3rem] border-8 border-surface shadow-2xl relative">
                {/* iPhone-like Frame Element */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-surface rounded-b-2xl z-10"></div>
                <iframe
                    id="JotFormIFrame-253007406534147"
                    title="Mattress Fiberglass Leak Report"
                    allow="geolocation; microphone; camera"
                    src="https://www.jotform.com/app/253007406534147?appEmbedded=1"
                    style={{ height: '700px', width: '375px', border: 'none', borderRadius: '2rem' }}
                />
             </div>
             <p className="text-xs text-muted uppercase tracking-widest mt-4">SafeGuard Internal Advocate Registry</p>
        </div>

        {/* SECTION 2: FEDERAL REPORT (Predominant & Important) */}
        <div className="space-y-8 lg:sticky lg:top-24">
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-danger/20 to-danger/5 border border-danger/30 relative overflow-hidden shadow-[0_0_50px_rgba(244,63,94,0.15)]">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-danger">
                    <ShieldAlert size={140} />
                </div>
                
                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-danger text-white text-[10px] font-bold uppercase tracking-widest">
                        <AlertCircle size={12} /> Federal Action Required
                    </div>
                    
                    <h2 className="text-4xl font-display text-white uppercase leading-[0.9]">
                        File a CPSC Complaint <span className="text-danger">Immediately</span>
                    </h2>
                    
                    <p className="text-gray-200 text-sm leading-relaxed font-medium">
                        While our internal form collects data for advocacy, filing with <strong>SaferProducts.gov</strong> is the <span className="text-white underline decoration-danger underline-offset-4">only legal mechanism</span> that forces the U.S. Government to investigate and issue recalls.
                    </p>

                    <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2 mb-2">Why This Is Critical</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-xs text-gray-300">
                                <CheckCircle2 size={14} className="text-danger shrink-0 mt-0.5" />
                                <span>Creates a permanent federal record manufacturers cannot delete.</span>
                            </li>
                            <li className="flex items-start gap-3 text-xs text-gray-300">
                                <CheckCircle2 size={14} className="text-danger shrink-0 mt-0.5" />
                                <span>Triggers automatic investigation algorithms at the CPSC.</span>
                            </li>
                            <li className="flex items-start gap-3 text-xs text-gray-300">
                                <CheckCircle2 size={14} className="text-danger shrink-0 mt-0.5" />
                                <span>Publicly warns other families via the national database.</span>
                            </li>
                        </ul>
                    </div>

                    <a
                        href="https://www.saferproducts.gov/IncidentEntry"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group w-full py-5 rounded-2xl bg-danger hover:bg-red-500 text-white font-bold text-lg uppercase tracking-wide flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                        Launch Federal Report <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    
                    <p className="text-[10px] text-center text-white/40 uppercase tracking-widest">
                        Redirects to SaferProducts.gov (Official US Govt Site)
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export const ContactUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-center space-y-8">
      <div className="space-y-2">
        <h1 className="text-5xl font-display text-white uppercase tracking-tighter">Contact Nexus</h1>
        <p className="text-primary text-xs font-bold uppercase tracking-[0.3em]">Direct Line to MFSAG</p>
      </div>

      <div className="glass-card p-12 space-y-6 flex flex-col items-center">
        <Mail size={48} className="text-primary" />
        <p className="text-gray-300 max-w-lg">
          For press inquiries, partnership opportunities, or technical support with the SafeGuard tool, please reach out directly.
        </p>
        <a href="mailto:support@mattressfiberglass.org" className="text-2xl font-display text-white hover:text-primary transition-colors">
          support@mattressfiberglass.org
        </a>
      </div>
    </div>
  );
};

export const OrganizationResources = () => (
  <div className="max-w-4xl mx-auto py-10 px-4 text-center">
     <h1 className="text-4xl font-display text-white uppercase mb-6">Official Repository</h1>
     <iframe src="https://mattressfiberglass.org" className="w-full h-[800px] rounded-3xl border border-white/10 bg-white" title="Official Site"></iframe>
  </div>
);