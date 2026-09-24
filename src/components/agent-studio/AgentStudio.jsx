import React from 'react';
import { useAgent } from '../../context/AgentContext';
import { AgentBasicInfo } from './AgentBasicInfo';
import { AgentPromptEditor } from './AgentPromptEditor';
import { KnowledgeUploader } from './KnowledgeUploader';
import { ToolsConfig } from './ToolsConfig';
import { VoiceSettings } from './VoiceSettings';
import { ExportModal } from './ExportModal';
import { TemplateModal } from './TemplateModal';
import { AgentAvatar } from '../agent/AgentAvatar';
import {
  UserCheck,
  FileCode2,
  Database,
  Wrench,
  Radio,
  ArrowRight,
  ArrowLeft,
  Save,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STEPS = [
  { id: 'identity', label: '1. Identity & Domain', icon: UserCheck, desc: 'Name, avatar, role & foundation model' },
  { id: 'prompt', label: '2. Persona & Prompt', icon: FileCode2, desc: 'System behavior, reasoning & tone' },
  { id: 'knowledge', label: '3. Knowledge Base', icon: Database, desc: 'RAG docs, PDFs, web scrapers' },
  { id: 'tools', label: '4. Tools & Actions', icon: Wrench, desc: 'Web search, Python, LiveKit, APIs' },
  { id: 'voice', label: '5. Voice & LiveKit', icon: Radio, desc: 'Speech models, VAD & WebRTC audio' },
];

export function AgentStudio() {
  const {
    activeStudioStep,
    setActiveStudioStep,
    agentConfig,
    setIsExportModalOpen,
    setIsTemplateModalOpen,
    setActivePreviewTab
  } = useAgent();

  const currentStepIndex = STEPS.findIndex(s => s.id === activeStudioStep);

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setActiveStudioStep(STEPS[currentStepIndex + 1].id);
    } else {
      // Finished all steps -> open export or focus test
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.3 }
      });
      setActivePreviewTab('voice');
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setActiveStudioStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const renderActiveStep = () => {
    switch (activeStudioStep) {
      case 'identity':
        return <AgentBasicInfo />;
      case 'prompt':
        return <AgentPromptEditor />;
      case 'knowledge':
        return <KnowledgeUploader />;
      case 'tools':
        return <ToolsConfig />;
      case 'voice':
        return <VoiceSettings />;
      default:
        return <AgentBasicInfo />;
    }
  };

  return (
    <div className="agent-studio-root">
      {/* Studio Header Bar */}
      <div className="studio-top-bar">
        <div className="studio-title-area">
          <div
            className="agent-current-badge-avatar"
            style={{ background: agentConfig.avatarBg }}
          >
            <AgentAvatar avatar={agentConfig.avatar} domain={agentConfig.domain} size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="studio-agent-name">{agentConfig.name}</h2>
              <span className="studio-domain-pill">{agentConfig.domain.toUpperCase()}</span>
              <span className="studio-model-pill">{agentConfig.model}</span>
            </div>
            <p className="studio-agent-tagline">{agentConfig.tagline}</p>
          </div>
        </div>

        <div className="studio-top-actions">
          <button
            type="button"
            className="btn-studio-preset"
            onClick={() => setIsTemplateModalOpen(true)}
          >
            <span>Load Template</span>
          </button>
        </div>
      </div>

      {/* Step Navigation Tabs */}
      <div className="studio-step-tabs-bar">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStudioStep === step.id;
          const isDone = currentStepIndex > idx;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStudioStep(step.id)}
              className={`step-tab-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
            >
              <div className="step-tab-icon-wrap">
                <Icon size={16} />
              </div>
              <div className="step-tab-text">
                <span className="step-tab-label">{step.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Active Step Content */}
      <div className="studio-content-body">
        {renderActiveStep()}
      </div>

      {/* Step Footer Navigation */}
      <div className="studio-footer-bar">
        <div>
          {currentStepIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="btn-footer-prev"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="btn-footer-export"
          >
            <span>Export SDK</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="btn-footer-next"
          >
            <span>{currentStepIndex === STEPS.length - 1 ? 'Launch Live Preview 🚀' : 'Next Step'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Modals */}
      <ExportModal />
      <TemplateModal />
    </div>
  );
}
