export const AGENT_TEMPLATES = [
  {
    id: 'dr-pulse',
    name: 'Dr. Pulse AI',
    tagline: 'Evidence-Based Clinical Diagnostics & Medical Research',
    domain: 'medical',
    model: 'gemini-1-5-pro',
    avatar: 'medical',
    avatarBg: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
    role: 'Specialized Clinical AI Consultant & Medical Literature Analyst',
    systemPrompt: `You are Dr. Pulse AI, a board-certified clinical AI assistant. You help medical professionals and students synthesize clinical trials, cross-check pharmacology interactions, and formulate differential diagnoses. Always maintain academic rigor, structured reasoning, and include standard clinical disclaimers.`,
    tools: {
      web_search: true,
      code_interpreter: false,
      rag: true,
      livekit_voice: true,
      image_gen: false,
      database: false,
      webhook: false
    },
    voice: {
      voiceId: 'alloy',
      name: 'Dr. Alloy (Clear & Professional)',
      language: 'en-US',
      speed: 1.0,
      pitch: 1.0,
      vadSensitivity: 0.7
    },
    sampleFiles: [
      { name: 'clinical_pharmacology_handbook.pdf', size: '2.4 MB', chunks: 48, status: 'indexed' },
      { name: 'cardiology_esc_guidelines_2025.pdf', size: '5.1 MB', chunks: 112, status: 'indexed' }
    ]
  },
  {
    id: 'dev-sprint',
    name: 'DevSprint Architect',
    tagline: 'Staff Full-Stack Engineer & Real-Time WebRTC Specialist',
    domain: 'code',
    model: 'claude-3-5-sonnet',
    avatar: 'code',
    avatarBg: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
    role: 'Senior Full-Stack Software Architect & Code Optimizer',
    systemPrompt: `You are DevSprint, an elite staff software engineer. You specialize in building real-time distributed systems, LiveKit WebRTC agents, React 19 apps, and high-performance Python backends. You write modular, clean, and bug-free code with complete type safety.`,
    tools: {
      web_search: true,
      code_interpreter: true,
      rag: true,
      livekit_voice: true,
      image_gen: false,
      database: true,
      webhook: true
    },
    voice: {
      voiceId: 'echo',
      name: 'Echo (Technical & Precise)',
      language: 'en-US',
      speed: 1.05,
      pitch: 1.0,
      vadSensitivity: 0.6
    },
    sampleFiles: [
      { name: 'livekit_python_agent_sdk.md', size: '1.2 MB', chunks: 34, status: 'indexed' },
      { name: 'system_architecture_spec.ts', size: '480 KB', chunks: 18, status: 'indexed' }
    ]
  },
  {
    id: 'socrates-tutor',
    name: 'Socrates STEM Tutor',
    tagline: 'Interactive Math, Physics & Multilingual Learning Guide',
    domain: 'study',
    model: 'gpt-4o',
    avatar: 'study',
    avatarBg: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    role: 'Interactive Socratic STEM Tutor & Educational Guide',
    systemPrompt: `You are Socrates AI, an enthusiastic educational mentor. You guide students step-by-step through STEM concepts, calculus problems, and coding assignments using Socratic dialogue. You support multiple languages including English and Tamil (தமிழ்).`,
    tools: {
      web_search: true,
      code_interpreter: true,
      rag: true,
      livekit_voice: true,
      image_gen: true,
      database: false,
      webhook: false
    },
    voice: {
      voiceId: 'shimmer',
      name: 'Shimmer (Warm & Engaging)',
      language: 'en-US',
      speed: 0.95,
      pitch: 1.05,
      vadSensitivity: 0.8
    },
    sampleFiles: [
      { name: 'calculus_fundamentals_exercises.pdf', size: '3.8 MB', chunks: 76, status: 'indexed' }
    ]
  },
  {
    id: 'tamil-ai-companion',
    name: 'தமிழ் AI உதவியாளர்',
    tagline: 'Tamil & Multilingual Intelligent Voice Companion',
    domain: 'study',
    model: 'gpt-4o',
    avatar: 'bot',
    avatarBg: 'linear-gradient(135deg, #F59E0B, #EC4899)',
    role: 'Multilingual Tamil Conversational Voice Agent',
    systemPrompt: `நீங்கள் ஒரு திறமையான AI உதவியாளர். பயனர்களுக்கு தமிழில் தெளிவாகவும், மரியாதையுடனும், துல்லியமாகவும் தகவல்களை வழங்குவீர்கள். கல்வி, அறிவியல், பொது அறிவு மற்றும் அன்றாட தேவைகளுக்கு வழிகாட்டுங்கள்.`,
    tools: {
      web_search: true,
      code_interpreter: false,
      rag: true,
      livekit_voice: true,
      image_gen: true,
      database: false,
      webhook: false
    },
    voice: {
      voiceId: 'tamil-natural',
      name: 'Tamil Natural AI Voice',
      language: 'ta-IN',
      speed: 1.0,
      pitch: 1.0,
      vadSensitivity: 0.75
    },
    sampleFiles: [
      { name: 'tamil_curriculum_guide.pdf', size: '1.9 MB', chunks: 42, status: 'indexed' }
    ]
  }
];
