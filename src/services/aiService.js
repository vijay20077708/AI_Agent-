// AI Service supporting both Backend Server and Direct Client Fallback

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.6-flash';
const DEFAULT_CITY = 'Chennai';
const DEFAULT_LATITUDE = '13.0827';
const DEFAULT_LONGITUDE = '80.2707';

function getWeatherCondition(code) {
  const codes = {
    0: 'Clear sky ☀️',
    1: 'Mainly clear 🌤️',
    2: 'Partly cloudy ⛅',
    3: 'Overcast ☁️',
    45: 'Foggy 🌫️',
    48: 'Depositing rime fog 🌫️',
    51: 'Light drizzle 🌦️',
    53: 'Moderate drizzle 🌦️',
    55: 'Dense drizzle 🌧️',
    61: 'Slight rain 🌧️',
    63: 'Moderate rain 🌧️',
    65: 'Heavy rain ⛈️',
    71: 'Slight snow 🌨️',
    73: 'Moderate snow 🌨️',
    75: 'Heavy snow ❄️',
    80: 'Slight rain showers 🌦️',
    81: 'Moderate rain showers 🌧️',
    82: 'Violent rain showers ⛈️',
    95: 'Thunderstorm ⚡',
    96: 'Thunderstorm with slight hail ⛈️',
    99: 'Thunderstorm with heavy hail ⛈️'
  };
  return codes[code] || 'Variable / Moderate 🌤️';
}

export async function fetchLiveWeather(lat = DEFAULT_LATITUDE, lon = DEFAULT_LONGITUDE) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation_probability,weather_code`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Weather API request failed');
  const data = await response.json();
  const current = data.current || {};
  return {
    city: DEFAULT_CITY,
    temperature: current.temperature_2m,
    temperatureUnit: data.current_units?.temperature_2m || '°C',
    humidity: current.relative_humidity_2m,
    humidityUnit: data.current_units?.relative_humidity_2m || '%',
    windSpeed: current.wind_speed_10m,
    windSpeedUnit: data.current_units?.wind_speed_10m || 'km/h',
    condition: getWeatherCondition(current.weather_code),
    time: current.time
  };
}

export async function askAI({ message, agentConfig, history = [] }) {
  // 1. Try Backend endpoint first
  try {
    const backendRes = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, agentConfig, history })
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.success && data.reply) {
        return data;
      }
    }
  } catch (backendErr) {
    // Backend server not running, fall through to direct API
    console.info('Backend server not reachable, using direct Gemini & Weather API client:', backendErr.message);
  }

  // 2. Direct Gemini + Weather API fallback
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
  let weatherContext = '';
  let toolBadge = 'Gemini 3.6 Flash';

  if (isWeatherQuery) {
    try {
      weatherData = await fetchLiveWeather();
      weatherContext = `\n[LIVE WEATHER TOOL DATA for ${DEFAULT_CITY}]:
- Current Temperature: ${weatherData.temperature}${weatherData.temperatureUnit}
- Relative Humidity: ${weatherData.humidity}${weatherData.humidityUnit}
- Wind Speed: ${weatherData.windSpeed} ${weatherData.windSpeedUnit}
- Condition: ${weatherData.condition}
Use this live real-time weather information accurately to answer the user's weather question.`;
      toolBadge = 'Live Weather API + Gemini 3.6 Flash';
    } catch (e) {
      console.warn('Weather fetch error:', e);
    }
  }

  const agentName = agentConfig?.name || 'Thamili AI Agent';
  const agentRole = agentConfig?.role || 'Intelligent Virtual Assistant';
  const agentDomain = agentConfig?.domain || 'General Knowledge';

  const systemPromptText = `You are "${agentName}", an expert AI assistant with the role of "${agentRole}".
Domain specialization: "${agentDomain}".
Platform: Thamili AI Agent Platform.
${weatherContext}

STRICT LANGUAGE REQUIREMENT:
- You must ALWAYS respond ONLY in ENGLISH.
- Never output replies in Tamil, Tanglish, or any other language. All answers and explanations must be 100% in English.
- Keep your answers concise, engaging, and directly helpful for conversational chat and voice.
- Never output markdown code fences around your entire response unless the user explicitly requested code.`;

  const contents = [];
  if (Array.isArray(history) && history.length > 0) {
    for (const msg of history.slice(-6)) {
      if (msg.sender === 'user' || msg.role === 'user') {
        contents.push({ role: 'user', parts: [{ text: msg.text || msg.content || '' }] });
      } else if (msg.sender === 'agent' || msg.role === 'model') {
        contents.push({ role: 'model', parts: [{ text: msg.text || msg.content || '' }] });
      }
    }
  }
  contents.push({ role: 'user', parts: [{ text: message }] });

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPromptText }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 350,
        thinkingConfig: {
          thinkingBudget: 0
        }
      }
    })
  });

  const resJson = await response.json();
  const replyText = resJson.candidates?.[0]?.content?.parts?.find(p => typeof p.text === 'string')?.text;

  if (replyText) {
    return {
      success: true,
      reply: replyText,
      toolBadge,
      model: GEMINI_MODEL,
      weather: weatherData
    };
  }

  throw new Error('Gemini API did not return text');
}
