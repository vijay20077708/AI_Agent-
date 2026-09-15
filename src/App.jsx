import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AgentProvider } from './context/AgentContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HomeScreen } from './components/home/HomeScreen';
import { AgentHub } from './components/agent/AgentHub';
import { CreateAgentForm } from './components/agent/CreateAgentForm';
import { ChooseAgentScreen } from './components/agent/ChooseAgentScreen';
import { AgentSidePreview } from './components/agent/AgentSidePreview';
import {
  AIChatView,
  AIImageView,
  AIVideoView,
  AILearnView
} from './components/ecosystem/OtherViews';
import { AICodeView } from './components/ecosystem/AICodeView';
import { MoreToolsView } from './components/ecosystem/MoreToolsView';
import { HistoryView } from './components/ecosystem/HistoryView';
import { SavedView } from './components/ecosystem/SavedView';
import { UserProfileView } from './components/profile/UserProfileView';
import './App.css';

function MainAppShell() {
  return (
    <div className="aurqo-root-layout">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Center Content View */}
      <div className="aurqo-main-view-wrapper">
        <Header />
        <main className="aurqo-main-stage">
          <Routes>
            {/* Primary /thamili prefixed routes */}
            <Route path="/" element={<Navigate to="/thamili/agent-hub" replace />} />
            <Route path="/thamili" element={<Navigate to="/thamili/agent-hub" replace />} />
            <Route path="/thamili/agent-hub" element={<AgentHub />} />
            <Route path="/thamili/create-agent" element={<CreateAgentForm />} />
            <Route path="/thamili/choose-agent" element={<ChooseAgentScreen />} />
            <Route path="/thamili/profile" element={<UserProfileView />} />
            <Route path="/thamili/home" element={<HomeScreen />} />
            <Route path="/thamili/chat" element={<AIChatView />} />
            <Route path="/thamili/code" element={<AICodeView />} />
            <Route path="/thamili/image" element={<AIImageView />} />
            <Route path="/thamili/video" element={<AIVideoView />} />
            <Route path="/thamili/learn" element={<AILearnView />} />
            <Route path="/thamili/tools" element={<MoreToolsView />} />
            <Route path="/thamili/history" element={<HistoryView />} />
            <Route path="/thamili/saved" element={<SavedView />} />

            {/* Non-prefixed paths gracefully redirect to /thamili/... */}
            <Route path="/agent-hub" element={<Navigate to="/thamili/agent-hub" replace />} />
            <Route path="/create-agent" element={<Navigate to="/thamili/create-agent" replace />} />
            <Route path="/choose-agent" element={<Navigate to="/thamili/choose-agent" replace />} />
            <Route path="/profile" element={<Navigate to="/thamili/profile" replace />} />
            <Route path="/history" element={<Navigate to="/thamili/history" replace />} />
            <Route path="/tools" element={<Navigate to="/thamili/tools" replace />} />
            <Route path="/home" element={<Navigate to="/thamili/home" replace />} />

            {/* Fallback to /thamili/agent-hub */}
            <Route path="*" element={<Navigate to="/thamili/agent-hub" replace />} />
          </Routes>
        </main>
      </div>

      {/* Side Preview Tab / Drawer */}
      <AgentSidePreview />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AgentProvider>
        <MainAppShell />
      </AgentProvider>
    </BrowserRouter>
  );
}

export default App;
