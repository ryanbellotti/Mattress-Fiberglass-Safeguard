import { test } from 'node:test';
import assert from 'node:assert';
import { base64ToUint8Array, arrayBufferToBase64 } from './audioUtils.ts';

test('base64ToUint8Array converts base64 string to Uint8Array', () => {
    const input = 'SGVsbG8gV29ybGQ='; // "Hello World" in Base64
    const expected = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]);
    const result = base64ToUint8Array(input);
    assert.deepStrictEqual(result, expected);
});

test('arrayBufferToBase64 converts ArrayBuffer to base64 string', () => {
    const input = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]).buffer;
    const expected = 'SGVsbG8gV29ybGQ=';
    const result = arrayBufferToBase64(input);
    assert.strictEqual(result, expected);
});

test('round trip conversion', () => {
    const original = 'TestString123';
    // Convert string to base64 manually for setup
    const base64 = Buffer.from(original).toString('base64');

    const uint8Array = base64ToUint8Array(base64);
    const resultBase64 = arrayBufferToBase64(uint8Array.buffer);

    assert.strictEqual(resultBase64, base64);
});
