import React, { useRef, useState } from 'react';
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
  SlidersHorizontal,
  Eye,
  CheckCircle2
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
  // View mode: 'stepped' (focus on one step) | 'all' (all 3 steps visible)
  const [viewMode, setViewMode] = useState('stepped');

  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(null);
  const fileInputRef = useRef(null);

  const currentDomainObj = DOMAINS.find((d) => d.id === agentConfig.domain) || DOMAINS[0];
  const currentVoiceObj = VOICE_PERSONAS.find((v) => v.id === (agentConfig.voiceId || 'shimmer')) || VOICE_PERSONAS[0];
  const activeToolsCount = Object.values(agentConfig.tools || {}).filter(Boolean).length;

  // Handle Domain Selection without overwriting user-given Name and Role
  const handleDomainSelect = (domainId) => {
    // If user has entered a name or role, preserve them
    const keepName = Boolean(agentConfig.name && agentConfig.name.trim());
    const keepRole = Boolean(agentConfig.role && agentConfig.role.trim());

    selectDomain(domainId, {
      keepName,
      keepRole
    });
  };

  // Option to explicitly apply the domain's default name and role if the user wishes
  const handleApplyDomainDefaults = () => {
    if (!currentDomainObj) return;
    updateAgentField('name', currentDomainObj.defaultName);
    updateAgentField('role', currentDomainObj.defaultRole);
    setHasCustomName(true);
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

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!agentConfig.name || !agentConfig.name.trim()) {
      setActiveStep(1);
      alert('Please enter an Agent Name in Step 1.');
      return;
    }
    if (!agentConfig.role || !agentConfig.role.trim()) {
      setActiveStep(1);
      alert('Please enter an Agent Role / Purpose in Step 1.');
      return;
    }
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

  const isStep1Complete = Boolean(agentConfig.name?.trim() && agentConfig.role?.trim());
  const isStep2Complete = Boolean(agentConfig.interactionMode && agentConfig.voiceId);
  const isStep3Complete = true; // optional tools/files

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
            {/* View Mode Switcher: Stepped vs All */}
            <div className="studio-view-toggle">
              <button
                type="button"
                onClick={() => setViewMode('stepped')}
                className={`view-toggle-btn ${viewMode === 'stepped' ? 'active' : ''}`}
                title="Step-by-Step Focus Mode"
              >
                <SlidersHorizontal size={13} />
                <span>Stepped Studio</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`view-toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
                title="View All Sections on One Page"
              >
                <Eye size={13} />
                <span>All Sections</span>
              </button>
            </div>

            <div className="badge-creation-mode">
              <Sparkles size={13} className="text-purple-600" />
              <span>AI Agent Studio</span>
            </div>
          </div>
        </div>

        {/* Page Main Headline */}
        <div className="studio-header-card">
          <div className="studio-header-info">
            <h1 className="studio-title">Create Custom AI Agent</h1>
            <p className="studio-subtitle">
              Configure your agent’s identity, conversational style, intelligence tools, and custom knowledge.
            </p>
          </div>

          {/* Stepper Navigation Pills */}
          <div className="studio-stepper-bar">
            <button
              type="button"
              className={`studio-step-tab ${activeStep === 1 ? 'active' : ''} ${isStep1Complete ? 'completed' : ''}`}
              onClick={() => {
                setActiveStep(1);
                if (viewMode === 'all') {
                  document.getElementById('studio-section-identity')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <div className="step-tab-number">
                {isStep1Complete ? <Check size={12} strokeWidth={3} /> : '1'}
              </div>
              <div className="step-tab-text">
                <span className="step-label">Step 1</span>
                <span className="step-name">Identity & Domain</span>
              </div>
            </button>

            <div className="step-divider-line" />

            <button
              type="button"
              className={`studio-step-tab ${activeStep === 2 ? 'active' : ''} ${isStep2Complete ? 'completed' : ''}`}
              onClick={() => {
                setActiveStep(2);
                if (viewMode === 'all') {
                  document.getElementById('studio-section-voice')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <div className="step-tab-number">
                {isStep2Complete ? <Check size={12} strokeWidth={3} /> : '2'}
              </div>
              <div className="step-tab-text">
                <span className="step-label">Step 2</span>
                <span className="step-name">Voice & Interaction</span>
              </div>
            </button>

            <div className="step-divider-line" />

            <button
              type="button"
              className={`studio-step-tab ${activeStep === 3 ? 'active' : ''} ${isStep3Complete ? 'completed' : ''}`}
              onClick={() => {
                setActiveStep(3);
                if (viewMode === 'all') {
                  document.getElementById('studio-section-tools')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <div className="step-tab-number">
                {isStep3Complete ? <Check size={12} strokeWidth={3} /> : '3'}
              </div>
              <div className="step-tab-text">
                <span className="step-label">Step 3</span>
                <span className="step-name">Tools & Knowledge</span>
              </div>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Studio Layout */}
        <div className="create-agent-studio-layout">
          {/* LEFT COLUMN: Clean, Spacious Form Sections */}
          <form onSubmit={handleSubmit} className="studio-form-column">
            {/* ========================================================
                SECTION 1: Identity & Domain Expertise
               ======================================================== */}
            {(viewMode === 'all' || activeStep === 1) && (
              <div id="studio-section-identity" className="studio-section-card">
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
                      Define the custom name, role, and domain for your AI assistant. Changing domain will preserve your custom name & role.
                    </p>
                  </div>
                </div>

                {/* Name & Role Inputs */}
                <div className="studio-inputs-grid">
                  <div className="form-input-group">
                    <div className="flex items-center justify-between mb-1">
                      <label className="form-field-label">
                        Agent Name <span className="text-purple-600">*</span>
                      </label>
                      {agentConfig.name && (
                        <span className="badge-name-preserved">
                          <CheckCircle2 size={11} />
                          <span>Custom Name Saved</span>
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      className="aurqo-input-field"
                      value={agentConfig.name}
                      onChange={(e) => {
                        updateAgentField('name', e.target.value);
                        setHasCustomName(true);
                      }}
                      placeholder="e.g. Socrates STEM Tutor, Grand Azure Concierge"
                      required
                    />
                    {currentDomainObj && agentConfig.name !== currentDomainObj.defaultName && (
                      <div className="domain-name-suggest-row">
                        <button
                          type="button"
                          className="btn-suggest-domain-name"
                          onClick={handleApplyDomainDefaults}
                          title={`Click if you want to use the default name: ${currentDomainObj.defaultName}`}
                        >
                          <Sparkles size={12} />
                          <span>Suggest for {currentDomainObj.name}: <strong>{currentDomainObj.defaultName}</strong></span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="form-input-group">
                    <label className="form-field-label">
                      Agent Role / Specialty Purpose <span className="text-purple-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="aurqo-input-field"
                      value={agentConfig.role}
                      onChange={(e) => {
                        updateAgentField('role', e.target.value);
                        setHasCustomName(true);
                      }}
                      placeholder="e.g. Interactive Educational Companion & STEM Tutor"
                      required
                    />
                  </div>
                </div>

                {/* Domain Selector Grid */}
                <div className="studio-sub-block mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="studio-sub-title">Select Domain Expertise</h3>
                      <p className="studio-sub-desc">
                        Configures domain instructions and discovery questions without altering your custom name.
                      </p>
                    </div>
                    <span className="badge-count-pill">{DOMAINS.length} Domains</span>
                  </div>

                  <div className="domains-modern-grid">
                    {DOMAINS.map((domain) => {
                      const Icon = ICON_MAP[domain.icon] || Sparkles;
                      const isSelected = agentConfig.domain === domain.id;

                      return (
                        <div
                          key={domain.id}
                          onClick={() => handleDomainSelect(domain.id)}
                          className={`domain-modern-card ${isSelected ? 'selected' : ''}`}
                        >
                          <div className="domain-card-head">
                            <div className="domain-card-icon-wrap" style={{ color: domain.color }}>
                              <Icon size={20} />
                            </div>
                            {isSelected && (
                              <div className="domain-card-selected-check">
                                <Check size={12} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <h4 className="domain-card-name">{domain.name}</h4>
                          <p className="domain-card-desc">{domain.description}</p>
                          <span className="domain-card-tag">{domain.tag}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stepper Navigation Actions */}
                {viewMode === 'stepped' && (
                  <div className="studio-step-footer">
                    <div className="flex items-center gap-2 text-xs text-sub font-medium">
                      <span>Step 1 of 3</span>
                    </div>
                    <button
                      type="button"
                      className="btn-studio-next"
                      onClick={() => {
                        if (!isStep1Complete) {
                          alert('Please enter Agent Name and Role before proceeding.');
                          return;
                        }
                        setActiveStep(2);
                      }}
                    >
                      <span>Next: Voice & Interaction</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================
                SECTION 2: Customer Interaction Mode & Voice Persona
               ======================================================== */}
            {(viewMode === 'all' || activeStep === 2) && (
              <div id="studio-section-voice" className="studio-section-card">
                <div className="studio-section-header">
                  <div className="studio-icon-circle text-blue-600">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h2 className="studio-section-title">2. Customer Interaction Mode & Voice</h2>
                    <p className="studio-section-desc">
                      Choose how users communicate with this agent and select the neural voice persona.
                    </p>
                  </div>
                </div>

                {/* Interaction Mode Choice Cards */}
                <div className="studio-sub-block">
                  <h3 className="studio-sub-title">Customer Interaction Mode</h3>
                  <div className="mode-modern-grid">
                    {/* Hybrid Both */}
                    <div
                      className={`mode-modern-card ${agentConfig.interactionMode === 'both' ? 'selected' : ''}`}
                      onClick={() => updateAgentField('interactionMode', 'both')}
                    >
                      <div className="mode-card-top">
                        <span className="mode-card-emoji">🎙️💬</span>
                        <span className="badge-recommended">Recommended</span>
                      </div>
                      <h4 className="mode-card-title">Both Voice & Text</h4>
                      <p className="mode-card-desc">
                        Conversational speech aloud with simultaneous live text messages.
                      </p>
                      <div className="mode-card-pill">Spoken Voice + Visual Chat</div>
                    </div>

                    {/* Text Only */}
                    <div
                      className={`mode-modern-card ${agentConfig.interactionMode === 'text-only' ? 'selected' : ''}`}
                      onClick={() => updateAgentField('interactionMode', 'text-only')}
                    >
                      <div className="mode-card-top">
                        <span className="mode-card-emoji">💬</span>
                        {agentConfig.interactionMode === 'text-only' && (
                          <div className="mode-card-selected-check">
                            <Check size={12} />
                          </div>
                        )}
                      </div>
                      <h4 className="mode-card-title">Text Message Only</h4>
                      <p className="mode-card-desc">
                        Fast, silent messaging for customers who prefer typed text without speech.
                      </p>
                      <div className="mode-card-pill">Silent Responses • No Mic</div>
                    </div>

                    {/* Voice Only */}
                    <div
                      className={`mode-modern-card ${agentConfig.interactionMode === 'voice-only' ? 'selected' : ''}`}
                      onClick={() => updateAgentField('interactionMode', 'voice-only')}
                    >
                      <div className="mode-card-top">
                        <span className="mode-card-emoji">🎙️</span>
                        {agentConfig.interactionMode === 'voice-only' && (
                          <div className="mode-card-selected-check">
                            <Check size={12} />
                          </div>
                        )}
                      </div>
                      <h4 className="mode-card-title">Voice Only (Call Stage)</h4>
                      <p className="mode-card-desc">
                        Hands-free audio phone-call style conversational stream.
                      </p>
                      <div className="mode-card-pill">Real-time Audio Call</div>
                    </div>
                  </div>
                </div>

                {/* Voice Persona Selection */}
                <div className="studio-sub-block mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="studio-sub-title">Neural Voice Persona</h3>
                      <p className="studio-sub-desc">
                        High-quality human-like voices with instant sample audio preview.
                      </p>
                    </div>
                    <span className="badge-count-pill">{VOICE_PERSONAS.length} Voices</span>
                  </div>

                  {agentConfig.interactionMode === 'text-only' && (
                    <div className="text-only-hint-banner mb-3">
                      💬 Note: Text-Only mode is active. Voice is muted during text chat but can be activated anytime.
                    </div>
                  )}

                  <div className="voices-modern-grid">
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
                          className={`voice-modern-card ${isSelected ? 'selected' : ''}`}
                        >
                          <div className="voice-card-top">
                            <div className="flex items-center gap-2.5">
                              <span className="voice-avatar-emoji">{persona.avatar}</span>
                              <div>
                                <h4 className="voice-name">{persona.name}</h4>
                                <span className={`voice-gender-tag ${persona.gender.toLowerCase().includes('female') ? 'female' : 'male'}`}>
                                  {persona.gender}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTestVoice(persona);
                              }}
                              className={`btn-voice-preview ${isPlaying ? 'playing' : ''}`}
                              title="Listen to sample voice"
                            >
                              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                              <span>{isPlaying ? 'Playing' : 'Preview'}</span>
                            </button>
                          </div>

                          <p className="voice-desc">{persona.desc}</p>
                          <span className="voice-tone-pill">{persona.tone}</span>

                          {isSelected && (
                            <div className="voice-card-active-check">
                              <Check size={12} />
                              <span>Active Voice</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stepper Navigation Actions */}
                {viewMode === 'stepped' && (
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
                      onClick={() => setActiveStep(3)}
                    >
                      <span>Next: Tools & Knowledge</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================
                SECTION 3: Tools, Knowledge Files & Memory
               ======================================================== */}
            {(viewMode === 'all' || activeStep === 3) && (
              <div id="studio-section-tools" className="studio-section-card">
                <div className="studio-section-header">
                  <div className="studio-icon-circle text-emerald-600">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <h2 className="studio-section-title">3. Intelligence Tools & Knowledge Base</h2>
                    <p className="studio-section-desc">
                      Equip your agent with real-time web search, code execution, knowledge files, and memory.
                    </p>
                  </div>
                </div>

                {/* Autonomous Tools 2x2 Grid */}
                <div className="studio-sub-block">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="studio-sub-title">Autonomous Capabilities & Tools</h3>
                    <span className="badge-count-pill">{activeToolsCount} of 4 Active</span>
                  </div>

                  <div className="tools-modern-grid">
                    {/* Tool 1: Web Search */}
                    <div
                      className={`tool-modern-card ${agentConfig.tools?.webSearch ? 'active' : ''}`}
                      onClick={() => toggleTool('webSearch')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="tool-modern-icon text-blue-500">
                          <Globe size={18} />
                        </div>
                        <div>
                          <h4 className="tool-modern-title">Live Web Search</h4>
                          <p className="tool-modern-desc">Live internet queries & latest data</p>
                        </div>
                      </div>
                      <div className={`aurqo-toggle ${agentConfig.tools?.webSearch ? 'on' : ''}`}>
                        <div className="toggle-thumb" />
                      </div>
                    </div>

                    {/* Tool 2: Code Interpreter */}
                    <div
                      className={`tool-modern-card ${agentConfig.tools?.codeInterpreter ? 'active' : ''}`}
                      onClick={() => toggleTool('codeInterpreter')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="tool-modern-icon text-purple-600">
                          <Terminal size={18} />
                        </div>
                        <div>
                          <h4 className="tool-modern-title">Code Interpreter</h4>
                          <p className="tool-modern-desc">Python math, logic & algorithm solver</p>
                        </div>
                      </div>
                      <div className={`aurqo-toggle ${agentConfig.tools?.codeInterpreter ? 'on' : ''}`}>
                        <div className="toggle-thumb" />
                      </div>
                    </div>

                    {/* Tool 3: Image Generator */}
                    <div
                      className={`tool-modern-card ${agentConfig.tools?.imageGen ? 'active' : ''}`}
                      onClick={() => toggleTool('imageGen')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="tool-modern-icon text-pink-500">
                          <Image size={18} />
                        </div>
                        <div>
                          <h4 className="tool-modern-title">Image Generator</h4>
                          <p className="tool-modern-desc">Generates visual diagrams & graphics</p>
                        </div>
                      </div>
                      <div className={`aurqo-toggle ${agentConfig.tools?.imageGen ? 'on' : ''}`}>
                        <div className="toggle-thumb" />
                      </div>
                    </div>

                    {/* Tool 4: Knowledge Search */}
                    <div
                      className={`tool-modern-card ${agentConfig.tools?.knowledgeSearch ? 'active' : ''}`}
                      onClick={() => toggleTool('knowledgeSearch')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="tool-modern-icon text-emerald-500">
                          <Database size={18} />
                        </div>
                        <div>
                          <h4 className="tool-modern-title">Knowledge Search</h4>
                          <p className="tool-modern-desc">RAG retrieval across uploaded docs</p>
                        </div>
                      </div>
                      <div className={`aurqo-toggle ${agentConfig.tools?.knowledgeSearch ? 'on' : ''}`}>
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
                    className={`dropzone-modern ${isDragOver ? 'drag-active' : ''}`}
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
                    <div className="dropzone-modern-icon">
                      <UploadCloud size={24} className="text-purple-600" />
                    </div>
                    <p className="dropzone-title">Click to upload or drag & drop files here</p>
                    <p className="dropzone-subtitle">PDF, DOCX, CSV, TXT, Code files (Up to 30MB)</p>
                  </div>

                  {agentConfig.files?.length > 0 && (
                    <div className="uploaded-chips-container mt-3">
                      {agentConfig.files.map((file) => (
                        <div key={file.id} className="file-chip-card">
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
                  <div className="memory-feature-box">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="memory-icon-wrap text-purple-600">
                          <BrainCircuit size={20} />
                        </div>
                        <div>
                          <h4 className="memory-title">Cross-Session Vector Memory</h4>
                          <p className="memory-desc">
                            Enables the agent to remember customer facts, preferences, and conversations across sessions.
                          </p>
                        </div>
                      </div>
                      <div
                        className={`aurqo-toggle ${agentConfig.memorySaving ? 'on' : ''}`}
                        onClick={() => updateAgentField('memorySaving', !agentConfig.memorySaving)}
                      >
                        <div className="toggle-thumb" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stepper Navigation Actions */}
                <div className="studio-step-footer">
                  {viewMode === 'stepped' && (
                    <button
                      type="button"
                      className="btn-studio-back"
                      onClick={() => setActiveStep(2)}
                    >
                      <ArrowLeft size={16} />
                      <span>Back to Step 2</span>
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-studio-launch"
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
            <div className="sticky-preview-card">
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
                      React.createElement(ICON_MAP[currentDomainObj.icon], { size: 26 })
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
                  <div className="flex items-center gap-2">
                    <Volume2 size={14} className="text-purple-600" />
                    <span className="spec-label">Voice:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="spec-value">
                      {currentVoiceObj.avatar} {currentVoiceObj.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTestVoice(currentVoiceObj)}
                      className="btn-preview-mini-audio"
                      title="Test Audio"
                    >
                      {isPlayingAudio === currentVoiceObj.id ? <Pause size={10} /> : <Play size={10} />}
                    </button>
                  </div>
                </div>

                {/* Capabilities Tools */}
                <div className="preview-spec-item">
                  <div className="flex items-center gap-2">
                    <Wrench size={14} className="text-blue-600" />
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
                  <div className="flex items-center gap-2">
                    <Database size={14} className="text-emerald-600" />
                    <span className="spec-label">Knowledge:</span>
                  </div>
                  <span className="spec-value">
                    {agentConfig.files?.length || 0} Files Attached
                  </span>
                </div>

                {/* Vector Memory */}
                <div className="preview-spec-item">
                  <div className="flex items-center gap-2">
                    <BrainCircuit size={14} className="text-amber-500" />
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
                  Hello! I am <strong>{agentConfig.name || 'your agent'}</strong>, your {agentConfig.role || 'assistant'}. I am ready to guide you in {currentDomainObj.name}!
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
