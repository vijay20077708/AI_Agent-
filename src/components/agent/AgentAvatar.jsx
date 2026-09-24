import React from 'react';
import {
  Bot, Hotel, Plane, TrendingUp, Code2, Stethoscope,
  GraduationCap, Scale, Headphones, Microscope, Globe, Sparkles, Cpu, Rocket,
  BookOpen, Compass, LineChart, HeartPulse
} from 'lucide-react';

const EMOJI_TO_ICON = {
  '🤖': Bot, 'bot': Bot, 'robot': Bot, 'cpu': Cpu, 'platform': Bot,
  '🏨': Hotel, 'hotel': Hotel, 'hospitality': Hotel,
  '✈️': Plane, 'travel': Plane, 'tourism': Plane, 'compass': Compass,
  '📈': TrendingUp, 'finance': TrendingUp, 'trading': TrendingUp, 'chart': LineChart,
  '💻': Code2, 'code': Code2, 'coding': Code2, 'dev': Code2,
  '🩺': Stethoscope, 'medical': Stethoscope, 'health': Stethoscope, 'heart': HeartPulse,
  '🎓': GraduationCap, 'study': GraduationCap, 'education': GraduationCap, 'book': BookOpen,
  '🔬': Microscope, 'research': Microscope,
  '⚖️': Scale, 'legal': Scale,
  '🎧': Headphones, 'support': Headphones,
  '🌐': Globe, 'general': Sparkles, 'sparkles': Sparkles,
  '🚀': Rocket, 'rocket': Rocket, 'speed': Rocket
};

export const DOMAIN_GRADIENTS = {
  hotel: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
  travel: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
  study: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
  code: 'linear-gradient(135deg, #06B6D4 0%, #0369A1 100%)',
  medical: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
  finance: 'linear-gradient(135deg, #10B981 0%, #065F46 100%)',
  research: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  legal: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
  support: 'linear-gradient(135deg, #06B6D4 0%, #0D9488 100%)',
  custom: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)'
};

export const DOMAIN_COLORS = {
  hotel: '#10B981',
  travel: '#3B82F6',
  study: '#8B5CF6',
  code: '#06B6D4',
  medical: '#EC4899',
  finance: '#10B981',
  research: '#F59E0B',
  legal: '#6366F1',
  support: '#06B6D4',
  custom: '#6366F1'
};

export function getAgentIconComponent(avatar, domain) {
  if (avatar && EMOJI_TO_ICON[avatar]) return EMOJI_TO_ICON[avatar];
  const cleanDomain = (domain || '').toLowerCase().trim();
  if (cleanDomain && EMOJI_TO_ICON[cleanDomain]) return EMOJI_TO_ICON[cleanDomain];
  return Bot;
}

export function getDomainGradient(domain, fallback = 'linear-gradient(135deg, #6366F1, #4F46E5)') {
  const clean = (domain || '').toLowerCase().trim();
  return DOMAIN_GRADIENTS[clean] || fallback;
}

export function AgentAvatar({ avatar, domain, size = 22, className = '', strokeWidth = 2.2, style }) {
  const IconComponent = getAgentIconComponent(avatar, domain);
  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={`agent-vector-icon ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/**
 * Universal Agent Logo Badge
 * Renders a full branded logo emblem with domain gradient background,
 * subtle ring, soft shadow, and centered crisp white icon.
 */
export function AgentLogoBadge({
  avatar,
  domain,
  avatarBg,
  size = 48,
  iconSize,
  borderRadius = 14,
  className = '',
  style = {}
}) {
  const bg = avatarBg || getDomainGradient(domain);
  const actualIconSize = iconSize || Math.round(size * 0.52);

  return (
    <div
      className={`agent-logo-badge ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: `${borderRadius}px`,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
        ...style
      }}
    >
      <AgentAvatar avatar={avatar} domain={domain} size={actualIconSize} strokeWidth={2.4} />
    </div>
  );
}
