import React, { useEffect, useState } from 'react';

export function VoiceOrb({ state = 'idle', audioLevel = 0, isSpeaking = false }) {
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    if (state === 'speaking' || isSpeaking) {
      const interval = setInterval(() => {
        setPulseScale(1 + Math.random() * 0.25 + (audioLevel * 0.3));
      }, 120);
      return () => clearInterval(interval);
    } else if (state === 'listening') {
      const interval = setInterval(() => {
        setPulseScale(1 + Math.random() * 0.15);
      }, 180);
      return () => clearInterval(interval);
    } else {
      setPulseScale(1);
    }
  }, [state, isSpeaking, audioLevel]);

  const getStateGlowColor = () => {
    switch (state) {
      case 'listening':
        return 'rgba(59, 130, 246, 0.7)'; // Blue glow
      case 'thinking':
        return 'rgba(168, 85, 247, 0.85)'; // Purple glow
      case 'speaking':
        return 'rgba(236, 72, 153, 0.85)'; // Magenta / pink glow
      default:
        return 'rgba(99, 102, 241, 0.4)'; // Indigo subtle glow
    }
  };

  return (
    <div className="voice-orb-container">
      {/* Dynamic Ripples */}
      {(state === 'listening' || state === 'speaking' || state === 'thinking') && (
        <>
          <div
            className="orb-ripple ripple-1"
            style={{ borderColor: getStateGlowColor() }}
          />
          <div
            className="orb-ripple ripple-2"
            style={{ borderColor: getStateGlowColor() }}
          />
        </>
      )}

      {/* Main 3D Glowing Orb */}
      <div
        className={`voice-orb-core state-${state}`}
        style={{
          transform: `scale(${pulseScale})`,
          boxShadow: `0 0 45px ${getStateGlowColor()}, inset 0 0 25px rgba(255, 255, 255, 0.6)`
        }}
      >
        <div className="orb-inner-fluid" />
        <div className="orb-specular-highlight" />
      </div>

      {/* Waveform Equalizer Bars below Orb */}
      <div className="waveform-equalizer-bars">
        {[...Array(12)].map((_, i) => {
          const barHeight = state === 'idle'
            ? 6
            : state === 'thinking'
            ? 12 + Math.sin(i + Date.now() / 200) * 8
            : 10 + Math.random() * 26 * (audioLevel || 0.8);

          return (
            <div
              key={i}
              className="eq-bar"
              style={{
                height: `${barHeight}px`,
                backgroundColor: state === 'speaking' ? '#EC4899' : state === 'listening' ? '#3B82F6' : '#8B5CF6',
                animationDelay: `${i * 0.08}s`
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
