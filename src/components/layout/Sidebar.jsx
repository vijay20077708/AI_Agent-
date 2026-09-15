import React, { useState, useRef, useEffect } from 'react';
import { useAgent } from '../../context/AgentContext';
import { ThamiliLogo } from '../brand/ThamiliLogo';
import {
  Bot,
  ChevronDown,
  History,
  User,
  LogOut,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  X,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export function Sidebar() {
  const {
    currentView,
    setCurrentView,
    agentHistory,
    userProfile
  } = useAgent();

  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [logoutNotice, setLogoutNotice] = useState(false);

  // 15-second Upgrade to Pro banner timer
  const [showProBanner, setShowProBanner] = useState(true);
  const [proSecondsLeft, setProSecondsLeft] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowProBanner(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isAgentActive = ['agent-hub', 'create-agent', 'choose-agent'].includes(currentView);
  const isProfileActive = currentView === 'profile';

  const handleMainAgentClick = () => {
    setCurrentView('agent-hub');
    setIsAgentMenuOpen(prev => !prev);
  };

  const handleOpenHistory = () => {
    setCurrentView('history');
  };

  const handleProfileClick = () => {
    setCurrentView('profile');
  };

  const handleLogout = () => {
    setLogoutNotice(true);
    setTimeout(() => {
      setLogoutNotice(false);
    }, 3500);
  };

  return (
    <>
      <aside className="aurqo-sidebar thamili-sidebar">
        {/* Top Logo - Exact Thamili branding from Image 2 */}
        <div className="sidebar-brand-box" onClick={() => setCurrentView('agent-hub')}>
          <ThamiliLogo size={46} />
        </div>

        {/* Main Nav Items */}
        <div className="sidebar-nav-container">
          <nav className="sidebar-nav-group">
            {/* AI Agent Main Menu Item */}
            <div className="sidebar-accordion-item">
              <button
                onClick={handleMainAgentClick}
                className={`sidebar-link ${isAgentActive ? 'active' : ''}`}
                title="AI Agent Studio"
              >
                <div className="flex items-center gap-3">
                  <div className="sidebar-icon-wrap">
                    <Bot size={18} className="link-icon" />
                  </div>
                  <span className="link-text font-semibold">AI Agent</span>
                </div>

                {/* Down Arrow replaces the old 'New' badge */}
                <div
                  className="sidebar-arrow-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAgentMenuOpen(prev => !prev);
                  }}
                  title={isAgentMenuOpen ? 'Collapse Agent Menu' : 'Expand Agent Menu'}
                >
                  <ChevronDown
                    size={16}
                    className={`sidebar-dropdown-arrow transition-transform duration-200 ${
                      isAgentMenuOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'
                    }`}
                  />
                </div>
              </button>

              {/* Collapsible Submenu with History */}
              {isAgentMenuOpen && (
                <div className="sidebar-submenu-box animate-fadeIn">
                  {/* History Page Shortcut */}
                  <button
                    onClick={handleOpenHistory}
                    className={`sidebar-sub-link ${currentView === 'history' ? 'active-sub' : ''}`}
                    title="View all launched agents and history details"
                  >
                    <div className="flex items-center gap-2">
                      <History size={14} className="text-purple-600" />
                      <span className="text-xs font-semibold">History</span>
                    </div>
                    {agentHistory && agentHistory.length > 0 && (
                      <span className="sub-counter-badge">{agentHistory.length}</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Upgrade to Pro Tab (Visible for first 15 seconds on website open) */}
        {showProBanner && (
          <div className="sidebar-pro-tab-card animate-fadeIn">
            <div className="sidebar-pro-tab-header">
              <div className="flex items-center gap-1.5 font-bold text-xs text-blue-600 dark:text-blue-400">
                <Sparkles size={14} className="text-amber-500 animate-pulse" />
                <span>Thamili AI Pro</span>
              </div>
              <span className="sidebar-pro-tab-timer" title={`${proSecondsLeft}s remaining before moving to profile`}>
                {proSecondsLeft}s
              </span>
            </div>
            <p className="sidebar-pro-tab-desc">
              Unlock all pro AI tools and models
            </p>
            <button
              onClick={() => setIsProModalOpen(true)}
              className="sidebar-pro-tab-btn"
            >
              <span>Explore Pro Tools</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* User Profile Footer - Navigates to Dedicated User Details Page */}
        <div className="sidebar-user-section">
          <div
            className={`user-profile-row ${isProfileActive ? 'profile-active' : ''}`}
            onClick={handleProfileClick}
            title="Click to view User Profile & Account Details"
          >
            <div className="user-avatar-tag">{userProfile.avatar || 'VK'}</div>
            <div className="user-meta-details">
              <span className="user-full-name">{userProfile.name}</span>
              <span className="user-role-status">{userProfile.email}</span>
            </div>
            <ChevronRight
              size={15}
              className={`user-dropdown-caret transition-transform duration-200 ${
                isProfileActive ? 'text-blue-600 translate-x-0.5' : 'text-gray-400'
              }`}
            />
          </div>
        </div>
      </aside>

      {/* Pro Features Modal */}
      {isProModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsProModalOpen(false)}>
          <div className="profile-modal-card animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold">
                  <Sparkles size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thamili AI Pro</h3>
                  <p className="text-xs text-gray-500">Advanced AI Agent Architecture</p>
                </div>
              </div>
              <button
                onClick={() => setIsProModalOpen(false)}
                className="btn-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="profile-modal-body">
              <div className="profile-detail-card space-y-3">
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500">Autonomous Agents</span>
                  <span className="text-xs font-semibold text-emerald-600">Unlimited Creation</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500">Voice Synthesis Engine</span>
                  <span className="text-xs font-semibold text-blue-600">Real-Time WebRTC LiveKit</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500">Custom Knowledge Bases</span>
                  <span className="text-xs font-semibold text-purple-600">PDF, Docs & Code RAG</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-gray-500">Active Account</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{userProfile.email}</span>
                </div>
              </div>
            </div>

            <div className="profile-modal-footer">
              <button
                onClick={() => setIsProModalOpen(false)}
                className="btn-modal-done"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsProfileModalOpen(false)}>
          <div className="profile-modal-card animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <div className="flex items-center gap-3">
                <div className="modal-profile-avatar">{userProfile.avatar}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{userProfile.name}</h3>
                  <p className="text-xs text-gray-500">{userProfile.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="btn-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="profile-modal-body">
              <div className="profile-detail-card">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500">Account Role</span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {userProfile.role}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500">Membership Tier</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    <ShieldCheck size={12} />
                    Verified Pro
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500">Active Agents Launched</span>
                  <span className="text-xs font-bold text-blue-600">
                    {agentHistory.length} Agents
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-gray-500">Language System</span>
                  <span className="text-xs font-semibold text-blue-600">
                    English (Default)
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-modal-footer">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="btn-modal-done"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Toast Notification */}
      {logoutNotice && (
        <div className="logout-toast-notification animate-bounceIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Session saved. Logged out of <strong>{userProfile.name}</strong></span>
          </div>
        </div>
      )}
    </>
  );
}
