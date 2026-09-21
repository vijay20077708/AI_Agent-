import express from 'express';
import { getWeather } from '../controllers/weatherController.js';
import { handleChat } from '../controllers/chatController.js';
import { config } from '../config/env.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    speedMode: 'ultra-fast',
    timestamp: new Date().toISOString(),
    gemini: {
      configured: Boolean(config.geminiApiKey),
      primaryModel: config.primaryModel,
      fallbackModels: config.fallbackModels
    },
    weather: {
      configured: Boolean(config.weatherApiUrl),
      city: config.defaultCity,
      coordinates: { latitude: config.defaultLatitude, longitude: config.defaultLongitude }
    }
  });
});

router.get('/weather', getWeather);
router.post('/chat', handleChat);

export default router;
