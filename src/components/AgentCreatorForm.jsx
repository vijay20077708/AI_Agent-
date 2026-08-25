import React, { useRef, useState } from 'react';
import { useAgent } from '../context/AgentContext';
import { DOMAINS } from '../data/domains';
import {
  GraduationCap,
  Code2,
  Stethoscope,
  BookOpenCheck,
  TrendingUp,
  Scale,
  Headphones,
  Sparkles,
  UploadCloud,
  FileText,
  Trash2,
  Globe,
  Terminal,
  Image,
  Database,
  Check,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ICON_MAP = {
  GraduationCap,
  Code2,
  Stethoscope,
  BookOpenCheck,
  TrendingUp,
  Scale,
  Headphones,
  Sparkles
};

export function AgentCreatorForm() {
  const {
    agentConfig,
    updateAgentField,
    selectDomain,
    addFiles,
    removeFile,
    launchAgent
  } = useAgent();

  const [showAdvancedPrompt, setShowAdvancedPrompt] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleLaunch = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.4 },
      colors: ['#10B981', '#059669', '#34D399', '#6EE7B7']
    });
    launchAgent();
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

  const currentDomainObj = DOMAINS.find(d => d.id === agentConfig.domain) || DOMAINS[0];

  return (
    <div className="creator-container">
      <div className="creator-card">
        {/* Form Header */}
        <div className="creator-header">
          <div className="creator-badge-mint">
            <Sparkles size={14} className="text-emerald-600" />
            <span>AI Agent Builder</span>
          </div>
          <h2 className="creator-title">Create Your Intelligent AI Agent</h2>
          <p className="creator-desc">
            Configure your agent's name, role, operating domain, and tools. Launch to test live interactive voice conversation.
          </p>
        </div>

        <form onSubmit={handleLaunch} className="creator-form-body">
          {/* Section 1: Agent Name & Role */}
          <div className="form-section-card">
            <h3 className="section-heading">1. Agent Identity & Role</h3>
            <div className="grid-2-col">
              <div className="input-group">
                <label className="input-label">
                  Agent Name <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  className="emerald-input"
                  value={agentConfig.name}
                  onChange={(e) => updateAgentField('name', e.target.value)}
                  placeholder="e.g. Socrates AI, DevPulse, Dr. Pulse"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  Agent Role / Purpose <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  className="emerald-input"
                  value={agentConfig.role}
                  onChange={(e) => updateAgentField('role', e.target.value)}
                  placeholder="e.g. Educational STEM Tutor, Senior Full-Stack Architect"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Domain Selection */}
          <div className="form-section-card">
            <div className="flex-between mb-2">
              <h3 className="section-heading mb-0">2. Select Operating Domain</h3>
              <span className="domain-count-pill">{DOMAINS.length} Domains Available</span>
            </div>
            <p className="section-subtext">
              Choose the primary domain to auto-configure reasoning logic, discovery questions, and tools.
            </p>

            <div className="domains-grid">
              {DOMAINS.map((domain) => {
                const Icon = ICON_MAP[domain.icon] || Sparkles;
                const isSelected = agentConfig.domain === domain.id;

                return (
                  <div
                    key={domain.id}
                    onClick={() => selectDomain(domain.id)}
                    className={`domain-select-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="domain-select-header">
                      <div className="domain-icon-wrapper">
                        <Icon size={18} />
                      </div>
                      {isSelected && (
                        <div className="domain-check-circle">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                    <h4 className="domain-title">{domain.name}</h4>
                    <p className="domain-text">{domain.description}</p>
                    <span className="domain-tag-pill">{domain.tag}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Files Upload (Optional RAG) */}
          <div className="form-section-card">
            <div className="flex-between mb-1">
              <h3 className="section-heading mb-0">3. Knowledge Base / Files Upload</h3>
              <span className="optional-tag">Optional</span>
            </div>
            <p className="section-subtext">
              Upload PDF, TXT, Docs, or Code files. (The agent will answer accurately even if no files are uploaded).
            </p>

            <div
              className={`dropzone-emerald ${isDragOver ? 'drag-over' : ''}`}
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
              <div className="dropzone-icon-box">
                <UploadCloud size={24} className="text-emerald-600" />
              </div>
              <p className="dropzone-main-text">Click or drag & drop documents here</p>
              <p className="dropzone-sub-text">PDF, DOCX, Markdown, Code, CSV (Max 25MB)</p>
            </div>

            {/* Uploaded files list */}
            {agentConfig.files.length > 0 && (
              <div className="uploaded-files-list">
                {agentConfig.files.map((file) => (
                  <div key={file.id} className="file-chip-item">
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-emerald-700" />
                      <span className="file-chip-name">{file.name}</span>
                      <span className="file-chip-size">({file.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="btn-file-delete"
                      title="Remove file"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Tools Access */}
          <div className="form-section-card">
            <h3 className="section-heading">4. Tools & Capabilities Access</h3>
            <p className="section-subtext">
              Enable real-time tools for your agent.
            </p>

            <div className="tools-grid-clean">
              <div
                className={`tool-clean-card ${agentConfig.tools.webSearch ? 'enabled' : ''}`}
                onClick={() => toggleTool('webSearch')}
              >
                <div className="flex items-center gap-3">
                  <div className="tool-icon-emerald">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h5 className="tool-clean-name">Live Web Search</h5>
                    <p className="tool-clean-desc">Real-time search across recent papers and internet</p>
                  </div>
                </div>
                <div className={`clean-switch ${agentConfig.tools.webSearch ? 'on' : ''}`}>
                  <div className="switch-dot" />
                </div>
              </div>

              <div
                className={`tool-clean-card ${agentConfig.tools.codeInterpreter ? 'enabled' : ''}`}
                onClick={() => toggleTool('codeInterpreter')}
              >
                <div className="flex items-center gap-3">
                  <div className="tool-icon-emerald">
                    <Terminal size={18} />
                  </div>
                  <div>
                    <h5 className="tool-clean-name">Code Interpreter</h5>
                    <p className="tool-clean-desc">Execute Python algorithms and math calculations</p>
                  </div>
                </div>
                <div className={`clean-switch ${agentConfig.tools.codeInterpreter ? 'on' : ''}`}>
                  <div className="switch-dot" />
                </div>
              </div>

              <div
                className={`tool-clean-card ${agentConfig.tools.imageGen ? 'enabled' : ''}`}
                onClick={() => toggleTool('imageGen')}
              >
                <div className="flex items-center gap-3">
                  <div className="tool-icon-emerald">
                    <Image size={18} />
                  </div>
                  <div>
                    <h5 className="tool-clean-name">Image Generator</h5>
                    <p className="tool-clean-desc">Create illustrations, diagrams, and visual aids</p>
                  </div>
                </div>
                <div className={`clean-switch ${agentConfig.tools.imageGen ? 'on' : ''}`}>
                  <div className="switch-dot" />
                </div>
              </div>

              <div
                className={`tool-clean-card ${agentConfig.tools.knowledgeSearch ? 'enabled' : ''}`}
                onClick={() => toggleTool('knowledgeSearch')}
              >
                <div className="flex items-center gap-3">
                  <div className="tool-icon-emerald">
                    <Database size={18} />
                  </div>
                  <div>
                    <h5 className="tool-clean-name">Knowledge Search</h5>
                    <p className="tool-clean-desc">Retrieve context from uploaded files and guidelines</p>
                  </div>
                </div>
                <div className={`clean-switch ${agentConfig.tools.knowledgeSearch ? 'on' : ''}`}>
                  <div className="switch-dot" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Advanced Instructions (Collapsible) */}
          <div className="form-section-card">
            <button
              type="button"
              onClick={() => setShowAdvancedPrompt(!showAdvancedPrompt)}
              className="btn-toggle-advanced"
            >
              <span>5. Custom Persona Instructions (Optional)</span>
              {showAdvancedPrompt ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showAdvancedPrompt && (
              <div className="mt-3">
                <textarea
                  className="emerald-textarea"
                  rows={4}
                  value={agentConfig.systemPrompt}
                  onChange={(e) => updateAgentField('systemPrompt', e.target.value)}
                  placeholder={`Optional: Override specific behaviors or instructions for ${agentConfig.name}...`}
                />
              </div>
            )}
          </div>

          {/* Launch Button */}
          <div className="creator-footer-action">
            <button type="submit" className="btn-launch-emerald">
              <span>Launch AI Agent & Live Preview</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
