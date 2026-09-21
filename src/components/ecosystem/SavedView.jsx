import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import {
  Bookmark,
  Bot,
  Code2,
  FileText,
  Trash2,
  ExternalLink,
  Plus,
  Check
} from 'lucide-react';

const INITIAL_SAVED = [
  {
    id: 's-1',
    category: 'agent',
    title: 'Grand Aurora Luxury Concierge',
    subtitle: 'Hotel front desk AI assistant with Voice Response and Persistent Memory enabled.',
    tags: ['Hospitality', 'Shimmer Voice', 'Active Memory'],
    date: 'Saved Aug 24, 2026'
  },
  {
    id: 's-2',
    category: 'prompt',
    title: 'Socratic Step-by-Step STEM Tutoring Template',
    subtitle: 'Guiding students through complex physics and math problems without revealing direct answers.',
    tags: ['Education', 'Socratic', 'STEM'],
    date: 'Saved Aug 23, 2026'
  },
  {
    id: 's-3',
    category: 'code',
    title: 'LiveKit WebRTC Low-Latency Voice Engine',
    subtitle: 'Production React hook with Silero VAD turn detection and Opus audio channel.',
    tags: ['TypeScript', 'WebRTC', 'FastAPI'],
    date: 'Saved Aug 22, 2026'
  },
  {
    id: 's-4',
    category: 'agent',
    title: 'VoyageAI Global Adventure Travel Planner',
    subtitle: 'Personalized travel planner with live fare scanner and custom day-by-day itineraries.',
    tags: ['Travel', 'Nova Voice', 'Tour Guide'],
    date: 'Saved Aug 20, 2026'
  }
];

export function SavedView() {
  const { setCurrentView } = useAgent();
  const [savedItems, setSavedItems] = useState(INITIAL_SAVED);
  const [activeTab, setActiveTab] = useState('all');

  const filteredItems = savedItems.filter(
    item => activeTab === 'all' || item.category === activeTab
  );

  const handleRemove = (id) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="ecosystem-view-page">
      <div className="ecosystem-view-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="eco-badge-tag">Favorites & Bookmarks</span>
          </div>
          <h2 className="eco-title">Saved Agents, Prompts & Snippets</h2>
          <p className="eco-sub">
            Quickly access your pinned domain agents, favorite system prompts, and bookmarked code snippets.
          </p>
        </div>

        <button onClick={() => setCurrentView('create-agent')} className="btn-eco-agent-cta">
          <Plus size={16} />
          <span>Create New Agent</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="saved-tabs-row mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`saved-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
        >
          All Saved ({savedItems.length})
        </button>
        <button
          onClick={() => setActiveTab('agent')}
          className={`saved-tab-btn ${activeTab === 'agent' ? 'active' : ''}`}
        >
          Agents ({savedItems.filter(i => i.category === 'agent').length})
        </button>
        <button
          onClick={() => setActiveTab('prompt')}
          className={`saved-tab-btn ${activeTab === 'prompt' ? 'active' : ''}`}
        >
          Prompts ({savedItems.filter(i => i.category === 'prompt').length})
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`saved-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
        >
          Code Snippets ({savedItems.filter(i => i.category === 'code').length})
        </button>
      </div>

      {/* Saved Items Grid */}
      <div className="saved-items-grid">
        {filteredItems.length === 0 ? (
          <div className="history-empty-state">
            <Bookmark size={40} className="text-gray-400 mb-2" />
            <h4>No saved items in this category</h4>
            <p>Bookmark agents, prompts, or snippets to save them here for quick access.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="saved-card-item">
              <div className="saved-card-top">
                <div className="flex items-center gap-2">
                  <Bookmark size={16} className="text-amber-500 fill-amber-500" />
                  <span className="saved-category-tag">{item.category.toUpperCase()}</span>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="btn-remove-saved"
                  title="Remove from saved"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h4 className="saved-item-title">{item.title}</h4>
              <p className="saved-item-desc">{item.subtitle}</p>

              <div className="saved-tags-row">
                {item.tags.map((t, idx) => (
                  <span key={idx} className="saved-mini-tag">{t}</span>
                ))}
              </div>

              <div className="saved-card-footer">
                <span className="saved-date">{item.date}</span>
                <button
                  onClick={() => setCurrentView('agent-hub')}
                  className="btn-open-saved"
                >
                  <span>Launch</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
