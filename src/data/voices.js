export const VOICE_PERSONAS = [
  {
    id: 'shimmer',
    name: 'Shimmer',
    gender: 'Female',
    tone: 'Warm, Empathetic & Clear',
    desc: 'Gentle, friendly tone ideal for Hospitality, Customer Support & Healthcare',
    lang: 'en-US',
    speed: 1.0,
    pitch: 1.05,
    avatar: '👩‍💼',
    previewText: "Hello! I'm Shimmer. I provide warm, friendly assistance for your guests and customers."
  },
  {
    id: 'nova',
    name: 'Nova',
    gender: 'Female',
    tone: 'Dynamic, Energetic & Professional',
    desc: 'Lively, crisp voice perfect for Education, Marketing & Interactive Tutoring',
    lang: 'en-US',
    speed: 1.05,
    pitch: 1.0,
    avatar: '👩‍🔬',
    previewText: "Hi there! I'm Nova. I can help guide you dynamically through complex topics and workflows."
  },
  {
    id: 'echo',
    name: 'Echo',
    gender: 'Male',
    tone: 'Deep, Crisp & Authoritative',
    desc: 'Clear, resonant voice ideal for Software Architecture, STEM & Tech Support',
    lang: 'en-US',
    speed: 1.0,
    pitch: 0.95,
    avatar: '👨‍💻',
    previewText: "Greetings! I'm Echo. I deliver clear, precise technical guidance and problem-solving."
  },
  {
    id: 'onyx',
    name: 'Onyx',
    gender: 'Male',
    tone: 'Calm, Resonant & Executive',
    desc: 'Authoritative, balanced tone great for Financial Strategy, Legal & Business',
    lang: 'en-US',
    speed: 0.95,
    pitch: 0.9,
    avatar: '👨‍💼',
    previewText: "Good day. I am Onyx. I specialize in strategic financial insights and executive reasoning."
  },
  {
    id: 'maya',
    name: 'Maya',
    gender: 'Female (Bilingual)',
    tone: 'Natural Tamil & English Multilingual',
    desc: 'Fluent Tamil (தமிழ்) and English conversational voice with cultural nuance',
    lang: 'ta-IN',
    speed: 1.0,
    pitch: 1.0,
    avatar: '👩‍🎓',
    previewText: "வணக்கம்! நான் மாயா. தமிழ் மற்றும் ஆங்கிலத்தில் உங்களுக்கு உதவ நான் தயாராக இருக்கிறேன்."
  }
];

export const LIVEKIT_PRESETS = {
  audioCodec: 'OPUS 48kHz Stereo',
  vadModel: 'Silero VAD v4',
  turnDetection: 'Multimodal EOU (End of Utterance)',
  eouThresholdMs: 350,
  allowInterruption: true,
  noiseSuppression: 'RNNoise Neural Filter'
};
