import React from 'react';
import { useAgent } from '../../context/AgentContext';
import { DOMAINS, AI_MODELS } from '../../data/domains';
import {
  Stethoscope,
  Code2,
  GraduationCap,
  BookOpenCheck,
  TrendingUp,
  Scale,
  Headphones,
  Sparkles,
  Bot,
  Cpu,
  Check,
  Zap,
  Layers,
  Smile
} from 'lucide-react';

const ICON_MAP = {
  Stethoscope,
  Code2,
  GraduationCap,
  BookOpenCheck,
  TrendingUp,
  Scale,
  Headphones,
  Sparkles
};

const AVATAR_OPTIONS = [
  { emoji: '🩺', label: 'Doctor / Medical', bg: 'linear-gradient(135deg, #EC4899, #8B5CF6)' },
  { emoji: '💻', label: 'Coder / Dev', bg: 'linear-gradient(135deg, #3B82F6, #06B6D4)' },
  { emoji: '🎓', label: 'Tutor / Scholar', bg: 'linear-gradient(135deg, #8B5CF6, #EC4899)' },
  { emoji: '🔬', label: 'Researcher / Sci', bg: 'linear-gradient(135deg, #10B981, #3B82F6)' },
  { emoji: '📈', label: 'Analyst / Finance', bg: 'linear-gradient(135deg, #F59E0B, #EF4444)' },
  { emoji: '⚖️', label: 'Legal / Counsel', bg: 'linear-gradient(135deg, #6366F1, #3B82F6)' },
  { emoji: '🎧', label: 'Support / Voice', bg: 'linear-gradient(135deg, #06B6D4, #10B981)' },
  { emoji: '🤖', label: 'Autonomous AI', bg: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' },
  { emoji: '🌟', label: 'Star / Multilingual', bg: 'linear-gradient(135deg, #F59E0B, #EC4899)' },
  { emoji: '🚀', label: 'Fast Velocity', bg: 'linear-gradient(135deg, #EF4444, #F59E0B)' }
];

export function AgentBasicInfo() {
  const { agentConfig, updateConfig, selectDomain } = useAgent();

  return (
    <div className="studio-step-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="step-number">01</span>
          <div>
            <h3 className="section-title">Agent Identity & Domain</h3>
            <p className="section-subtitle">
              Define the name, avatar, operating domain, and underlying foundation model for your AI agent.
            </p>
          </div>
        </div>
      </div>

      {/* Row 1: Agent Name & Avatar */}
      <div className="form-grid-2">
        {/* Agent Name */}
        <div className="form-group">
          <label className="form-label">
            Agent Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={agentConfig.name}
            onChange={(e) => updateConfig('name', e.target.value)}
            placeholder="e.g. Dr. Pulse AI, DevSprint Architect, Socrates Tutor"
          />
          <span className="form-hint">A catchy, memorable name for your agent in the AURQO directory.</span>
        </div>

        {/* Tagline / Purpose */}
        <div className="form-group">
          <label className="form-label">
            Role & Tagline <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={agentConfig.tagline}
            onChange={(e) => updateConfig('tagline', e.target.value)}
            placeholder="e.g. Clinical Diagnostics, Realtime WebRTC Code Specialist"
          />
          <span className="form-hint">Brief description of the agent's specialization.</span>
        </div>
      </div>

      {/* Avatar Customizer */}
      <div className="form-group mt-4">
        <label className="form-label">
          Agent Avatar & Icon Style
        </label>
        <div className="avatar-selection-row">
          <div
            className="active-avatar-preview"
            style={{ background: agentConfig.avatarBg }}
          >
            <span className="preview-emoji">{agentConfig.avatar}</span>
          </div>

          <div className="avatar-options-grid">
            {AVATAR_OPTIONS.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                className={`avatar-option-btn ${agentConfig.avatar === opt.emoji ? 'selected' : ''}`}
                style={{ background: opt.bg }}
                onClick={() => {
                  updateConfig('avatar', opt.emoji);
                  updateConfig('avatarBg', opt.bg);
                }}
                title={opt.label}
              >
                <span>{opt.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Domain Selection Grid */}
      <div className="form-group mt-6">
        <div className="flex-between mb-2">
          <label className="form-label mb-0">
            Select Domain Specialization <span className="text-red-500">*</span>
          </label>
          <span className="badge-soft-info">8 Domains Available</span>
        </div>
        <p className="form-hint mb-3">
          Choosing a domain automatically configures optimal reasoning instructions, suggested tools, and LiveKit audio models.
        </p>

        <div className="domain-cards-grid">
          {DOMAINS.map((domain) => {
            const Icon = ICON_MAP[domain.icon] || Sparkles;
            const isSelected = agentConfig.domain === domain.id;

            return (
              <div
                key={domain.id}
                onClick={() => selectDomain(domain.id)}
                className={`domain-card ${isSelected ? 'selected' : ''}`}
                style={{
                  '--domain-color': domain.color,
                  borderColor: isSelected ? domain.color : undefined
                }}
              >
                <div className="domain-card-top">
                  <div
                    className="domain-icon-box"
                    style={{ backgroundColor: domain.bgColor, color: domain.color }}
                  >
                    <Icon size={20} />
                  </div>
                  {isSelected && (
                    <div className="domain-check-badge" style={{ backgroundColor: domain.color }}>
                      <Check size={12} color="#fff" />
                    </div>
                  )}
                </div>

                <h4 className="domain-card-name">{domain.name}</h4>
                <p className="domain-card-desc">{domain.description}</p>
                
                <div className="domain-card-footer">
                  <span className="domain-badge-tag">{domain.badge}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Foundation Model Selector */}
      <div className="form-group mt-6">
        <label className="form-label">
          Base Reasoning Foundation Model <span className="text-red-500">*</span>
        </label>
        <p className="form-hint mb-3">
          Select the LLM backbone that powers the agent's logic, reasoning depth, and speed.
        </p>

        <div className="model-cards-grid">
          {AI_MODELS.map((model) => {
            const isSelected = agentConfig.model === model.id;
            return (
              <div
                key={model.id}
                onClick={() => updateConfig('model', model.id)}
                className={`model-card ${isSelected ? 'selected' : ''}`}
              >
                <div className="model-card-header">
                  <div>
                    <h5 className="model-name">{model.name}</h5>
                    <span className="model-provider">{model.provider}</span>
                  </div>
                  {isSelected && (
                    <span className="model-selected-badge">Active</span>
                  )}
                </div>

                <div className="model-card-metrics">
                  <div className="metric-chip">
                    <Zap size={12} className="text-amber-500" />
                    <span>{model.latency}</span>
                  </div>
                  <div className="metric-chip">
                    <Layers size={12} className="text-blue-500" />
                    <span>{model.context}</span>
                  </div>
                  {model.audio && (
                    <div className="metric-chip audio-badge">
                      <span>LiveKit Ready</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
