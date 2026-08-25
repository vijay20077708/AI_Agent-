import React from 'react';
import { useAgent } from '../../context/AgentContext';
import {
  Wrench,
  Users,
  Sparkles,
  ArrowRight,
  Bot,
  Hotel,
  Plane,
  BrainCircuit,
  Layers,
  ArrowLeft,
  Volume2,
  Zap
} from 'lucide-react';

export function AgentHub() {
  const { setCurrentView } = useAgent();

  return (
    <div className="agent-hub-wrapper animated-cyber-bg">
      {/* Background Animated Cyber Mesh */}
      <div className="cyber-glow-orb cyan-orb" />
      <div className="cyber-glow-orb purple-orb" />

      {/* Header */}
      <div className="agent-hub-header">
        <button onClick={() => setCurrentView('home')} className="btn-hub-back">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div className="hub-badge-pill animated-pulse-badge">
          <Sparkles size={14} className="text-purple-600 spin-slow" />
          <span>AURQO 3D Neural Agent Studio</span>
        </div>

        <div className="hub-title-with-robot-row">
          <div>
            <h2 className="hub-main-title">
              What would you like to <span className="gradient-purple-text">create today?</span>
            </h2>
            <p className="hub-sub-title">
              Build a custom autonomous agent with bespoke tools, 3D animated robot avatar, and persistent memory, or choose from ready-to-use domain agents.
            </p>
          </div>

          <div className="hub-robot-mini-preview" title="Interactive 3D Robot Assistant Included">
            <img
              src="/assets/robot-assistant.png"
              alt="AI Robot Assistant"
              className="hub-floating-robot-img"
            />
            <span className="robot-mini-badge">
              <Zap size={11} className="text-cyan-400" />
              <span>3D Live Robot</span>
            </span>
          </div>
        </div>
      </div>

      {/* Two Options Cards Grid with Rich Animations */}
      <div className="agent-options-cards-grid">
        {/* Option 1: Create Agent */}
        <div
          className="agent-option-card create-card animated-card-glow"
          onClick={() => setCurrentView('create-agent')}
        >
          <div className="option-card-icon-box create-icon">
            <Wrench size={28} />
          </div>
          <div className="option-card-content">
            <div className="flex items-center gap-2 mb-1">
              <span className="option-number-tag">Option 01</span>
              <span className="option-badge-custom">Custom AI Builder</span>
            </div>
            <h3 className="option-card-title">1. Create Custom Agent</h3>
            <p className="option-card-desc">
              Design a custom AI Agent from scratch. Configure Agent Name, Role, Domain (Hotel, Travel, STEM, Code, Medical, Finance), 5 Neural Voices, 3 Interaction Modes, Document uploads, and <strong>Memory Saving</strong>.
            </p>

            <div className="option-card-features">
              <span className="feature-mini-pill">🤖 3D Live Robot</span>
              <span className="feature-mini-pill">🎙️ 5 Male/Female Voices</span>
              <span className="feature-mini-pill">💬 3 Interaction Modes</span>
              <span className="feature-mini-pill">🧠 Memory Saving</span>
            </div>
          </div>

          <div className="option-card-cta">
            <span className="cta-text">Launch Custom Builder</span>
            <ArrowRight size={18} className="cta-arrow" />
          </div>
        </div>

        {/* Option 2: Choose Agent */}
        <div
          className="agent-option-card choose-card animated-card-glow"
          onClick={() => setCurrentView('choose-agent')}
        >
          <div className="option-card-icon-box choose-icon">
            <Users size={28} />
          </div>
          <div className="option-card-content">
            <div className="flex items-center gap-2 mb-1">
              <span className="option-number-tag">Option 02</span>
              <span className="option-badge-ready">Pre-Built Domain Agents</span>
            </div>
            <h3 className="option-card-title">2. Choose Pre-Built Agent</h3>
            <p className="option-card-desc">
              Select from ready-to-use domain agents pre-loaded with 10+ industry discovery questions. Easily customize the agent's name, choose voice/text mode, and launch into the <strong>Centered 3D Robot Studio</strong>.
            </p>

            <div className="prebuilt-agent-preview-row">
              <div className="prebuilt-agent-mini-chip">
                <Hotel size={16} className="text-emerald-600" />
                <span>🏨 Hotel Staff Agent</span>
              </div>
              <div className="prebuilt-agent-mini-chip">
                <Plane size={16} className="text-blue-600" />
                <span>✈️ Travel Agent</span>
              </div>
            </div>
          </div>

          <div className="option-card-cta">
            <span className="cta-text">Browse Domain Agents</span>
            <ArrowRight size={18} className="cta-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
}

