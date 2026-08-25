import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import { DEFAULT_AGENTS } from '../../data/defaultAgents';
import {
  ArrowLeft,
  Hotel,
  Plane,
  GraduationCap,
  Code2,
  Stethoscope,
  TrendingUp,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Volume2,
  CheckCircle2,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ICON_MAP = {
  hotel: Hotel,
  travel: Plane,
  study: GraduationCap,
  code: Code2,
  medical: Stethoscope,
  finance: TrendingUp
};

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
    launchDefaultAgent(agent, agentNames[agent.id], chosenMode);
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
            const Icon = ICON_MAP[agent.domain] || Sparkles;

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

                {/* Preset Discovery Questions (Extended List!) */}
                <div className="preset-questions-section">
                  <div className="flex-between mb-2">
                    <h5 className="preset-questions-heading mb-0">Pre-Configured Domain Questions:</h5>
                    <span className="badge-count-questions">{agent.discoveryQuestions.length} Questions</span>
                  </div>
                  <ul className="preset-questions-list">
                    {agent.discoveryQuestions.map((q, idx) => (
                      <li key={idx} className="preset-question-item">
                        <CheckCircle2 size={13} className="text-purple-500 flex-shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
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
                  className="btn-launch-prebuilt"
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

