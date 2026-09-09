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
            <Route path="/" element={<Navigate to="/agent-hub" replace />} />
            <Route path="/agent-hub" element={<AgentHub />} />
            <Route path="/create-agent" element={<CreateAgentForm />} />
            <Route path="/choose-agent" element={<ChooseAgentScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/chat" element={<AIChatView />} />
            <Route path="/code" element={<AICodeView />} />
            <Route path="/image" element={<AIImageView />} />
            <Route path="/video" element={<AIVideoView />} />
            <Route path="/learn" element={<AILearnView />} />
            <Route path="/tools" element={<MoreToolsView />} />
            <Route path="/history" element={<HistoryView />} />
            <Route path="/saved" element={<SavedView />} />
            {/* Fallback to agent-hub */}
            <Route path="*" element={<Navigate to="/agent-hub" replace />} />
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
