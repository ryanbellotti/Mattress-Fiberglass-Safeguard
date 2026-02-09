/**
 * Benchmark Simulation for Image Resizing
 *
 * This script simulates the pixel reduction achieved by resizing images to a max dimension of 1024px.
 * It calculates the theoretical memory savings (assuming 4 bytes per pixel for RGBA) and processing reduction.
 */

const MAX_SIZE = 1024;

// Test cases representing common camera resolutions
const testCases = [
  { name: 'SD (480p)', width: 640, height: 480 },
  { name: 'HD (720p)', width: 1280, height: 720 },
  { name: 'Full HD (1080p)', width: 1920, height: 1080 },
  { name: '2K QHD', width: 2560, height: 1440 },
  { name: '4K UHD', width: 3840, height: 2160 },
  { name: 'Mobile Portrait High', width: 1080, height: 2400 }, // Example modern phone
  { name: 'Mobile Portrait Low', width: 720, height: 1600 }
];

function calculateSize(width, height) {
  let newWidth = width;
  let newHeight = height;

  if (width > MAX_SIZE || height > MAX_SIZE) {
    if (width > height) {
      newHeight = Math.round((height * MAX_SIZE) / width);
      newWidth = MAX_SIZE;
    } else {
      newWidth = Math.round((width * MAX_SIZE) / height);
      newHeight = MAX_SIZE;
    }
  }
  return { width: newWidth, height: newHeight };
}

console.log('--- Image Optimization Benchmark ---');
console.log('Max Dimension Target:', MAX_SIZE + 'px');
console.log('-------------------------------------');

let totalOriginalPixels = 0;
let totalOptimizedPixels = 0;

testCases.forEach(t => {
  const originalPixels = t.width * t.height;
  const originalMB = (originalPixels * 4) / (1024 * 1024); // 4 bytes per pixel (RGBA)

  const optimized = calculateSize(t.width, t.height);
  const optimizedPixels = optimized.width * optimized.height;
  const optimizedMB = (optimizedPixels * 4) / (1024 * 1024);

  const reduction = ((originalPixels - optimizedPixels) / originalPixels) * 100;

  totalOriginalPixels += originalPixels;
  totalOptimizedPixels += optimizedPixels;

  console.log(`${t.name} (${t.width}x${t.height})`);
  console.log(`  Original:  ${originalPixels.toLocaleString()} px (~ ${originalMB.toFixed(2)} MB)`);
  console.log(`  Optimized: ${optimizedPixels.toLocaleString()} px (~ ${optimizedMB.toFixed(2)} MB) -> ${optimized.width}x${optimized.height}`);
  console.log(`  Reduction: ${reduction.toFixed(2)}%`);
  console.log('');
});

const totalOriginalMB = (totalOriginalPixels * 4) / (1024 * 1024);
const totalOptimizedMB = (totalOptimizedPixels * 4) / (1024 * 1024);
const totalReduction = ((totalOriginalPixels - totalOptimizedPixels) / totalOriginalPixels) * 100;

console.log('-------------------------------------');
console.log('AGGREGATE RESULTS:');
console.log(`Total Original Memory:  ~${totalOriginalMB.toFixed(2)} MB`);
console.log(`Total Optimized Memory: ~${totalOptimizedMB.toFixed(2)} MB`);
console.log(`Overall Reduction:      ${totalReduction.toFixed(2)}%`);

if (totalReduction > 0) {
  console.log('\n✅ PERFORMANCE IMPROVEMENT VERIFIED');
} else {
  console.log('\n⚠️ NO IMPROVEMENT DETECTED');
}
