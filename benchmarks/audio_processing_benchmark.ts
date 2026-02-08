import { float32To16BitPCM, arrayBufferToBase64 } from '../utils/audioUtils.ts';

// Mock input buffer (mono, 4096 samples)
const bufferSize = 4096;
const inputData = new Float32Array(bufferSize);
// Fill with random data
for (let i = 0; i < bufferSize; i++) {
  inputData[i] = Math.random() * 2 - 1;
}

const ITERATIONS = 10000;

console.log(`Benchmarking audio processing for ${ITERATIONS} iterations (buffer size: ${bufferSize})...`);

const start = performance.now();
let totalVolume = 0;

for (let j = 0; j < ITERATIONS; j++) {
  // Volume calculation
  let sum = 0;
  for(let i=0; i<inputData.length; i++) sum += Math.abs(inputData[i]);
  const volume = (sum / inputData.length) * 100;
  totalVolume += volume;

  // PCM Conversion
  const pcm16 = float32To16BitPCM(inputData);

  // Base64 encoding (Main thread cost currently)
  const base64 = arrayBufferToBase64(pcm16.buffer);
}

const end = performance.now();
console.log(`Total Baseline Time (Main Thread): ${(end - start).toFixed(2)}ms`);
console.log(`Average time per iteration: ${((end - start) / ITERATIONS).toFixed(4)}ms`);

// Measure just the part remaining on main thread (Base64 only)
// Pre-calculate pcm16 buffer once to simulate receiving it from worklet
const pcm16ForOpt = float32To16BitPCM(inputData);
const start2 = performance.now();
for (let j = 0; j < ITERATIONS; j++) {
    // Only base64 encoding happens on main thread after optimization
    const base64 = arrayBufferToBase64(pcm16ForOpt.buffer);
}
const end2 = performance.now();

console.log(`Projected Optimized Time (Main Thread): ${(end2 - start2).toFixed(2)}ms`);
console.log(`Average time per iteration: ${((end2 - start2) / ITERATIONS).toFixed(4)}ms`);

const improvement = ((end - start) - (end2 - start2));
const pct = (improvement / (end - start) * 100);
console.log(`Estimated Main Thread Time Saved: ${improvement.toFixed(2)}ms (${pct.toFixed(1)}% reduction)`);
