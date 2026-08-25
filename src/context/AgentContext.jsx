import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DEFAULT_AGENTS } from '../data/defaultAgents';
import { DOMAINS } from '../data/domains';
import { VOICE_PERSONAS } from '../data/voices';

const AgentContext = createContext();

export function AgentProvider({ children }) {
  // Navigation & View Routing
  // 'home' | 'agent-hub' | 'create-agent' | 'choose-agent' | 'chat' | 'code' | 'image' | 'video' | 'learn' | 'tools' | 'history' | 'saved'
  const [currentView, setCurrentView] = useState('home');
  const [theme, setTheme] = useState('light');
  const [isSidePreviewOpen, setIsSidePreviewOpen] = useState(false);

  // Active Agent Configuration State
  const [agentConfig, setAgentConfig] = useState({
    name: 'Grand Aurora Hotel Concierge',
    role: 'Front Desk Hospitality & Guest Services Specialist',
    domain: 'hotel',
    avatar: '🏨',
    avatarBg: 'linear-gradient(135deg, #10B981, #059669)',
    voiceId: 'shimmer',
    voiceName: 'Shimmer (Female)',
    interactionMode: 'both', // 'both' | 'text-only' | 'voice-only'
    memorySaving: true,
    files: [],
    tools: {
      webSearch: true,
      codeInterpreter: false,
      imageGen: true,
      knowledgeSearch: true
    },
    systemPrompt: ''
  });

  // Conversation & Speech Synthesis State
  const [messages, setMessages] = useState([]);
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
    setAgentConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Switch domain and set defaults
  const selectDomain = (domainId) => {
    const domainObj = DOMAINS.find(d => d.id === domainId);
    if (!domainObj) return;

    setAgentConfig(prev => ({
      ...prev,
      domain: domainId,
      name: domainObj.defaultName,
      role: domainObj.defaultRole,
      avatar: domainId === 'hotel' ? '🏨' : domainId === 'travel' ? '✈️' : domainId === 'study' ? '🎓' : domainId === 'code' ? '💻' : domainId === 'medical' ? '🩺' : domainId === 'research' ? '🔬' : domainId === 'finance' ? '📈' : '✨'
    }));
  };

  // Add uploaded files
  const addFiles = (fileList) => {
    const formatted = Array.from(fileList).map((file, idx) => ({
      id: 'f-' + Date.now() + '-' + idx,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || 'Document'
    }));

    setAgentConfig(prev => ({
      ...prev,
      files: [...prev.files, ...formatted]
    }));
  };

  // Remove file
  const removeFile = (id) => {
    setAgentConfig(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== id)
    }));
  };

  // Speech Synthesis: Natural Voice Talk-Back using chosen persona
  const speakText = (text, customVoiceId = null) => {
    if (!('speechSynthesis' in window) || isMuted || agentConfig.interactionMode === 'text-only') return;

    try {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/[*#`_~]/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\(.*?\)/g, '')
        .slice(0, 320);

      const targetVoiceId = customVoiceId || agentConfig.voiceId || 'shimmer';
      const persona = VOICE_PERSONAS.find(v => v.id === targetVoiceId) || VOICE_PERSONAS[0];

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = persona.speed || 1.0;
      utterance.pitch = persona.pitch || 1.0;
      utterance.lang = persona.lang || 'en-US';

      // Pick matching system voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        if (persona.lang === 'ta-IN') {
          const taVoice = voices.find(v => v.lang.includes('ta') || v.name.toLowerCase().includes('tamil'));
          if (taVoice) utterance.voice = taVoice;
        } else if (persona.gender.toLowerCase().includes('female')) {
          const femVoice = voices.find(v => (v.lang.includes('en') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('victoria'))));
          if (femVoice) utterance.voice = femVoice;
        } else if (persona.gender.toLowerCase().includes('male')) {
          const maleVoice = voices.find(v => (v.lang.includes('en') && (v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('alex'))));
          if (maleVoice) utterance.voice = maleVoice;
        }
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

  const replayVoice = (text) => {
    speakText(text);
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
      const domain = agentConfig.domain;
      const userLower = userText.toLowerCase();
      let replyText = '';
      let toolBadge = null;

      // Intelligent Contextual Responses based on Domain & Memory Saving
      if (domain === 'hotel') {
        if (userLower.includes('check-in') || userLower.includes('time') || userLower.includes('check in')) {
          replyText = `Standard check-in begins at 5:30 PM, and check-out is at 11:08 AM. If you require early check-out or luggage storage prior to arrival, I can arrange that for you right away!`;
        } else if (userLower.includes('book') || userLower.includes('suite') || userLower.includes('room') || userLower.includes('weekend')) {
          replyText = `I have checked our inventory: Our Deluxe King Suite with city view is available for this weekend at $240/night including complimentary breakfast. Shall I reserve this under your name?`;
          toolBadge = 'Hotel Booking Engine';
        } else if (userLower.includes('dining') || userLower.includes('restaurant') || userLower.includes('food') || userLower.includes('breakfast')) {
          replyText = `Our rooftop restaurant 'Aurora Sky Lounge' serves gourmet continental cuisine from 6:30 PM to 11:00 PM. Breakfast is served at the Palm Court from 6:30 AM to 10:30 AM. Would you like a table reservation?`;
        } else {
          replyText = `Thank you for contacting Grand Aurora Hotel Concierge. Regarding "${userText}": I have logged your request in our guest management system. How else may I ensure your stay is wonderful?`;
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
        replyText = `I have processed your request for "${userText}" using ${agentConfig.name}. ${agentConfig.memorySaving ? '🧠 Context saved to persistent memory.' : ''} How would you like to proceed?`;
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

      // Speak response out loud if mode allows voice
      if (agentConfig.interactionMode !== 'text-only') {
        speakText(replyText);
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

    const domainObj = DOMAINS.find(d => d.id === finalConfig.domain) || DOMAINS[0];
    const welcome = `${domainObj.welcomeGreeting}\n\nHere are some questions you can ask me:\n1. ${domainObj.discoveryQuestions[0]}\n2. ${domainObj.discoveryQuestions[1]}\n3. ${domainObj.discoveryQuestions[2]}`;

    setMessages([
      {
        id: 'msg-init-' + Date.now(),
        sender: 'agent',
        text: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setIsSidePreviewOpen(true);
    if (finalConfig.interactionMode !== 'text-only') {
      setTimeout(() => {
        speakText(`${domainObj.welcomeGreeting} ${domainObj.discoveryQuestions[0]}`);
      }, 400);
    }
  };

  // Launch Default Pre-built Agent (Hotel Staff or Travel Agent)
  const launchDefaultAgent = (defaultAgent, customizedName, chosenMode = 'both') => {
    const finalName = customizedName && customizedName.trim() ? customizedName : defaultAgent.name;
    const config = {
      ...defaultAgent,
      name: finalName,
      interactionMode: chosenMode,
      files: []
    };
    setAgentConfig(config);

    const welcome = `${defaultAgent.welcomeGreeting}\n\nKey questions for your convenience:\n1. ${defaultAgent.discoveryQuestions[0]}\n2. ${defaultAgent.discoveryQuestions[1]}\n3. ${defaultAgent.discoveryQuestions[2]}`;

    setMessages([
      {
        id: 'msg-init-' + Date.now(),
        sender: 'agent',
        text: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setIsSidePreviewOpen(true);
    if (chosenMode !== 'text-only') {
      setTimeout(() => {
        speakText(`${defaultAgent.welcomeGreeting} ${defaultAgent.discoveryQuestions[0]}`);
      }, 400);
    }
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
