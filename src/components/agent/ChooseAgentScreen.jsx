import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import { DEFAULT_AGENTS } from '../../data/defaultAgents';
import {
  ArrowLeft,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Check,
  Plus,
  Trash2,
  Edit3,
  HelpCircle,
  Copy,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function ChooseAgentScreen() {
  const { launchDefaultAgent, setCurrentView } = useAgent();
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('all');
  const [agentModes, setAgentModes] = useState(
    DEFAULT_AGENTS.reduce((acc, agent) => {
      acc[agent.id] = 'both'; // default to both
      return acc;
    }, {})
  );
  const [agentNames, setAgentNames] = useState(
    DEFAULT_AGENTS.reduce((acc, agent) => {
      acc[agent.id] = agent.name;
      return acc;
    }, {})
  );
  const [agentQuestions, setAgentQuestions] = useState(
    DEFAULT_AGENTS.reduce((acc, agent) => {
      acc[agent.id] = [...(agent.discoveryQuestions || [])];
      return acc;
    }, {})
  );
  const [expandedQuestions, setExpandedQuestions] = useState({
    'hotel-staff': true // Start with first agent open for instant discovery
  });
  const [isEditingQuestions, setIsEditingQuestions] = useState({});
  const [copiedQuestion, setCopiedQuestion] = useState(null);

  const filteredAgents = DEFAULT_AGENTS.filter(
    (agent) => selectedDomainFilter === 'all' || agent.domain === selectedDomainFilter
  );

  const handleLaunch = (agent) => {
    confetti({
      particleCount: 70,
      spread: 65,
      origin: { y: 0.35 },
      colors: ['#3B82F6', '#8B5CF6', '#10B981', '#EC4899']
    });
    const chosenMode = agentModes[agent.id] || 'both';
    const currentQuestions = agentQuestions[agent.id] || agent.discoveryQuestions;
    launchDefaultAgent(
      {
        ...agent,
        discoveryQuestions: currentQuestions
      },
      agentNames[agent.id],
      chosenMode
    );
  };

  const handleNameChange = (agentId, newName) => {
    setAgentNames((prev) => ({
      ...prev,
      [agentId]: newName
    }));
  };

  const handleModeChange = (agentId, mode) => {
    setAgentModes((prev) => ({
      ...prev,
      [agentId]: mode
    }));
  };

  const toggleQuestionsDropdown = (agentId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [agentId]: !prev[agentId]
    }));
  };

  const toggleEditMode = (agentId, e) => {
    e.stopPropagation();
    setExpandedQuestions((prev) => ({ ...prev, [agentId]: true }));
    setIsEditingQuestions((prev) => ({
      ...prev,
      [agentId]: !prev[agentId]
    }));
  };

  const handleQuestionChange = (agentId, qIndex, newText) => {
    setAgentQuestions((prev) => {
      const currentList = [...(prev[agentId] || [])];
      currentList[qIndex] = newText;
      return {
        ...prev,
        [agentId]: currentList
      };
    });
  };

  const handleAddQuestion = (agentId) => {
    setAgentQuestions((prev) => {
      const currentList = [...(prev[agentId] || [])];
      currentList.push('');
      return {
        ...prev,
        [agentId]: currentList
      };
    });
    setExpandedQuestions((prev) => ({ ...prev, [agentId]: true }));
    setIsEditingQuestions((prev) => ({ ...prev, [agentId]: true }));
  };

  const handleDeleteQuestion = (agentId, qIndex) => {
    setAgentQuestions((prev) => {
      const currentList = [...(prev[agentId] || [])];
      currentList.splice(qIndex, 1);
      return {
        ...prev,
        [agentId]: currentList
      };
    });
  };

  const handleCopyQuestion = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedQuestion(`${idx}-${text.slice(0, 10)}`);
    setTimeout(() => setCopiedQuestion(null), 2000);
  };

  return (
    <div className="choose-agent-view">
      <div className="choose-agent-container">
        {/* Navigation Header */}
        <div className="choose-form-nav">
          <button
            type="button"
            onClick={() => setCurrentView('agent-hub')}
            className="btn-back-hub"
          >
            <ArrowLeft size={16} />
            <span>Back to Agent Options</span>
          </button>
          <div className="badge-choose-mode">
            <Sparkles size={14} className="text-purple-600" />
            <span>Domain Agents</span>
          </div>
        </div>

        {/* Intro Header */}
        <div className="choose-intro-header">
          <h1 className="choose-heading-title">Choose AI Agent</h1>
          <p className="choose-heading-sub">
            Select a pre-configured domain agent and launch instantly.
          </p>
        </div>

        {/* Domain Filter Pills Row */}
        <div className="choose-filter-pills-row">
          {[
            { id: 'all', label: 'All Pre-Built Agents' },
            { id: 'hotel', label: '🏨 Hospitality & Hotel' },
            { id: 'travel', label: '✈️ Travel & Tours' },
            { id: 'study', label: '🎓 STEM & Tutoring' },
            { id: 'code', label: '💻 Code & Architecture' },
            { id: 'medical', label: '🩺 Clinical Healthcare' },
            { id: 'finance', label: '📈 Finance & Markets' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDomainFilter(tab.id)}
              className={`choose-filter-pill ${selectedDomainFilter === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stack of Horizontal Pre-Built Agent Cards */}
        <div className="choose-agents-list-stack">
          {filteredAgents.map((agent, index) => {
            const indexNumber = String(index + 1).padStart(2, '0');
            const isExpanded = Boolean(expandedQuestions[agent.id]);
            const isEditing = Boolean(isEditingQuestions[agent.id]);
            const currentQuestions = agentQuestions[agent.id] || agent.discoveryQuestions || [];
            const currentMode = agentModes[agent.id] || 'both';

            return (
              <div
                key={agent.id}
                className={`choose-agent-card-item ${agent.domain}-theme-card ${isExpanded ? 'is-expanded' : ''}`}
              >
                {/* Main Horizontal Card Row */}
                <div className="agent-card-main-row">
                  {/* Left: Number + Avatar Badge */}
                  <div className="agent-card-index-avatar-wrap">
                    <div className="agent-card-index-box">
                      <span className="agent-card-index-num">{indexNumber}</span>
                      <span className="agent-card-avatar-emoji">{agent.avatar}</span>
                    </div>
                  </div>

                  {/* Middle: Agent Identity & Meta Badges */}
                  <div className="agent-card-info-col">
                    {/* Title + Domain Tag + Online Dot + Editable Agent Name */}
                    <div className="agent-card-title-row">
                      <div className="agent-name-input-box" title="Click to edit agent name">
                        <input
                          type="text"
                          className="agent-card-name-input"
                          value={agentNames[agent.id] ?? agent.name}
                          onChange={(e) => handleNameChange(agent.id, e.target.value)}
                          placeholder="Enter agent name..."
                        />
                        <Edit3 size={13} className="agent-name-pencil-icon" />
                      </div>
                      <span className={`agent-domain-pill ${agent.domain}`}>
                        {agent.domain.toUpperCase()}
                      </span>
                      <div className="agent-online-status-badge">
                        <span className="online-green-dot" />
                        <span>Online</span>
                      </div>
                    </div>

                    {/* Role Subtitle */}
                    <p className="agent-card-role-desc">{agent.role}</p>

                    {/* Metadata & Interactive Mode Selector Badges */}
                    <div className="agent-card-meta-pills-row">
                      {/* Mode Switcher Pills */}
                      <div className="agent-card-mode-pills-group">
                        <span className="meta-pill-label">Mode:</span>
                        <button
                          type="button"
                          onClick={() => handleModeChange(agent.id, 'both')}
                          className={`agent-mode-mini-pill ${currentMode === 'both' ? 'active' : ''}`}
                          title="Voice & Text Hybrid Mode"
                        >
                          🎙️💬 Hybrid
                        </button>
                        <button
                          type="button"
                          onClick={() => handleModeChange(agent.id, 'text-only')}
                          className={`agent-mode-mini-pill ${currentMode === 'text-only' ? 'active' : ''}`}
                          title="Text Message Only"
                        >
                          💬 Text
                        </button>
                        <button
                          type="button"
                          onClick={() => handleModeChange(agent.id, 'voice-only')}
                          className={`agent-mode-mini-pill ${currentMode === 'voice-only' ? 'active' : ''}`}
                          title="Voice Only Phone Call"
                        >
                          🎙️ Voice
                        </button>
                      </div>

                      {/* Voice Persona Pill */}
                      <div className="agent-card-spec-pill">
                        <Volume2 size={13} className="text-purple-600" />
                        <span>Voice: {agent.voiceName || 'Shimmer (Female)'}</span>
                      </div>

                      {/* Prompts Count Pill */}
                      <div className="agent-card-spec-pill">
                        <HelpCircle size={13} className="text-blue-600" />
                        <span>{currentQuestions.length} Prompts</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Buttons (Prompts Toggle & Launch) */}
                  <div className="agent-card-actions-col">
                    {/* Prompts Accordion Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleQuestionsDropdown(agent.id)}
                      className={`btn-agent-prompts-toggle ${isExpanded ? 'active' : ''}`}
                    >
                      <span>Prompts</span>
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>

                    {/* Primary Launch Button */}
                    <button
                      type="button"
                      onClick={() => handleLaunch(agent)}
                      className={`btn-agent-card-launch ${agent.domain}-launch-btn`}
                    >
                      <span>Launch</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>

                {/* Expanded Discovery Questions Accordion Drawer */}
                {isExpanded && (
                  <div className="agent-card-expanded-drawer animate-fadeIn">
                    {/* Drawer Header: Title & Edit Action */}
                    <div className="drawer-header-bar">
                      <div className="drawer-title-group">
                        <Sparkles size={14} className="text-purple-600" />
                        <span className="drawer-title-text">
                          PRE-CONFIGURED INQUIRY & DISCOVERY QUESTIONS ({currentQuestions.length})
                        </span>
                      </div>

                      <div className="drawer-actions-group">
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => handleAddQuestion(agent.id)}
                            className="btn-drawer-add-q"
                          >
                            <Plus size={13} />
                            <span>Add Question</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => toggleEditMode(agent.id, e)}
                          className={`btn-drawer-edit-toggle ${isEditing ? 'editing' : ''}`}
                        >
                          {isEditing ? (
                            <>
                              <Check size={13} />
                              <span>Done</span>
                            </>
                          ) : (
                            <>
                              <Edit3 size={13} />
                              <span>Edit Questions</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Drawer Content Body: Grid of Questions or Edit Form */}
                    <div className="drawer-content-body">
                      {isEditing ? (
                        /* Edit Mode */
                        <div className="drawer-edit-mode-list">
                          <div className="drawer-agent-name-edit-box">
                            <label className="drawer-name-field-label">
                              <Edit3 size={12} className="text-purple-600" />
                              <span>Custom Agent Name:</span>
                            </label>
                            <input
                              type="text"
                              className="drawer-agent-name-input"
                              value={agentNames[agent.id] ?? agent.name}
                              onChange={(e) => handleNameChange(agent.id, e.target.value)}
                              placeholder="Enter custom agent name..."
                            />
                          </div>
                          {currentQuestions.map((q, qIdx) => (
                            <div key={qIdx} className="drawer-edit-row">
                              <span className="drawer-edit-num">{String(qIdx + 1).padStart(2, '0')}.</span>
                              <input
                                type="text"
                                className="drawer-edit-input"
                                value={q}
                                onChange={(e) => handleQuestionChange(agent.id, qIdx, e.target.value)}
                                placeholder="Enter discovery question..."
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteQuestion(agent.id, qIdx)}
                                className="btn-drawer-delete-q"
                                title="Delete Question"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}

                          <div className="drawer-edit-footer">
                            <button
                              type="button"
                              onClick={() => handleAddQuestion(agent.id)}
                              className="btn-drawer-add-q-main"
                            >
                              <Plus size={14} />
                              <span>Add New Question</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => toggleEditMode(agent.id, e)}
                              className="btn-drawer-done-main"
                            >
                              <Check size={14} />
                              <span>Save Questions</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* View Mode: Clean 2/3 Column Grid of Question Cards */
                        <div className="drawer-questions-cards-grid">
                          {currentQuestions.length === 0 ? (
                            <div className="drawer-no-questions">
                              No questions configured. Click "Edit Questions" to add.
                            </div>
                          ) : (
                            currentQuestions.map((question, qIdx) => {
                              const qNum = String(qIdx + 1).padStart(2, '0');
                              const isCopied = copiedQuestion === `${qIdx}-${question.slice(0, 10)}`;

                              return (
                                <div
                                  key={qIdx}
                                  className="drawer-question-card"
                                  onClick={() => handleCopyQuestion(question, qIdx)}
                                  title="Click to copy question"
                                >
                                  <div className="drawer-q-card-head">
                                    <span className="drawer-q-num">{qNum}.</span>
                                    <button
                                      type="button"
                                      className="btn-copy-q-icon"
                                      title={isCopied ? 'Copied!' : 'Copy question'}
                                    >
                                      {isCopied ? (
                                        <Check size={12} className="text-emerald-500" />
                                      ) : (
                                        <Copy size={12} />
                                      )}
                                    </button>
                                  </div>
                                  <p className="drawer-q-text">{question}</p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
