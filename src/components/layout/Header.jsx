import React from 'react';
import { useAgent } from '../../context/AgentContext';
import { Sun, Moon } from 'lucide-react';

export function Header() {
  const { theme, toggleTheme } = useAgent();

  return (
    <header className="aurqo-topbar">
      <div className="topbar-left" />

      <div className="topbar-right">
        {/* Sun / Moon Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn-theme-toggle"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <Sun size={20} className="text-gray-600 hover:text-amber-500" />
          ) : (
            <Moon size={20} className="text-blue-400" />
          )}
        </button>

        {/* Sign In & Get Started Buttons from image */}
        <div className="auth-buttons-wrap">
          <button className="btn-signin-ghost">Sign In</button>
          <button className="btn-getstarted-solid">Get Started</button>
        </div>
      </div>
    </header>
  );
}
