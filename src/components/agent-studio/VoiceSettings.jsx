import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import { VOICE_PERSONAS, LIVEKIT_PRESETS } from '../../data/voices';
import {
  Mic,
  Volume2,
  Radio,
  Sliders,
  Play,
  Pause,
  Zap,
  Globe2,
  ShieldCheck
} from 'lucide-react';

export function VoiceSettings() {
  const { agentConfig, updateConfig } = useAgent();
  const [isPlayingPreview, setIsPlayingPreview] = useState(null);

  const voiceState = agentConfig.voice || {
    voiceId: 'alloy',
    name: 'Alloy',
    language: 'en-US',
    speed: 1.0,
    pitch: 1.0,
    vadSensitivity: 0.7,
    allowInterruption: true,
    latencyMode: 'ultra_low'
  };

  const updateVoiceParam = (key, val) => {
    updateConfig('voice', {
      ...voiceState,
      [key]: val
    });
  };

  const handleTestVoicePersona = (persona) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isPlayingPreview === persona.id) {
        setIsPlayingPreview(null);
        return;
      }
      setIsPlayingPreview(persona.id);
      
      const sampleText = persona.lang === 'ta-IN'
        ? "வணக்கம்! நான் உங்கள் AURQO AI குரல் உதவியாளர். உங்களுக்கு உதவ தயாராக உள்ளேன்."
        : persona.lang === 'hi-IN'
        ? "नमस्ते! मैं आपका AURQO AI वॉइस असिस्टेंट हूँ। मैं आपकी सहायता के लिए तैयार हूँ।"
        : `Hello! I am ${persona.name}, your real-time LiveKit voice agent. Latency is running at under two hundred milliseconds.`;

      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.rate = persona.speed || voiceState.speed || 1.0;
      utterance.pitch = persona.pitch || voiceState.pitch || 1.0;
      
      utterance.onend = () => setIsPlayingPreview(null);
      utterance.onerror = () => setIsPlayingPreview(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="studio-step-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="step-number">05</span>
          <div>
            <h3 className="section-title">LiveKit Realtime Voice & Audio Engine</h3>
            <p className="section-subtitle">
              Configure low-latency WebRTC streaming, multilingual voice personas (including Tamil & Hindi), VAD sensitivity, and interruption handling.
            </p>
          </div>
        </div>
      </div>

      {/* Voice Persona Grid */}
      <div className="form-group">
        <label className="form-label">
          Select Voice Persona & Accent
        </label>
        <div className="voice-persona-grid">
          {VOICE_PERSONAS.map((persona) => {
            const isSelected = voiceState.voiceId === persona.id;
            const isPlaying = isPlayingPreview === persona.id;

            return (
              <div
                key={persona.id}
                onClick={() => {
                  updateVoiceParam('voiceId', persona.id);
                  updateVoiceParam('name', persona.name);
                  updateVoiceParam('language', persona.lang);
                }}
                className={`voice-card ${isSelected ? 'selected' : ''}`}
              >
                <div className="voice-card-top">
                  <div className="voice-icon-circle">
                    <Volume2 size={16} />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestVoicePersona(persona);
                    }}
                    className={`voice-play-btn ${isPlaying ? 'playing' : ''}`}
                    title="Play voice preview"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                </div>

                <h5 className="voice-name">{persona.name}</h5>
                <span className="voice-gender">{persona.gender}</span>
                <p className="voice-desc">{persona.desc}</p>

                <div className="voice-footer">
                  <span className="voice-lang-badge">{persona.lang}</span>
                  {isSelected && (
                    <span className="voice-selected-pill">Active Voice</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Speech Parameters */}
      <div className="form-grid-2 mt-6">
        {/* Speaking Rate */}
        <div className="param-card">
          <div className="flex-between mb-1">
            <label className="param-label">
              Speaking Rate / Speed: <span className="param-value">{voiceState.speed}x</span>
            </label>
          </div>
          <p className="param-desc">Natural cadence is 1.0x. Higher rates (1.1x–1.2x) suit fast developer voice streams.</p>
          <input
            type="range"
            min="0.75"
            max="1.3"
            step="0.05"
            className="aurqo-slider"
            value={voiceState.speed}
            onChange={(e) => updateVoiceParam('speed', parseFloat(e.target.value))}
          />
          <div className="slider-ticks">
            <span>0.75x (Slow)</span>
            <span>1.0x (Normal)</span>
            <span>1.3x (Fast)</span>
          </div>
        </div>

        {/* VAD Sensitivity */}
        <div className="param-card">
          <div className="flex-between mb-1">
            <label className="param-label">
              VAD Turn Sensitivity: <span className="param-value">{voiceState.vadSensitivity}</span>
            </label>
            <span className="param-subtag">Silero VAD v4</span>
          </div>
          <p className="param-desc">Voice Activity Detection determines how quickly the agent yields when you begin speaking.</p>
          <input
            type="range"
            min="0.4"
            max="0.95"
            step="0.05"
            className="aurqo-slider"
            value={voiceState.vadSensitivity}
            onChange={(e) => updateVoiceParam('vadSensitivity', parseFloat(e.target.value))}
          />
          <div className="slider-ticks">
            <span>0.4 (Strict)</span>
            <span>0.7 (Balanced)</span>
            <span>0.95 (Instant)</span>
          </div>
        </div>
      </div>

      {/* LiveKit WebRTC Specs Banner */}
      <div className="livekit-specs-card mt-6">
        <div className="livekit-specs-left">
          <Radio size={20} className="text-purple-500 pulse-anim" />
          <div>
            <h5 className="livekit-title">LiveKit Realtime Pipeline Specifications</h5>
            <p className="livekit-desc">
              WebRTC Audio: {LIVEKIT_PRESETS.audioCodec} • VAD: {LIVEKIT_PRESETS.vadModel} • Noise Filter: {LIVEKIT_PRESETS.noiseSuppression}
            </p>
          </div>
        </div>
        <div className="livekit-badge-wrap">
          <span className="badge-latency">&lt; 200ms Latency Budget</span>
        </div>
      </div>
    </div>
  );
}
