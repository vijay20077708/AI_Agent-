import React from 'react';
import { useAgent } from '../context/AgentContext';
import { Bot, RotateCcw, ArrowLeft, Sparkles, Activity } from 'lucide-react';

export function Navbar() {
  const { currentScreen, backToCreator, resetForm, agentConfig } = useAgent();

  return (
    <header className="navbar-emerald">
      <div className="navbar-left">
        <div className="navbar-brand-logo">
          <Bot size={22} className="text-emerald-700" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="navbar-title">AURQO Agent Studio</h1>
            <span className="navbar-badge">v2.0 Neural</span>
          </div>
          <p className="navbar-tagline">Multi-Domain AI Agent & Voice Engine</p>
        </div>
      </div>

      <div className="navbar-right">
        {currentScreen === 'preview' ? (
          <button
            onClick={backToCreator}
            className="btn-nav-outline"
          >
            <ArrowLeft size={16} />
            <span>Edit Agent Settings</span>
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="btn-nav-ghost"
            title="Reset Form"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        )}

        <div className="navbar-status-pill">
          <span className="status-live-dot" />
          <span>{currentScreen === 'preview' ? 'Voice Session Live' : 'Creator Ready'}</span>
        </div>
      </div>
    </header>
  );
}
