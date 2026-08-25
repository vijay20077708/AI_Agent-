import React from 'react';
import { AgentProvider, useAgent } from './context/AgentContext';
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
  const { currentView } = useAgent();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeScreen />;
      case 'agent-hub':
        return <AgentHub />;
      case 'create-agent':
        return <CreateAgentForm />;
      case 'choose-agent':
        return <ChooseAgentScreen />;
      case 'chat':
        return <AIChatView />;
      case 'code':
        return <AICodeView />;
      case 'image':
        return <AIImageView />;
      case 'video':
        return <AIVideoView />;
      case 'learn':
        return <AILearnView />;
      case 'tools':
        return <MoreToolsView />;
      case 'history':
        return <HistoryView />;
      case 'saved':
        return <SavedView />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="aurqo-root-layout">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Center Content View */}
      <div className="aurqo-main-view-wrapper">
        <Header />
        <main className="aurqo-main-stage">
          {renderCurrentView()}
        </main>
      </div>

      {/* Side Preview Tab / Drawer */}
      <AgentSidePreview />
    </div>
  );
}

function App() {
  return (
    <AgentProvider>
      <MainAppShell />
    </AgentProvider>
  );
}

export default App;
