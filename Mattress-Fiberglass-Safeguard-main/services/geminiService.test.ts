import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeSafetyMedia } from './geminiService';

const { generateContentMock } = vi.hoisted(() => {
  return { generateContentMock: vi.fn() };
});

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: generateContentMock
      };
    },
    Type: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
      ARRAY: 'ARRAY'
    },
    Modality: {
      AUDIO: 'AUDIO'
    }
  };
});

describe('geminiService - analyzeSafetyMedia', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully analyze safety media and return parsed JSON', async () => {
    const mockData = {
      severity: 'medium',
      detections: ['fiberglass'],
      remediationPlan: ['leave the room'],
      summary: 'Detected fiberglass.'
    };

    generateContentMock.mockResolvedValue({
      text: JSON.stringify(mockData)
    });

    const result = await analyzeSafetyMedia('base64data', 'image/jpeg', 'test prompt');

    expect(generateContentMock).toHaveBeenCalledWith(expect.objectContaining({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: expect.arrayContaining([
          { inlineData: { mimeType: 'image/jpeg', data: 'base64data' } },
          { text: 'test prompt' }
        ])
      },
      config: expect.objectContaining({
        responseMimeType: "application/json"
      })
    }));

    expect(result).toEqual(mockData);
  });

  it('should handle errors during media analysis', async () => {
    const error = new Error('API Error');
    generateContentMock.mockRejectedValue(error);

    await expect(analyzeSafetyMedia('data', 'type', 'prompt')).rejects.toThrow('API Error');
  });

  it('should return empty object on empty response text', async () => {
    generateContentMock.mockResolvedValue({ text: '' });
    const result = await analyzeSafetyMedia('data', 'type', 'prompt');
    expect(result).toEqual({});
  });

  it('should handle JSON parsing errors', async () => {
    generateContentMock.mockResolvedValue({ text: 'invalid json' });
    await expect(analyzeSafetyMedia('data', 'type', 'prompt')).rejects.toThrow();
  });
});
