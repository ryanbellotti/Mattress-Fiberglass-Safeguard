import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
    export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), ''); // Use process.cwd() for better reliability
    return {
      // ... rest of config
      define: {
        // This prevents "process is not defined" errors
        'process.env': {}, 
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
