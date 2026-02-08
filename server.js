import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// Health check
app.get('/health', (req, res) => res.send('OK'));

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!apiKey) {
  console.error("Warning: GEMINI_API_KEY or API_KEY not found.");
}

// Proxy middleware
const geminiProxy = createProxyMiddleware('/api/gemini', {
  target: 'https://generativelanguage.googleapis.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/gemini': '', // Remove base path
  },
  ws: true, // Handle WebSocket
  onProxyReq: (proxyReq, req, res) => {
    if (apiKey) {
      proxyReq.setHeader('x-goog-api-key', apiKey);
    }
  },
  onProxyReqWs: (proxyReq, req, socket, options, head) => {
      if (apiKey) {
          proxyReq.setHeader('x-goog-api-key', apiKey);
      }
  }
});

app.use(geminiProxy);

const server = app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});

// Handle WebSocket upgrade
server.on('upgrade', geminiProxy.upgrade);
