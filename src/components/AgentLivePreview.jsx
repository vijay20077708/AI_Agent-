import React, { useState, useEffect, useRef } from 'react';
import { useAgent } from '../context/AgentContext';
import { DOMAINS } from '../data/domains';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  ArrowLeft,
  Loader2,
  RotateCcw,
  CheckCircle2,
  Bot,
  User,
  Activity,
  Layers,
  Wrench
} from 'lucide-react';

export function AgentLivePreview() {
  const {
    agentConfig,
    messages,
    sendMessage,
    backToCreator,
    isThinking,
    isSpeaking,
    isListening,
    setIsListening,
    audioLevel,
    isMuted,
    setIsMuted,
    speakText
  } = useAgent();

  const [inputText, setInputText] = useState('');
  const [speechTranscript, setSpeechTranscript] = useState('');
  const chatScrollRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto scroll chat
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, isSpeaking]);

  // Initialize Speech Recognition for Voice Input
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setSpeechTranscript(current);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (speechTranscript.trim()) {
          const spoken = speechTranscript;
          setSpeechTranscript('');
          sendMessage(spoken);
        }
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, [speechTranscript]);

  const toggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          setSpeechTranscript('');
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Mic start error:', e);
        }
      } else {
        alert('Speech recognition is not supported in this browser. Please type your message in the chat box.');
      }
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    sendMessage(inputText);
    setInputText('');
  };

  const domainObj = DOMAINS.find(d => d.id === agentConfig.domain) || DOMAINS[0];

  return (
    <div className="preview-container-emerald">
      {/* Top Bar */}
      <div className="preview-navbar">
        <button onClick={backToCreator} className="btn-back-link">
          <ArrowLeft size={16} />
          <span>← Back to Setup</span>
        </button>

        <div className="preview-agent-id">
          <div className="agent-avatar-emerald">
            <span>{agentConfig.avatar}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="agent-heading-name">{agentConfig.name}</h3>
              <span className="domain-pill-emerald">{domainObj.name}</span>
            </div>
            <p className="agent-heading-role">{agentConfig.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`btn-mute-toggle ${isMuted ? 'muted' : ''}`}
            title={isMuted ? 'Unmute Audio Out' : 'Mute Audio Out'}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            <span>{isMuted ? 'Voice Muted' : 'Voice Active'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="preview-body-grid">
        {/* Left Side: Voice Stage & Visualizer */}
        <div className="voice-stage-card">
          <div className="voice-stage-header">
            <span className="voice-stage-tag">Neural Voice Engine</span>
            <div className="voice-status-indicator">
              <span className={`voice-live-dot ${isSpeaking ? 'speaking' : isListening ? 'listening' : 'ready'}`} />
              <span>
                {isSpeaking
                  ? 'Agent Speaking...'
                  : isListening
                  ? 'Listening to your voice...'
                  : isThinking
                  ? 'Processing answer...'
                  : 'Ready • Speak or Type'}
              </span>
            </div>
          </div>

          {/* Central Glowing Emerald Voice Orb */}
          <div className="voice-orb-wrapper">
            <div className={`emerald-voice-orb ${isSpeaking ? 'speaking' : isListening ? 'listening' : 'idle'}`}>
              <div className="orb-inner-light" />
              <div className="orb-center-icon">
                {isSpeaking ? (
                  <Volume2 size={36} className="text-white" />
                ) : isListening ? (
                  <Mic size={36} className="text-white" />
                ) : (
                  <Bot size={36} className="text-white" />
                )}
              </div>
            </div>

            {/* Waveform Bars */}
            <div className="emerald-waveform">
              {[...Array(14)].map((_, i) => (
                <div
                  key={i}
                  className={`wave-bar ${isSpeaking || isListening ? 'active' : ''}`}
                  style={{
                    height: (isSpeaking || isListening) ? `${12 + Math.random() * 24}px` : '6px',
                    animationDelay: `${i * 0.07}s`
                  }}
                />
              ))}
            </div>

            {speechTranscript && (
              <div className="speech-transcript-box">
                <span className="transcript-lead">Heard:</span> "{speechTranscript}"
              </div>
            )}
          </div>

          {/* Voice Action Button */}
          <div className="voice-controls-center">
            <button
              type="button"
              onClick={toggleMic}
              className={`btn-voice-mic-main ${isListening ? 'listening' : ''}`}
              title={isListening ? 'Stop Listening' : 'Click to Speak (Microphone)'}
            >
              {isListening ? <MicOff size={26} /> : <Mic size={26} />}
            </button>
            <p className="mic-help-text">
              {isListening ? 'Listening... Speak your question now' : 'Click to speak or use text chat below'}
            </p>
          </div>

          {/* Active Capabilities Summary */}
          <div className="agent-features-summary">
            <div className="summary-item">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Voice Auto-Response Enabled</span>
            </div>
            <div className="summary-item">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>{agentConfig.files.length} Document(s) Attached</span>
            </div>
            <div className="summary-item">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Domain: {domainObj.name}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Chat Stream */}
        <div className="chat-stream-card">
          <div className="chat-stream-header">
            <h4>Live Conversation with {agentConfig.name}</h4>
            <span className="chat-subtag flex items-center gap-1"><Volume2 size={12} className="text-purple-500" /> Every reply speaks out automatically</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="chat-messages-scroll">
            {messages.map((msg) => {
              const isAgent = msg.sender === 'agent';

              return (
                <div key={msg.id} className={`chat-message-row ${isAgent ? 'agent' : 'user'}`}>
                  <div className="msg-avatar-badge">
                    {isAgent ? <span>{agentConfig.avatar}</span> : <User size={14} />}
                  </div>

                  <div className="msg-content-wrapper">
                    <div className="msg-meta-info">
                      <span className="msg-sender-title">{isAgent ? agentConfig.name : 'You'}</span>
                      <span className="msg-time">{msg.timestamp}</span>
                    </div>

                    {msg.toolBadge && (
                      <div className="tool-executed-tag">
                        <Wrench size={11} />
                        <span>{msg.toolBadge}</span>
                      </div>
                    )}

                    <div className="msg-text-content">
                      {msg.text.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="chat-message-row agent">
                <div className="msg-avatar-badge">
                  <span>{agentConfig.avatar}</span>
                </div>
                <div className="msg-content-wrapper">
                  <div className="msg-thinking-row">
                    <Loader2 size={14} className="animate-spin text-emerald-600" />
                    <span>{agentConfig.name} is thinking and formulating voice response...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatScrollRef} />
          </div>

          {/* Discovery Question Chips */}
          {domainObj.samplePrompts && domainObj.samplePrompts.length > 0 && (
            <div className="domain-suggestions-bar">
              <span className="suggestions-title">Quick questions:</span>
              <div className="suggestions-chips-wrap">
                {domainObj.samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="suggestion-chip-btn"
                  >
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="chat-input-form-emerald">
            <input
              type="text"
              className="chat-text-input-emerald"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Type a message to ${agentConfig.name} (replies will speak out)...`}
            />
            <button
              type="button"
              onClick={toggleMic}
              className={`btn-mic-inline ${isListening ? 'active' : ''}`}
              title="Voice Mic"
            >
              <Mic size={17} />
            </button>
            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className="btn-send-emerald"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
