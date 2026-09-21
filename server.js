import express from 'express';
import cors from 'cors';
import { config } from './backend/config/env.js';
import apiRoutes from './backend/routes/apiRoutes.js';
import { initWeatherSync } from './backend/services/weatherService.js';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '5mb' }));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    speedMode: 'ultra-fast',
    message: '⚡ High-Speed Thamili Agent Backend is Running',
    endpoints: {
      health: 'GET /api/health',
      weather: 'GET /api/weather',
      chat: 'POST /api/chat'
    }
  });
});

// Warm weather cache in background
initWeatherSync();

const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`=============================================`);
  console.log(`⚡ High-Speed Thamili Backend running on port ${config.port}`);
  console.log(`🔗 Local URL: http://localhost:${config.port}`);
  console.log(`🤖 Gemini Model: ${config.primaryModel}`);
  console.log(`☀️  Weather Target: ${config.defaultCity} (Pre-warmed in memory)`);
  console.log(`=============================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${config.port} is already in use by another process.`);
    console.error(`👉 Close any other running terminal or server instance and try again.\n`);
  } else {
    console.error('Server error:', err);
  }
});
