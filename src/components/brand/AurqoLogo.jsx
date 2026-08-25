import React from 'react';

/**
 * Precision SVG Icon for AURQO
 * Exactly matching the 3D folded ribbon 'A', elliptical orbital ring, and satellite sphere
 * from the reference image (media_1787635571646.jpg / media_1787633998042.png).
 */
export function AurqoIcon({ size = 42, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible', flexShrink: 0 }}
    >
      <defs>
        {/* Left Arm & Apex: Vibrant Neon Cyan to Azure Blue */}
        <linearGradient id="aurqoLeftCyanGrad" x1="15%" y1="95%" x2="70%" y2="5%">
          <stop offset="0%" stopColor="#00F5FF" />
          <stop offset="35%" stopColor="#00B4D8" />
          <stop offset="70%" stopColor="#0077B6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        {/* Right Arm: Indigo to Rich Violet & Magenta Pink */}
        <linearGradient id="aurqoRightMagentaGrad" x1="45%" y1="15%" x2="90%" y2="95%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="30%" stopColor="#6D28D9" />
          <stop offset="65%" stopColor="#9333EA" />
          <stop offset="85%" stopColor="#D946EF" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        {/* Front Loop of Orbital Ring: Luminous Cyan / Teal */}
        <linearGradient id="orbitFrontCyan" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#00F5FF" stopOpacity="1" />
          <stop offset="50%" stopColor="#00D2FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
        </linearGradient>

        {/* Back Loop of Orbital Ring: Magenta / Purple */}
        <linearGradient id="orbitBackPurple" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#A855F7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="1" />
        </linearGradient>

        {/* Soft Radial Glow Filter for Realistic 3D Depth */}
        <filter id="aurqoNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="satelliteBeadGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Back Segment of the Orbital Ring (Loops behind the 'A') */}
      <path
        d="M 22 74 C 18 52, 44 36, 82 35 C 114 34, 134 44, 130 58 C 127 64, 116 72, 98 78"
        stroke="url(#orbitBackPurple)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* 2. Main 3D Ribbon 'A' - Left Leg, Arch and Apex */}
      <path
        d="M 32 108 C 32 108, 44 60, 63 30 C 67 22, 73 22, 77 30 C 88 50, 100 75, 110 108 C 108 109, 95 106, 90 94 C 83 78, 73 54, 70 45 C 67 54, 57 78, 50 94 C 45 106, 34 108, 32 108 Z"
        fill="url(#aurqoLeftCyanGrad)"
        filter="url(#aurqoNeonGlow)"
      />

      {/* 3. Main 3D Ribbon 'A' - Right Leg Volume Curve (Smooth 3D Fold) */}
      <path
        d="M 70 24 C 77 24, 85 38, 97 64 C 109 88, 114 105, 108 109 C 101 112, 92 101, 85 84 C 79 70, 72 52, 70 40 Z"
        fill="url(#aurqoRightMagentaGrad)"
        opacity="0.98"
      />

      {/* 4. Horizontal Ribbon Curve Accent (Subtle inner glow reflection) */}
      <path
        d="M 52 76 C 60 72, 78 72, 88 76 C 83 81, 57 81, 52 76 Z"
        fill="#FFFFFF"
        opacity="0.8"
      />

      {/* 5. Front Segment of the Orbital Ring (Sweeps in front of the 'A') */}
      <path
        d="M 24 76 C 28 92, 60 104, 100 96 C 120 90, 130 80, 126 66"
        stroke="url(#orbitFrontCyan)"
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
        filter="url(#aurqoNeonGlow)"
      />

      {/* 6. Orbiting Satellite Sphere Bead on the right side */}
      <circle cx="124" cy="65" r="5.5" fill="#00F5FF" filter="url(#satelliteBeadGlow)" />
      <circle cx="124" cy="65" r="3" fill="#FFFFFF" />

      {/* 7. Apex Light Flare Accent */}
      <circle cx="70" cy="26" r="2.5" fill="#FFFFFF" opacity="0.95" />
    </svg>
  );
}

/**
 * Full AURQO Brand Component:
 * Features the precise 3D icon + stylized vector typography with sparkling star in 'Q',
 * and the exact tagline: "ONE AI. INFINITE POSSIBILITIES." matching media_1787635571646.jpg.
 */
