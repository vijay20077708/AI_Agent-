import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend and parent folders
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export const config = {
  port: process.env.PORT || 5000,
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  primaryModel: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
  fallbackModels: ['gemini-2.5-flash', 'gemini-2.5-pro'],
  weatherApiUrl: process.env.WEATHER_API_URL || 'https://api.open-meteo.com/v1/forecast?latitude=13.0827&longitude=80.2707&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code',
  defaultLatitude: process.env.DEFAULT_LATITUDE || '13.0827',
  defaultLongitude: process.env.DEFAULT_LONGITUDE || '80.2707',
  defaultCity: process.env.DEFAULT_CITY || 'Chennai',
  weatherTimeoutMs: parseInt(process.env.WEATHER_TIMEOUT_MS, 10) || 12000
};

