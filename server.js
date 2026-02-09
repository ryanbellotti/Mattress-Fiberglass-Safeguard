import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Proxy to Gemini API
app.use(
  '/api/gemini',
  createProxyMiddleware({
    target: 'https://generativelanguage.googleapis.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api/gemini': '', // Remove /api/gemini prefix when forwarding
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        // Inject API Key securely
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
          proxyReq.setHeader('x-goog-api-key', apiKey);
        } else {
          console.warn('GEMINI_API_KEY is missing in environment variables');
        }
      },
    },
  })
);

app.listen(PORT, () => {
  console.log(`Backend proxy server running on http://localhost:${PORT}`);
});
