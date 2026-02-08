import { useState } from 'react';
import { analyzeFiberglassExposure } from '../services/geminiService.ts';
import type { AssessmentData, AssessmentResult } from '../types.ts';

export const useNeuralDiagnostic = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  const runDiagnostic = async (data: AssessmentData) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await analyzeFiberglassExposure(data);
      setResult(response);

      const assessmentData = {
        date: new Date().toISOString(),
        data: data,
        result: response,
        status: 'Complete'
      };
      localStorage.setItem('safeguard_assessment', JSON.stringify(assessmentData));

      return response;
    } catch (e) {
      console.error(e);
      setError(e);

      // Fallback
      const fallbackResult: AssessmentResult = {
        severity: data.coverRemoved ? 'high' : 'medium',
        remediationPlan: ["Secure Area", "Do Not Disturb", "Contact Pro", "Wear PPE"]
      };

      const fallbackData = {
        date: new Date().toISOString(),
        data: data,
        result: fallbackResult,
        status: 'Complete'
      };
      localStorage.setItem('safeguard_assessment', JSON.stringify(fallbackData));

      // We return fallback result even on error to allow flow to continue
      setResult(fallbackResult);
      return fallbackResult;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { runDiagnostic, isAnalyzing, result, error };
};
