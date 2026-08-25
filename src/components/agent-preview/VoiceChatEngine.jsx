import React, { useState, useEffect, useRef } from 'react';
import { useAgent } from '../../context/AgentContext';
import { VoiceOrb } from './VoiceOrb';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  PhoneCall,
  PhoneOff,
  Sparkles,
  Zap,
  Activity,
  RotateCcw
} from 'lucide-react';

export function VoiceChatEngine() {
  const {
    agentConfig,
    agentState,
    setAgentState,
    audioLevel,
    setAudioLevel,
    isMuted,
    setIsMuted,
    isSpeakingOut,
    latencyMs,
    sendMessage
  } = useAgent();

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = agentConfig.voice?.language || 'en-US';

      recognition.onstart = () => {
        setAgentState('listening');
        setAudioLevel(0.6);
      };

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onend = () => {
        setAudioLevel(0);
        if (transcript.trim()) {
          const spoken = transcript;
          setTranscript('');
          sendMessage(spoken);
        } else {
          setAgentState('idle');
        }
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setAgentState('idle');
        setAudioLevel(0);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, [agentConfig.voice?.language, transcript]);

  const toggleVoiceSession = () => {
    if (isSessionActive) {
      // Disconnect
      setIsSessionActive(false);
      setAgentState('idle');
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      // Start Realtime Session
      setIsSessionActive(true);
      startListening();
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        setTranscript('');
        recognitionRef.current.lang = agentConfig.voice?.language || 'en-US';
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Already listening or mic blocked', e);
      }
    }
  };

  const getStateBadge = () => {
    switch (agentState) {
      case 'listening':
        return { label: 'Listening to your voice...', color: '#3B82F6', icon: Activity };
      case 'thinking':
        return { label: 'Reasoning & Tool Execution...', color: '#8B5CF6', icon: Sparkles };
      case 'speaking':
        return { label: 'Agent Speaking (LiveKit Audio)...', color: '#EC4899', icon: Radio };
      default:
        return { label: isSessionActive ? 'Ready • Speak anytime' : 'LiveKit Stream Idle', color: '#10B981', icon: Radio };
    }
  };

  const stateBadge = getStateBadge();
  const StateIcon = stateBadge.icon;

  return (
    <div className="voice-chat-engine-container">
      {/* Top Stream Header */}
      <div className="voice-stream-header">
        <div className="stream-badge-status" style={{ color: stateBadge.color }}>
          <span className="live-dot-pulse" style={{ backgroundColor: stateBadge.color }} />
          <span className="live-status-text">{stateBadge.label}</span>
        </div>

        <div className="stream-metrics-tag">
          <Zap size={13} className="text-amber-400" />
          <span>{latencyMs}ms WebRTC</span>
        </div>
      </div>

      {/* Center 3D Voice Orb Visualization */}
      <div className="voice-orb-stage">
        <VoiceOrb
          state={agentState}
          audioLevel={audioLevel}
          isSpeaking={isSpeakingOut}
        />

        {/* Live Audio Transcript Preview */}
        {transcript && (
          <div className="live-transcript-bubble">
            <span className="transcript-label">Heard:</span> "{transcript}"
          </div>
        )}
      </div>

      {/* Voice Controls Bar */}
      <div className="voice-controls-bar">
        {/* Mute Toggle */}
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className={`btn-voice-tool ${isMuted ? 'muted' : ''}`}
          title={isMuted ? 'Unmute Audio Out' : 'Mute Audio Out'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Main Connect / Mic Action Button */}
        <button
          type="button"
          onClick={toggleVoiceSession}
          className={`btn-voice-main-mic ${isSessionActive ? 'active' : ''}`}
          title={isSessionActive ? 'End LiveKit Voice Call' : 'Start LiveKit Realtime Voice'}
        >
          {isSessionActive ? (
            <PhoneOff size={22} color="#fff" />
          ) : (
            <Mic size={22} color="#fff" />
          )}
        </button>

        {/* Manual Push-To-Talk when active */}
        <button
          type="button"
          onClick={startListening}
          disabled={!isSessionActive}
          className="btn-voice-tool"
          title="Push to speak now"
        >
          <Radio size={18} />
        </button>
      </div>

      {/* Helper text */}
      <div className="voice-hint-footer">
        {isSessionActive ? (
          <p>
            🎙️ LiveKit WebRTC channel open. Speak in <strong>{agentConfig.voice?.language || 'English'}</strong> or click mic to ask questions.
          </p>
        ) : (
          <p>
            Click the Purple Mic button to test real-time bidirectional voice conversation with <strong>{agentConfig.name}</strong>.
          </p>
        )}
      </div>
    </div>
  );
}
