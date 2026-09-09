import React from 'react';
import { useAgent } from '../../context/AgentContext';
import { Plus, Bot } from 'lucide-react';

export function AgentHub() {
  const { setCurrentView, openLiveRobotGuide } = useAgent();

  return (
    <div className="thamili-hub-container">
      {/* Floating 3D Robot Assistant on the Right Side from Photo */}
      <div
        className="thamili-side-robot-widget"
        onClick={() => openLiveRobotGuide()}
        title="Click to interact with 3D Live Robot Guide"
      >
        <img
          src="/assets/robot-assistant.png"
          alt="3D Live Robot"
          className="thamili-floating-robot-img"
        />
        <div className="thamili-robot-status-pill">
          <div className="robot-pill-row">
            <span className="robot-green-dot" />
            <span className="robot-pill-title">3D Robot Online</span>
          </div>
          <span className="robot-pill-subtitle">Platform Guide • Voice Active</span>
        </div>
      </div>

      {/* Centered Thamili Brand Title from Photo */}
      <div className="thamili-center-brand-box">
        <img
          src="/assets/thamili-title.png"
          alt="Thamili"
          className="thamili-center-logo-img"
        />
      </div>

      {/* Two Neat, Clean English Cards */}
      <div className="thamili-cards-grid">
        {/* Create Agent Card */}
        <div
          className="thamili-hero-card"
          onClick={() => setCurrentView('create-agent')}
        >
          <div className="thamili-hero-icon-circle">
            <Plus size={34} strokeWidth={2.2} />
          </div>
          <h3 className="thamili-hero-title">Create Agent</h3>
          <p className="thamili-hero-subtitle">Build a custom agent</p>
          <button
            className="thamili-hero-pill-btn"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentView('create-agent');
            }}
          >
            <span>Create</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>

        {/* Choose Agent Card */}
        <div
          className="thamili-hero-card"
          onClick={() => setCurrentView('choose-agent')}
        >
          <div className="thamili-hero-icon-circle">
            <Bot size={34} strokeWidth={2.2} />
          </div>
          <h3 className="thamili-hero-title">Choose Agent</h3>
          <p className="thamili-hero-subtitle">Select ready templates</p>
          <button
            className="thamili-hero-pill-btn"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentView('choose-agent');
            }}
          >
            <span>Choose</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}


