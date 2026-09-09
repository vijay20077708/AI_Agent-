import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import { AurqoLogo, AurqoIcon } from '../brand/AurqoLogo';
import {
  MessageSquare,
  Image,
  Video,
  GraduationCap,
  Bot,
  Paperclip,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function HomeScreen() {
  const { setCurrentView, sendMessage } = useAgent();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery;
    setSearchQuery('');
    // Direct search opens AI Agent hub or launches search query
    setCurrentView('agent-hub');
  };

  const featurePills = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'image', label: 'AI Image', icon: Image },
    { id: 'video', label: 'AI Video', icon: Video },
    { id: 'learn', label: 'AI Learn', icon: GraduationCap },
    { id: 'agent-hub', label: 'AI Agent', icon: Bot },
  ];

  return (
    <div className="aurqo-home-view">
      <div className="home-center-stage">
        {/* Big 3D Logo matching reference image */}
        <div className="home-hero-brand">
          <AurqoLogo size={96} isHero={true} />
        </div>

        {/* Hero Headings */}
        <h1 className="home-hero-heading">
          தமிழி — <span className="gradient-purple-text">TAMIL-FIRST AI COMPANION</span>
        </h1>
        <p className="home-hero-subheading">
          அனைத்து AI கருவிகளும் மற்றும் AI Agent-களும் ஒரே இடத்தில்!
        </p>

        {/* Central Search Bar from screenshot */}
        <form onSubmit={handleSearchSubmit} className="aurqo-central-search-card">
          <textarea
            className="central-search-textarea"
            rows={3}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="How can I help you today?"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSearchSubmit(e);
              }
            }}
          />
          <div className="search-card-actions">
            <button type="button" className="btn-search-paperclip" title="Attach file or context">
              <Paperclip size={18} />
            </button>
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="btn-search-arrow-submit"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </form>

        {/* 5 Feature Pill Buttons below search bar matching screenshot */}
        <div className="home-feature-pills-row">
          {featurePills.map((pill) => {
            const Icon = pill.icon;
            return (
              <button
                key={pill.id}
                onClick={() => setCurrentView(pill.id)}
                className="hero-pill-item"
              >
                <Icon size={16} className="pill-item-icon" />
                <span className="pill-item-label">{pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Powered by footer */}
      <footer className="aurqo-home-footer">
        <span>Powered by advanced AI technology</span>
        <Sparkles size={14} className="text-purple-500" />
      </footer>
    </div>
  );
}
