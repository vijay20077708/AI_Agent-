import React, { useRef, useState, useEffect } from 'react';
import { useAgent } from '../../context/AgentContext';
import { DOMAINS } from '../../data/domains';
import { VOICE_PERSONAS } from '../../data/voices';
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  Trash2,
  Globe,
  Terminal,
  Image,
  Database,
  BrainCircuit,
  Volume2,
  Play,
  Pause,
  Check,
  ArrowRight,
  Sparkles,
  User,
  MessageSquare,
  Wrench,
  Hotel,
  Plane,
  GraduationCap,
  Code2,
  Stethoscope,
  BookOpenCheck,
  TrendingUp,
  Lock,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ICON_MAP = {
  Hotel,
  Plane,
  GraduationCap,
  Code2,
  Stethoscope,
  BookOpenCheck,
  TrendingUp,
  Sparkles
};

export function CreateAgentForm() {
  const {
    agentConfig,
    updateAgentField,
    selectDomain,
    addFiles,
    removeFile,
    launchCreatedAgent,
    setCurrentView
  } = useAgent();

  // Active step: 1: Identity & Domain | 2: Voice & Interaction | 3: Tools & Knowledge
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({
    1: false,
    2: false,
    3: false
  });
  const [stepWarning, setStepWarning] = useState(null);
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);

  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(null);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const currentDomainObj = DOMAINS.find((d) => d.id === agentConfig.domain) || DOMAINS[0];
  const currentVoiceObj = VOICE_PERSONAS.find((v) => v.id === (agentConfig.voiceId || 'shimmer')) || VOICE_PERSONAS[0];
  const activeToolsCount = Object.values(agentConfig.tools || {}).filter(Boolean).length;

  // Validation checks
  const isStep1Valid = Boolean(agentConfig.name?.trim() && agentConfig.role?.trim());
  const isStep2Valid = Boolean(agentConfig.interactionMode && agentConfig.voiceId);

  const isStep2Unlocked = Boolean(completedSteps[1] && isStep1Valid);
  const isStep3Unlocked = Boolean(completedSteps[2] && isStep2Unlocked);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDomainDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Domain Selection without overwriting user-given Name and Role
  const handleDomainSelect = (domainId) => {
    const keepName = Boolean(agentConfig.name && agentConfig.name.trim());
    const keepRole = Boolean(agentConfig.role && agentConfig.role.trim());

    selectDomain(domainId, {
      keepName,
      keepRole
    });
    setIsDomainDropdownOpen(false);
  };

  const handleApplyDomainDefaults = () => {
    if (!currentDomainObj) return;
    updateAgentField('name', currentDomainObj.defaultName);
    updateAgentField('role', currentDomainObj.defaultRole);
  };

  const handleTestVoice = (persona) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isPlayingAudio === persona.id) {
        setIsPlayingAudio(null);
        return;
      }
      setIsPlayingAudio(persona.id);
      const textToSpeak = persona.previewText || `Hello! I am ${persona.name}. I am ready to assist you.`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = persona.speed || 1.0;
      utterance.pitch = persona.pitch || 1.0;
      utterance.lang = persona.lang || 'en-US';

      utterance.onend = () => setIsPlayingAudio(null);
      utterance.onerror = () => setIsPlayingAudio(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Stepper Header click handler
  const handleStepClick = (targetStep) => {
    if (targetStep === activeStep) return;

    if (targetStep === 1) {
      setActiveStep(1);
      setStepWarning(null);
    } else if (targetStep === 2) {
      if (!isStep2Unlocked) {
        setStepWarning('🔒 Please complete Step 1 (Agent Name & Role) first to unlock Step 2.');
        setTimeout(() => setStepWarning(null), 3500);
        return;
      }
      setActiveStep(2);
      setStepWarning(null);
    } else if (targetStep === 3) {
      if (!isStep2Unlocked) {
        setStepWarning('🔒 Please complete Step 1 first to unlock subsequent steps.');
        setTimeout(() => setStepWarning(null), 3500);
        return;
      }
      if (!isStep3Unlocked) {
        setStepWarning('🔒 Please complete Step 2 (Voice & Interaction) first to unlock Step 3.');
        setTimeout(() => setStepWarning(null), 3500);
        return;
      }
      setActiveStep(3);
      setStepWarning(null);
    }
  };

  const handleCompleteStep1 = () => {
    if (!agentConfig.name || !agentConfig.name.trim()) {
      setStepWarning('⚠️ Please enter an Agent Name in Step 1.');
      setTimeout(() => setStepWarning(null), 3500);
      return;
    }
    if (!agentConfig.role || !agentConfig.role.trim()) {
      setStepWarning('⚠️ Please enter an Agent Role / Purpose in Step 1.');
      setTimeout(() => setStepWarning(null), 3500);
      return;
    }
    setCompletedSteps((prev) => ({ ...prev, 1: true }));
    setActiveStep(2);
    setStepWarning(null);
  };

  const handleCompleteStep2 = () => {
    if (!agentConfig.interactionMode || !agentConfig.voiceId) {
      setStepWarning('⚠️ Please choose an Interaction Mode and Voice Persona.');
      setTimeout(() => setStepWarning(null), 3500);
      return;
    }
    setCompletedSteps((prev) => ({ ...prev, 2: true }));
    setActiveStep(3);
    setStepWarning(null);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!agentConfig.name || !agentConfig.name.trim()) {
      setActiveStep(1);
      setStepWarning('Please enter an Agent Name in Step 1.');
      return;
    }
    if (!agentConfig.role || !agentConfig.role.trim()) {
      setActiveStep(1);
      setStepWarning('Please enter an Agent Role / Purpose in Step 1.');
      return;
    }
    setCompletedSteps({ 1: true, 2: true, 3: true });
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.35 },
      colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981']
    });
    launchCreatedAgent(agentConfig);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const toggleTool = (toolKey) => {
    updateAgentField('tools', {
      ...agentConfig.tools,
      [toolKey]: !agentConfig.tools[toolKey]
    });
  };

  return (
    <div className="create-agent-studio-view">
      <div className="create-agent-studio-container">
        {/* Top Header Navigation */}
        <div className="studio-top-nav">
          <button
            type="button"
            onClick={() => setCurrentView('agent-hub')}
            className="btn-back-hub"
          >
            <ArrowLeft size={16} />
            <span>Back to Agent Options</span>
          </button>

          <div className="studio-top-actions">
            <div className="badge-creation-mode">
              <Sparkles size={14} className="text-purple-600" />
              <span>AI Agent Studio</span>
            </div>
          </div>
        </div>

        {/* Page Main Headline & Stepper Bar */}
        <div className="studio-header-card">
          <div className="studio-header-info">
            <h1 className="studio-title">Create AI Agent</h1>
            <p className="studio-subtitle">
              Configure agent identity, domain expertise, interaction style, and neural voice.
            </p>
          </div>

          {/* Stepper Navigation Pills */}
          <div className="studio-stepper-bar">
            {/* Step 1 Tab */}
            <button
              type="button"
              className={`studio-step-tab ${activeStep === 1 ? 'active' : ''} ${completedSteps[1] && isStep1Valid ? 'completed' : ''}`}
              onClick={() => handleStepClick(1)}
            >
              <div className="step-tab-number">
                {completedSteps[1] && isStep1Valid ? (
                  <Check size={13} strokeWidth={3} />
                ) : (
                  '1'
                )}
              </div>
              <div className="step-tab-text">
                <span className="step-label">
                  Step 1 {completedSteps[1] && isStep1Valid ? '• Done ✓' : activeStep === 1 ? '• In Progress' : ''}
                </span>
                <span className="step-name">Identity & Domain</span>
              </div>
            </button>

            <div className={`step-divider-line ${isStep2Unlocked ? 'unlocked' : 'locked'}`} />

            {/* Step 2 Tab */}
            <button
              type="button"
              className={`studio-step-tab ${!isStep2Unlocked ? 'locked' : ''} ${activeStep === 2 ? 'active' : ''} ${completedSteps[2] && isStep2Unlocked ? 'completed' : ''}`}
              onClick={() => handleStepClick(2)}
              title={!isStep2Unlocked ? 'Locked: Finish Step 1 to unlock' : 'Step 2: Voice & Interaction'}
            >
              <div className="step-tab-number">
                {!isStep2Unlocked ? (
                  <Lock size={13} className="lock-icon" />
                ) : completedSteps[2] ? (
                  <Check size={13} strokeWidth={3} />
                ) : (
                  '2'
                )}
              </div>
              <div className="step-tab-text">
                <span className="step-label">
                  Step 2 {!isStep2Unlocked ? '• 🔒 Locked' : completedSteps[2] ? '• Done ✓' : activeStep === 2 ? '• In Progress' : ''}
                </span>
                <span className="step-name">Voice & Interaction</span>
              </div>
            </button>

            <div className={`step-divider-line ${isStep3Unlocked ? 'unlocked' : 'locked'}`} />

            {/* Step 3 Tab */}
            <button
              type="button"
              className={`studio-step-tab ${!isStep3Unlocked ? 'locked' : ''} ${activeStep === 3 ? 'active' : ''} ${completedSteps[3] && isStep3Unlocked ? 'completed' : ''}`}
              onClick={() => handleStepClick(3)}
              title={!isStep3Unlocked ? 'Locked: Finish Step 2 to unlock' : 'Step 3: Tools & Knowledge'}
            >
              <div className="step-tab-number">
                {!isStep3Unlocked ? (
                  <Lock size={13} className="lock-icon" />
                ) : completedSteps[3] ? (
                  <Check size={13} strokeWidth={3} />
                ) : (
                  '3'
                )}
              </div>
              <div className="step-tab-text">
                <span className="step-label">
                  Step 3 {!isStep3Unlocked ? '• 🔒 Locked' : completedSteps[3] ? '• Done ✓' : activeStep === 3 ? '• In Progress' : ''}
                </span>
                <span className="step-name">Tools & Knowledge</span>
              </div>
            </button>
          </div>

          {/* Locked Step Warning Toast */}
          {stepWarning && (
            <div className="studio-step-warning-toast animate-fadeIn">
              <span>{stepWarning}</span>
            </div>
          )}
        </div>

        {/* 2-Column Responsive Studio Layout */}
        <div className="create-agent-studio-layout">
          {/* LEFT COLUMN: Scrollable Form Sections */}
          <form onSubmit={handleSubmit} className="studio-form-column">
            {/* ========================================================
                SECTION 1: Identity & Domain Expertise
               ======================================================== */}
            {activeStep === 1 && (
              <div id="studio-section-identity" className="studio-section-card animate-fadeIn">
                <div className="studio-section-header">
                  <div className="studio-icon-circle text-purple-600">
                    <User size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="studio-section-title">1. Agent Identity & Domain Expertise</h2>
                      <span className="badge-required-pill">Required</span>
                    </div>
                    <p className="studio-section-desc">
                      Define name, role, and choose a domain. Custom name & role will always be preserved.
                    </p>
                  </div>
                </div>

                {/* Name & Role Inputs in 2-Col Grid */}
                <div className="studio-inputs-grid">
                  <div className="form-input-group">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="form-field-label">
                        Agent Name <span className="text-purple-600">*</span>
                      </label>
                      {agentConfig.name && (
                        <span className="badge-name-preserved">
                          <CheckCircle2 size={12} />
                          <span>Custom Saved</span>
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      className="aurqo-input-field"
                      value={agentConfig.name}
                      onChange={(e) => updateAgentField('name', e.target.value)}
                      placeholder="e.g. Grand Aurora Luxury Concierge"
                      required
                    />
                    {currentDomainObj && agentConfig.name !== currentDomainObj.defaultName && (
                      <div className="domain-name-suggest-row">
                        <button
                          type="button"
                          className="btn-suggest-domain-name"
                          onClick={handleApplyDomainDefaults}
                          title={`Click to use default: ${currentDomainObj.defaultName}`}
                        >
                          <Sparkles size={12} />
                          <span>Suggest for {currentDomainObj.name}: <strong>{currentDomainObj.defaultName}</strong></span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="form-input-group">
                    <label className="form-field-label mb-1.5 block">
                      Agent Role / Specialty Purpose <span className="text-purple-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="aurqo-input-field"
                      value={agentConfig.role}
                      onChange={(e) => updateAgentField('role', e.target.value)}
                      placeholder="e.g. Front Desk Hospitality & Guest Services Specialist"
                      required
                    />
                  </div>
                </div>

                {/* Select Domain Expertise - Dropdown with Arrow Click */}
                <div className="studio-sub-block mt-4" ref={dropdownRef}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="studio-sub-title">Select Domain Expertise</h3>
                      <p className="studio-sub-desc">
                        Configures domain knowledge model without altering your custom name.
                      </p>
                    </div>
                    <span className="badge-count-pill">{DOMAINS.length} Domains Available</span>
                  </div>

                  <div className="domain-dropdown-container relative">
                    {/* Trigger Button showing Selected Domain with Down Arrow */}
                    <button
                      type="button"
                      onClick={() => setIsDomainDropdownOpen((prev) => !prev)}
                      className={`domain-dropdown-trigger-btn ${isDomainDropdownOpen ? 'open' : ''}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="domain-dropdown-icon-wrap" style={{ color: currentDomainObj.color }}>
                          {(() => {
                            const CurrIcon = ICON_MAP[currentDomainObj.icon] || Sparkles;
                            return <CurrIcon size={20} />;
                          })()}
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="domain-dropdown-selected-name">{currentDomainObj.name}</span>
                            <span className="domain-dropdown-tag-pill">{currentDomainObj.tag}</span>
                          </div>
                          <p className="domain-dropdown-selected-desc truncate">
                            {currentDomainObj.description}
                          </p>
                        </div>
                      </div>

                      <div className="domain-dropdown-caret-box">
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 text-gray-400 ${isDomainDropdownOpen ? 'rotate-180 text-blue-600' : ''}`}
                        />
                      </div>
                    </button>

                    {/* Dropdown Menu Popup (Scrollable with all 8 domains) */}
                    {isDomainDropdownOpen && (
                      <div className="domain-dropdown-menu-list animate-fadeIn">
                        {DOMAINS.map((domain) => {
                          const Icon = ICON_MAP[domain.icon] || Sparkles;
                          const isSelected = agentConfig.domain === domain.id;

                          return (
                            <div
                              key={domain.id}
                              onClick={() => handleDomainSelect(domain.id)}
                              className={`domain-dropdown-row-item ${isSelected ? 'selected' : ''}`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="domain-dropdown-icon-wrap" style={{ color: domain.color }}>
                                  <Icon size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="domain-row-title">{domain.name}</span>
                                    <span className="domain-row-tag">{domain.tag}</span>
                                  </div>
                                  <p className="domain-row-desc truncate">{domain.description}</p>
                                </div>
                              </div>

                              {isSelected && (
                                <div className="domain-row-check">
                                  <Check size={14} strokeWidth={3} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stepper Navigation Footer */}
                <div className="studio-step-footer">
                  <div className="flex items-center gap-2 text-sm text-sub font-medium">
                    <span>Step 1 of 3</span>
                  </div>
                  <button
                    type="button"
                    className="btn-studio-next"
                    onClick={handleCompleteStep1}
                  >
                    <span>Complete Step 1 & Next: Voice</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                SECTION 2: Customer Interaction Mode & Voice Persona
               ======================================================== */}
            {activeStep === 2 && (
              <div id="studio-section-voice" className="studio-section-card animate-fadeIn">
                <div className="studio-section-header">
                  <div className="studio-icon-circle text-blue-600">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h2 className="studio-section-title">2. Customer Interaction Mode & Voice</h2>
                    <p className="studio-section-desc">
                      Choose communication mode and select neural voice persona.
                    </p>
                  </div>
                </div>

                {/* Interaction Mode Choice Cards */}
                <div className="studio-sub-block">
                  <h3 className="studio-sub-title">Customer Interaction Mode</h3>
                  <div className="mode-compact-grid">
                    {/* Both */}
                    <div
                      className={`mode-compact-card ${agentConfig.interactionMode === 'both' ? 'selected' : ''}`}
                      onClick={() => updateAgentField('interactionMode', 'both')}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="mode-emoji">🎙️💬</span>
                        <span className="badge-rec-tiny">Recommended</span>
                      </div>
                      <h4 className="mode-title-text">Both Voice & Text</h4>
                      <p className="mode-desc-text">Conversational speech with live interactive text</p>
                      <span className="mode-pill-tag">Spoken Voice + Chat</span>
                    </div>

                    {/* Text Only */}
                    <div
                      className={`mode-compact-card ${agentConfig.interactionMode === 'text-only' ? 'selected' : ''}`}
                      onClick={() => updateAgentField('interactionMode', 'text-only')}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="mode-emoji">💬</span>
                        {agentConfig.interactionMode === 'text-only' && <Check size={14} className="text-blue-600" />}
                      </div>
                      <h4 className="mode-title-text">Text Message Only</h4>
                      <p className="mode-desc-text">Fast, silent messaging without speech audio</p>
                      <span className="mode-pill-tag">Silent • No Mic</span>
                    </div>

                    {/* Voice Only */}
                    <div
                      className={`mode-compact-card ${agentConfig.interactionMode === 'voice-only' ? 'selected' : ''}`}
                      onClick={() => updateAgentField('interactionMode', 'voice-only')}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="mode-emoji">🎙️</span>
                        {agentConfig.interactionMode === 'voice-only' && <Check size={14} className="text-blue-600" />}
                      </div>
                      <h4 className="mode-title-text">Voice Only (Call)</h4>
                      <p className="mode-desc-text">Hands-free real-time audio phone-call style</p>
                      <span className="mode-pill-tag">Real-time Call</span>
                    </div>
                  </div>
                </div>

                {/* Neural Voice Persona Grid */}
                <div className="studio-sub-block mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="studio-sub-title">Neural Voice Persona</h3>
                      <p className="studio-sub-desc">
                        High-quality human-like voices with instant sample preview.
                      </p>
                    </div>
                    <span className="badge-count-pill">{VOICE_PERSONAS.length} Voices</span>
                  </div>

                  <div className="voices-compact-grid">
                    {VOICE_PERSONAS.map((persona) => {
                      const isSelected = (agentConfig.voiceId || 'shimmer') === persona.id;
                      const isPlaying = isPlayingAudio === persona.id;

                      return (
                        <div
                          key={persona.id}
                          onClick={() => {
                            updateAgentField('voiceId', persona.id);
                            updateAgentField('voiceName', `${persona.name} (${persona.gender})`);
                          }}
                          className={`voice-compact-card ${isSelected ? 'selected' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">{persona.avatar}</span>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="voice-compact-name">{persona.name}</h4>
                                  <span className={`voice-gender-pill ${persona.gender.toLowerCase().includes('female') ? 'female' : 'male'}`}>
                                    {persona.gender}
                                  </span>
                                </div>
                                <span className="voice-compact-tone">{persona.tone}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTestVoice(persona);
                                }}
                                className={`btn-voice-preview-compact ${isPlaying ? 'playing' : ''}`}
                                title="Listen to voice sample"
                              >
                                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                                <span>{isPlaying ? 'Playing' : 'Preview'}</span>
                              </button>
                              {isSelected && (
                                <div className="voice-active-check-dot" title="Active Voice">
                                  <Check size={12} strokeWidth={3} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stepper Navigation Footer */}
                <div className="studio-step-footer">
                  <button
                    type="button"
                    className="btn-studio-back"
                    onClick={() => setActiveStep(1)}
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Step 1</span>
                  </button>
                  <button
                    type="button"
                    className="btn-studio-next"
                    onClick={handleCompleteStep2}
                  >
                    <span>Complete Step 2 & Next: Tools</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                SECTION 3: Tools, Knowledge Files & Memory
               ======================================================== */}
            {activeStep === 3 && (
              <div id="studio-section-tools" className="studio-section-card animate-fadeIn">
                <div className="studio-section-header">
                  <div className="studio-icon-circle text-emerald-600">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <h2 className="studio-section-title">3. Intelligence Tools & Knowledge Base</h2>
                    <p className="studio-section-desc">
                      Equip agent with live web search, code execution, uploaded knowledge files, and memory.
                    </p>
                  </div>
                </div>

                {/* Autonomous Tools 2x2 Grid */}
                <div className="studio-sub-block">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="studio-sub-title">Autonomous Capabilities & Tools</h3>
                    <span className="badge-count-pill">{activeToolsCount} of 4 Active</span>
                  </div>

                  <div className="tools-compact-grid">
                    {/* Tool 1: Web Search */}
                    <div
                      className={`tool-compact-card ${agentConfig.tools?.webSearch ? 'active' : ''}`}
                      onClick={() => toggleTool('webSearch')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="tool-icon-box text-blue-500">
                          <Globe size={18} />
                        </div>
                        <div>
                          <h4 className="tool-card-name">Live Web Search</h4>
                          <p className="tool-card-sub">Internet queries & latest data</p>
                        </div>
                      </div>
                      <div className={`aurqo-toggle-compact ${agentConfig.tools?.webSearch ? 'on' : ''}`}>
                        <div className="toggle-thumb" />
                      </div>
                    </div>

                    {/* Tool 2: Code Interpreter */}
                    <div
                      className={`tool-compact-card ${agentConfig.tools?.codeInterpreter ? 'active' : ''}`}
                      onClick={() => toggleTool('codeInterpreter')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="tool-icon-box text-purple-600">
                          <Terminal size={18} />
                        </div>
                        <div>
                          <h4 className="tool-card-name">Code Interpreter</h4>
                          <p className="tool-card-sub">Python math & logic solver</p>
                        </div>
                      </div>
                      <div className={`aurqo-toggle-compact ${agentConfig.tools?.codeInterpreter ? 'on' : ''}`}>
                        <div className="toggle-thumb" />
                      </div>
                    </div>

                    {/* Tool 3: Image Generator */}
                    <div
                      className={`tool-compact-card ${agentConfig.tools?.imageGen ? 'active' : ''}`}
                      onClick={() => toggleTool('imageGen')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="tool-icon-box text-pink-500">
                          <Image size={18} />
                        </div>
                        <div>
                          <h4 className="tool-card-name">Image Generator</h4>
                          <p className="tool-card-sub">Visual diagrams & graphics</p>
                        </div>
                      </div>
                      <div className={`aurqo-toggle-compact ${agentConfig.tools?.imageGen ? 'on' : ''}`}>
                        <div className="toggle-thumb" />
                      </div>
                    </div>

                    {/* Tool 4: Knowledge Search */}
                    <div
                      className={`tool-compact-card ${agentConfig.tools?.knowledgeSearch ? 'active' : ''}`}
                      onClick={() => toggleTool('knowledgeSearch')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="tool-icon-box text-emerald-500">
                          <Database size={18} />
                        </div>
                        <div>
                          <h4 className="tool-card-name">Knowledge Search</h4>
                          <p className="tool-card-sub">RAG retrieval across docs</p>
                        </div>
                      </div>
                      <div className={`aurqo-toggle-compact ${agentConfig.tools?.knowledgeSearch ? 'on' : ''}`}>
                        <div className="toggle-thumb" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload Files Dropzone */}
                <div className="studio-sub-block mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="studio-sub-title">Knowledge Base Documents</h3>
                    <span className="badge-optional">Optional</span>
                  </div>

                  <div
                    className={`dropzone-compact ${isDragOver ? 'drag-active' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      multiple
                      accept=".pdf,.docx,.txt,.csv,.json,.md,.py,.js,.ts"
                      style={{ display: 'none' }}
                    />
                    <UploadCloud size={22} className="text-purple-600" />
                    <span className="dropzone-text-main">Click to upload or drag files here</span>
                    <span className="dropzone-text-sub">PDF, DOCX, CSV, TXT (Up to 30MB)</span>
                  </div>

                  {agentConfig.files?.length > 0 && (
                    <div className="uploaded-chips-container mt-2.5">
                      {agentConfig.files.map((file) => (
                        <div key={file.id} className="file-chip-compact">
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-purple-600" />
                            <span className="file-chip-name">{file.name}</span>
                            <span className="file-chip-size">({file.size})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            className="btn-file-delete"
                            title="Remove file"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cross Session Vector Memory */}
                <div className="studio-sub-block mt-4">
                  <div className="memory-feature-compact">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BrainCircuit size={20} className="text-purple-600" />
                        <div>
                          <h4 className="memory-title">Cross-Session Vector Memory</h4>
                          <p className="memory-desc">Remembers customer facts, history, and preferences across chats</p>
                        </div>
                      </div>
                      <div
                        className={`aurqo-toggle-compact ${agentConfig.memorySaving ? 'on' : ''}`}
                        onClick={() => updateAgentField('memorySaving', !agentConfig.memorySaving)}
                      >
                        <div className="toggle-thumb" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stepper Navigation Footer */}
                <div className="studio-step-footer">
                  <button
                    type="button"
                    className="btn-studio-back"
                    onClick={() => setActiveStep(2)}
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Step 2</span>
                  </button>
                  <button
                    type="submit"
                    className="btn-studio-launch"
                    onClick={() => setCompletedSteps((prev) => ({ ...prev, 3: true }))}
                  >
                    <span>Create Agent & Open Side Preview</span>
                    <Sparkles size={16} />
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* RIGHT COLUMN: Sticky Real-Time Live Agent Preview Card */}
          <div className="studio-preview-column">
            <div className="sticky-preview-card-compact">
              {/* Card Header & Live Status */}
              <div className="preview-card-top-bar">
                <div className="preview-pulse-dot" />
                <span className="preview-top-badge">Live Agent Preview</span>
              </div>

              {/* Agent Identity Showcase */}
              <div className="preview-identity-hero">
                <div className="preview-avatar-circle">
                  <span className="preview-avatar-icon">
                    {currentDomainObj?.icon && ICON_MAP[currentDomainObj.icon] ? (
                      React.createElement(ICON_MAP[currentDomainObj.icon], { size: 24 })
                    ) : (
                      '🤖'
                    )}
                  </span>
                </div>
                <h3 className="preview-agent-name">
                  {agentConfig.name?.trim() || 'Untitled Agent'}
                </h3>
                <p className="preview-agent-role">
                  {agentConfig.role?.trim() || 'Role & Purpose Pending...'}
                </p>

                <div className="preview-badges-row">
                  <span className="preview-domain-badge">
                    {currentDomainObj.name}
                  </span>
                  <span className="preview-mode-badge">
                    {agentConfig.interactionMode === 'text-only'
                      ? '💬 Text Only'
                      : agentConfig.interactionMode === 'voice-only'
                      ? '🎙️ Voice Only'
                      : '🎙️💬 Hybrid'}
                  </span>
                </div>
              </div>

              {/* Preview Details List */}
              <div className="preview-specs-box">
                {/* Voice Persona */}
                <div className="preview-spec-item">
                  <div className="flex items-center gap-1.5">
                    <Volume2 size={15} className="text-purple-600" />
                    <span className="spec-label">Voice:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="spec-value">
                      {currentVoiceObj.avatar} {currentVoiceObj.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTestVoice(currentVoiceObj)}
                      className="btn-preview-mini-audio"
                      title="Test Voice"
                    >
                      {isPlayingAudio === currentVoiceObj.id ? <Pause size={10} /> : <Play size={10} />}
                    </button>
                  </div>
                </div>

                {/* Capabilities Tools */}
                <div className="preview-spec-item">
                  <div className="flex items-center gap-1.5">
                    <Wrench size={15} className="text-blue-600" />
                    <span className="spec-label">Tools:</span>
                  </div>
                  <div className="spec-tools-chips">
                    {agentConfig.tools?.webSearch && <span className="spec-tool-pill">🌐 Search</span>}
                    {agentConfig.tools?.codeInterpreter && <span className="spec-tool-pill">💻 Code</span>}
                    {agentConfig.tools?.imageGen && <span className="spec-tool-pill">🎨 Image</span>}
                    {agentConfig.tools?.knowledgeSearch && <span className="spec-tool-pill">📚 Docs</span>}
                    {activeToolsCount === 0 && <span className="text-xs text-sub">None</span>}
                  </div>
                </div>

                {/* Knowledge Base Files */}
                <div className="preview-spec-item">
                  <div className="flex items-center gap-1.5">
                    <Database size={15} className="text-emerald-600" />
                    <span className="spec-label">Knowledge:</span>
                  </div>
                  <span className="spec-value">
                    {agentConfig.files?.length || 0} Files
                  </span>
                </div>

                {/* Vector Memory */}
                <div className="preview-spec-item">
                  <div className="flex items-center gap-1.5">
                    <BrainCircuit size={15} className="text-amber-500" />
                    <span className="spec-label">Memory:</span>
                  </div>
                  <span className="spec-value">
                    {agentConfig.memorySaving ? '🧠 Active' : 'Off'}
                  </span>
                </div>
              </div>

              {/* Sample Speech Bubble */}
              <div className="preview-speech-bubble">
                <span className="speech-quote-mark">“</span>
                <p className="speech-text">
                  Hello! I am <strong>{agentConfig.name || 'your agent'}</strong>, your {agentConfig.role || 'assistant'}. Ready to assist in {currentDomainObj.name}!
                </p>
              </div>

              {/* Launch CTA Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-preview-launch"
              >
                <span>Launch Agent Now</span>
                <Sparkles size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
