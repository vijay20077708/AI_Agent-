import React, { useState, useEffect, useRef } from 'react';
import { useAgent } from '../../context/AgentContext';
import { DOMAINS } from '../../data/domains';
import robotAvatarImg from '../../assets/robot-assistant.png';
import { RobotSpeechDialog } from '../agent-preview/RobotSpeechDialog';
import { AgentAvatar } from './AgentAvatar';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Send,
  Loader2,
  User,
  BrainCircuit,
  Wrench,
  RotateCcw,
  CheckCircle2,
  MessageSquare,
  Radio,
  Bot,
  Zap
} from 'lucide-react';

export function AgentSidePreview() {
  const {
    isSidePreviewOpen,
    closeSidePreview,
    agentConfig,
    messages,
    sendMessage,
    isThinking,
    isSpeaking,
    isListening,
    setIsListening,
    audioLevel,
    isMuted,
    setIsMuted,
    toggleMute,
    isPaused,
    pauseSpeech,
    resumeSpeech,
    togglePauseResume,
    replayVoice
  } = useAgent();

  const [inputVal, setInputVal] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState(null);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [isReacting, setIsReacting] = useState(false);
  const chatScrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const robotStageRef = useRef(null);

  // 3D Mouse Parallax Tilt Tracking
  const handleStageMouseMove = (e) => {
    if (!robotStageRef.current) return;
    const rect = robotStageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    setMouseTilt({
      x: Math.max(-12, Math.min(12, offsetY * -10)),
      y: Math.max(-15, Math.min(15, offsetX * 14))
    });
  };

  const handleStageMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  const handleRobotClick = () => {
    setIsReacting(true);
    setTimeout(() => setIsReacting(false), 1400);
  };

  const mode = agentConfig.interactionMode || 'both'; // 'both' | 'text-only' | 'voice-only'
  const isTextOnly = mode === 'text-only';
  const isVoiceOnly = mode === 'voice-only';

  // Auto scroll chat
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, isSpeaking]);

  // Speech Recognition Setup (Active when not text-only)
  useEffect(() => {
    if (isTextOnly) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = agentConfig.voiceId === 'maya' ? 'ta-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setVoiceTranscript(text);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (voiceTranscript.trim()) {
          const spoken = voiceTranscript;
          setVoiceTranscript('');
          sendMessage(spoken);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, [voiceTranscript, agentConfig.voiceId, isTextOnly]);

  const toggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          setVoiceTranscript('');
          recognitionRef.current.lang = agentConfig.voiceId === 'maya' ? 'ta-IN' : 'en-US';
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
    if (!inputVal.trim() || isThinking) return;
    sendMessage(inputVal);
    setInputVal('');
  };

  const handleReplay = (msgId, text) => {
    setActiveSpeakingMsgId(msgId);
    replayVoice(text);
    setTimeout(() => setActiveSpeakingMsgId(null), 3000);
  };

  if (!isSidePreviewOpen) return null;

  const domainObj = DOMAINS.find(d => d.id === agentConfig.domain) || DOMAINS[0];
  const lastMessage = messages[messages.length - 1];
  const latestAgentMsg = [...messages].reverse().find(m => m.sender === 'agent');
  const isCurrentlySpeakingLatest = activeSpeakingMsgId ? activeSpeakingMsgId === latestAgentMsg?.id : isSpeaking;

  return (
    <div className="centered-preview-overlay" onClick={closeSidePreview}>
      <div className="centered-preview-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Top Studio Header: ONLY Hotel/Agent Name + Mode Pill + Controls */}
        <div className="centered-modal-header">
          <div className="flex items-center gap-3">
            <div className="side-avatar-circle" style={{ background: agentConfig.avatarBg || '#6366F1' }}>
              <AgentAvatar avatar={agentConfig.avatar} domain={agentConfig.domain} size={20} />
            </div>
            <div>
              <h3 className="side-agent-name mb-0">{agentConfig.name}</h3>
            </div>
            <span className="modal-mode-badge">
              {isVoiceOnly ? 'Voice Only Call' : isTextOnly ? 'Text Only' : 'Voice & Text'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isTextOnly && (
              <>
                <button
                  type="button"
                  onClick={toggleMute}
                  className={`side-mute-btn ${isMuted ? 'muted' : ''}`}
                  title={isMuted ? 'Unmute Voice Output (Sound is Muted)' : 'Mute Voice Output (Sound is Active)'}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                <button
                  type="button"
                  onClick={togglePauseResume}
                  disabled={!isSpeaking && !isPaused}
                  className={`side-pause-resume-btn ${isPaused ? 'paused' : isSpeaking ? 'speaking' : ''} ${(!isSpeaking && !isPaused) ? 'disabled' : ''}`}
                  title={
                    isPaused
                      ? 'Resume Agent Voice'
                      : isSpeaking
                      ? 'Pause Agent Voice'
                      : 'Pause / Resume (Agent is idle)'
                  }
                >
                  {isPaused ? <Play size={16} /> : <Pause size={16} />}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={closeSidePreview}
              className="side-close-btn"
              title="Close Preview Window"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Studio Center Body: Left 3D Animated Robot + Right Conversation Stream */}
        <div className="centered-studio-body-grid">
          {/* Left Column: 3D Animated Robot Stage with Popping Speech Dialog */}
          <div className="robot-interactive-stage">
            {/* Robot Status Aura Pill */}
            <div className="robot-status-pill">
              <span className={`robot-live-dot ${isPaused ? 'paused' : isSpeaking ? 'speaking' : isListening ? 'listening' : isThinking ? 'thinking' : 'ready'}`} />
              <span className="robot-status-text">
                {isPaused
                  ? `${agentConfig.name} is paused • Tap Resume`
                  : isSpeaking
                  ? (isMuted ? `${agentConfig.name} is speaking (Muted)...` : `${agentConfig.name} is speaking...`)
                  : isListening
                  ? 'Listening to you... Speak now'
                  : isThinking
                  ? 'Thinking & processing...'
                  : 'AI Agent Ready • Live'}
              </span>
            </div>

            {/* 3D Animated Robot Character Visual with Speaking Reactions */}
            <div
              className="robot-character-wrapper"
              ref={robotStageRef}
              onMouseMove={handleStageMouseMove}
              onMouseLeave={handleStageMouseLeave}
            >
              <div
                className={`robot-avatar-container ${
                  isReacting
                    ? 'robot-reacting'
                    : isSpeaking
                    ? 'robot-talking'
                    : isListening
                    ? 'robot-listening'
                    : isThinking
                    ? 'robot-thinking'
                    : 'robot-floating'
                }`}
                style={{
                  transform: `perspective(700px) rotateX(${mouseTilt.x}deg) rotateY(${mouseTilt.y}deg)`
                }}
                onClick={handleRobotClick}
                title="Click me to interact!"
              >
                {/* Soft Ambient Energy Aura Behind Robot */}
                <div className={`robot-energy-halo ${isSpeaking ? 'active-glow' : ''} ${isThinking ? 'thinking-glow' : ''}`} />

                {/* Cute 3D Robot Image */}
                <img
                  src={robotAvatarImg}
                  alt="3D AI Robot Assistant"
                  className="animated-robot-img"
                />

                {/* Soft Ground Shadow Platform */}
                <div className="robot-holo-stage">
                  <div className="holo-ground-shadow" />
                </div>
              </div>

              {/* Dynamic Speech Dialogue Box Popping directly from the Robot! */}
              <RobotSpeechDialog
                agentName={agentConfig.name}
                latestAgentMsg={latestAgentMsg}
                isThinking={isThinking}
                isSpeaking={isSpeaking}
                isPaused={isPaused}
                isMuted={isMuted}
                isTextOnly={isTextOnly}
                onReplayVoice={handleReplay}
                isCurrentlySpeakingThis={isCurrentlySpeakingLatest}
              />

              {/* Dynamic Equalizer Waves directly under robot */}
              {!isTextOnly && (
                <div className="robot-sound-equalizer">
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={i}
                      className={`robot-wave-bar ${(isSpeaking || isListening) && !isPaused ? 'active' : ''}`}
                      style={{
                        height: ((isSpeaking || isListening) && !isPaused) ? `${10 + Math.random() * 26}px` : '4px',
                        animationDelay: `${i * 0.06}s`
                      }}
                    />
                  ))}
                </div>
              )}

              {voiceTranscript && (
                <div className="robot-heard-transcript">
                  <span className="heard-tag">Heard:</span> "{voiceTranscript}"
                </div>
              )}
            </div>

            {/* Voice Quick Action Controller */}
            {!isTextOnly && (
              <div className="robot-voice-controls-row">
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`btn-robot-mic-action ${isListening ? 'active' : ''}`}
                  title={isListening ? 'Stop Speaking' : 'Start Voice Input'}
                >
                  <Mic size={18} />
                  <span>{isListening ? 'Listening...' : 'Tap to Speak'}</span>
                </button>

                <span className="robot-voice-persona-tag">
                  <Volume2 size={12} />
                  <span>{agentConfig.voiceName || 'Shimmer'}</span>
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Conversational Stream Beside the Robot */}
          <div className="robot-chat-stream-column">
            <div className="chat-messages-container">
              {messages.map((msg, index) => {
                const isAgent = msg.sender === 'agent';
                const isSpeakingThisMsg = activeSpeakingMsgId === msg.id || (isSpeaking && index === messages.length - 1 && isAgent);

                return (
                  <div key={msg.id} className={`side-msg-row ${isAgent ? 'agent-robot-bubble' : 'user'}`}>
                    <div className="side-msg-avatar">
                      {isAgent ? (
                        <div
                          className="robot-mini-avatar-thumb"
                          style={{
                            background: agentConfig.avatarBg || '#6366F1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                          }}
                        >
                          <AgentAvatar avatar={agentConfig.avatar} domain={agentConfig.domain} size={14} />
                        </div>
                      ) : (
                        <User size={13} />
                      )}
                    </div>

                    <div className={`side-msg-bubble ${isAgent ? 'robot-speech-bubble-beside' : ''} ${isSpeakingThisMsg ? 'currently-speaking-border' : ''}`}>
                      <div className="side-msg-header">
                        <span className="sender-title">
                          {isAgent ? `${agentConfig.name} (Robot Speaking)` : 'You'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="sender-time">{msg.timestamp}</span>
                          {isAgent && !isTextOnly && (
                            <button
                              type="button"
                              onClick={() => handleReplay(msg.id, msg.text)}
                              className={`btn-replay-voice-bubble ${isSpeakingThisMsg ? 'playing' : ''}`}
                              title="Replay Voice Audio"
                            >
                              <Volume2 size={12} />
                              <span>{isSpeakingThisMsg ? 'Speaking...' : 'Listen'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {msg.toolBadge && (
                        <div className="tool-badge-pill">
                          <Wrench size={11} />
                          <span>{msg.toolBadge}</span>
                        </div>
                      )}

                      {/* Visible text message right next to robot */}
                      <div className="msg-text-lines">
                        {msg.text.split('\n\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isThinking && (
                <div className="side-msg-row agent-robot-bubble">
                  <div className="side-msg-avatar">
                    <div className="robot-mini-avatar-thumb">
                      <img src={robotAvatarImg} alt="Robot" className="thumb-robot-icon" />
                    </div>
                  </div>
                  <div className="side-msg-bubble robot-speech-bubble-beside">
                    <div className="thinking-row">
                      <Loader2 size={14} className="animate-spin text-purple-600" />
                      <span>{agentConfig.name} is formulating answer & synthesizing speech...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatScrollRef} />
            </div>

            {/* Quick Inquiries & Questions Chips */}
            {(() => {
              const inquiries = (agentConfig.discoveryQuestions && agentConfig.discoveryQuestions.length > 0)
                ? agentConfig.discoveryQuestions
                : (domainObj.samplePrompts || domainObj.discoveryQuestions || []);

              if (!inquiries || inquiries.length === 0) return null;

              return (
                <div className="quick-suggestions-bar">
                  <span className="suggestions-label">Quick Inquiries:</span>
                  <div className="suggestions-chips-row">
                    {inquiries.slice(0, 6).map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        className="suggestion-chip-button"
                      >
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Bottom Action Controls (Text typing bar or Voice Only controls) */}
            {isVoiceOnly ? (
              <div className="side-voice-only-bar">
                <div className="voice-only-status-pill">
                  <span className={`voice-dot-pulse ${isListening ? 'listening' : isSpeaking ? 'speaking' : 'ready'}`} />
                  <span>
                    {isSpeaking
                      ? 'Robot is answering aloud...'
                      : isListening
                      ? 'Listening to your voice... Speak now'
                      : 'Voice Only Mode • Tap mic to speak'}
                  </span>
                </div>

                <div className="voice-only-buttons-row">
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`btn-voice-large-mic ${isListening ? 'active' : ''}`}
                    title={isListening ? 'Stop Listening' : 'Tap to Speak'}
                  >
                    <Mic size={20} />
                    <span>{isListening ? 'Listening...' : 'Tap to Speak'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className={`btn-voice-mute-toggle ${isMuted ? 'muted' : ''}`}
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSend} className={`side-chat-input-bar ${isTextOnly ? 'text-only-input-bar' : ''}`}>
                <input
                  type="text"
                  className="side-chat-input"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={
                    isTextOnly
                      ? `Type your message for ${agentConfig.name}...`
                      : `Ask in voice or text (Robot replies in ${agentConfig.voiceName || 'voice'})...`
                  }
                />
                {!isTextOnly && (
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`btn-mic-drawer ${isListening ? 'active' : ''}`}
                    title="Speak via Microphone (Voice Input)"
                  >
                    <Mic size={17} />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isThinking}
                  className="btn-send-drawer"
                  title="Send Message"
                >
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


