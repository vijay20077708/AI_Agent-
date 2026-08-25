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
  Hotel,
  Plane,
  GraduationCap,
  Code2,
  Stethoscope,
  BookOpenCheck,
  TrendingUp
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

  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(null);
  const fileInputRef = useRef(null);

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
    e.preventDefault();
    confetti({
      particleCount: 75,
      spread: 70,
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
    <div className="create-agent-view">
      <div className="create-agent-container">
        {/* Top Header */}
        <div className="create-form-nav">
          <button
            type="button"
            onClick={() => setCurrentView('agent-hub')}
            className="btn-back-hub"
          >
            <ArrowLeft size={16} />
            <span>Back to Agent Options</span>
          </button>
          <div className="badge-creation-mode">
            <Sparkles size={13} className="text-purple-600" />
            <span>Custom Agent Builder</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="agent-creation-form-card">
          <div className="form-card-title-section">
            <h2 className="form-heading-title">Create Custom AI Agent</h2>
            <p className="form-heading-sub">
              Fill in the details below. Once created, the <strong>Side Preview Tab</strong> will open to test real-time voice conversation.
            </p>
          </div>

          {/* Section 1: Agent Name & Role */}
          <div className="form-block-section">
            <h3 className="block-title">1. Agent Name & Role</h3>
            <div className="form-row-grid-2">
              <div className="form-input-group">
                <label className="form-field-label">
                  Agent Name <span className="text-purple-600">*</span>
                </label>
                <input
                  type="text"
                  className="aurqo-input-field"
                  value={agentConfig.name}
                  onChange={(e) => updateAgentField('name', e.target.value)}
                  placeholder="e.g. Apex Medical Scholar, DevPulse Pro"
                  required
                />
              </div>

              <div className="form-input-group">
                <label className="form-field-label">
                  Agent Role / Purpose <span className="text-purple-600">*</span>
                </label>
                <input
                  type="text"
                  className="aurqo-input-field"
                  value={agentConfig.role}
                  onChange={(e) => updateAgentField('role', e.target.value)}
                  placeholder="e.g. Senior Medical Consultant, Travel Guide Specialist"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Domain Choosing */}
          <div className="form-block-section">
            <div className="flex-between mb-1">
              <h3 className="block-title mb-0">2. Domain Choosing</h3>
              <span className="badge-mini-count">{DOMAINS.length} Domains Available</span>
            </div>
            <p className="block-sub-desc">
              Choose the domain to configure reasoning instructions and starter discovery questions.
            </p>

            <div className="domains-cards-selection-grid">
              {DOMAINS.map((domain) => {
                const Icon = ICON_MAP[domain.icon] || Sparkles;
                const isSelected = agentConfig.domain === domain.id;

                return (
                  <div
                    key={domain.id}
                    onClick={() => selectDomain(domain.id)}
                    className={`domain-select-item ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="domain-item-top">
                      <div className="domain-item-icon">
                        <Icon size={18} />
                      </div>
                      {isSelected && (
                        <div className="domain-item-check">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                    <h4 className="domain-item-title">{domain.name}</h4>
                    <p className="domain-item-desc">{domain.description}</p>
                    <span className="domain-item-tag">{domain.tag}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Communication & Interaction Mode (Requested Feature!) */}
          <div className="form-block-section mode-section-highlight">
            <div className="flex-between mb-1">
              <div className="flex items-center gap-3">
                <div className="mode-icon-box">
                  <Sparkles size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="block-title mb-0">3. Customer Interaction Mode</h3>
                  <p className="block-sub-desc mb-0">
                    Choose how customers interact with your agent (Text only, Both voice & text, or Voice only).
                  </p>
                </div>
              </div>
              <span className="badge-mini-count">3 Interaction Modes</span>
            </div>

            <div className="interaction-mode-grid mt-4">
              {/* Option 1: Text Only */}
              <div
                className={`mode-choice-card ${agentConfig.interactionMode === 'text-only' ? 'selected' : ''}`}
                onClick={() => updateAgentField('interactionMode', 'text-only')}
              >
                <div className="mode-choice-top">
                  <div className="mode-choice-icon-wrap text-blue-500">
                    <span className="text-2xl">💬</span>
                  </div>
                  {agentConfig.interactionMode === 'text-only' && (
                    <div className="mode-selected-badge">
                      <Check size={12} />
                      <span>Active</span>
                    </div>
                  )}
                </div>
                <h4 className="mode-choice-title">1. Text Message Only</h4>
                <p className="mode-choice-desc">
                  Customer interacts strictly via text typing. Agent replies with fast, visible text without voice audio.
                </p>
                <span className="mode-feature-pill">Mic Disabled • Silent Responses</span>
              </div>

              {/* Option 2: Both Text & Voice */}
              <div
                className={`mode-choice-card ${agentConfig.interactionMode === 'both' ? 'selected' : ''}`}
                onClick={() => updateAgentField('interactionMode', 'both')}
              >
                <div className="mode-choice-top">
                  <div className="mode-choice-icon-wrap text-purple-600">
                    <span className="text-2xl">🎙️💬</span>
                  </div>
                  <span className="mode-recommended-tag">Recommended</span>
                </div>
                <h4 className="mode-choice-title">2. Both Voice & Text Hybrid</h4>
                <p className="mode-choice-desc">
                  Customer can talk with voice or type text. Agent speaks replies aloud AND displays visible text messages.
                </p>
                <span className="mode-feature-pill">Voice Speech + Visible Text Chat</span>
              </div>

              {/* Option 3: Voice Only */}
              <div
                className={`mode-choice-card ${agentConfig.interactionMode === 'voice-only' ? 'selected' : ''}`}
                onClick={() => updateAgentField('interactionMode', 'voice-only')}
              >
                <div className="mode-choice-top">
                  <div className="mode-choice-icon-wrap text-emerald-500">
                    <span className="text-2xl">🎙️</span>
                  </div>
                  {agentConfig.interactionMode === 'voice-only' && (
                    <div className="mode-selected-badge">
                      <Check size={12} />
                      <span>Active</span>
                    </div>
                  )}
                </div>
                <h4 className="mode-choice-title">3. Voice Only (Call Mode)</h4>
                <p className="mode-choice-desc">
                  Hands-free conversational call stream. Customer speaks via microphone, agent responds directly with voice audio.
                </p>
                <span className="mode-feature-pill">Real-time Voice Stage • Hands-free</span>
              </div>
            </div>
          </div>

          {/* Section 4: Tools Access */}
          <div className="form-block-section">
            <h3 className="block-title">4. Tools Access & Capabilities</h3>
            <p className="block-sub-desc">
              Enable real-time tools for search, calculations, and illustrations.
            </p>

            <div className="tools-selection-grid">
              <div
                className={`tool-option-card ${agentConfig.tools.webSearch ? 'enabled' : ''}`}
                onClick={() => toggleTool('webSearch')}
              >
                <div className="flex items-center gap-3">
                  <div className="tool-card-icon">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h5 className="tool-card-name">Live Web Search</h5>
                    <p className="tool-card-desc">Query live internet & latest knowledge</p>
                  </div>
                </div>
                <div className={`aurqo-toggle ${agentConfig.tools.webSearch ? 'on' : ''}`}>
                  <div className="toggle-thumb" />
                </div>
              </div>

              <div
                className={`tool-option-card ${agentConfig.tools.codeInterpreter ? 'enabled' : ''}`}
                onClick={() => toggleTool('codeInterpreter')}
              >
                <div className="flex items-center gap-3">
                  <div className="tool-card-icon">
                    <Terminal size={18} />
                  </div>
                  <div>
                    <h5 className="tool-card-name">Code Interpreter</h5>
                    <p className="tool-card-desc">Run Python algorithms & calculations</p>
                  </div>
                </div>
                <div className={`aurqo-toggle ${agentConfig.tools.codeInterpreter ? 'on' : ''}`}>
                  <div className="toggle-thumb" />
                </div>
              </div>

              <div
                className={`tool-option-card ${agentConfig.tools.imageGen ? 'enabled' : ''}`}
                onClick={() => toggleTool('imageGen')}
              >
                <div className="flex items-center gap-3">
                  <div className="tool-card-icon">
                    <Image size={18} />
                  </div>
                  <div>
                    <h5 className="tool-card-name">Image Generator</h5>
                    <p className="tool-card-desc">Create illustrations and visual diagrams</p>
                  </div>
                </div>
                <div className={`aurqo-toggle ${agentConfig.tools.imageGen ? 'on' : ''}`}>
                  <div className="toggle-thumb" />
                </div>
              </div>

              <div
                className={`tool-option-card ${agentConfig.tools.knowledgeSearch ? 'enabled' : ''}`}
                onClick={() => toggleTool('knowledgeSearch')}
              >
                <div className="flex items-center gap-3">
                  <div className="tool-card-icon">
                    <Database size={18} />
                  </div>
                  <div>
                    <h5 className="tool-card-name">Knowledge Search</h5>
                    <p className="tool-card-desc">Context retrieval across uploaded files</p>
                  </div>
                </div>
                <div className={`aurqo-toggle ${agentConfig.tools.knowledgeSearch ? 'on' : ''}`}>
                  <div className="toggle-thumb" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Upload Files (Optional) */}
          <div className="form-block-section">
            <div className="flex-between mb-1">
              <h3 className="block-title mb-0">5. Upload Files (Knowledge Base)</h3>
              <span className="badge-optional">Optional</span>
            </div>
            <p className="block-sub-desc">
              Upload PDF, DOCX, Code, or CSV files to ground your agent in specific documents.
            </p>

            <div
              className={`dropzone-aurqo ${isDragOver ? 'drag-active' : ''}`}
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
              <div className="dropzone-icon-circle">
                <UploadCloud size={24} className="text-purple-600" />
              </div>
              <p className="dropzone-text-primary">Click to upload or drag & drop files</p>
              <p className="dropzone-text-secondary">PDF, DOCX, CSV, TXT, Code files (Up to 30MB)</p>
            </div>

            {agentConfig.files.length > 0 && (
              <div className="uploaded-files-chips-row">
                {agentConfig.files.map((file) => (
                  <div key={file.id} className="file-chip-badge">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-purple-600" />
                      <span className="file-name-text">{file.name}</span>
                      <span className="file-size-text">({file.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="btn-remove-file"
                      title="Remove file"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Memory Saving (Requested Feature!) */}
          <div className="form-block-section memory-section-highlight">
            <div className="flex-between">
              <div className="flex items-center gap-3">
                <div className="memory-icon-box">
                  <BrainCircuit size={22} className="text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="memory-title">6. Memory Saving & Long-Term Context</h4>
                    <span className="memory-active-tag">Persistent Vector Memory</span>
                  </div>
                  <p className="memory-desc">
                    Allows the agent to remember facts, conversation history, user preferences, and previous sessions across inquiries.
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

          {/* Section 7: Voice Persona & Speech Model (5 Voices: Male & Female) */}
          <div className={`form-block-section voice-section-highlight ${agentConfig.interactionMode === 'text-only' ? 'opacity-60' : ''}`}>
            <div className="flex-between mb-1">
              <div className="flex items-center gap-3">
                <div className="voice-icon-box">
                  <Volume2 size={22} className="text-purple-600" />
                </div>
                <div>
                  <h4 className="block-title mb-0">7. Voice Persona & Speech Output</h4>
                  <p className="block-sub-desc mb-0">
                    {agentConfig.interactionMode === 'text-only'
                      ? 'Note: Text-Only mode selected. Voice is optional/inactive.'
                      : 'Choose from 5 distinct male & female voices. Agent will speak replies out loud.'}
                  </p>
                </div>
              </div>
              <span className="badge-mini-count">5 Voices Available</span>
            </div>

            <div className="voice-selection-cards-grid mt-4">
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
                    className={`voice-choice-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="voice-choice-top">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{persona.avatar}</span>
                        <div>
                          <h5 className="voice-choice-name">{persona.name}</h5>
                          <span className={`voice-gender-pill ${persona.gender.toLowerCase().includes('female') ? 'female' : 'male'}`}>
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
                        className={`btn-test-voice-audio ${isPlaying ? 'playing' : ''}`}
                        title="Click to test sample voice"
                      >
                        {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                        <span>{isPlaying ? 'Playing...' : 'Test Voice'}</span>
                      </button>
                    </div>

                    <p className="voice-choice-desc">{persona.desc}</p>
                    <span className="voice-choice-tone">{persona.tone}</span>

                    {isSelected && (
                      <div className="voice-selected-check-badge">
                        <Check size={12} />
                        <span>Active Voice</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="form-submit-action-row">
            <button type="submit" className="btn-create-agent-submit">
              <span>Create Agent & Open Side Preview</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
