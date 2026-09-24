import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import { AgentAvatar } from '../agent/AgentAvatar';
import {
  ArrowLeft,
  Bot,
  Trash2,
  Search,
  Clock,
  Play,
  Plus,
  Volume2,
  Wrench,
  Users,
  Key,
  X,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

export function HistoryView() {
  const {
    agentHistory,
    launchHistoryAgent,
    removeAgentFromHistory,
    clearAgentHistory,
    setCurrentView
  } = useAgent();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'created' | 'chosen'

  // Generate API Key Modal State
  const [apiKeyModalAgent, setApiKeyModalAgent] = useState(null);
  const [agentApiKeys, setAgentApiKeys] = useState({});
  const [copiedKey, setCopiedKey] = useState(false);

  const handleOpenApiKeyModal = (agent) => {
    if (!agentApiKeys[agent.id]) {
      const randHex = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 6);
      const agentSlug = (agent.name || 'agent').toLowerCase().replace(/[^a-z0-9]+/g, '_');
      setAgentApiKeys((prev) => ({
        ...prev,
        [agent.id]: `thk_live_${agentSlug}_${randHex}`
      }));
    }
    setApiKeyModalAgent(agent);
    setCopiedKey(false);
  };

  const handleCloseApiKeyModal = () => {
    setApiKeyModalAgent(null);
    setCopiedKey(false);
  };

  const handleCopyApiKey = (keyToCopy) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(keyToCopy);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleRegenerateApiKey = (agentId, agentName) => {
    const randHex = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 6);
    const agentSlug = (agentName || 'agent').toLowerCase().replace(/[^a-z0-9]+/g, '_');
    setAgentApiKeys((prev) => ({
      ...prev,
      [agentId]: `thk_live_${agentSlug}_${randHex}`
    }));
    setCopiedKey(false);
  };

  const filteredAgents = agentHistory.filter((agent) => {
    const matchesType = filterType === 'all' || agent.type === filterType;
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.role && agent.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (agent.domain && agent.domain.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleLaunch = (agent) => {
    launchHistoryAgent(agent);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your agent history?')) {
      clearAgentHistory();
    }
  };

  const formatLaunchTime = (isoString) => {
    if (!isoString) return 'Recently';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMinutes = Math.floor((now - date) / (1000 * 60));
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes} mins ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours} hours ago`;
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <div className="ecosystem-view-page">
      <div className="ecosystem-view-header">
        <div>
          <div className="mb-2.5">
            <button
              type="button"
              onClick={() => setCurrentView('agent-hub')}
              className="btn-back-hub"
              title="Back to Agent Main Page"
            >
              <ArrowLeft size={15} />
              <span>Back to Main Page</span>
            </button>
          </div>
          <h2 className="eco-title">My Agent History</h2>
          <p className="eco-sub">
            All the AI agents you have created or chosen and launched are saved here. Click any agent to instantly resume your session.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('agent-hub')}
            className="btn-create-history-shortcut"
          >
            <Plus size={15} />
            <span>Launch New Agent</span>
          </button>

          {agentHistory.length > 0 && (
            <button onClick={handleClear} className="btn-clear-history">
              <Trash2 size={15} />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="history-filter-bar">
        <div className="history-search-input-wrap">
          <Search size={16} className="search-icon-inside" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search launched agents by name, role or domain..."
            className="history-search-input"
          />
        </div>

        <div className="history-pills-filter">
          {[
            { id: 'all', label: `All Agents (${agentHistory.length})` },
            { id: 'created', label: 'Custom Created' },
            { id: 'chosen', label: 'Chosen Templates' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`history-filter-pill ${filterType === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Agent History Grid */}
      <div className="agent-history-cards-grid">
        {filteredAgents.length === 0 ? (
          <div className="history-empty-state">
            <div className="empty-history-icon-box">
              <Bot size={44} className="text-purple-500" />
            </div>
            <h4>No agents found in history</h4>
            <p>
              {searchTerm
                ? `No agents match "${searchTerm}". Try another search term.`
                : 'Agents you create or choose and launch will appear here.'}
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setCurrentView('create-agent')}
                className="btn-empty-action create-btn"
              >
                <Wrench size={14} />
                <span>Create Custom Agent</span>
              </button>
              <button
                onClick={() => setCurrentView('choose-agent')}
                className="btn-empty-action choose-btn"
              >
                <Users size={14} />
                <span>Choose Template Agent</span>
              </button>
            </div>
          </div>
        ) : (
          filteredAgents.map((agent) => {
            const isCreated = agent.type === 'created';
            return (
              <div key={agent.id} className="history-agent-card animated-card-glow">
                <div className="history-agent-top">
                  <div
                    className="history-agent-avatar"
                    style={{ background: agent.avatarBg || 'linear-gradient(135deg, #6366F1, #4F46E5)' }}
                  >
                    <AgentAvatar avatar={agent.avatar} domain={agent.domain} size={22} />
                  </div>

                  <div className="history-agent-badges">
                    <span className={`history-origin-pill ${isCreated ? 'created-pill' : 'chosen-pill'}`}>
                      {isCreated ? 'Created' : 'Template'}
                    </span>
                    <span className="history-domain-tag">
                      {agent.domain ? agent.domain.toUpperCase() : 'GENERAL'}
                    </span>
                  </div>
                </div>

                <div className="history-agent-details">
                  <h3 className="history-agent-name">{agent.name}</h3>
                  <p className="history-agent-role">{agent.role}</p>

                  <div className="history-agent-meta-row">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <Volume2 size={13} className="text-blue-500" />
                      <span>{agent.voiceName || agent.voiceId || 'Shimmer'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={12} />
                      <span>{formatLaunchTime(agent.launchedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="history-agent-footer">
                  <div className="history-agent-footer-top">
                    <button
                      onClick={() => handleLaunch(agent)}
                      className="btn-launch-history-agent"
                      title={`Open ${agent.name}`}
                    >
                      <Play size={13} />
                      <span>Launch & Chat</span>
                    </button>

                    <button
                      onClick={() => removeAgentFromHistory(agent.id)}
                      className="btn-remove-history-agent"
                      title="Remove from history"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenApiKeyModal(agent)}
                    className="btn-history-apikey"
                    title={`Generate API Key for ${agent.name}`}
                  >
                    <Key size={13} className="api-key-btn-icon" />
                    <span>Generate API Key</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Generate API Key Modal Popup */}
      {apiKeyModalAgent && (
        <div className="modal-backdrop-overlay" onClick={handleCloseApiKeyModal}>
          <div
            className="api-key-modal-card animate-modalZoom"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="api-key-modal-header">
              <div className="api-key-modal-title-wrap">
                <div className="api-key-icon-badge">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="api-key-modal-title">Generate API Key</h3>
                  <p className="api-key-modal-subtitle">
                    API access credentials for <strong>{apiKeyModalAgent.name}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={handleCloseApiKeyModal}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="api-key-modal-body">
              {/* Agent Card Summary */}
              <div className="api-key-agent-summary">
                <div
                  className="api-key-agent-avatar-box"
                  style={{ background: apiKeyModalAgent.avatarBg || 'linear-gradient(135deg, #6366F1, #4F46E5)' }}
                >
                  <AgentAvatar avatar={apiKeyModalAgent.avatar} domain={apiKeyModalAgent.domain} size={22} />
                </div>
                <div className="api-key-agent-info">
                  <div className="api-key-agent-title-row">
                    <span className="api-key-agent-name">{apiKeyModalAgent.name}</span>
                    <span className={`agent-domain-pill ${apiKeyModalAgent.domain || 'custom'}`}>
                      {(apiKeyModalAgent.domain || 'GENERAL').toUpperCase()}
                    </span>
                  </div>
                  <p className="api-key-agent-desc">{apiKeyModalAgent.role}</p>
                </div>
              </div>

              {/* API Key Box */}
              <div className="api-key-box-section">
                <div className="api-key-label-row">
                  <label className="api-key-label">Secret API Key</label>
                  <span className="api-key-live-pill">Active</span>
                </div>
                <div className="api-key-input-row">
                  <input
                    type="text"
                    readOnly
                    value={
                      agentApiKeys[apiKeyModalAgent.id] ||
                      `thk_live_${(apiKeyModalAgent.name || 'agent').toLowerCase().replace(/[^a-z0-9]+/g, '_')}_default`
                    }
                    className="api-key-display-input font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyApiKey(
                        agentApiKeys[apiKeyModalAgent.id] ||
                          `thk_live_${(apiKeyModalAgent.name || 'agent').toLowerCase().replace(/[^a-z0-9]+/g, '_')}_default`
                      )
                    }
                    className={`btn-api-key-copy ${copiedKey ? 'copied' : ''}`}
                    title="Copy API Key"
                  >
                    {copiedKey ? (
                      <>
                        <Check size={14} className="text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="api-key-hint-note">
                  Anyone can use this secret key to query this agent via REST API or LiveKit WebRTC SDK.
                </p>
              </div>

              {/* API Endpoint Preview */}
              <div className="api-key-endpoint-box">
                <label className="api-key-label">REST API Endpoint</label>
                <div className="api-key-endpoint-display font-mono">
                  <span className="endpoint-method">POST</span>
                  <span className="endpoint-url">
                    https://api.thamili.ai/v1/agents/{(apiKeyModalAgent.name || 'agent').toLowerCase().replace(/[^a-z0-9]+/g, '-')}/chat
                  </span>
                </div>
              </div>

              {/* Placeholder Notice for Future Details */}
              <div className="api-key-placeholder-box">
                <div className="api-key-placeholder-icon">
                  <ShieldCheck size={18} />
                </div>
                <div className="api-key-placeholder-text">
                  <div className="api-key-placeholder-heading">Custom Details Placeholder</div>
                  <p>
                    Ungalukku intha pop-up la enna details (rate limits, webhooks, authentication scopes, allowed domains) venumo atha solrappo inge easily add seithu kollalaam.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="api-key-modal-footer">
              <button
                type="button"
                onClick={() => handleRegenerateApiKey(apiKeyModalAgent.id, apiKeyModalAgent.name)}
                className="btn-api-key-regen"
              >
                <RefreshCw size={14} />
                <span>Regenerate Key</span>
              </button>
              <button
                type="button"
                onClick={handleCloseApiKeyModal}
                className="btn-api-key-done"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
