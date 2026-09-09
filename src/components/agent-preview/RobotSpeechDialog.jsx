import React, { useState } from 'react';
import { Volume2, Sparkles, Copy, Check, Wrench, MessageSquareQuote } from 'lucide-react';

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
            <span className="robot-speaking-live-chip">
              <span className="live-pulse-dot" />
              <span>Speaking Aloud</span>
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
              <span>{isCurrentlySpeakingThis ? 'Speaking...' : 'Listen'}</span>
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
            <Sparkles size={16} className="spin-slow text-purple-600" />
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
