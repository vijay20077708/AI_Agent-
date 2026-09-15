import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEFAULT_AGENTS } from '../data/defaultAgents';
import { DOMAINS } from '../data/domains';
import { VOICE_PERSONAS } from '../data/voices';

const PATH_TO_VIEW = {
  '/': 'agent-hub',
  '/thamili': 'agent-hub',
  '/thamili/agent-hub': 'agent-hub',
  '/thamili/create-agent': 'create-agent',
  '/thamili/choose-agent': 'choose-agent',
  '/thamili/profile': 'profile',
  '/thamili/home': 'home',
  '/thamili/chat': 'chat',
  '/thamili/code': 'code',
  '/thamili/image': 'image',
  '/thamili/video': 'video',
  '/thamili/learn': 'learn',
  '/thamili/tools': 'tools',
  '/thamili/history': 'history',
  '/thamili/saved': 'saved',
  '/agent-hub': 'agent-hub',
  '/create-agent': 'create-agent',
  '/choose-agent': 'choose-agent',
  '/profile': 'profile',
  '/home': 'home',
  '/chat': 'chat',
  '/code': 'code',
  '/image': 'image',
  '/video': 'video',
  '/learn': 'learn',
  '/tools': 'tools',
  '/history': 'history',
  '/saved': 'saved'
};

const VIEW_TO_PATH = {
  'agent-hub': '/thamili/agent-hub',
  'create-agent': '/thamili/create-agent',
  'choose-agent': '/thamili/choose-agent',
  'profile': '/thamili/profile',
  'home': '/thamili/home',
  'chat': '/thamili/chat',
  'code': '/thamili/code',
  'image': '/thamili/image',
  'video': '/thamili/video',
  'learn': '/thamili/learn',
  'tools': '/thamili/tools',
  'history': '/thamili/history',
  'saved': '/thamili/saved'
};

const DEFAULT_INITIAL_AGENT_HISTORY = [
  {
    id: 'agent-hist-1',
    name: 'Grand Aurora Hotel Concierge',
    role: 'Front Desk Hospitality & Guest Services Specialist',
    domain: 'hotel',
    avatar: '🏨',
    avatarBg: 'linear-gradient(135deg, #10B981, #059669)',
    voiceId: 'shimmer',
    voiceName: 'Shimmer (Female)',
    interactionMode: 'both',
    launchedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    type: 'chosen'
  },
  {
    id: 'agent-hist-2',
    name: 'VoyageAI Bali Travel Guide',
    role: 'Smart Travel Itinerary & Flight Assistant',
    domain: 'travel',
    avatar: '✈️',
    avatarBg: 'linear-gradient(135deg, #3B82F6, #2563EB)',
    voiceId: 'alloy',
    voiceName: 'Alloy (Male)',
    interactionMode: 'both',
    launchedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    type: 'chosen'
  }
];

const AgentContext = createContext();

