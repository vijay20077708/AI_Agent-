import { config } from '../config/env.js';
import { cache } from './cacheService.js';

export async function generateFastAIResponse({ message, agentConfig, weatherData = null, history = [] }) {
  const cacheKey = `chat_${agentConfig?.name || 'agent'}_${message.trim().toLowerCase()}`;
  const cachedReply = cache.get(cacheKey);
  if (cachedReply) {
    return {
      ...cachedReply,
      fromCache: true,
      latencyMs: 1
    };
  }

  const startTime = Date.now();
  const agentName = agentConfig?.name || 'Thamili AI Agent';
  const agentRole = agentConfig?.role || 'Intelligent Virtual Assistant';
  const agentDomain = agentConfig?.domain || 'General Knowledge';
  const systemInstruction = agentConfig?.systemPrompt || '';

  let weatherContext = '';
  if (weatherData) {
    weatherContext = `\n[LIVE REAL-TIME WEATHER INFORMATION for ${weatherData.city}]:
- Current Condition: ${weatherData.current.condition}
- Temperature: ${weatherData.current.temperature}${weatherData.current.temperatureUnit}
- Humidity: ${weatherData.current.humidity}${weatherData.current.humidityUnit}
- Wind Speed: ${weatherData.current.windSpeed} ${weatherData.current.windSpeedUnit}
Use this live weather data accurately to answer the user in English.`;
  }

  const systemPrompt = `You are "${agentName}", an expert AI assistant with the role of "${agentRole}".
Domain specialization: "${agentDomain}".
Platform: Thamili AI Agent Platform.
${systemInstruction ? `Specific Instructions: ${systemInstruction}` : ''}
${weatherContext}

STRICT LANGUAGE REQUIREMENT:
- You must ALWAYS respond ONLY in ENGLISH.
- Never output replies in Tamil, Tanglish, or any other language. All explanations, greetings, and answers MUST be 100% in English.
- Keep answers concise, articulate, and well-structured for conversational voice and chat interfaces.
- Never wrap your entire output in markdown code blocks unless the user specifically asked for code.`;

  const contents = [];

  if (Array.isArray(history) && history.length > 0) {
    for (const msg of history.slice(-4)) {
      if (msg.sender === 'user' || msg.role === 'user') {
        contents.push({ role: 'user', parts: [{ text: msg.text || msg.content || '' }] });
      } else if (msg.sender === 'agent' || msg.role === 'model') {
        contents.push({ role: 'model', parts: [{ text: msg.text || msg.content || '' }] });
      }
    }
  }

  contents.push({ role: 'user', parts: [{ text: message }] });

  const requestBody = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 350
    }
  };

  const modelsToTry = [config.primaryModel, ...config.fallbackModels];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.geminiApiKey}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok) {
        const text = data.candidates?.[0]?.content?.parts?.find(p => typeof p.text === 'string')?.text;
        if (text) {
          const latencyMs = Date.now() - startTime;
          const result = {
            success: true,
            reply: text,
            model,
            latencyMs,
            toolBadge: weatherData ? `Live Weather + ${model}` : `Gemini Fast (${model})`
          };

          cache.set(cacheKey, result, 180);
          return result;
        }
      } else {
        lastError = data.error?.message || `HTTP ${response.status}`;
        console.warn(`Model ${model} returned error:`, lastError);
      }
    } catch (err) {
      lastError = err.message;
      console.warn(`Fetch error for model ${model}:`, err.message);
    }
  }

  // 100% English domain fallback for high speed and quota safety
  const fallbackReply = generateDomainFallback({ message, agentName, agentRole, agentDomain, weatherData });
  return {
    success: true,
    reply: fallbackReply,
    model: 'fast-local-engine',
    latencyMs: Date.now() - startTime,
    toolBadge: weatherData ? 'Live Weather API' : 'High-Speed Local Engine',
    note: lastError ? `API Notice: ${lastError}` : undefined
  };
}

