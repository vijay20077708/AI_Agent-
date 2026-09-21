import { getWeatherData } from '../services/weatherService.js';
import { config } from '../config/env.js';

export async function getWeather(req, res) {
  try {
    const lat = req.query.latitude || req.query.lat || config.defaultLatitude;
    const lon = req.query.longitude || req.query.lon || config.defaultLongitude;
    
    const weather = await getWeatherData(lat, lon);
    return res.json({
      success: true,
      weather
    });
  } catch (error) {
    console.error('Weather controller error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