export function AurqoLogo({ size = 38, showText = true, showTagline = false, className = "", isHero = false }) {
  const textScale = isHero ? size * 0.76 : size * 0.65;

  return (
    <div
      className={`aurqo-brand-container ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none'
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: isHero ? '16px' : '10px'
        }}
      >
        <AurqoIcon size={size} />

        {showText && (
          <div
            className="aurqo-wordmark-wrapper"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: `${size}px`,
              position: 'relative'
            }}
          >
            {/* Custom SVG Geometric Wordmark for AURQO matching the uploaded photo exactly */}
            <svg
              height={textScale}
              viewBox="0 0 240 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Gradient for the Q ring and sparkle */}
                <linearGradient id="qRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D2FF" />
                  <stop offset="40%" stopColor="#3B82F6" />
                  <stop offset="80%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>

                <linearGradient id="qTailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#00F5FF" />
                </linearGradient>

                <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Letter 'A': Sleek geometric apex without middle bar */}
              <path
                d="M 6 48 L 24 12 C 25.5 9 28.5 9 30 12 L 48 48 L 38 48 L 27 25 L 16 48 Z"
                fill="currentColor"
                className="aurqo-letter-fill"
              />

              {/* Letter 'U': Geometric rounded U */}
              <path
                d="M 58 12 L 58 34 C 58 43 64 49 74 49 C 84 49 90 43 90 34 L 90 12 L 80 12 L 80 34 C 80 38 78 40 74 40 C 70 40 68 38 68 34 L 68 12 Z"
                fill="currentColor"
                className="aurqo-letter-fill"
              />

              {/* Letter 'R': Geometric R */}
              <path
                d="M 100 12 L 118 12 C 126 12 131 16 131 23 C 131 28 128 32 122 33 L 133 48 L 121 48 L 112 35 L 110 35 L 110 48 L 100 48 Z M 110 20 L 110 27 L 117 27 C 120 27 121 25 121 23.5 C 121 22 120 20 117 20 Z"
                fill="currentColor"
                className="aurqo-letter-fill"
              />

              {/* Letter 'Q': Glowing Ring + 4-Point Star Flare + Angled Tail */}
              <g transform="translate(142, 10)">
                {/* Outer Circular Ring of Q */}
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="url(#qRingGrad)"
                  strokeWidth="7"
                  fill="none"
                />

                {/* 4-Point Star Flare / Sparkle in Center of Q */}
                <path
                  d="M 20 13 Q 20 20 13 20 Q 20 20 20 27 Q 20 20 27 20 Q 20 20 20 13 Z"
                  fill="#00F5FF"
                  filter="url(#starGlow)"
                />
                <path
                  d="M 20 15 Q 20 20 15 20 Q 20 20 20 25 Q 20 20 25 20 Q 20 20 20 15 Z"
                  fill="#FFFFFF"
                />

                {/* Angled Tail of Q with dot accent at bottom right */}
                <path
                  d="M 28 28 L 39 39"
                  stroke="url(#qTailGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <circle cx="39" cy="39" r="3" fill="#00F5FF" />
              </g>

              {/* Letter 'O': Clean geometric circle matching Q */}
              <path
                d="M 215 10 C 203 10 194 19 194 30 C 194 41 203 50 215 50 C 227 50 236 41 236 30 C 236 19 227 10 215 10 Z M 215 18 C 222 18 227 23 227 30 C 227 37 222 42 215 42 C 208 42 203 37 203 30 C 203 23 208 18 215 18 Z"
                fill="currentColor"
                className="aurqo-letter-fill"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Optional Exact Tagline Underline matching media_1787635571646.jpg */}
      {(showTagline || isHero) && (
        <div className="aurqo-logo-tagline-row" style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '28px', height: '2px', background: 'linear-gradient(90deg, transparent, #00D2FF)' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.22em', color: '#94A3B8', textTransform: 'uppercase' }}>
            ONE AI. <span style={{ color: '#00D2FF' }}>INFINITE</span> <span style={{ color: '#EC4899' }}>POSSIBILITIES.</span>
          </span>
          <span style={{ width: '28px', height: '2px', background: 'linear-gradient(90deg, #EC4899, transparent)' }} />
        </div>
      )}
    </div>
  );
}



