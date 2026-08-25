import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import {
  X,
  Copy,
  Check,
  Download,
  Terminal,
  Code2,
  FileCode,
  Globe,
  Radio
} from 'lucide-react';

export function ExportModal() {
  const { isExportModalOpen, setIsExportModalOpen, agentConfig } = useAgent();
  const [activeLang, setActiveLang] = useState('python'); // 'python' | 'node' | 'rest' | 'embed'
  const [copied, setCopied] = useState(false);

  if (!isExportModalOpen) return null;

  const pythonLiveKitCode = `# AURQO LiveKit Voice Agent Worker
# Domain: ${agentConfig.domain.toUpperCase()} | Model: ${agentConfig.model}
import asyncio
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, llm
from livekit.plugins import openai, silero, deepgram, rag

async def entrypoint(ctx: JobContext):
    print(f"Connecting to AURQO LiveKit Room: {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Initialize ${agentConfig.name}
    initial_ctx = llm.ChatContext().append(
        role="system",
        text="""${agentConfig.systemPrompt.replace(/"/g, '\\"')}"""
    )

    # Participant join notification
    participant = await ctx.wait_for_participant()
    print(f"Starting voice stream for participant: {participant.identity}")

    # Initialize LiveKit Multimodal Pipeline Agent
    agent = openai.multimodal.RealtimeModel(
        model="${agentConfig.model}",
        voice="${agentConfig.voice.voiceId}",
        temperature=${agentConfig.temperature},
        instructions=initial_ctx.to_prompt()
    )

    # Start conversational loop
    agent.start(ctx.room, participant)
    await agent.say("Hello! I am ${agentConfig.name} built on AURQO. How can I assist you today?", allow_interruptions=True)

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
`;

  const nodeJsCode = `// AURQO Node.js / TypeScript LiveKit Agent
import { LiveKitAgent, ToolRegistry } from '@aurqo/agent-sdk';
import { OpenAIRealtime } from '@livekit/agents-plugin-openai';

const agent = new LiveKitAgent({
  name: "${agentConfig.name}",
  domain: "${agentConfig.domain}",
  model: "${agentConfig.model}",
  systemPrompt: \`${agentConfig.systemPrompt.replace(/`/g, '\\`')}\`,
  tools: {
    webSearch: ${agentConfig.tools.web_search},
    codeInterpreter: ${agentConfig.tools.code_interpreter},
    ragKnowledgeBase: ${agentConfig.tools.rag}
  },
  voice: {
    persona: "${agentConfig.voice.voiceId}",
    speed: ${agentConfig.voice.speed},
    vadSensitivity: ${agentConfig.voice.vadSensitivity}
  }
});

agent.onConnect((session) => {
  console.log(\`Agent \${agent.name} connected to live room \${session.roomId}\`);
});

agent.start();
`;

  const restApiCode = `curl -X POST https://api.aurqo.ai/v1/agents/${agentConfig.id}/chat \\
  -H "Authorization: Bearer YOUR_AURQO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Perform clinical analysis for atypical chest pain"
      }
    ],
    "stream": true,
    "tools": {
      "web_search": ${agentConfig.tools.web_search},
      "code_sandbox": ${agentConfig.tools.code_interpreter}
    }
  }'
`;

  const embedCode = `<!-- AURQO Embeddable Voice & Chat Widget -->
<script 
  src="https://cdn.aurqo.ai/widget/v2/aurqo-agent.js" 
  data-agent-id="${agentConfig.id}" 
  data-theme="auto"
  data-voice-mode="livekit-webrtc"
  async>
</script>
`;

  const getActiveCode = () => {
    switch (activeLang) {
      case 'python': return pythonLiveKitCode;
      case 'node': return nodeJsCode;
      case 'rest': return restApiCode;
      case 'embed': return embedCode;
      default: return pythonLiveKitCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeLang === 'python' ? 'py' : activeLang === 'node' ? 'ts' : activeLang === 'rest' ? 'sh' : 'html';
    const filename = `${agentConfig.name.toLowerCase().replace(/\s+/g, '_')}_agent.${ext}`;
    const blob = new Blob([getActiveCode()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsExportModalOpen(false)}>
      <div className="modal-content export-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="modal-icon-badge">
              <Radio size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="modal-title">Deploy & Export Agent SDK</h3>
              <p className="modal-subtitle">Ready-to-deploy LiveKit WebRTC Python Worker, Node.js SDK, or REST cURL snippet.</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setIsExportModalOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="export-tabs-row">
          <button
            className={`export-tab-btn ${activeLang === 'python' ? 'active' : ''}`}
            onClick={() => setActiveLang('python')}
          >
            <FileCode size={16} />
            <span>LiveKit Python Worker (agent.py)</span>
          </button>
          <button
            className={`export-tab-btn ${activeLang === 'node' ? 'active' : ''}`}
            onClick={() => setActiveLang('node')}
          >
            <Code2 size={16} />
            <span>Node.js / TypeScript SDK</span>
          </button>
          <button
            className={`export-tab-btn ${activeLang === 'rest' ? 'active' : ''}`}
            onClick={() => setActiveLang('rest')}
          >
            <Terminal size={16} />
            <span>REST API (cURL)</span>
          </button>
          <button
            className={`export-tab-btn ${activeLang === 'embed' ? 'active' : ''}`}
            onClick={() => setActiveLang('embed')}
          >
            <Globe size={16} />
            <span>Web Embed Widget</span>
          </button>
        </div>

        {/* Code View Area */}
        <div className="code-viewer-container">
          <div className="code-viewer-header">
            <span className="code-file-name">
              {activeLang === 'python' ? 'agent_worker.py' : activeLang === 'node' ? 'agent.ts' : activeLang === 'rest' ? 'request.sh' : 'index.html'}
            </span>
            <div className="code-actions">
              <button onClick={handleCopy} className="btn-copy-code">
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
              </button>
              <button onClick={handleDownload} className="btn-copy-code">
                <Download size={14} />
                <span>Download</span>
              </button>
            </div>
          </div>
          <pre className="code-viewer-pre">
            <code>{getActiveCode()}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="badge-dot" />
            <span>Compatible with LiveKit Cloud & Self-Hosted WebRTC Servers</span>
          </div>
          <button
            type="button"
            className="btn-primary-gradient"
            onClick={() => setIsExportModalOpen(false)}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
