import React from 'react';
import { useAgent } from '../../context/AgentContext';
import { AGENT_TEMPLATES } from '../../data/templates';
import {
  X,
  Bot,
  ArrowRight,
  Stethoscope,
  Code2,
  GraduationCap,
  CheckCircle2
} from 'lucide-react';
import { AgentAvatar } from '../agent/AgentAvatar';

export function TemplateModal() {
  const { isTemplateModalOpen, setIsTemplateModalOpen, loadTemplate, agentConfig } = useAgent();

  if (!isTemplateModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsTemplateModalOpen(false)}>
      <div className="modal-content template-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="modal-icon-badge">
              <Bot size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="modal-title">Pre-Built Agent Templates</h3>
              <p className="modal-subtitle">One-click jumpstart with battle-tested personas, system prompts, and tool configurations.</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setIsTemplateModalOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="template-cards-grid">
          {AGENT_TEMPLATES.map((tmpl) => {
            const isCurrent = agentConfig.name === tmpl.name;

            return (
              <div
                key={tmpl.id}
                className={`template-card-item ${isCurrent ? 'current-active' : ''}`}
                onClick={() => {
                  loadTemplate(tmpl);
                  setIsTemplateModalOpen(false);
                }}
              >
                <div className="template-card-header">
                  <div
                    className="template-avatar-box"
                    style={{ background: tmpl.avatarBg }}
                  >
                    <AgentAvatar avatar={tmpl.avatar} domain={tmpl.domain} size={22} />
                  </div>
                  <span className="template-domain-tag">{tmpl.domain.toUpperCase()}</span>
                </div>

                <h4 className="template-title">{tmpl.name}</h4>
                <p className="template-tagline">{tmpl.tagline}</p>

                <div className="template-meta-row">
                  <span className="template-model-pill">{tmpl.model}</span>
                  <span className="template-voice-pill">Voice: {tmpl.voice.name.split(' ')[0]}</span>
                </div>

                <button className="template-use-btn">
                  <span>{isCurrent ? 'Currently Loaded' : 'Load Template'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
