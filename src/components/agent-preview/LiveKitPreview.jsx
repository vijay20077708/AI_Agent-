import React from 'react';
import { useAgent } from '../../context/AgentContext';
import { VoiceChatEngine } from './VoiceChatEngine';
import { ChatSandbox } from './ChatSandbox';
import {
  Radio,
  MessageSquare,
  Activity,
  Code2,
  Share2,
  CheckCircle,
  Zap,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function LiveKitPreview() {
  const {
    agentConfig,
    activePreviewTab,
    setActivePreviewTab,
    setIsExportModalOpen,
    latencyMs
  } = useAgent();

  const handleQuickDeploy = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.3 }
    });
    setIsExportModalOpen(true);
  };

  const enabledToolsCount = Object.values(agentConfig.tools).filter(Boolean).length;

  return (
    <div className="livekit-preview-panel">
      {/* Top Preview Bar */}
      <div className="preview-top-bar">
        <div className="preview-mode-switch">
          <button
            type="button"
            className={`preview-tab-btn ${activePreviewTab === 'voice' ? 'active' : ''}`}
            onClick={() => setActivePreviewTab('voice')}
          >
            <Radio size={15} />
            <span>LiveKit Voice Room</span>
          </button>

          <button
            type="button"
            className={`preview-tab-btn ${activePreviewTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActivePreviewTab('chat')}
          >
            <MessageSquare size={15} />
            <span>Chat Sandbox</span>
          </button>
        </div>

        <div className="preview-quick-actions">
          <button
            type="button"
            onClick={handleQuickDeploy}
            className="btn-preview-deploy"
            title="Deploy LiveKit Agent"
          >
            <Zap size={14} />
            <span>Deploy</span>
          </button>
        </div>
      </div>

      {/* Main Preview Content Area */}
      <div className="preview-content-area">
        {activePreviewTab === 'voice' ? (
          <VoiceChatEngine />
        ) : (
          <ChatSandbox />
        )}
      </div>

      {/* Bottom Live Metrics Telemetry Bar */}
      <div className="preview-telemetry-bar">
        <div className="telemetry-item">
          <span className="telemetry-dot live" />
          <span className="telemetry-label">WebRTC:</span>
          <span className="telemetry-value">LiveKit 48kHz</span>
        </div>

        <div className="telemetry-item">
          <span className="telemetry-label">Latency:</span>
          <span className="telemetry-value font-mono">{latencyMs}ms</span>
        </div>

        <div className="telemetry-item">
          <span className="telemetry-label">Tools:</span>
          <span className="telemetry-value">{enabledToolsCount} Active</span>
        </div>

        <div className="telemetry-item">
          <span className="telemetry-label">Docs:</span>
          <span className="telemetry-value">{agentConfig.files.length} RAG</span>
        </div>
      </div>
    </div>
  );
}
