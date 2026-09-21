import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import {
  Layers,
  FileText,
  Mic,
  Globe,
  FileEdit,
  Database,
  Languages,
  Code2,
  Image,
  ArrowRight,
  CheckCircle2,
  Zap,
  Bot
} from 'lucide-react';

const ECOSYSTEM_TOOLS = [
  {
    id: 'pdf-analyzer',
    name: 'PDF & Document Analyzer',
    icon: FileText,
    badge: 'Vision & OCR',
    color: '#8B5CF6',
    desc: 'Extract structured tables, key takeaways, and answer questions across lengthy PDF documents & research papers.',
    action: 'Analyze Document'
  },
  {
    id: 'voice-transcriber',
    name: 'Neural Voice Transcriber',
    icon: Mic,
    badge: 'Whisper v3',
    color: '#10B981',
    desc: 'Ultra-accurate speech-to-text transcription with speaker diarization, punctuation, and multilingual translation.',
    action: 'Transcribe Audio'
  },
  {
    id: 'web-scraper',
    name: 'Live Web Scraping & Synthesis',
    icon: Globe,
    badge: 'Live Data',
    color: '#3B82F6',
    desc: 'Crawl dynamic websites, extract clean markdown data, and summarize web pages in real-time.',
    action: 'Scrape & Synthesize'
  },
  {
    id: 'prompt-optimizer',
    name: 'System Prompt Optimizer',
    icon: FileEdit,
    badge: 'AI Refiner',
    color: '#EC4899',
    desc: 'Transform simple ideas into bulletproof few-shot system prompts with chain-of-thought and guardrails.',
    action: 'Optimize Prompt'
  },
  {
    id: 'sql-builder',
    name: 'SQL Query & Schema Builder',
    icon: Database,
    badge: 'Database AI',
    color: '#F59E0B',
    desc: 'Convert plain English questions into optimized SQL queries, indexes, and database schema migrations.',
    action: 'Build Query'
  },
  {
    id: 'translation-matrix',
    name: 'Universal Translation Matrix',
    icon: Languages,
    badge: 'Tamil / Multilingual',
    color: '#06B6D4',
    desc: 'Culturally nuanced, context-aware translations between Tamil (தமிழ்), Hindi, English, and 40+ global languages.',
    action: 'Translate Text'
  }
];

export function MoreToolsView() {
  const { setCurrentView } = useAgent();
  const [activeTool, setActiveTool] = useState(null);
  const [toolInput, setToolInput] = useState('');
  const [toolResult, setToolResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLaunchTool = (tool) => {
    setActiveTool(tool);
    setToolInput('');
    setToolResult('');
  };

  const handleExecuteTool = (e) => {
    e.preventDefault();
    if (!toolInput.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (activeTool?.id === 'pdf-analyzer') {
        setToolResult(`[PDF Analysis Complete] Processed 1 document. Found 3 key sections, 4 action items, and extracted summary with 99.4% confidence.`);
      } else if (activeTool?.id === 'translation-matrix') {
        setToolResult(`[Tamil / English Translation] தமிழ் விளக்கம்: "${toolInput}" என்ற உரை வெற்றிகரமாக மொழிபெயர்க்கப்பட்டது.`);
      } else {
        setToolResult(`[${activeTool?.name} Execution Output] Processed query: "${toolInput}". Tool workflow executed successfully.`);
      }
    }, 600);
  };

  return (
    <div className="ecosystem-view-page">
      <div className="ecosystem-view-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="eco-badge-tag">AI Productivity Suite</span>
          </div>
          <h2 className="eco-title">⚡ More AI Tools & Utilities</h2>
          <p className="eco-sub">
            Specialized multi-modal tools to analyze documents, transcribe speech, scrape data, and optimize prompts.
          </p>
        </div>

        <button onClick={() => setCurrentView('agent-hub')} className="btn-eco-agent-cta">
          <Bot size={16} />
          <span>Launch AI Agent Studio</span>
        </button>
      </div>

      {/* Active Tool Interactive Panel */}
      {activeTool ? (
        <div className="active-tool-runner-card mb-6">
          <div className="flex-between mb-3">
            <div className="flex items-center gap-3">
              <div className="tool-runner-icon" style={{ backgroundColor: `${activeTool.color}20`, color: activeTool.color }}>
                <activeTool.icon size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{activeTool.name}</h3>
                <span className="text-xs text-gray-500">{activeTool.badge}</span>
              </div>
            </div>
            <button onClick={() => setActiveTool(null)} className="btn-close-tool">
              Back to Tools Grid
            </button>
          </div>

          <form onSubmit={handleExecuteTool} className="mt-4">
            <label className="form-field-label">Enter Input for {activeTool.name}:</label>
            <textarea
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value)}
              placeholder={`Provide text, URL, query, or prompt for ${activeTool.name}...`}
              rows={3}
              className="aurqo-input-field mb-3"
            />
            <button type="submit" disabled={!toolInput.trim() || isProcessing} className="btn-create-agent-submit">
              <Zap size={16} />
              <span>{isProcessing ? 'Processing Tool Pipeline...' : `Execute ${activeTool.name}`}</span>
            </button>
          </form>

          {toolResult && (
            <div className="tool-result-box mt-4">
              <h5 className="result-heading">
                <CheckCircle2 size={15} className="text-emerald-500 inline mr-1" />
                Pipeline Output:
              </h5>
              <p className="result-text">{toolResult}</p>
            </div>
          )}
        </div>
      ) : null}

      {/* Tools Grid */}
      <div className="more-tools-grid">
        {ECOSYSTEM_TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <div key={tool.id} className="eco-tool-card" onClick={() => handleLaunchTool(tool)}>
              <div className="tool-card-top-row">
                <div className="eco-tool-icon-circle" style={{ backgroundColor: `${tool.color}18`, color: tool.color }}>
                  <Icon size={22} />
                </div>
                <span className="eco-tool-badge" style={{ color: tool.color, backgroundColor: `${tool.color}15` }}>
                  {tool.badge}
                </span>
              </div>

              <h4 className="eco-tool-name">{tool.name}</h4>
              <p className="eco-tool-desc">{tool.desc}</p>

              <div className="eco-tool-footer">
                <span className="tool-cta-label" style={{ color: tool.color }}>
                  {tool.action}
                </span>
                <ArrowRight size={15} style={{ color: tool.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
