import { test, mock, describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

// Mock dependencies BEFORE importing the service
const generateContentMock = mock.fn();

// Mock GoogleGenAI class constructor
const GoogleGenAIMock = class {
  apiKey: string;
  models: any;
  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
    this.models = {
      generateContent: generateContentMock
    };
  }
};

// Use mock.module to replace @google/genai
mock.module('@google/genai', {
  namedExports: {
    GoogleGenAI: GoogleGenAIMock,
    Type: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
      ARRAY: 'ARRAY'
    },
    Modality: {}
  }
});

describe('geminiService', () => {
  let analyzeFiberglassExposure: any;

  beforeEach(async () => {
    generateContentMock.mock.resetCalls();
    // Dynamic import to ensure mock is applied
    const module = await import('../services/geminiService.ts');
    analyzeFiberglassExposure = module.analyzeFiberglassExposure;
  });

  it('analyzeFiberglassExposure calls GoogleGenAI with correct parameters', async () => {
    const mockData = {
      name: 'Test User',
      location: 'Test Loc',
      brand: 'Brand X',
      model: 'Model Y',
      coverRemoved: true,
      visibleFibers: false,
      symptoms: ['Cough'],
      areas: ['Bedroom']
    };

    const mockResponse = {
      text: JSON.stringify({
        severity: 'high',
        remediationPlan: ['Step 1'],
        detections: [],
        summary: 'Bad'
      })
    };

    generateContentMock.mock.mockImplementation(async () => {
      return { text: mockResponse.text };
    });

    const result = await analyzeFiberglassExposure(mockData);

    assert.deepStrictEqual(result, {
      severity: 'high',
      remediationPlan: ['Step 1'],
      detections: [],
      summary: 'Bad'
    });

    assert.strictEqual(generateContentMock.mock.callCount(), 1);
    const callArgs = generateContentMock.mock.calls[0].arguments[0];

    assert.strictEqual(callArgs.model, 'gemini-3-pro-preview');
    assert.ok(callArgs.contents.parts[0].text.includes('Brand X'));
    assert.ok(callArgs.contents.parts[0].text.includes('Model Y'));
    assert.ok(callArgs.contents.parts[0].text.includes('YES (HIGH RISK)'));
  });
});
