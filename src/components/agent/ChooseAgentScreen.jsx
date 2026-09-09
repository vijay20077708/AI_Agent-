import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import { DEFAULT_AGENTS } from '../../data/defaultAgents';
import {
  ArrowLeft,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Volume2,
  CheckCircle2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Check,
  Plus,
  Trash2,
  HelpCircle
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
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [isEditingQuestions, setIsEditingQuestions] = useState({});

  const filteredAgents = DEFAULT_AGENTS.filter(
    agent => selectedDomainFilter === 'all' || agent.domain === selectedDomainFilter
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
    launchDefaultAgent({
      ...agent,
      discoveryQuestions: currentQuestions
    }, agentNames[agent.id], chosenMode);
  };

  const handleNameChange = (agentId, newName) => {
    setAgentNames(prev => ({
      ...prev,
      [agentId]: newName
    }));
  };

  const handleModeChange = (agentId, mode) => {
    setAgentModes(prev => ({
      ...prev,
      [agentId]: mode
    }));
  };

  const toggleQuestionsDropdown = (agentId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [agentId]: !prev[agentId]
    }));
  };

  const toggleEditMode = (agentId, e) => {
    e.stopPropagation();
    setExpandedQuestions(prev => ({ ...prev, [agentId]: true }));
    setIsEditingQuestions(prev => ({
      ...prev,
      [agentId]: !prev[agentId]
    }));
  };

  const handleQuestionChange = (agentId, qIndex, newText) => {
    setAgentQuestions(prev => {
      const currentList = [...(prev[agentId] || [])];
      currentList[qIndex] = newText;
      return {
        ...prev,
        [agentId]: currentList
      };
    });
  };

  const handleAddQuestion = (agentId) => {
    setAgentQuestions(prev => {
      const currentList = [...(prev[agentId] || [])];
      currentList.push('');
      return {
        ...prev,
        [agentId]: currentList
      };
    });
    setExpandedQuestions(prev => ({ ...prev, [agentId]: true }));
    setIsEditingQuestions(prev => ({ ...prev, [agentId]: true }));
  };

  const handleDeleteQuestion = (agentId, qIndex) => {
    setAgentQuestions(prev => {
      const currentList = [...(prev[agentId] || [])];
      currentList.splice(qIndex, 1);
      return {
        ...prev,
        [agentId]: currentList
      };
    });
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
            <Sparkles size={13} className="text-purple-600" />
            <span>Pre-Built Automatic Domain Agents</span>
          </div>
        </div>

        <div className="choose-intro-header">
          <h2 className="choose-heading-title">Choose from Pre-Configured Domain Agents</h2>
          <p className="choose-heading-sub">
            Battle-tested domain agents pre-equipped with extensive domain questions, neural voice personas, and persistent memory. Customize any name and launch instantly into the <strong>Side Preview Tab</strong>.
          </p>
        </div>

        {/* Domain Filter Pills */}
        <div className="choose-filter-pills-row mb-6">
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

        {/* Pre-built Agents Grid */}
        <div className="prebuilt-agents-grid">
          {filteredAgents.map((agent) => {
            return (
              <div key={agent.id} className={`prebuilt-agent-card ${agent.domain}-theme`}>
                <div className="card-top-identity">
                  <div className="agent-avatar-circle" style={{ background: agent.avatarBg }}>
                    <span className="text-2xl">{agent.avatar}</span>
                  </div>
                  <div>
                    <span className="card-domain-badge">{agent.domain.toUpperCase()} AI AGENT</span>
                    <h3 className="card-agent-title">{agent.name}</h3>
                    <p className="card-agent-role">{agent.role}</p>
                  </div>
                </div>

                {/* Editable Name Field */}
                <div className="agent-name-edit-box">
                  <label className="name-edit-label">
                    <Edit3 size={13} />
                    <span>Customize Agent Name:</span>
                  </label>
                  <input
                    type="text"
                    className="name-edit-input"
                    value={agentNames[agent.id] || agent.name}
                    onChange={(e) => handleNameChange(agent.id, e.target.value)}
                    placeholder="Enter Custom Agent Name"
                  />
                </div>

                {/* Collapsible Questions Dropdown with Edit Option */}
                <div className="preset-questions-accordion">
                  <div
                    className="questions-accordion-header"
                    onClick={() => toggleQuestionsDropdown(agent.id)}
                  >
                    <div className="questions-header-left">
                      <HelpCircle size={15} className="text-purple-600" />
                      <span className="questions-header-title">Questions</span>
                      <span className="badge-count-questions">
                        {(agentQuestions[agent.id] || []).length}
                      </span>
                    </div>

                    <div className="questions-header-right">
                      <button
                        type="button"
                        className={`btn-toggle-edit-questions ${isEditingQuestions[agent.id] ? 'active' : ''}`}
                        onClick={(e) => toggleEditMode(agent.id, e)}
                        title={isEditingQuestions[agent.id] ? 'Save changes' : 'Edit questions'}
                      >
                        {isEditingQuestions[agent.id] ? (
                          <>
                            <Check size={12} />
                            <span>Done</span>
                          </>
                        ) : (
                          <>
                            <Edit3 size={12} />
                            <span>Edit</span>
                          </>
                        )}
                      </button>

                      <span className="questions-dropdown-chevron">
                        {expandedQuestions[agent.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedQuestions[agent.id] && (
                    <div className="questions-accordion-body">
                      {isEditingQuestions[agent.id] ? (
                        /* Edit Mode */
                        <div className="questions-edit-mode-list">
                          {(agentQuestions[agent.id] || []).map((q, qIdx) => (
                            <div key={qIdx} className="question-edit-row">
                              <span className="question-num">{qIdx + 1}.</span>
                              <input
                                type="text"
                                className="question-inline-input"
                                value={q}
                                onChange={(e) => handleQuestionChange(agent.id, qIdx, e.target.value)}
                                placeholder="Enter question..."
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteQuestion(agent.id, qIdx)}
                                className="btn-delete-question"
                                title="Delete question"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}

                          <div className="questions-edit-actions">
                            <button
                              type="button"
                              onClick={() => handleAddQuestion(agent.id)}
                              className="btn-add-question"
                            >
                              <Plus size={13} />
                              <span>Add Question</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => toggleEditMode(agent.id, e)}
                              className="btn-save-questions"
                            >
                              <Check size={13} />
                              <span>Done</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* View Mode */
                        <ul className="preset-questions-list">
                          {(agentQuestions[agent.id] || []).length === 0 ? (
                            <li className="no-questions-text">No questions configured. Click Edit to add questions.</li>
                          ) : (
                            (agentQuestions[agent.id] || []).map((q, idx) => (
                              <li key={idx} className="preset-question-item">
                                <CheckCircle2 size={13} className="text-purple-500 flex-shrink-0 mt-0.5" />
                                <span>{q}</span>
                              </li>
                            ))
                          )}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* Interaction Mode Selector for Pre-built Agent */}
                <div className="agent-mode-selector-row">
                  <span className="agent-mode-label">Interaction Mode:</span>
                  <div className="agent-mode-pills">
                    <button
                      type="button"
                      onClick={() => handleModeChange(agent.id, 'both')}
                      className={`agent-mode-pill ${(agentModes[agent.id] || 'both') === 'both' ? 'active' : ''}`}
                    >
                      🎙️💬 Both
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeChange(agent.id, 'text-only')}
                      className={`agent-mode-pill ${(agentModes[agent.id] || 'both') === 'text-only' ? 'active' : ''}`}
                    >
                      💬 Text Only
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeChange(agent.id, 'voice-only')}
                      className={`agent-mode-pill ${(agentModes[agent.id] || 'both') === 'voice-only' ? 'active' : ''}`}
                    >
                      🎙️ Voice Only
                    </button>
                  </div>
                </div>

                {/* Features Tags */}
                <div className="card-features-row">
                  <span className="feature-pill-badge">
                    <Volume2 size={11} className="inline mr-1" />
                    {(agentModes[agent.id] || 'both') === 'text-only' ? 'Text Mode (Silent)' : (agent.voiceName || 'Voice Output Active')}
                  </span>
                  <span className="feature-pill-badge">
                    <BrainCircuit size={11} className="inline mr-1" />
                    Memory Saving
                  </span>
                  <span className="feature-pill-badge">
                    {(agentModes[agent.id] || 'both') === 'text-only' ? '⚡ Instant Text' : '⚡ Real-time Speech'}
                  </span>
                </div>

                {/* Launch Button */}
                <button
                  type="button"
                  onClick={() => handleLaunch(agent)}
                  className={`btn-launch-prebuilt ${agent.domain}-launch-btn`}
                >
                  <span>Launch {agentNames[agent.id] || agent.name}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

