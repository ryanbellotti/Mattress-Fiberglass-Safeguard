import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { checkBrandWithSearch } from '../services/geminiService.ts';

describe('Gemini Service', () => {
  it('should export checkBrandWithSearch function', () => {
    assert.strictEqual(typeof checkBrandWithSearch, 'function');
  });
});
