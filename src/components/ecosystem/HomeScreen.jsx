import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import { AurqoLogo, AurqoIcon } from '../brand/AurqoLogo';
import {
  MessageSquare,
  Code2,
  Image,
  Video,
  GraduationCap,
  Bot,
  Paperclip,
  ArrowRight,
  Sparkles,
  Zap,
  Layers
} from 'lucide-react';

export function HomeScreen() {
  const { setActiveTab, selectDomain, sendMessage } = useAgent();
  const [promptInput, setPromptInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setActiveTab('agents');
    setTimeout(() => {
      sendMessage(promptInput);
    }, 400);
  };

  const featureCards = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, desc: 'Conversational reasoning & GPT-4o' },
    { id: 'code', label: 'AI Code', icon: Code2, desc: 'Full-stack code generation & debugging' },
    { id: 'image', label: 'AI Image', icon: Image, desc: 'Midjourney & Gemini style generation' },
    { id: 'video', label: 'AI Video', icon: Video, desc: 'Flow / Veo AI cinematic video studio' },
    { id: 'learn', label: 'AI Learn', icon: GraduationCap, desc: 'Socratic interactive education tutor' },
  ];

  return (
    <div className="aurqo-home-container">
      <div className="home-center-hero">
        {/* Brand Big Logo from reference image */}
        <div className="hero-logo-box">
          <AurqoIcon size={96} />
          <div className="hero-brand-name">AURQO</div>
        </div>

        {/* Hero Headlines */}
        <h1 className="hero-main-title">
          One AI. <span className="gradient-text-hero">Infinite Possibilities.</span>
        </h1>
        <p className="hero-subtitle">
          All the AI models and tools you need, in one simple place.
        </p>

        {/* Central Search / Prompt Box matching screenshot */}
        <form onSubmit={handleSearchSubmit} className="hero-search-box-card">
          <textarea
            className="hero-search-input"
            rows={3}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="How can I help you today?"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSearchSubmit(e);
              }
            }}
          />
          <div className="hero-search-actions-bar">
            <button
              type="button"
              className="btn-attach-clip"
              title="Attach File or Code"
            >
              <Paperclip size={18} />
            </button>
            <button
              type="submit"
              disabled={!promptInput.trim()}
              className="btn-hero-submit-arrow"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </form>

        {/* 5 Core Feature Buttons matching screenshot */}
        <div className="hero-feature-buttons-row">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className="hero-pill-feature-btn"
              >
                <Icon size={16} className="feature-btn-icon" />
                <span className="feature-btn-label">{feat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Direct Link to Agent Studio */}
        <div className="hero-agent-banner mt-6" onClick={() => setActiveTab('agents')}>
          <div className="agent-banner-left">
            <div className="agent-banner-icon">
              <Bot size={22} className="text-purple-600" />
            </div>
            <div>
              <h4 className="agent-banner-title">Build Autonomous AI Agents & LiveKit Voice Sandbox</h4>
              <p className="agent-banner-desc">
                Multi-domain setup: Medical, Code, STEM Study, Research, Voice Support with real-time WebRTC LiveKit testing.
              </p>
            </div>
          </div>
          <button className="btn-launch-agent-studio">
            <span>Launch Agent Studio</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Footer info matching screenshot */}
      <footer className="home-powered-footer">
        <span>Powered by advanced AI technology</span>
        <Sparkles size={14} className="text-purple-500" />
      </footer>
    </div>
  );
}
