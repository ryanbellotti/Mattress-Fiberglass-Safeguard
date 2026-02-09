import { vi, describe, it, expect, beforeEach } from 'vitest';
import { GoogleGenAI } from '@google/genai';
import { checkBrandWithSearch } from '../../Mattress-Fiberglass-Safeguard-main/services/geminiService';

// Mock @google/genai
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn(),
    Type: {},
    Modality: {}
  };
});

describe('checkBrandWithSearch', () => {
  const mockGenerateContent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Use a standard function so it can be used as a constructor
    (GoogleGenAI as any).mockImplementation(function() {
      return {
        models: {
          generateContent: mockGenerateContent
        }
      };
    });
  });

  it('should return low risk when analysis indicates no fiberglass', async () => {
    mockGenerateContent.mockResolvedValue({
      text: () => "Analysis shows no fiberglass. Risk is low.",
      candidates: [{
        groundingMetadata: {
          groundingChunks: [{ web: { uri: "http://example.com" } }]
        }
      }]
    });

    const result = await checkBrandWithSearch("SafeMattress");

    expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
      model: 'gemini-3-flash-preview',
      contents: expect.stringContaining("SafeMattress"),
      config: expect.any(Object)
    }));

    expect(result).toEqual({
      riskLevel: 'low',
      containsFiberglass: false,
      summary: "Analysis shows no fiberglass. Risk is low.",
      sources: ["http://example.com"]
    });
  });

  it('should identify high risk and confirmed fiberglass', async () => {
    mockGenerateContent.mockResolvedValue({
      text: () => "Confirmed contains fiberglass. Risk level is High.",
      candidates: []
    });

    const result = await checkBrandWithSearch("DangerMattress");

    expect(result).toEqual({
      riskLevel: 'high',
      containsFiberglass: true,
      summary: "Confirmed contains fiberglass. Risk level is High.",
      sources: []
    });
  });

  it('should identify medium risk', async () => {
    mockGenerateContent.mockResolvedValue({
      text: () => "Potential issues found. Risk is Medium.",
      candidates: []
    });

    const result = await checkBrandWithSearch("MaybeMattress");

    expect(result.riskLevel).toBe('medium');
  });

  it('should handle API errors gracefully', async () => {
    const error = new Error("API Error");
    mockGenerateContent.mockRejectedValue(error);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(checkBrandWithSearch("ErrorMattress")).rejects.toThrow("API Error");
    expect(consoleSpy).toHaveBeenCalledWith("Brand Audit Error:", error);

    consoleSpy.mockRestore();
  });

  it('should handle empty response text gracefully', async () => {
    mockGenerateContent.mockResolvedValue({
      text: () => null,
      candidates: []
    });

    const result = await checkBrandWithSearch("EmptyMattress");
    expect(result.riskLevel).toBe('low');
    expect(result.summary).toBe("");
  });
});
