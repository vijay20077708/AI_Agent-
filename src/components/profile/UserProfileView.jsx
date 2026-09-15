import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import {
  User,
  Mail,
  Briefcase,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Save,
  RotateCcw,
  Bot,
  History,
  Radio,
  Zap,
  LogOut,
  Sliders,
  Globe
} from 'lucide-react';

export function UserProfileView() {
  const {
    userProfile,
    setUserProfile,
    agentHistory,
    setCurrentView
  } = useAgent();

  const [formData, setFormData] = useState({
    name: userProfile.name || 'Vijay',
    email: userProfile.email || 'vijay@thamili',
    role: userProfile.role || 'AI Agent Architect',
    avatar: userProfile.avatar || 'VK',
    language: 'English & Tamil',
    bio: 'AI Agent Architect exploring autonomous voice agents and domain-specific knowledge models.'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [logoutNotice, setLogoutNotice] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name: formData.name.trim() || prev.name,
      email: formData.email.trim() || prev.email,
      role: formData.role.trim() || prev.role,
      avatar: formData.avatar.trim() || prev.avatar,
      plan: prev.plan || 'Pro Plan'
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    const defaultData = {
      name: 'Vijay',
      email: 'vijay@thamili',
      role: 'AI Agent Architect',
      avatar: 'VK',
      language: 'English & Tamil',
      bio: 'AI Agent Architect exploring autonomous voice agents and domain-specific knowledge models.'
    };
    setFormData(defaultData);
    setUserProfile(prev => ({
      ...prev,
      name: 'Vijay',
      email: 'vijay@thamili',
      role: 'AI Agent Architect',
      avatar: 'VK'
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = () => {
    setLogoutNotice(true);
    setTimeout(() => {
      setLogoutNotice(false);
      setCurrentView('agent-hub');
    }, 2500);
  };

  return (
    <div className="user-profile-page-wrapper">
      {/* Top Breadcrumb / Back Bar */}
      <div className="user-profile-top-bar">
        <button
          onClick={() => setCurrentView('agent-hub')}
          className="btn-back-hub"
          title="Return to Agent Hub"
        >
          <ArrowLeft size={16} />
          <span>Back to Agent Hub</span>
        </button>
        <span className="profile-page-tag">Account Overview</span>
      </div>

      {/* Main Profile Header */}
      <div className="user-profile-header-banner">
        <div className="profile-header-avatar-circle">
          <span>{formData.avatar || 'VK'}</span>
          <div className="profile-verified-badge" title="Verified Account">
            <ShieldCheck size={14} />
          </div>
        </div>

        <div className="profile-header-info">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="profile-header-name">{userProfile.name}</h1>
            <span className="profile-pro-chip">
              <Sparkles size={12} className="text-amber-500" />
              <span>{userProfile.plan || 'Pro Plan'}</span>
            </span>
          </div>
          <p className="profile-header-email">{userProfile.email}</p>
          <p className="profile-header-role">{userProfile.role}</p>
        </div>

        <div className="profile-header-actions">
          <button
            onClick={() => setCurrentView('history')}
            className="btn-profile-secondary"
            title="View Launched Agents"
          >
            <History size={15} />
            <span>Agent History</span>
          </button>
          <button
            onClick={handleLogout}
            className="btn-profile-logout"
            title="Log out of account"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="profile-save-banner animate-slideDown">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>Profile updated and saved successfully!</span>
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

      {/* Profile Content Grid */}
      <div className="user-profile-grid">
        {/* Left Side: Account Statistics & Pro Plan Card */}
        <div className="profile-sidebar-column">
          {/* Stats Overview */}
          <div className="profile-card stats-card">
            <h3 className="profile-card-title">Platform Stats</h3>
            <div className="stats-row-grid">
              <div className="stat-box">
                <span className="stat-label">Active Agents</span>
                <span className="stat-value text-blue-600">{agentHistory ? agentHistory.length : 0}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Plan Status</span>
                <span className="stat-value text-emerald-600">Active</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Voice Latency</span>
                <span className="stat-value text-purple-600">~120ms</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">RAG Memory</span>
                <span className="stat-value text-amber-600">Enabled</span>
              </div>
            </div>
          </div>

          {/* Thamili AI Pro Features Card */}
          <div className="profile-card pro-features-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold">
                  <Sparkles size={16} />
                </div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Thamili AI Pro</h4>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                Active
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              All pro AI tools, custom agent templates, and WebRTC real-time neural voices are unlocked.
            </p>

            <ul className="pro-feature-list">
              <li>
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span>Unlimited Autonomous Custom Agents</span>
              </li>
              <li>
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span>Real-Time WebRTC Neural Speech Engine</span>
              </li>
              <li>
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span>RAG Knowledge Base (PDF, Docs & Code)</span>
              </li>
              <li>
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span>Multi-Domain Autonomous Tool Suite</span>
              </li>
            </ul>

            <button
              onClick={() => setCurrentView('tools')}
              className="btn-explore-tools-full"
            >
              <span>Explore Pro AI Tools</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Right Side: Editable User Details Form */}
        <div className="profile-main-column">
          <div className="profile-card form-card">
            <div className="profile-card-header-row">
              <div>
                <h3 className="profile-card-title">Personal Details</h3>
                <p className="profile-card-subtitle">Update your personal and professional profile information</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="profile-form">
              <div className="form-fields-grid">
                {/* Full Name */}
                <div className="profile-form-group">
                  <label className="profile-form-label">
                    <User size={14} className="text-blue-600" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="profile-form-input"
                    placeholder="e.g. Vijay"
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="profile-form-group">
                  <label className="profile-form-label">
                    <Mail size={14} className="text-blue-600" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="profile-form-input"
                    placeholder="e.g. vijay@thamili"
                    required
                  />
                </div>

                {/* Role / Job Title */}
                <div className="profile-form-group">
                  <label className="profile-form-label">
                    <Briefcase size={14} className="text-blue-600" />
                    <span>Role / Designation</span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="profile-form-input"
                    placeholder="e.g. AI Agent Architect"
                  />
                </div>

                {/* Avatar Initials */}
                <div className="profile-form-group">
                  <label className="profile-form-label">
                    <Sliders size={14} className="text-blue-600" />
                    <span>Avatar Tag</span>
                  </label>
                  <input
                    type="text"
                    name="avatar"
                    maxLength={3}
                    value={formData.avatar}
                    onChange={handleChange}
                    className="profile-form-input"
                    placeholder="e.g. VK"
                  />
                </div>

                {/* Language Preference */}
                <div className="profile-form-group">
                  <label className="profile-form-label">
                    <Globe size={14} className="text-blue-600" />
                    <span>Language Preference</span>
                  </label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="profile-form-input"
                    placeholder="e.g. English & Tamil"
                  />
                </div>

                {/* Subscription Tier (Readonly) */}
                <div className="profile-form-group">
                  <label className="profile-form-label">
                    <Zap size={14} className="text-blue-600" />
                    <span>Membership Plan</span>
                  </label>
                  <input
                    type="text"
                    value="Thamili AI Pro (Lifetime Access)"
                    readOnly
                    className="profile-form-input input-readonly"
                  />
                </div>
              </div>

              {/* Bio / Domain Focus */}
              <div className="profile-form-group mt-3">
                <label className="profile-form-label">
                  <span>Professional Bio / Domain Specialization</span>
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="profile-form-textarea"
                  placeholder="Tell us about your background or how you use AI Agents..."
                />
              </div>

              {/* Form Buttons */}
              <div className="profile-form-actions">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-form-reset"
                  title="Reset to default details"
                >
                  <RotateCcw size={15} />
                  <span>Reset Defaults</span>
                </button>

                <button
                  type="submit"
                  className="btn-form-save"
                >
                  <Save size={15} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
