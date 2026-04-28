import { GoogleGenAI, Type, Modality } from "@google/genai";

// Advanced Chat with Thinking & Search
export const sendAdvancedChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
) => {
  // Always initialize GoogleGenAI within the call scope to ensure the latest API key is used
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing");
    return { text: "Error: API Key is missing. Please check your configuration.", sources: [] };
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // Filter out any potential 'system' roles from history if they exist, 
    // as Gemini 3 uses systemInstruction config instead
    const validHistory = history.filter(h => h.role === 'user' || h.role === 'model');

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...validHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, // Reduced budget for faster response in preview
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are Matt Russ Fyburs, the lead advocate at mattressfiberglass.org. You are a highly technical but empathetic safety expert. Use Google Search to find the latest recalls or lawsuits. When you use search, always provide the URLs. You use your 'Thinking' capability to analyze complex cross-contamination scenarios.",
      }
    });
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((u: any) => u) || [];

    return { text: response.text, sources };
  } catch (error: any) {
    console.error("Chat Error:", error);
    return { text: `Connection to safety nexus interrupted: ${error.message || 'Unknown error'}`, sources: [] };
  }
};

// Image/Video Understanding for the Scan page
export const analyzeSafetyMedia = async (base64Data: string, mimeType: string, prompt: string) => {
  // NOTE: For production you MUST call GenAI from a server-side endpoint that holds your API key.
  const apiKey = process.env.API_KEY;

  // If no API key is present (typical for client-side builds), run a demo fallback so the UI remains functional.
  if (!apiKey) {
    console.warn("API key not found — running analyzeSafetyMedia in demo mode (no external call).");
    const demo = {
      severity: 'medium',
      detections: [
        "Demo: Shiny flecks visible in flashlight area",
        "Demo: Mattress law tag detected (uncertain text)",
      ],
      remediationPlan: [
        "Isolate the mattress and avoid disturbing the cover",
        "Use bright flashlight to document contamination",
        "Contact a qualified remediation professional",
        "Document and report the incident to SaferProducts.gov"
      ],
      summary: "Demo analysis: no API key configured. This is a simulated response — for real analysis, configure a server-side API key and proxy GenAI calls through your backend."
    };
    await new Promise(resolve => setTimeout(resolve, 700));
    return demo;
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
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
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key Missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { 
          aspectRatio: "1:1", 
          imageSize: size 
        }
      }
    });
    
    // Check for inline data in the response
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    console.warn("No image data found in response");
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

export const generateSpeech = async (text: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key Missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO]
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Speech Generation Error:", error);
    return null;
  }
};

export const checkBrandWithSearch = async (query: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key Missing");
    throw new Error("API key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: `Search for safety audits, lawsuits, and fiberglass contamination issues regarding: ${query}. Return a JSON summary.` }] }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ["high", "medium", "low", "none"] },
            containsFiberglass: { type: Type.BOOLEAN },
            summary: { type: Type.STRING }
          },
          required: ["riskLevel", "containsFiberglass", "summary"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web?.uri)
      .filter((u: any) => u) || [];

    return {
      ...data,
      sources
    };
  } catch (error) {
    console.error("Brand Check Error:", error);
    throw error;
  }
};
