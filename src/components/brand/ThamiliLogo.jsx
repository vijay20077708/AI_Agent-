import React from 'react';

/**
 * Precision Thamili Icon Component
 */
export function ThamiliIcon({ size = 38, className = "" }) {
  return (
    <div
      className={`thamili-icon-box ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        overflow: 'hidden',
        flexShrink: 0
      }}
    >
      <img
        src="/assets/thamili-icon.png"
        alt="Thamili Icon"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
}

/**
 * Precision Thamili Logo Component
 * Exactly reproduces the branding from the reference image:
 * "தமிழி" with green leaf sprout, "THAMILI" English wordmark,
 * "✦ அனைத்து AI கருவிகளும் ஒரே இடத்தில்! ✦" badge,
 * and "TAMIL-FIRST AI COMPANION" subtitle.
 */
export function ThamiliLogo({
  size = 38,
  showText = true,
  showTagline = false,
  className = "",
  isHero = false
}) {
  if (isHero) {
    return (
      <div className={`thamili-hero-branding ${className}`}>
        {/* Main Logo from User Photo */}
        <div className="thamili-hero-logo-wrap">
          <img
            src="/assets/thamili-title.png"
            alt="தமிழி THAMILI"
            className="thamili-hero-logo-img"
          />
        </div>

        {/* Feature Badge Pill: அனைத்து AI கருவிகளும் ஒரே இடத்தில்! */}
        <div className="thamili-tagline-badge">
          <span className="badge-sparkle">✦</span>
          <span>அனைத்து AI கருவிகளும் ஒரே இடத்தில்!</span>
          <span className="badge-sparkle">✦</span>
        </div>

        {/* Subtitle: TAMIL-FIRST AI COMPANION */}
        <div className="thamili-companion-sub">
          <span className="sub-line sub-line-left" />
          <span className="sub-text">TAMIL-FIRST AI COMPANION</span>
          <span className="sub-line sub-line-right" />
        </div>
      </div>
    );
  }

  // Sidebar and Header Compact Version
  return (
    <div
      className={`thamili-brand-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        width: '100%'
      }}
    >
      <div className="thamili-sidebar-badge">
        <img
          src="/assets/thamili-title.png"
          alt="தமிழி THAMILI"
          className="thamili-sidebar-img"
          style={{
            maxHeight: `${Math.max(size, 42)}px`,
            maxWidth: '185px',
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  );
}

// Backward compatibility exports
export const AurqoLogo = ThamiliLogo;
export const AurqoIcon = ThamiliIcon;
