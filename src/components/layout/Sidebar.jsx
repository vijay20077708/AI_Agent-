import React from 'react';
import { useAgent } from '../../context/AgentContext';
import { AurqoLogo } from '../brand/AurqoLogo';
import {
  Home,
  MessageSquare,
  Code2,
  Image,
  Video,
  GraduationCap,
  Bot,
  Layers,
  History,
  Bookmark,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export function Sidebar() {
  const { currentView, setCurrentView } = useAgent();

  const mainNav = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'code', label: 'AI Code', icon: Code2 },
    { id: 'image', label: 'AI Image', icon: Image },
    { id: 'video', label: 'AI Video', icon: Video },
    { id: 'learn', label: 'AI Learn', icon: GraduationCap },
    { id: 'agent-hub', label: 'AI Agent', icon: Bot, isAgent: true },
    { id: 'tools', label: 'More Tools', icon: Layers },
  ];

  const secondaryNav = [
    { id: 'history', label: 'History', icon: History },
    { id: 'saved', label: 'Saved', icon: Bookmark },
  ];

  const handleNavClick = (navId) => {
    if (navId === 'agent-hub') {
      setCurrentView('agent-hub');
    } else {
      setCurrentView(navId);
    }
  };

  const isAgentActive = ['agent-hub', 'create-agent', 'choose-agent'].includes(currentView);

  return (
    <aside className="aurqo-sidebar">
      {/* Top Logo */}
      <div className="sidebar-brand-box" onClick={() => setCurrentView('home')}>
        <AurqoLogo size={36} />
      </div>

      {/* Main Nav Items */}
      <div className="sidebar-nav-container">
        <nav className="sidebar-nav-group">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.isAgent ? isAgentActive : currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="link-icon" />
                  <span className="link-text">{item.label}</span>
                </div>
                {item.isAgent && (
                  <span className="sidebar-pill-tag">New</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-divider" />

        {/* Secondary Nav */}
        <nav className="sidebar-nav-group">
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`sidebar-link secondary ${isActive ? 'active' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="link-icon" />
                  <span className="link-text">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Upgrade to Pro Card matching screenshot */}
      <div className="sidebar-pro-banner">
        <div className="pro-banner-header">
          <span className="pro-title">Upgrade to Pro</span>
          <Sparkles size={15} className="pro-sparkle" />
        </div>
        <p className="pro-subtitle">
          Unlock more power, more models, and more possibilities.
        </p>
        <button className="pro-upgrade-btn">
          Upgrade Now
        </button>
      </div>

      {/* User Profile Footer matching screenshot */}
      <div className="sidebar-user-section">
        <div className="user-profile-row">
          <div className="user-avatar-tag">AR</div>
          <div className="user-meta-details">
            <span className="user-full-name">Arjun R.</span>
          </div>
          <ChevronDown size={15} className="user-dropdown-caret" />
        </div>
      </div>
    </aside>
  );
}