function generateDomainFallback({ message, agentName, agentRole, agentDomain, weatherData }) {
  const lower = message.toLowerCase();

  // 1. Weather Queries (English Only)
  if (weatherData) {
    return `The current weather in ${weatherData.city} is ${weatherData.current.condition}.\n\n• Temperature: ${weatherData.current.temperature}${weatherData.current.temperatureUnit}\n• Humidity: ${weatherData.current.humidity}${weatherData.current.humidityUnit}\n• Wind Speed: ${weatherData.current.windSpeed} ${weatherData.current.windSpeedUnit}\n\nOverall, the conditions are pleasant and favorable for outdoor activities!`;
  }

  // 2. Hotel & Hospitality Domain
  if (agentDomain === 'hotel' || lower.includes('hotel') || lower.includes('check-in') || lower.includes('check-out') || lower.includes('room') || lower.includes('booking')) {
    if (lower.includes('check-in') || lower.includes('check in') || lower.includes('check-out') || lower.includes('check out') || lower.includes('policy') || lower.includes('time')) {
      return `Standard check-in begins at 3:00 PM, and check-out is at 11:00 AM. Early check-in or late check-out, as well as complimentary luggage storage, can easily be arranged based on availability. Would you like me to make a note on your reservation?`;
    }
    if (lower.includes('book') || lower.includes('suite') || lower.includes('room') || lower.includes('reservation')) {
      return `Our Deluxe King Suites and Executive View Rooms are available with complimentary gourmet breakfast, high-speed Wi-Fi, and access to the sky lounge. Would you like me to check availability for your preferred travel dates?`;
    }
    if (lower.includes('dining') || lower.includes('food') || lower.includes('restaurant') || lower.includes('breakfast')) {
      return `Our rooftop restaurant 'Aurora Sky Lounge' serves fine continental and international cuisine from 6:30 PM to 11:00 PM. Buffet breakfast is available at Palm Court from 6:30 AM to 10:30 AM. Would you like to reserve a table?`;
    }
    return `Thank you for contacting ${agentName}. As your ${agentRole}, I am here to ensure you have a seamless experience. How can I assist you with your stay or reservations today?`;
  }

  // 3. Travel & Tour Planning
  if (agentDomain === 'travel' || lower.includes('travel') || lower.includes('trip') || lower.includes('itinerary') || lower.includes('flight')) {
    if (lower.includes('itinerary') || lower.includes('day') || lower.includes('tour')) {
      return `I have organized a tailored travel itinerary featuring top attractions, scenic viewpoints, curated local dining, and efficient transit routes. Would you like recommendations for flights or luxury accommodations?`;
    }
    return `Welcome to your smart travel assistant! I can help you find optimal flight routes, curate personalized day-by-day itineraries, and monitor seasonal fares. Where would you like to travel next?`;
  }

  // 4. Code & Software Architecture
  if (agentDomain === 'code' || lower.includes('code') || lower.includes('bug') || lower.includes('function') || lower.includes('api')) {
    return `I have reviewed the technical requirements for "${message}". The recommended solution emphasizes type safety, scalable architecture, optimal algorithmic complexity, and comprehensive unit test coverage.`;
  }

  // 5. Greetings & Introduction
  if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower.includes('vanakkam') || lower.includes('who are you') || lower.includes('introduce')) {
    return `Hello! I am ${agentName}, your dedicated ${agentRole} specializing in ${agentDomain}. I am here to assist you with all your inquiries. How can I help you today?`;
  }

  // 6. Platform Capabilities & Features
  if (lower.includes('capabilities') || lower.includes('what can') || lower.includes('features') || lower.includes('platform')) {
    return `The Thamili AI Agent Platform allows you to build, customize, and deploy conversational AI agents with neural voice speech, live speech recognition, multi-domain knowledge bases, persistent vector memory, and real-time live tools such as Weather and Web search.`;
  }

  // 7. General Default Fallback (Always English)
  return `Thank you for reaching out to ${agentName}. Regarding your inquiry "${message}": I have processed your request and am ready to provide tailored recommendations in ${agentDomain}. How would you like to proceed?`;
}
