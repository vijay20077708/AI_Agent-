import React from 'react';
import {
  Bot, Hotel, Plane, TrendingUp, Code2, Stethoscope,
  GraduationCap, Scale, Headphones, Microscope, Globe, Sparkles, Cpu, Rocket
} from 'lucide-react';

const EMOJI_TO_ICON = {
  '\U0001F916': Bot, 'bot': Bot, 'robot': Bot, 'cpu': Cpu, 'platform': Bot,
  '\U0001F3E8': Hotel, 'hotel': Hotel, 'hospitality': Hotel,
  '\u2708\uFE0F': Plane, 'travel': Plane, 'tourism': Plane,
  '\U0001F4C8': TrendingUp, 'finance': TrendingUp, 'trading': TrendingUp,
  '\U0001F4BB': Code2, 'code': Code2, 'coding': Code2, 'dev': Code2,
  '\U0001FA7A': Stethoscope, 'medical': Stethoscope, 'health': Stethoscope,
  '\U0001F393': GraduationCap, 'study': GraduationCap, 'education': GraduationCap,
  '\U0001F52C': Microscope, 'research': Microscope,
  '\u2696\uFE0F': Scale, 'legal': Scale,
  '\U0001F3A7': Headphones, 'support': Headphones,
  '\U0001F310': Globe, 'general': Sparkles,
  '\U0001F680': Rocket, 'rocket': Rocket, 'speed': Rocket
};

export function getAgentIconComponent(avatar, domain) {
  if (avatar && EMOJI_TO_ICON[avatar]) return EMOJI_TO_ICON[avatar];
  const cleanDomain = (domain || '').toLowerCase().trim();
  if (cleanDomain && EMOJI_TO_ICON[cleanDomain]) return EMOJI_TO_ICON[cleanDomain];
  return Bot;
}

export function AgentAvatar({ avatar, domain, size = 22, className = '', strokeWidth = 2.2 }) {
  const IconComponent = getAgentIconComponent(avatar, domain);
  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={`agent-vector-icon ${className}`}
      aria-hidden="true"
    />
  );
}
