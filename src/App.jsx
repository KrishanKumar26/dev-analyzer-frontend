import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/ProfilePage";
import AIPortfolio from "./components/AIPortfolio";
import Activity from "./components/Activity";
import Leaderboard from "./components/Leaderboard";
import SearchUser from "./components/SearchUser";
import CommandPalette from "./components/CommandPalette";
import ShortcutsHelp from "./components/ShortcutsHelp";
import { AppProvider, useApp } from "./context/AppContext";

const TAB_ORDER = ["overview", "leaderboard", "activity", "search", "insights", "profile"];

function AppShell({ user, setUser }) {
  const { activeTab, setActiveTab, toasts, addToast, theme, toggleTheme, setPaletteOpen, setShortcutsOpen, logout } = useApp();

  useEffect(() => {
    if (user) {
      const messages = {
        overview: "Systems Synced 🟢",
        activity: "Activity Feed Loaded 📊",
        leaderboard: "Leaderboard Updated 🏆",
        search: "Search Engine Ready 🔍",
        insights: "AI Engine Initialized 🤖",
        profile: "Identity Verified 🛡️"
      };
      if (messages[activeTab]) {
        addToast(messages[activeTab], 'info');
      }
    }
  }, [activeTab, user]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const target = e.target;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }

      if (isTyping) return;

      if (e.key === "?") {
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }

      if (e.altKey) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < TAB_ORDER.length) {
          e.preventDefault();
          setActiveTab(TAB_ORDER[idx]);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setPaletteOpen, setShortcutsOpen, setActiveTab]);

  return (
    <div id="app">
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span className="toast-icon">
              {t.type === 'success' ? '⚡' : t.type === 'info' ? '📡' : '⚠️'}
            </span>
            {t.message}
          </div>
        ))}
      </div>

      {!user ? (
        <Auth setUser={(userData) => {
          setUser(userData);
          addToast('Welcome, ' + userData.name.split(' ')[0] + ' 👋', 'success');
        }} />
      ) : (
        <>
          <CommandPalette />
          <ShortcutsHelp />

          <nav className="navbar">
            <div className="nav-logo" onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer' }}>
              <div className="logo-icon-wrapper">
                <div className="pulse"></div>
                <div className="orbit-ring"></div>
              </div>
              <span className="logo-text">
                VOR<span className="logo-accent">TEX</span>
              </span>
            </div>

            <div className="nav-tabs">
              <button className={'nav-tab ' + (activeTab === 'overview' ? 'active' : '')} onClick={() => setActiveTab('overview')}>Overview</button>
              <button className={'nav-tab ' + (activeTab === 'leaderboard' ? 'active' : '')} onClick={() => setActiveTab('leaderboard')}>Leaderboard</button>
              <button className={'nav-tab ' + (activeTab === 'activity' ? 'active' : '')} onClick={() => setActiveTab('activity')}>Activity</button>
              <button className={'nav-tab ' + (activeTab === 'search' ? 'active' : '')} onClick={() => setActiveTab('search')}>🔍 Search</button>
              <button className={'nav-tab ' + (activeTab === 'insights' ? 'active' : '')} onClick={() => setActiveTab('insights')}>Insights</button>
              <button className={'nav-tab ' + (activeTab === 'profile' ? 'active' : '')} onClick={() => setActiveTab('profile')}>Profile</button>
            </div>

            <div className="nav-actions">
              <button className="palette-trigger" onClick={() => setPaletteOpen(true)} title="Command Palette">
                🔎 <span className="kbd">⌘K</span>
              </button>
              <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button className="logout-btn" onClick={logout} title="Logout">Logout</button>

              <div className="nav-user" onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer' }}>
                <div className="user-info-text" style={{ textAlign: 'right', marginRight: '12px' }}>
                  <span className="user-name" style={{ display: 'block', fontSize: '14px', fontWeight: '600' }}>
                    {user.name}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--primary)', opacity: 0.8, fontFamily: 'monospace' }}>
                    ONLINE ●
                  </span>
                </div>
                <div className="avatar" style={{ border: '2px solid var(--primary)', position: 'relative' }}>
                  {user.name ? user.name.substring(0, 2).toUpperCase() : "KK"}
                  <div style={{ position: 'absolute', bottom: '0', right: '0', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', border: '2px solid var(--bg)' }}></div>
                </div>
              </div>
            </div>
          </nav>

          <div className="rel">
            {activeTab === 'overview' && <Dashboard user={user} />}
            {activeTab === 'leaderboard' && <Leaderboard user={user} />}
            {activeTab === 'activity' && <Activity user={user} />}
            {activeTab === 'search' && <SearchUser user={user} />}
            {activeTab === 'insights' && <AIPortfolio user={user} />}
            {activeTab === 'profile' && <ProfilePage user={user} setUser={setUser} />}
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AppProvider user={user} setUser={setUser} activeTab={activeTab} setActiveTab={setActiveTab}>
      <AppShell user={user} setUser={setUser} />
    </AppProvider>
  );
}

export default App;
