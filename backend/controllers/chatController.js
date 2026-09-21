import { generateFastAIResponse } from '../services/geminiService.js';
import { getWeatherData } from '../services/weatherService.js';
import { config } from '../config/env.js';

export async function handleChat(req, res) {
  const startTime = Date.now();
  try {
    const { message, agentConfig, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'A message string is required.' });
    }

    const lower = message.toLowerCase();
    const isWeatherQuery =
      lower.includes('weather') ||
      lower.includes('climate') ||
      lower.includes('temperature') ||
      lower.includes('rain') ||
      lower.includes('mazhai') ||
      lower.includes('vaanilai') ||
      lower.includes('வானிலை') ||
      lower.includes('சூடு') ||
      lower.includes('மழை') ||
      lower.includes('forecast');

    let weatherData = null;
    if (isWeatherQuery) {
      try {
        weatherData = await getWeatherData(config.defaultLatitude, config.defaultLongitude);
      } catch (err) {
        console.warn('Weather prefetch error:', err.message);
      }
    }

    const result = await generateFastAIResponse({
      message,
      agentConfig,
      weatherData,
      history
    });

    const totalTimeMs = Date.now() - startTime;

    return res.json({
      ...result,
      totalTimeMs,
      weather: weatherData
    });
  } catch (error) {
    console.error('Chat controller error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal error in chat processing'
    });
  }
}
