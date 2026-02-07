import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { analyzeMattressTag } from '../services/geminiService';

const Visualizer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        handleAnalyze(base64.split(',')[1]); // Send just the base64 data
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (base64Data: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await analyzeMattressTag(base64Data);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-display tracking-wide text-white mb-2">Tag Scanner</h1>
        <p className="text-muted">Upload a clear photo of your mattress tag. Gemini 3 Pro will analyze the materials list.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div className="space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`neuro-card border-2 border-dashed ${image ? 'border-success' : 'border-white/20'} h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden`}
          >
            {image ? (
              <img src={image} alt="Upload" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera size={48} className="text-muted mb-4" />
                <span className="text-sm font-bold text-muted">Click to Upload Tag Photo</span>
              </>
            )}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileSelect}
            />
          </div>
          
          {image && (
            <button 
              onClick={() => { setImage(null); setAnalysis(null); }}
              className="w-full neuro-btn py-3 text-sm text-muted hover:text-white"
            >
              Reset / Scan New
            </button>
          )}
        </div>

        {/* Results Area */}
        <div className="neuro-card p-6 min-h-[16rem]">
          {!image ? (
            <div className="h-full flex items-center justify-center text-muted text-sm">
              Waiting for image...
            </div>
          ) : isAnalyzing ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-sm font-bold animate-pulse">Analyzing Materials...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-4 animate-in fade-in">
              <div className={`p-4 rounded-xl border ${analysis.hasFiberglassTerms ? 'bg-danger/10 border-danger/30' : 'bg-success/10 border-success/30'}`}>
                <div className="flex items-center gap-3 mb-2">
                  {analysis.hasFiberglassTerms ? (
                    <AlertTriangle className="text-danger" />
                  ) : (
                    <Check className="text-success" />
                  )}
                  <h3 className="font-bold text-white">
                    {analysis.hasFiberglassTerms ? "Risk Detected" : "No Obvious Risk"}
                  </h3>
                </div>
                <p className="text-sm text-gray-300">
                  {analysis.hasFiberglassTerms 
                    ? "Warning terms found on label." 
                    : "No common fiberglass synonyms detected."}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">AI Analysis</h4>
                <p className="text-sm leading-relaxed text-gray-300">{analysis.analysis}</p>
              </div>

              {analysis.detectedTerms && analysis.detectedTerms.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Terms Found</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.detectedTerms.map((term: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-white">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
