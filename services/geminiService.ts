
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/generative-ai";

// Advanced Chat with Thinking & Search
export const sendAdvancedChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
) => {
  // Always initialize GoogleGenAI within the call scope to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are Matt Russ Fyburs, the lead advocate at mattressfiberglass.org. You are a highly technical but empathetic safety expert. Use Google Search to find the latest recalls or lawsuits. When you use search, always provide the URLs. You use your 'Thinking' capability to analyze complex cross-contamination scenarios.",
      }
    });
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((u: any) => u) || [];

    return { text: response.text, sources };
  } catch (error) {
    console.error("Chat Error:", error);
    return { text: "Connection to safety nexus interrupted.", sources: [] };
  }
};

// Image/Video Understanding for the Scan page
export const analyzeSafetyMedia = async (base64Data: string, mimeType: string, prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: prompt }
        ]
      },
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING, enum: ["low", "medium", "high", "extreme"] },
            detections: { type: Type.ARRAY, items: { type: Type.STRING } },
            remediationPlan: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Step-by-step safety plan based on the items seen in the room (e.g., carpets, electronics)."
            },
            summary: { type: Type.STRING }
          },
          required: ["severity", "detections", "remediationPlan", "summary"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Media Analysis Error:", error);
    throw error;
  }
};

// High-Res Image Generation
export const generateSafetyGraphic = async (prompt: string, size: "1K" | "2K" | "4K") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio: "1:1", imageSize: size }
    }
  });
  
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

// Added: Search-grounded brand auditor for MattressChecker.tsx
export const checkBrandWithSearch = async (brandName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a safety audit for the mattress brand/model: "${brandName}". 
      Is it known to contain fiberglass in its fire barrier? 
      What is the risk level (High, Medium, or Low)?
      Provide a concise summary of findings including recall status or known class action lawsuits.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are Matt Russ Fyburs, the lead advocate at mattressfiberglass.org. Use precise technical safety data."
      }
    });

    const text = response.text || "";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web?.uri)
      .filter((u: any) => u) || [];

    // Analyze response text for structured UI display
    const lowerText = text.toLowerCase();
    let riskLevel: 'high' | 'medium' | 'low' = 'low';
    if (lowerText.includes('high')) riskLevel = 'high';
    else if (lowerText.includes('medium')) riskLevel = 'medium';

    return {
      riskLevel,
      containsFiberglass: lowerText.includes('yes') || lowerText.includes('confirmed') || lowerText.includes('contains fiberglass'),
      summary: text,
      sources
    };
  } catch (error) {
    console.error("Brand Audit Error:", error);
    throw error;
  }
};

// Added: Audio synthesis for hands-free cleanup guidance in CleanupGuide.tsx
export const generateSpeech = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read following safety instruction: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("Speech Synthesis Error:", error);
    return null;
  }
};
