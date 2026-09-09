import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import {
  Bot,
  Trash2,
  Search,
  Clock,
  Play,
  Plus,
  Volume2,
  Wrench,
  Users
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
          <div className="flex items-center gap-2 mb-1">
            <span className="eco-badge-tag">
              <Clock size={12} className="text-purple-600" />
              Agent Launch Log
            </span>
          </div>
          <h2 className="eco-title">🕒 My Agent History</h2>
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
                    <span>{agent.avatar || '🤖'}</span>
                  </div>

                  <div className="history-agent-badges">
                    <span className={`history-origin-pill ${isCreated ? 'created-pill' : 'chosen-pill'}`}>
                      {isCreated ? '✨ Created' : '⚡ Chosen'}
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
                  <button
                    onClick={() => handleLaunch(agent)}
                    className="btn-launch-history-agent"
                    title={`Open ${agent.name}`}
                  >
                    <Play size={14} />
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
