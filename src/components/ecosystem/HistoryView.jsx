import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import {
  History,
  MessageSquare,
  Bot,
  Code2,
  Image,
  Video,
  GraduationCap,
  Trash2,
  RotateCcw,
  Search,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';

const INITIAL_HISTORY = [
  {
    id: 'h-1',
    type: 'agent',
    title: 'Grand Aurora Hotel Concierge Session',
    subtitle: 'Discussed check-in times, penthouse suite booking, and airport shuttle reservation.',
    time: '10 mins ago',
    date: 'Today',
    icon: Bot,
    color: '#10B981'
  },
  {
    id: 'h-2',
    type: 'chat',
    title: 'Multi-Model Comparative Reasoning',
    subtitle: 'Compared LiveKit WebRTC architecture vs traditional WebSocket audio streaming.',
    time: '2 hours ago',
    date: 'Today',
    icon: MessageSquare,
    color: '#6366F1'
  },
  {
    id: 'h-3',
    type: 'code',
    title: 'FastAPI Voice WebSocket Server Implementation',
    subtitle: 'Generated clean async Python endpoint with Opus codec and Silero VAD turn detection.',
    time: 'Yesterday',
    date: 'Yesterday',
    icon: Code2,
    color: '#06B6D4'
  },
  {
    id: 'h-4',
    type: 'agent',
    title: 'VoyageAI Bali 5-Day Itinerary Plan',
    subtitle: 'Curated day-by-day travel plan with Ubud villas, Nusa Penida trek, and budget breakdown.',
    time: 'Aug 23, 2026',
    date: 'This Week',
    icon: Bot,
    color: '#3B82F6'
  },
  {
    id: 'h-5',
    type: 'image',
    title: 'Cyberpunk Holographic AI Orb Avatar',
    subtitle: 'Generated 4K photorealistic neon purple and cyan 3D glowing sphere concept.',
    time: 'Aug 22, 2026',
    date: 'This Week',
    icon: Image,
    color: '#EC4899'
  }
];

export function HistoryView() {
  const { setCurrentView } = useAgent();
  const [historyItems, setHistoryItems] = useState(INITIAL_HISTORY);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = historyItems.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDelete = (id) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all conversation history?')) {
      setHistoryItems([]);
    }
  };

  return (
    <div className="ecosystem-view-page">
      <div className="ecosystem-view-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="eco-badge-tag">Sessions & Logs</span>
          </div>
          <h2 className="eco-title">🕒 Conversation & Execution History</h2>
          <p className="eco-sub">
            Review past agent conversations, code generation sessions, voice interactions, and generated assets.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button onClick={handleClearAll} className="btn-clear-history">
            <Trash2 size={15} />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="history-filter-bar">
        <div className="history-search-input-wrap">
          <Search size={16} className="search-icon-inside" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search past conversations, agents, or prompts..."
            className="history-search-input"
          />
        </div>

        <div className="history-pills-filter">
          {['all', 'agent', 'chat', 'code', 'image'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`history-filter-pill ${filterType === t ? 'active' : ''}`}
            >
              {t === 'all' ? 'All Sessions' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      <div className="history-items-container">
        {filteredHistory.length === 0 ? (
          <div className="history-empty-state">
            <Clock size={40} className="text-gray-400 mb-2" />
            <h4>No session history found</h4>
            <p>Your previous conversations and agent interactions will appear here.</p>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="history-item-row">
                <div className="history-item-left">
                  <div className="history-type-icon" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="history-item-title">{item.title}</h4>
                    <p className="history-item-sub">{item.subtitle}</p>
                    <span className="history-item-timestamp">{item.time}</span>
                  </div>
                </div>

                <div className="history-item-actions">
                  <button
                    onClick={() => setCurrentView('agent-hub')}
                    className="btn-resume-session"
                    title="Resume Session"
                  >
                    <RotateCcw size={14} />
                    <span>Open</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-delete-history-item"
                    title="Remove item"
                  >
                    <Trash2 size={14} />
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
