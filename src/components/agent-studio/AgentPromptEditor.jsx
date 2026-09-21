import React from 'react';
import { useAgent } from '../../context/AgentContext';
import { DOMAINS } from '../../data/domains';
import {
  FileText,
  Sliders,
  RotateCcw,
  MessageCircle,
  HelpCircle,
  CheckCircle,
  Cpu
} from 'lucide-react';

const TONES = [
  { id: 'professional', label: 'Professional & Clinical', desc: 'Formal, concise, objective' },
  { id: 'socratic', label: 'Socratic Tutor', desc: 'Inquisitive, step-by-step guidance' },
  { id: 'friendly', label: 'Friendly & Conversational', desc: 'Warm, approachable, great for voice' },
  { id: 'technical', label: 'Deep Technical & Direct', desc: 'Code-heavy, strict specifications' },
  { id: 'concise', label: 'Ultra-Concise Bullet Points', desc: 'Fast, minimal token footprint' }
];

export function AgentPromptEditor() {
  const { agentConfig, updateConfig } = useAgent();

  const handleResetToDomainDefault = () => {
    const domainObj = DOMAINS.find(d => d.id === agentConfig.domain);
    if (domainObj) {
      updateConfig('systemPrompt', domainObj.defaultPrompt);
    }
  };

  return (
    <div className="studio-step-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="step-number">02</span>
          <div>
            <h3 className="section-title">System Persona & Prompt Engineering</h3>
            <p className="section-subtitle">
              Configure how your agent thinks, communicates, structures answers, and behaves under different contexts.
            </p>
          </div>
        </div>
      </div>

      {/* Persona Tone Selector */}
      <div className="form-group">
        <label className="form-label">
          Conversational Tone & Persona Style
        </label>
        <div className="tone-pills-container">
          {TONES.map((tone) => (
            <button
              key={tone.id}
              type="button"
              className={`tone-pill-btn ${agentConfig.systemPrompt.includes(tone.label) ? 'active' : ''}`}
              onClick={() => {
                const updated = `${agentConfig.systemPrompt}\n\n[Tone Specification]: Maintain a ${tone.label} tone (${tone.desc}).`;
                updateConfig('systemPrompt', updated);
              }}
            >
              <span className="tone-pill-title">{tone.label}</span>
              <span className="tone-pill-desc">{tone.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* System Prompt Code/Text Area */}
      <div className="form-group mt-4">
        <div className="flex-between mb-2">
          <label className="form-label mb-0">
            System Instructions (Persona Prompt) <span className="text-red-500">*</span>
          </label>
          <div className="flex-actions-gap">
            <button
              type="button"
              onClick={handleResetToDomainDefault}
              className="btn-text-action"
            >
              <RotateCcw size={13} />
              <span>Reset to Domain Default</span>
            </button>
          </div>
        </div>

        <div className="prompt-editor-wrapper">
          <textarea
            className="prompt-textarea"
            rows={10}
            value={agentConfig.systemPrompt}
            onChange={(e) => updateConfig('systemPrompt', e.target.value)}
            placeholder="Write explicit instructions for how the AI Agent should act, tools it should invoke, and guidelines to follow..."
          />
          <div className="prompt-meta-bar">
            <span className="meta-char-count">{agentConfig.systemPrompt.length} characters</span>
            <span className="meta-token-est">~{Math.round(agentConfig.systemPrompt.length / 4)} tokens</span>
          </div>
        </div>
      </div>

      {/* Hyperparameters / Sliders */}
      <div className="form-grid-2 mt-6">
        {/* Temperature Slider */}
        <div className="param-card">
          <div className="flex-between mb-1">
            <label className="param-label">
              Creativity & Temperature: <span className="param-value">{agentConfig.temperature}</span>
            </label>
            <span className="param-subtag">{agentConfig.temperature < 0.4 ? 'Precise' : agentConfig.temperature > 0.8 ? 'Creative' : 'Balanced'}</span>
          </div>
          <p className="param-desc">
            Lower values for deterministic facts (medical, code, finance). Higher values for creative writing & brainstorming.
          </p>
          <input
            type="range"
            min="0"
            max="1.2"
            step="0.05"
            className="aurqo-slider"
            value={agentConfig.temperature}
            onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
          />
          <div className="slider-ticks">
            <span>0.0 (Strict)</span>
            <span>0.7 (Standard)</span>
            <span>1.2 (Creative)</span>
          </div>
        </div>

        {/* Max Output Tokens */}
        <div className="param-card">
          <div className="flex-between mb-1">
            <label className="param-label">
              Max Response Tokens: <span className="param-value">{agentConfig.maxTokens}</span>
            </label>
            <span className="param-subtag">~{Math.round(agentConfig.maxTokens * 0.75)} words</span>
          </div>
          <p className="param-desc">
            Limit the maximum length of generated agent responses to optimize latency and voice turnaround times.
          </p>
          <input
            type="range"
            min="512"
            max="8192"
            step="256"
            className="aurqo-slider"
            value={agentConfig.maxTokens}
            onChange={(e) => updateConfig('maxTokens', parseInt(e.target.value))}
          />
          <div className="slider-ticks">
            <span>512 (Fast Voice)</span>
            <span>4096 (Standard)</span>
            <span>8192 (Long Paper)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
