import React, { useState, useRef, useEffect } from 'react';
import { useAgent } from '../../context/AgentContext';
import { DOMAINS } from '../../data/domains';
import {
  Send,
  Loader2,
  RotateCcw,
  Paperclip,
  Globe,
  Terminal,
  Database,
  FileText,
  Bot,
  User,
  Zap,
  Volume2
} from 'lucide-react';

export function ChatSandbox() {
  const {
    agentConfig,
    chatMessages,
    sendMessage,
    clearChat,
    agentState
  } = useAgent();

  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, agentState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(inputVal);
    setInputVal('');
  };

  const domainObj = DOMAINS.find(d => d.id === agentConfig.domain) || DOMAINS[0];

  return (
    <div className="chat-sandbox-root">
      {/* Sandbox Header */}
      <div className="sandbox-header-bar">
        <div className="sandbox-agent-summary">
          <div
            className="sandbox-avatar-mini"
            style={{ background: agentConfig.avatarBg }}
          >
            <span>{agentConfig.avatar}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="sandbox-agent-title">{agentConfig.name}</span>
              <span className="sandbox-live-pill">Live Testing</span>
            </div>
            <span className="sandbox-agent-sub">
              {agentConfig.model} • Temp: {agentConfig.temperature}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={clearChat}
          className="btn-clear-chat"
          title="Clear Conversation"
        >
          <RotateCcw size={14} />
          <span>Clear</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="sandbox-messages-area">
        {chatMessages.map((msg) => {
          const isAgent = msg.sender === 'agent';

          return (
            <div
              key={msg.id}
              className={`sandbox-msg-wrapper ${isAgent ? 'msg-agent' : 'msg-user'}`}
            >
              <div className="msg-avatar-col">
                {isAgent ? (
                  <div
                    className="msg-avatar-icon agent-avatar"
                    style={{ background: agentConfig.avatarBg }}
                  >
                    <span>{agentConfig.avatar}</span>
                  </div>
                ) : (
                  <div className="msg-avatar-icon user-avatar">
                    <User size={14} />
                  </div>
                )}
              </div>

              <div className="msg-bubble-content">
                <div className="msg-meta-row">
                  <span className="msg-sender-name">{isAgent ? agentConfig.name : 'You'}</span>
                  <span className="msg-timestamp">{msg.timestamp}</span>
                </div>

                {/* Tool Invocations Badge */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="tool-invocation-badges">
                    {msg.toolCalls.map((tc, idx) => (
                      <div key={idx} className="tool-call-chip">
                        {tc.name === 'WebSearch' && <Globe size={12} className="text-blue-400" />}
                        {tc.name === 'PythonSandbox' && <Terminal size={12} className="text-emerald-400" />}
                        <span>Invoked Tool: <strong>{tc.name}</strong></span>
                      </div>
                    ))}
                  </div>
                )}

                {/* RAG Citations */}
                {msg.ragSources && msg.ragSources.length > 0 && (
                  <div className="rag-sources-row">
                    <span className="rag-sources-label">RAG Knowledge Retrieved:</span>
                    {msg.ragSources.map((src, idx) => (
                      <span key={idx} className="rag-source-chip">
                        <FileText size={11} />
                        <span>{src}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Main Message Text */}
                <div className="msg-text-body">
                  {msg.text.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {agentState === 'thinking' && (
          <div className="sandbox-msg-wrapper msg-agent">
            <div className="msg-avatar-col">
              <div
                className="msg-avatar-icon agent-avatar pulse-anim"
                style={{ background: agentConfig.avatarBg }}
              >
                <span>{agentConfig.avatar}</span>
              </div>
            </div>
            <div className="msg-bubble-content">
              <div className="msg-thinking-loader">
                <Loader2 size={14} className="animate-spin text-purple-500" />
                <span>{agentConfig.name} is evaluating context and tools...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      {domainObj.samplePrompts && domainObj.samplePrompts.length > 0 && (
        <div className="prompt-suggestions-row">
          <span className="suggestions-label">Try asking:</span>
          {domainObj.samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendMessage(p)}
              className="prompt-chip-btn"
            >
              <span>{p}</span>
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <form onSubmit={handleSubmit} className="sandbox-input-form">
        <div className="sandbox-input-box">
          <input
            type="text"
            className="sandbox-text-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Ask ${agentConfig.name} anything in ${domainObj.name}...`}
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || agentState === 'thinking'}
            className="btn-send-message"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
