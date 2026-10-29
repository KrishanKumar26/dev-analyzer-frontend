import React from 'react';

const Navbar = ({ activeTab, setActiveTab, user, logout, toggleTheme, theme }) => {
  return (
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
        <button className={'nav-tab ' + (activeTab === 'groups' ? 'active' : '')} onClick={() => setActiveTab('groups')}>Groups</button>
        <button className={'nav-tab ' + (activeTab === 'goals' ? 'active' : '')} onClick={() => setActiveTab('goals')}>Goals</button>
        <button className={'nav-tab ' + (activeTab === 'activity' ? 'active' : '')} onClick={() => setActiveTab('activity')}>Activity</button>
        <button className={'nav-tab ' + (activeTab === 'compare' ? 'active' : '')} onClick={() => setActiveTab('compare')}>Compare</button>
        <button className={'nav-tab ' + (activeTab === 'search' ? 'active' : '')} onClick={() => setActiveTab('search')}>🔍 Search</button>
        <button className={'nav-tab ' + (activeTab === 'insights' ? 'active' : '')} onClick={() => setActiveTab('insights')}>Insights</button>
        <button className={'nav-tab ' + (activeTab === 'profile' ? 'active' : '')} onClick={() => setActiveTab('profile')}>Profile</button>
      </div>

      <div className="nav-actions">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="logout-btn" onClick={logout} title="Logout">Logout</button>

        <div className="nav-user" onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer' }}>
          <div className="user-info-text" style={{ textAlign: 'right', marginRight: '12px' }}>
            <span className="user-name" style={{ display: 'block', fontSize: '14px', fontWeight: '600' }}>
              {user?.name || 'User'}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--primary)', opacity: 0.8, fontFamily: 'monospace' }}>
              ONLINE ●
            </span>
          </div>
          <div className="avatar" style={{ border: '2px solid var(--primary)', position: 'relative' }}>
            {user?.name ? user.name.substring(0, 2).toUpperCase() : "KK"}
            <div style={{ position: 'absolute', bottom: '0', right: '0', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', border: '2px solid var(--bg)' }}></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
