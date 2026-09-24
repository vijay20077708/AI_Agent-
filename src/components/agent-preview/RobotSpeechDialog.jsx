import React, { useState } from 'react';
import { Volume2, Loader2, Copy, Check, Wrench, MessageSquareQuote } from 'lucide-react';

/**
 * RobotSpeechDialog:
 * Animated speech balloon dialog box that opens directly from the 3D Robot Assistant
 * when the agent thinks, formulates, and speaks replies.
 */
export function RobotSpeechDialog({
  agentName,
  latestAgentMsg,
  isThinking,
  isSpeaking,
  isPaused,
  isMuted,
  isTextOnly,
  onReplayVoice,
  isCurrentlySpeakingThis
}) {
  const [copied, setCopied] = useState(false);

  if (!latestAgentMsg && !isThinking) {
    return null;
  }

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`robot-speech-popup-card ${isSpeaking ? 'active-speaking-glow' : ''} ${isThinking ? 'thinking-glow' : ''}`}>
      {/* Speech Balloon Pointer Tail pointing to Robot */}
      <div className="robot-speech-pointer-tail" />

      {/* Top Header of Robot Speech Card */}
      <div className="robot-speech-card-header">
        <div className="flex items-center gap-2">
          <div className="robot-dialog-speaker-badge">
            <MessageSquareQuote size={13} className="text-purple-600 dark:text-purple-400" />
            <span className="robot-dialog-speaker-name">{agentName}</span>
          </div>
          {isSpeaking && (
            <span className={`robot-speaking-live-chip ${isMuted ? 'muted' : ''}`} style={isMuted ? { background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.25)' } : {}}>
              <span className="live-pulse-dot" style={isMuted ? { background: '#EF4444' } : {}} />
              <span>{isMuted ? 'Speaking (Muted)' : 'Speaking Aloud'}</span>
            </span>
          )}
          {isPaused && (
            <span className="robot-speaking-live-chip paused" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#D97706', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              <span className="live-pulse-dot" style={{ background: '#F59E0B' }} />
              <span>Voice Paused</span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {latestAgentMsg && !isTextOnly && (
            <button
              type="button"
              onClick={() => onReplayVoice(latestAgentMsg.id, latestAgentMsg.text)}
              className={`btn-robot-bubble-listen ${isCurrentlySpeakingThis ? 'playing' : ''}`}
              title="Listen to Robot Voice"
            >
              <Volume2 size={13} />
              <span>{isCurrentlySpeakingThis ? (isPaused ? 'Paused' : 'Speaking...') : 'Listen'}</span>
            </button>
          )}

          {latestAgentMsg && (
            <button
              type="button"
              onClick={() => handleCopy(latestAgentMsg.text)}
              className="btn-robot-bubble-copy"
              title="Copy Response"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            </button>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="robot-speech-card-body">
        {isThinking ? (
          <div className="robot-dialog-thinking-state">
            <Loader2 size={16} className="animate-spin text-purple-600" />
            <span>Formulating answer & synthesizing neural voice...</span>
            <div className="dialog-bouncing-dots">
              <span className="dot dot-1" />
              <span className="dot dot-2" />
              <span className="dot dot-3" />
            </div>
          </div>
        ) : latestAgentMsg ? (
          <>
            {latestAgentMsg.toolBadge && (
              <div className="dialog-tool-badge">
                <Wrench size={11} />
                <span>{latestAgentMsg.toolBadge}</span>
              </div>
            )}
            <div className="robot-dialog-text-content">
              {latestAgentMsg.text.split('\n\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