export function AgentProvider({ children }) {
  // Navigation & View Routing synced directly with browser URL
  const location = useLocation();
  const navigate = useNavigate();

  const currentView = useMemo(() => {
    const norm = (location.pathname || '/').toLowerCase().replace(/\/+$/, '') || '/';
    return PATH_TO_VIEW[norm] || 'agent-hub';
  }, [location.pathname]);

  const setCurrentView = useCallback((view) => {
    const path = VIEW_TO_PATH[view] || (view.startsWith('/') ? view : `/${view}`);
    navigate(path);
  }, [navigate]);

  // Dynamically update document tab title based on current view
  useEffect(() => {
    const titles = {
      'agent-hub': 'தமிழி (THAMILI) — AI Agent Hub',
      'create-agent': 'Create Agent — தமிழி (THAMILI)',
      'choose-agent': 'Choose Agent — தமிழி (THAMILI)',
      'profile': 'User Profile & Account — தமிழி (THAMILI)',
      'history': 'Agent History — தமிழி (THAMILI)',
      'tools': 'AI Tools — தமிழி (THAMILI)',
      'chat': 'AI Chat — தமிழி (THAMILI)',
      'code': 'AI Code — தமிழி (THAMILI)',
      'image': 'AI Image — தமிழி (THAMILI)',
      'video': 'AI Video — தமிழி (THAMILI)',
      'learn': 'AI Learn — தமிழி (THAMILI)'
    };
    document.title = titles[currentView] || 'தமிழி (THAMILI) — Tamil-First AI Agent Platform';
  }, [currentView]);

  const [theme, setTheme] = useState('light');
  const [isSidePreviewOpen, setIsSidePreviewOpen] = useState(false);

  // Agent History State (persistent in localStorage)
  const [agentHistory, setAgentHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('thamili_agent_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_INITIAL_AGENT_HISTORY;
  });

  // User Profile State for bottom profile dropdown
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('thamili_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (!parsed.email || parsed.email.includes('aurqo')) {
            parsed.email = 'vijay@thamili';
          }
          return parsed;
        }
      }
    } catch (e) {}
    return {
      name: 'Vijay',
      email: 'vijay@thamili',
      role: 'AI Agent Architect',
      avatar: 'VK',
      plan: 'Pro Plan'
    };
  });

  // Persist userProfile to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('thamili_user_profile', JSON.stringify(userProfile));
    } catch (e) {}
  }, [userProfile]);

  // Default 3D Live Robot Assistant Configuration (Thamili Platform Guide)
  const DEFAULT_ROBOT_CONFIG = {
    name: 'Thamili 3D AI Robot',
    role: 'AI Agent Platform Specialist & Guide',
    domain: 'platform',
    avatar: '🤖',
    avatarBg: 'linear-gradient(135deg, #6366F1, #3B82F6)',
    voiceId: 'shimmer',
    voiceName: 'Shimmer (Female)',
    interactionMode: 'both', // 'both' | 'text-only' | 'voice-only'
    memorySaving: true,
    files: [],
    tools: {
      webSearch: true,
      codeInterpreter: true,
      imageGen: true,
      knowledgeSearch: true
    },
    systemPrompt: '',
    discoveryQuestions: [
      'What can Thamili AI Agent do?',
      'What features and tools are included in this platform?',
      'Who can use these AI agents and for what purposes?',
      'What industries and domains can I use this for?',
      'How do I create and customize my own AI agent?',
      'How does real-time voice speech work?'
    ]
  };

  const DEFAULT_ROBOT_WELCOME = `👋 **Hello! I am your Thamili 3D AI Robot Guide.**\n\nWelcome to the **Thamili AI Agent Platform**!\n\n✨ **What can this AI Agent do?**\nIt allows you to build, customize, and interact with intelligent AI agents that communicate via natural voice & text, answer complex domain questions, search uploaded documents, and execute web research autonomously.\n\n🛠️ **What features are included in this platform?**\n- **Real-Time Neural Speech & Call Stage**: 5 human-like voices with hands-free voice chat.\n- **Custom Agent Builder**: Easily configure your agent's name, role, domain, memory, and tools.\n- **Pre-Built Agent Templates**: Instant agents for Hospitality, Travel, STEM, Coding, and Healthcare.\n- **Autonomous Tool Suite**: Live Web Search, Code Interpreter, Image Generator, and Knowledge Search.\n\n🎯 **Who can use this & what can it be used for?**\n- **Businesses & Hotels**: 24/7 guest concierge, room bookings, and customer support.\n- **Doctors & Healthcare**: Patient FAQ triage and consultation guidance.\n- **Developers & Tech Teams**: Code generation, architecture, and syntax debugging.\n- **Teachers & Students**: 1-on-1 personalized tutoring and academic problem solving.\n- **Travel Agencies**: Trip itineraries, flight comparisons, and destination advice.\n\nClick any question below or speak aloud using your microphone!`;

  const DEFAULT_ROBOT_SPOKEN_INTRO = `Hello and welcome! I am your Thamili AI Robot Assistant. Here, you can create custom AI agents or choose ready templates with natural voice and text. Anyone can use our platform—from businesses and doctors to teachers and developers—to automate customer inquiries, research knowledge, and boost productivity. How can I help you today?`;

  // Active Agent Configuration State
  const [agentConfig, setAgentConfig] = useState(DEFAULT_ROBOT_CONFIG);

  // Keep a synchronous ref for callbacks & speech calls
  const agentConfigRef = useRef(agentConfig);
  useEffect(() => {
    agentConfigRef.current = agentConfig;
  }, [agentConfig]);

  // Pre-load and cache browser voices to prevent initial voice delay / mismatch
  const [systemVoices, setSystemVoices] = useState([]);
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const vList = window.speechSynthesis.getVoices();
        if (vList && vList.length > 0) {
          setSystemVoices(vList);
        }
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
      return () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, []);

  // Conversation & Speech Synthesis State
  const [messages, setMessages] = useState([
    {
      id: 'msg-robot-welcome',
      sender: 'agent',
      text: DEFAULT_ROBOT_WELCOME,
      timestamp: 'Just now'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Theme Sync
  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Update a single agent field
  const updateAgentField = (key, value) => {
    setAgentConfig(prev => {
      const updated = {
        ...prev,
        [key]: value
      };
      agentConfigRef.current = updated;
      return updated;
    });
  };

  // Switch domain and optionally preserve user customized name & role
  const selectDomain = (domainId, options = {}) => {
    const domainObj = DOMAINS.find(d => d.id === domainId);
    if (!domainObj) return;

    setAgentConfig(prev => {
      const hasCustomName = Boolean(prev.name && prev.name.trim() !== '' && prev.name !== 'Thamili 3D AI Robot');
      const hasCustomRole = Boolean(prev.role && prev.role.trim() !== '' && prev.role !== 'AI Agent Platform Specialist & Guide');

      const shouldKeepName = options.keepName !== undefined ? options.keepName : (!options.forceOverride && hasCustomName);
      const shouldKeepRole = options.keepRole !== undefined ? options.keepRole : (!options.forceOverride && hasCustomRole);

      const updated = {
        ...prev,
        domain: domainId,
        name: shouldKeepName ? prev.name : domainObj.defaultName,
        role: shouldKeepRole ? prev.role : domainObj.defaultRole,
        avatar: domainId === 'hotel' ? '🏨' : domainId === 'travel' ? '✈️' : domainId === 'study' ? '🎓' : domainId === 'code' ? '💻' : domainId === 'medical' ? '🩺' : domainId === 'research' ? '🔬' : domainId === 'finance' ? '📈' : '✨'
      };
      agentConfigRef.current = updated;
      return updated;
    });
  };

  // Add uploaded files
  const addFiles = (fileList) => {
    const formatted = Array.from(fileList).map((file, idx) => ({
      id: 'f-' + Date.now() + '-' + idx,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || 'Document'
    }));

    setAgentConfig(prev => {
      const updated = {
        ...prev,
        files: [...prev.files, ...formatted]
      };
      agentConfigRef.current = updated;
      return updated;
    });
  };

  // Remove file
  const removeFile = (id) => {
    setAgentConfig(prev => {
      const updated = {
        ...prev,
        files: prev.files.filter(f => f.id !== id)
      };
      agentConfigRef.current = updated;
      return updated;
    });
  };

  // Helper to pick the best matching system voice for each persona
  const pickSystemVoice = (persona) => {
    if (!('speechSynthesis' in window)) return null;
    let voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      voices = systemVoices;
    }
    if (!voices || voices.length === 0) return null;

    const isTamil = persona.lang === 'ta-IN' || persona.id === 'maya';
    if (isTamil) {
      const taVoice = voices.find(v => v.lang.toLowerCase().includes('ta') || v.name.toLowerCase().includes('tamil'));
      if (taVoice) return taVoice;
    }

    const isFemale = persona.gender.toLowerCase().includes('female');
    if (isFemale) {
      // 1st priority: known high-quality female system voices
      const specificFemale = voices.find(v =>
        v.lang.startsWith('en') && (
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('jenny') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('aria') ||
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('sonia') ||
          v.name.toLowerCase().includes('female')
        )
      );
      if (specificFemale) return specificFemale;

      // 2nd priority: any English voice not explicitly named male
      const anyFemaleLike = voices.find(v =>
        v.lang.startsWith('en') &&
        !v.name.toLowerCase().includes('male') &&
        !v.name.toLowerCase().includes('david') &&
        !v.name.toLowerCase().includes('mark') &&
        !v.name.toLowerCase().includes('george')
      );
      if (anyFemaleLike) return anyFemaleLike;
    } else {
      // Male persona
      // 1st priority: known high-quality male system voices
      const specificMale = voices.find(v =>
        v.lang.startsWith('en') && (
          v.name.toLowerCase().includes('david') ||
          v.name.toLowerCase().includes('guy') ||
          v.name.toLowerCase().includes('mark') ||
          v.name.toLowerCase().includes('george') ||
          v.name.toLowerCase().includes('alex') ||
          v.name.toLowerCase().includes('ryan') ||
          v.name.toLowerCase().includes('male')
        )
      );
      if (specificMale) return specificMale;

      // 2nd priority: any English voice not female
      const anyMaleLike = voices.find(v =>
        v.lang.startsWith('en') &&
        !v.name.toLowerCase().includes('zira') &&
        !v.name.toLowerCase().includes('female') &&
        !v.name.toLowerCase().includes('samantha') &&
        !v.name.toLowerCase().includes('jenny')
      );
      if (anyMaleLike) return anyMaleLike;
    }

    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  };

  // Speech Synthesis: Natural Voice Talk-Back using chosen persona consistently
  const speakText = (text, explicitVoiceId = null) => {
    const currentMode = agentConfigRef.current.interactionMode;
    if (!('speechSynthesis' in window) || isMuted || currentMode === 'text-only') return;

    try {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/[*#`_~]/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\(.*?\)/g, '')
        .slice(0, 320);

      const targetVoiceId = explicitVoiceId || agentConfigRef.current.voiceId || 'shimmer';
      const persona = VOICE_PERSONAS.find(v => v.id === targetVoiceId) || VOICE_PERSONAS[0];

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = persona.speed || 1.0;
      utterance.pitch = persona.pitch || 1.0;
      utterance.lang = persona.lang || 'en-US';

      const selectedSystemVoice = pickSystemVoice(persona);
      if (selectedSystemVoice) {
        utterance.voice = selectedSystemVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setAudioLevel(0.85);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setAudioLevel(0);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setAudioLevel(0);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
      setAudioLevel(0);
    }
  };

  const replayVoice = (text, customVoiceId = null) => {
    speakText(text, customVoiceId || agentConfigRef.current.voiceId);
  };

  // Send message in preview chat & reply with text and/or voice based on mode
  const sendMessage = (userText) => {
    if (!userText.trim()) return;

    const userMsg = {
      id: 'msg-u-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    setTimeout(() => {
      const activeConfig = agentConfigRef.current;
      const domain = activeConfig.domain;
      const domainObj = DOMAINS.find(d => d.id === domain) || DOMAINS[0];
      const userLower = userText.toLowerCase().trim();
      let replyText = '';
      let toolBadge = null;

      // 1. Check if chatting with the Thamili Robot Guide or asking platform capabilities
      const isPlatformBot = domain === 'platform' || activeConfig.name.toLowerCase().includes('robot') || activeConfig.name.toLowerCase().includes('thamili');

      if (
        userLower.includes('what can') ||
        userLower.includes('capabilities') ||
        userLower.includes('enna pannum') ||
        userLower.includes('what does this') ||
        (userLower.includes('what') && userLower.includes('agent do')) ||
        (userLower.includes('what') && userLower.includes('platform'))
      ) {
        replyText = `Thamili AI Agent Platform allows you to create and deploy intelligent, voice-ready conversational AI agents. These agents can talk aloud with customers, answer complex domain questions, search uploaded documents and PDFs, browse the live web, execute code calculations, and retain persistent memory across conversations!`;
        toolBadge = 'Thamili Platform Engine';
      } else if (
        userLower.includes('feature') ||
        userLower.includes('tool') ||
        userLower.includes('ennathula irukku') ||
        userLower.includes('included') ||
        userLower.includes('what is in this')
      ) {
        replyText = `Our platform includes 6 powerful core features: 1) Neural Voice Speech with 5 natural voices; 2) Live Speech Recognition for hands-free voice calls; 3) 8 Domain Knowledge models; 4) 4 Autonomous Tools (Web Search, Code Interpreter, Image Generator, Knowledge Retrieval); 5) Persistent Vector Memory; and 6) 3D Animated Robot Interactive Stages!`;
        toolBadge = 'Platform Tools & Specs';
      } else if (
        userLower.includes('who can use') ||
        userLower.includes('yaar') ||
        userLower.includes('who is this for') ||
        (userLower.includes('who') && userLower.includes('use')) ||
        userLower.includes('audience')
      ) {
        replyText = `Anyone can use Thamili AI Agents! It is designed for: 1) Business Owners & Hotels for 24/7 guest service; 2) Doctors & Clinics for patient FAQ guidance; 3) Developers & Tech teams for software architecture; 4) Teachers & Students for personalized 1-on-1 tutoring; and 5) Travel Agencies for tour itineraries!`;
        toolBadge = 'Target Audience & Users';
      } else if (
        userLower.includes('ethukula') ||
        userLower.includes('what can it be used') ||
        userLower.includes('use for') ||
        userLower.includes('use case') ||
        userLower.includes('industries') ||
        userLower.includes('purposes') ||
        userLower.includes('domains')
      ) {
        replyText = `You can use Thamili AI agents across 8 major domains: 🏨 Hotel & Hospitality concierge, ✈️ Travel & Tour planning, 🎓 STEM & Education tutoring, 💻 Software Coding & Architecture, 🩺 Clinical Healthcare FAQs, 📈 Finance & Trading, ⚖️ Legal & Compliance, and 🎧 24/7 Customer Support.`;
        toolBadge = 'Domain Knowledge Bases';
      } else if (
        userLower.includes('create') ||
        userLower.includes('custom') ||
        userLower.includes('build') ||
        userLower.includes('how do i')
      ) {
        replyText = `To create your custom agent, click 'Create Agent' on the home screen. Enter your agent's name and role, expand any of the dropdown sections using the arrow buttons to choose your domain, interaction mode (Text, Voice, or Both), tools, documents, and voice persona, then click 'Create Agent & Open Side Preview'!`;
        toolBadge = 'Agent Creation Guide';
      } else if (
        userLower.includes('voice') ||
        userLower.includes('speech') ||
        userLower.includes('audio') ||
        userLower.includes('pesanum') ||
        userLower.includes('talk') ||
        userLower.includes('mic')
      ) {
        replyText = `Our real-time speech engine features 5 neural voices: Shimmer, Echo, Alloy, Fable, and Onyx. You can tap the microphone button on the 3D robot stage to speak directly with your voice, or switch to Voice Only Call mode for a hands-free conversational phone-call experience!`;
        toolBadge = 'Neural Speech Engine';
      } else if (
        userLower === 'hi' ||
        userLower === 'hello' ||
        userLower === 'hey' ||
        userLower.startsWith('hi ') ||
        userLower.startsWith('hello ') ||
        userLower.startsWith('hey ') ||
        userLower.includes('who are you') ||
        userLower.includes('introduce') ||
        userLower.includes('vanakkam')
      ) {
        if (isPlatformBot) {
          replyText = `Hello! I am your Thamili 3D AI Robot Assistant. I can explain what this platform does, what features and tools are included, who can use it, and guide you on creating your custom agents. How can I help you today?`;
          toolBadge = 'Thamili Robot Guide';
        } else {
          replyText = `Hello! I am ${activeConfig.name}, your dedicated ${activeConfig.role}. I am here to assist you with everything in ${domainObj.name}. Feel free to ask me any question or make a request!`;
        }
      } else if (domain === 'hotel') {
        if (userLower.includes('check-in') || userLower.includes('time') || userLower.includes('check in')) {
          replyText = `Standard check-in begins at 3:00 PM, and check-out is at 11:00 AM. If you require early check-in or luggage storage prior to arrival, I can arrange that for you right away!`;
        } else if (userLower.includes('book') || userLower.includes('suite') || userLower.includes('room') || userLower.includes('weekend')) {
          replyText = `I have checked our inventory: Our Deluxe King Suite with city view is available for this weekend at $240/night including complimentary breakfast. Shall I reserve this under your name?`;
          toolBadge = 'Hotel Booking Engine';
        } else if (userLower.includes('dining') || userLower.includes('restaurant') || userLower.includes('food') || userLower.includes('breakfast')) {
          replyText = `Our rooftop restaurant 'Aurora Sky Lounge' serves gourmet continental cuisine from 6:30 PM to 11:00 PM. Breakfast is served at the Palm Court from 6:30 AM to 10:30 AM. Would you like a table reservation?`;
        } else {
          replyText = `Thank you for contacting ${activeConfig.name}. Regarding "${userText}": I have logged your request in our guest management system. How else may I ensure your stay is wonderful?`;
        }
      } else if (domain === 'travel') {
        if (userLower.includes('bali') || userLower.includes('itinerary') || userLower.includes('5-day') || userLower.includes('trip')) {
          replyText = `Here is your curated 5-day Bali itinerary: Day 1: Arrive in Ubud, visit the Monkey Forest & Tegallalang Rice Terraces. Day 2: Mount Batur sunrise trek & hot springs. Day 3: Transfer to Seminyak, beach clubs & sunset at Tanah Lot. Day 4: Nusa Penida day tour to Kelingking Beach. Day 5: Uluwatu Temple & farewell seafood dinner at Jimbaran! Would you like flight options?`;
          toolBadge = 'Travel Routing & Map Data';
        } else if (userLower.includes('budget') || userLower.includes('flight') || userLower.includes('hotel')) {
          replyText = `I have analyzed budget accommodations and seasonal airfares. For your target dates, booking 4 weeks in advance saves up to 35% on flights. Would you like me to compare airlines?`;
          toolBadge = 'Live Fare Scanner';
        } else {
          replyText = `I have noted your travel inquiry for "${userText}". I will factor your preferences into our destination guide and travel budget planner!`;
        }
      } else if (domain === 'code') {
        replyText = `Here is the architectural solution for "${userText}": I have structured the implementation with type safety, optimal computational complexity, and complete error handling.`;
        toolBadge = 'Code Sandbox Verified';
      } else {
        replyText = `I have processed your request for "${userText}" using ${activeConfig.name}. ${activeConfig.memorySaving ? '🧠 Context saved to persistent memory.' : ''} How would you like to proceed?`;
      }

      const agentMsg = {
        id: 'msg-a-' + Date.now(),
        sender: 'agent',
        text: replyText,
        toolBadge: toolBadge,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsThinking(false);
      setMessages(prev => [...prev, agentMsg]);

      // Speak response out loud using the chosen voice persona
      if (activeConfig.interactionMode !== 'text-only') {
        speakText(replyText, activeConfig.voiceId);
      }
    }, 700);
  };

  // Launch from Custom Form
  const launchCreatedAgent = (customConfig) => {
    const finalConfig = {
      ...agentConfig,
      ...customConfig
    };
    setAgentConfig(finalConfig);
    agentConfigRef.current = finalConfig;

    // Save to Agent History
    const historyItem = {
      id: 'agent-hist-' + Date.now(),
      name: finalConfig.name,
      role: finalConfig.role,
      domain: finalConfig.domain,
      avatar: finalConfig.avatar,
      avatarBg: finalConfig.avatarBg || 'linear-gradient(135deg, #6366F1, #4F46E5)',
      voiceId: finalConfig.voiceId,
      voiceName: finalConfig.voiceName,
      interactionMode: finalConfig.interactionMode,
      tools: finalConfig.tools,
      files: finalConfig.files,
      launchedAt: new Date().toISOString(),
      type: 'created'
    };
    setAgentHistory(prev => {
      const filtered = prev.filter(a => a.name !== historyItem.name);
      const updated = [historyItem, ...filtered];
      try {
        localStorage.setItem('thamili_agent_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    const domainObj = DOMAINS.find(d => d.id === finalConfig.domain) || DOMAINS[0];
    const questions = domainObj.discoveryQuestions || [];

    // Warm welcome greeting and detailed self-introduction for the created agent
    const welcomeGreeting = `👋 **Welcome! I am ${finalConfig.name}**, your dedicated **${finalConfig.role}**.\n\nI am here to provide you with expert assistance, smart problem-solving, and real-time answers in **${domainObj.name}**.\n\nHere are some questions you can ask me to get started:\n1. ${questions[0] || 'How can you help me today?'}\n2. ${questions[1] || 'Tell me about your capabilities.'}\n3. ${questions[2] || 'Can you guide me step-by-step?'}`;

    // Polite spoken self-introduction
    const spokenIntro = `Hello and welcome! I am ${finalConfig.name}, your ${finalConfig.role}. I am ready to assist you. How can I help you today?`;

    setMessages([
      {
        id: 'msg-init-' + Date.now(),
        sender: 'agent',
        text: welcomeGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setIsSidePreviewOpen(true);
    if (finalConfig.interactionMode !== 'text-only') {
      setTimeout(() => {
        speakText(spokenIntro, finalConfig.voiceId);
      }, 400);
    }
  };

  // Launch Default Pre-built Agent (Hotel Staff, Travel Agent, Socrates, DevPulse, Dr. Pulse, FinPulse)
  const launchDefaultAgent = (defaultAgent, customizedName, chosenMode = 'both') => {
    const finalName = customizedName && customizedName.trim() ? customizedName : defaultAgent.name;
    const config = {
      ...defaultAgent,
      name: finalName,
      interactionMode: chosenMode,
      files: []
    };
    setAgentConfig(config);
    agentConfigRef.current = config;

    // Save to Agent History
    const historyItem = {
      id: 'agent-hist-' + Date.now(),
      name: finalName,
      role: defaultAgent.role,
      domain: defaultAgent.domain,
      avatar: defaultAgent.avatar,
      avatarBg: defaultAgent.avatarBg || 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
      voiceId: config.voiceId,
      voiceName: config.voiceName,
      interactionMode: chosenMode,
      tools: config.tools,
      files: [],
      launchedAt: new Date().toISOString(),
      type: 'chosen'
    };
    setAgentHistory(prev => {
      const filtered = prev.filter(a => a.name !== historyItem.name);
      const updated = [historyItem, ...filtered];
      try {
        localStorage.setItem('thamili_agent_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    const questions = defaultAgent.discoveryQuestions || [];
    const domainObj = DOMAINS.find(d => d.id === defaultAgent.domain) || DOMAINS[0];

    // Warm welcome greeting and detailed self-introduction
    const welcomeGreeting = `👋 **Welcome! I am ${finalName}**, your dedicated **${defaultAgent.role}**.\n\nI am here to assist you with all your **${domainObj.name}** inquiries, workflows, and real-time guidance.\n\nHere are some key questions for your convenience:\n1. ${questions[0] || 'How can you assist me today?'}\n2. ${questions[1] || 'Tell me about your services.'}\n3. ${questions[2] || 'What options are available?'}`;

    // Polite spoken self-introduction
    const spokenIntro = `Hello and welcome! I am ${finalName}, your ${defaultAgent.role}. I am ready to assist you. How can I help you today?`;

    setMessages([
      {
        id: 'msg-init-' + Date.now(),
        sender: 'agent',
        text: welcomeGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setIsSidePreviewOpen(true);
    if (chosenMode !== 'text-only') {
      setTimeout(() => {
        speakText(spokenIntro, config.voiceId);
      }, 400);
    }
  };

  // Launch any agent from History directly
  const launchHistoryAgent = (historyAgent) => {
    const config = {
      ...agentConfigRef.current,
      ...historyAgent
    };
    setAgentConfig(config);
    agentConfigRef.current = config;

    const domainObj = DOMAINS.find(d => d.id === historyAgent.domain) || DOMAINS[0];
    const questions = domainObj.discoveryQuestions || [];

    const welcomeGreeting = `👋 **Welcome back to ${historyAgent.name}**, your dedicated **${historyAgent.role}**.\n\nI am ready to assist you with **${domainObj.name}**.\n\nHow can I help you today?`;
    const spokenIntro = `Hello! Welcome back to ${historyAgent.name}. I am ready to assist you.`;

    setMessages([
      {
        id: 'msg-init-' + Date.now(),
        sender: 'agent',
        text: welcomeGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setIsSidePreviewOpen(true);
    if (historyAgent.interactionMode !== 'text-only') {
      setTimeout(() => {
        speakText(spokenIntro, historyAgent.voiceId);
      }, 400);
    }
  };

  const removeAgentFromHistory = (id) => {
    setAgentHistory(prev => {
      const updated = prev.filter(a => a.id !== id);
      try {
        localStorage.setItem('thamili_agent_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearAgentHistory = () => {
    setAgentHistory([]);
    try {
      localStorage.removeItem('thamili_agent_history');
    } catch (e) {}
  };

  // Launch 3D Live Robot Platform Guide (Spoken intro + platform capabilities & Q&A)
  const openLiveRobotGuide = () => {
    setAgentConfig(DEFAULT_ROBOT_CONFIG);
    agentConfigRef.current = DEFAULT_ROBOT_CONFIG;

    setMessages([
      {
        id: 'msg-robot-init-' + Date.now(),
        sender: 'agent',
        text: DEFAULT_ROBOT_WELCOME,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setIsSidePreviewOpen(true);
    setTimeout(() => {
      speakText(DEFAULT_ROBOT_SPOKEN_INTRO, 'shimmer');
    }, 450);
  };

  const closeSidePreview = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsListening(false);
    setIsSidePreviewOpen(false);
  };

  return (
    <AgentContext.Provider
      value={{
        currentView,
        setCurrentView,
        theme,
        toggleTheme,
        isSidePreviewOpen,
        setIsSidePreviewOpen,
        agentConfig,
        setAgentConfig,
        agentHistory,
        launchHistoryAgent,
        removeAgentFromHistory,
        clearAgentHistory,
        userProfile,
        setUserProfile,
        updateAgentField,
        selectDomain,
        addFiles,
        removeFile,
        messages,
        isThinking,
        isSpeaking,
        isListening,
        setIsListening,
        audioLevel,
        setAudioLevel,
        isMuted,
        setIsMuted,
        speakText,
        replayVoice,
        sendMessage,
        launchCreatedAgent,
        launchDefaultAgent,
        openLiveRobotGuide,
        closeSidePreview
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}
