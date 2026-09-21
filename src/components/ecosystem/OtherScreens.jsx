import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import {
  MessageSquare,
  Code2,
  Image,
  Video,
  GraduationCap,
  Bot,
  Send,
  Play,
  Download,
  Copy,
  Check,
  Zap,
  Layers,
  FileCode,
  Terminal,
  Settings,
  History,
  Bookmark,
  ShieldCheck,
  Key
} from 'lucide-react';

export function AIChatScreen() {
  const { setActiveTab } = useAgent();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to AURQO AI Chat! How can I assist you with deep research, reasoning, or content creation today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `[AURQO Core Chat Response] I have analyzed "${userText}". For specialized domain tasks, you can also launch our AI Agent Studio!` }
      ]);
    }, 600);
  };

  return (
    <div className="ecosystem-view-container">
      <div className="ecosystem-header">
        <div>
          <h2>💬 AI Conversational Suite</h2>
          <p>Multi-model chat with GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro.</p>
        </div>
        <button onClick={() => setActiveTab('agents')} className="btn-secondary-pill">
          <Bot size={16} /> Open Agent Studio
        </button>
      </div>

      <div className="ecosystem-chat-body">
        {messages.map((m, idx) => (
          <div key={idx} className={`eco-msg-bubble ${m.role}`}>
            <strong>{m.role === 'assistant' ? 'AURQO Chat' : 'You'}:</strong>
            <p>{m.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="eco-input-bar">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AURQO Chat anything..."
          className="eco-text-input"
        />
        <button type="submit" className="eco-btn-send"><Send size={16} /></button>
      </form>
    </div>
  );
}

export function AICodeScreen() {
  const [code, setCode] = useState(`// AURQO AI Code Assistant
// Real-time LiveKit Agent initialization
import { LiveKitAgent } from '@aurqo/agent-sdk';

export const agent = new LiveKitAgent({
  name: 'DevSprint',
  runtime: 'python-livekit-v0.9',
  vad: 'silero-v4'
});
`);

  return (
    <div className="ecosystem-view-container">
      <div className="ecosystem-header">
        <div>
          <h2>{'</>'} AI Code Generator & Debugger</h2>
          <p>Write, analyze, test, and optimize production code across 30+ languages.</p>
        </div>
      </div>
      <div className="code-editor-mock">
        <div className="code-editor-top">
          <span>agent_runtime.ts</span>
          <span className="text-xs text-emerald-400">● Live TypeScript Linter Ready</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={12}
          className="code-mock-textarea"
        />
      </div>
    </div>
  );
}

export function AIImageScreen() {
  const [prompt, setPrompt] = useState('Futuristic glowing holographic AI assistant avatar in cyberpunk purple and cyan');
  return (
    <div className="ecosystem-view-container">
      <div className="ecosystem-header">
        <div>
          <h2>🖼️ AI Image Creation Studio</h2>
          <p>Generate photorealistic imagery, icons, and UI assets with Imagen & DALL-E 3.</p>
        </div>
      </div>
      <div className="image-gen-box">
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
          />
        </div>
        <button className="btn-primary-gradient mb-4">
          <Image size={16} /> Generate High-Res Image
        </button>
        <div className="image-gallery-mock">
          <div className="img-placeholder-card p-1">
            <span className="text-4xl">🎨</span>
            <span className="text-sm text-gray-500 mt-2">Ready to generate with team Imagen API</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AIVideoScreen() {
  return (
    <div className="ecosystem-view-container">
      <div className="ecosystem-header">
        <div>
          <h2>🎥 AI Video Creator (Flow / Veo Engine)</h2>
          <p>Generate cinematic video scenes and animations from prompt descriptions.</p>
        </div>
      </div>
      <div className="video-gen-box">
        <div className="img-placeholder-card">
          <Play size={40} className="text-purple-600 mb-2" />
          <h4>Google Flow / Veo Video Pipeline</h4>
          <p className="text-sm text-gray-500">Connected to 14-member multi-modal team video pipeline</p>
        </div>
      </div>
    </div>
  );
}

export function AILearnScreen() {
  return (
    <div className="ecosystem-view-container">
      <div className="ecosystem-header">
        <div>
          <h2>🎓 AI Socratic Learning Hub</h2>
          <p>Personalized study companion with step-by-step tutoring in STEM, Medical & Languages.</p>
        </div>
      </div>
      <div className="learn-cards-grid">
        <div className="learn-topic-card">
          <span className="topic-icon">🧬</span>
          <h4>Biology & Clinical Medicine</h4>
          <p>Master pharmacology, anatomy & diagnostics with interactive Socratic quizzes.</p>
        </div>
        <div className="learn-topic-card">
          <span className="topic-icon">💻</span>
          <h4>Distributed Systems & LiveKit</h4>
          <p>Learn WebRTC audio pipelines, asynchronous event loops, and LLM streaming.</p>
        </div>
        <div className="learn-topic-card">
          <span className="topic-icon">🌐</span>
          <h4>Tamil & Multilingual AI</h4>
          <p>Explore NLP tokenization, Tamil literature, and bilingual reasoning models.</p>
        </div>
      </div>
    </div>
  );
}

export function GenericSettingsScreen() {
  return (
    <div className="ecosystem-view-container">
      <div className="ecosystem-header">
        <div>
          <h2>⚙️ Settings & API Configuration</h2>
          <p>Configure LiveKit credentials, OpenAI API keys, and team permissions.</p>
        </div>
      </div>
      <div className="settings-form-grid">
        <div className="form-group">
          <label className="form-label">LiveKit Server URL</label>
          <input type="text" className="form-input" defaultValue="wss://aurqo-livekit.livekit.cloud" />
        </div>
        <div className="form-group">
          <label className="form-label">LiveKit API Key</label>
          <input type="password" className="form-input" defaultValue="APIKey_AURQO_Team14_Secret" />
        </div>
        <div className="form-group">
          <label className="form-label">OpenAI / Gemini API Key</label>
          <input type="password" className="form-input" defaultValue="sk-proj-AURQO9988776655" />
        </div>
      </div>
    </div>
  );
}
