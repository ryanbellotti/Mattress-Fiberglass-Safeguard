import { test, describe, it, mock, beforeEach } from 'node:test';
import assert from 'node:assert';

// Mock needs to be set up before importing the module that uses it.
// However, since we are using ESM, we need to use the module mocking capability.
// node:test mock.module is available in recent Node versions.

const generateContentMock = mock.fn();

// Mock the GoogleGenAI class
class MockGoogleGenAI {
  models;
  opts;
  constructor(opts) {
    this.opts = opts;
    this.models = {
      generateContent: generateContentMock
    };
  }
}

// Mock the module
mock.module('@google/genai', {
  namedExports: {
    GoogleGenAI: MockGoogleGenAI,
    Type: { OBJECT: 'OBJECT', STRING: 'STRING', ARRAY: 'ARRAY' },
    Modality: { AUDIO: 'AUDIO' }
  }
});

// Import the service dynamically to ensure the mock is in place
const { sendAdvancedChatMessage } = await import('./geminiService.ts');

describe('geminiService', () => {
  beforeEach(() => {
    generateContentMock.mock.resetCalls();
  });

  it('sendAdvancedChatMessage sends correct parameters and returns structured response', async () => {
    const mockResponse = {
      text: 'AI Response',
      candidates: [{
        groundingMetadata: {
          groundingChunks: [
            { web: { uri: 'https://example.com' } }
          ]
        }
      }]
    };

    generateContentMock.mock.mockImplementation(async () => mockResponse);

    const history = [{ role: 'user', parts: [{ text: 'Previous message' }] }];
    const message = 'New query';

    const result = await sendAdvancedChatMessage(history, message);

    assert.strictEqual(result.text, 'AI Response');
    assert.deepStrictEqual(result.sources, [{ uri: 'https://example.com' }]);

    assert.strictEqual(generateContentMock.mock.calls.length, 1);
    const callArgs = generateContentMock.mock.calls[0].arguments;

    // Check call arguments
    const config = callArgs[0];
    assert.strictEqual(config.model, 'gemini-3-pro-preview');

    // Verify contents structure
    // content[0] is history[0], content[1] is new message
    assert.strictEqual(config.contents.length, 2);
    assert.strictEqual(config.contents[1].parts[0].text, message);

    // Verify tools config
    assert.ok(config.config.tools[0].googleSearch);
    assert.ok(config.config.thinkingConfig);
  });

  it('sendAdvancedChatMessage handles errors gracefully', async () => {
    generateContentMock.mock.mockImplementation(async () => {
      throw new Error('API Failure');
    });

    const result = await sendAdvancedChatMessage([], 'trigger error');

    assert.strictEqual(result.text, 'Connection to safety nexus interrupted.');
    assert.deepStrictEqual(result.sources, []);
  });
});
