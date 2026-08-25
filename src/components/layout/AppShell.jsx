import React from 'react';
import { useAgent } from '../../context/AgentContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AgentStudio } from '../agent-studio/AgentStudio';
import { LiveKitPreview } from '../agent-preview/LiveKitPreview';
import { HomeScreen } from '../ecosystem/HomeScreen';
import {
  AIChatScreen,
  AICodeScreen,
  AIImageScreen,
  AIVideoScreen,
  AILearnScreen,
  GenericSettingsScreen
} from '../ecosystem/OtherScreens';

export function AppShell() {
  const { activeTab } = useAgent();

  const renderMainContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'agents':
        return (
          <div className="agent-studio-split-layout">
            <div className="studio-left-column">
              <AgentStudio />
            </div>
            <div className="studio-right-column">
              <LiveKitPreview />
            </div>
          </div>
        );
      case 'chat':
        return <AIChatScreen />;
      case 'code':
        return <AICodeScreen />;
      case 'image':
        return <AIImageScreen />;
      case 'video':
        return <AIVideoScreen />;
      case 'learn':
        return <AILearnScreen />;
      case 'settings':
      case 'history':
      case 'saved':
      case 'tools':
      default:
        return <GenericSettingsScreen />;
    }
  };

  return (
    <div className="aurqo-app-layout">
      {/* Left Sidebar matching uploaded design */}
      <Sidebar />

      {/* Main Content View with Header */}
      <div className="aurqo-main-wrapper">
        <Header />
        <main className="aurqo-main-content">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}
