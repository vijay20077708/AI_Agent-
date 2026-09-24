import React from 'react';
import { useAgent } from '../../context/AgentContext';
import {
  Globe,
  Terminal,
  Database,
  Radio,
  Image,
  Webhook,
  Layers,
  Check,
  AlertCircle,
  ExternalLink,
  CloudSun
} from 'lucide-react';

const AVAILABLE_TOOLS = [
  {
    id: 'weather',
    name: 'Live Weather & Forecast API (Open-Meteo)',
    icon: CloudSun,
    color: '#0284C7',
    badge: 'Live Meteorological Data',
    desc: 'Real-time temperature, precipitation probability, humidity, and condition forecasts for destinations worldwide.',
    recommendedFor: ['travel', 'hotel']
  },
  {
    id: 'livekit_voice',
    name: 'LiveKit Realtime Voice & Audio',
    icon: Radio,
    color: '#8B5CF6',
    badge: 'Real-Time Audio WebRTC',
    desc: 'Bi-directional low-latency voice streaming, automated interruption handling, and acoustic echo cancellation.',
    recommendedFor: ['medical', 'support', 'study']
  },
  {
    id: 'web_search',
    name: 'Live Web Search & Browsing',
    icon: Globe,
    color: '#3B82F6',
    badge: 'Live Internet',
    desc: 'Empowers agent to query live web search results, fetch latest medical journals, news, and documentation.',
    recommendedFor: ['medical', 'research', 'finance', 'code']
  },
  {
    id: 'code_interpreter',
    name: 'Python Code Sandbox & Interpreter',
    icon: Terminal,
    color: '#10B981',
    badge: 'Execution Environment',
    desc: 'Secure sandboxed Python execution for data science, plotting math charts, algorithmic simulations, and script testing.',
    recommendedFor: ['code', 'research', 'finance', 'study']
  },
  {
    id: 'rag',
    name: 'Vector Knowledge Retrieval (RAG)',
    icon: Layers,
    color: '#EC4899',
    badge: 'Hybrid Vector Search',
    desc: 'Semantic retrieval across your uploaded PDFs, textbooks, codebases, and clinical manuals with source citations.',
    recommendedFor: ['medical', 'study', 'research', 'legal', 'support']
  },
  {
    id: 'image_gen',
    name: 'AI Image Generator (Imagen / DALL-E)',
    icon: Image,
    color: '#F59E0B',
    badge: 'Multi-Modal Generation',
    desc: 'Enables agent to generate diagrams, charts, medical illustrations, or creative assets directly in the conversation.',
    recommendedFor: ['study', 'custom']
  },
  {
    id: 'database',
    name: 'SQL & Enterprise Database Connector',
    icon: Database,
    color: '#6366F1',
    badge: 'PostgreSQL / MySQL / Snowflake',
    desc: 'Secure read/write queries to relational data stores with automatic SQL validation and schema introspection.',
    recommendedFor: ['finance', 'code']
  },
  {
    id: 'webhook',
    name: 'Custom REST API & Webhook Dispatcher',
    icon: Webhook,
    color: '#06B6D4',
    badge: 'Custom API Endpoint',
    desc: 'Call external backend APIs, Zapier/n8n workflows, CRM databases, or hospital HL7/FHIR systems.',
    recommendedFor: ['support', 'code', 'custom']
  }
];

export function ToolsConfig() {
  const { agentConfig, updateConfig } = useAgent();

  const toggleTool = (toolId) => {
    updateConfig('tools', {
      ...agentConfig.tools,
      [toolId]: !agentConfig.tools[toolId]
    });
  };

  return (
    <div className="studio-step-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="step-number">04</span>
          <div>
            <h3 className="section-title">Tools, Integrations & Capabilities</h3>
            <p className="section-subtitle">
              Equip your agent with real-time abilities: Web search, Python code sandbox, LiveKit WebRTC voice streaming, and databases.
            </p>
          </div>
        </div>
      </div>

      <div className="tools-cards-container">
        {AVAILABLE_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isEnabled = !!agentConfig.tools[tool.id];
          const isRecommended = tool.recommendedFor.includes(agentConfig.domain);

          return (
            <div
              key={tool.id}
              onClick={() => toggleTool(tool.id)}
              className={`tool-item-card ${isEnabled ? 'tool-enabled' : ''}`}
            >
              <div className="tool-card-left">
                <div
                  className="tool-icon-box"
                  style={{
                    backgroundColor: isEnabled ? tool.color : 'var(--bg-card-alt)',
                    color: isEnabled ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  <Icon size={22} />
                </div>
                <div className="tool-card-info">
                  <div className="tool-name-row">
                    <h4 className="tool-title">{tool.name}</h4>
                    <span className="tool-badge-pill">{tool.badge}</span>
                    {isRecommended && (
                      <span className="tool-recommended-tag">Recommended for {agentConfig.domain}</span>
                    )}
                  </div>
                  <p className="tool-description">{tool.desc}</p>
                </div>
              </div>

              <div className="tool-card-right">
                <div className={`aurqo-switch ${isEnabled ? 'on' : 'off'}`}>
                  <div className="switch-handle" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
