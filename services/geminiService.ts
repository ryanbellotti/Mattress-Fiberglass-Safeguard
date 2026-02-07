import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 2048 },
        systemInstruction: "You are Matt Russ Fyburs, a compassionate safety expert for mattress fiberglass. You are part of a support group on Facebook and co-founder of mattressfiberglass.org. Be scientific, empathetic, and always prioritize N95 masks and HVAC isolation.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting to my safety database. Please check your internet.";
  }
};

export const checkBrandWithSearch = async (brandName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search for the latest safety reports, lawsuits, and ingredient lists for the mattress brand: "${brandName}". Does it contain fiberglass? Summarize risk level.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            containsFiberglass: { type: Type.BOOLEAN },
            summary: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ["high", "medium", "low", "none"] },
          },
          required: ["containsFiberglass", "summary", "riskLevel"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web?.uri)
      .filter((u: any) => u) || [];

    return { ...data, sources };
  } catch (error) {
    console.error("Search Error:", error);
    return null;
  }
};

export const analyzeMattressTag = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Scan this mattress tag for indicators of fiberglass (silica, glass fiber, glass wool). Return JSON: {hasFiberglassTerms: boolean, detectedTerms: string[], analysis: string}." }
        ]
      },
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Vision Error:", error);
    throw error;
  }
};

export const generateSpeech = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};