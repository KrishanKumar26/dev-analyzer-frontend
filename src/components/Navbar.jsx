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
        {/* Command Palette Button */}
        <button 
          className="cmd-palette-btn" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '10px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(139, 92, 246, 0.15)';
            e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(139, 92, 246, 0.1)';
            e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)';
          }}
          title="Quick search"
        >
          <span style={{ fontSize: '16px' }}>🔍</span>
          <span style={{ fontSize: '11px', opacity: 0.6, fontFamily: 'monospace' }}>⌘K</span>
        </button>

        {/* Theme Toggle */}
        <button 
          className="theme-toggle" 
          onClick={toggleTheme} 
          title="Toggle theme"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Logout Button */}
        <button 
          className="logout-btn" 
          onClick={logout} 
          title="Logout"
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            background: 'rgba(239, 68, 68, 0.05)',
            color: '#ef4444',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(239, 68, 68, 0.1)';
            e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(239, 68, 68, 0.05)';
            e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          }}
        >
          Logout
        </button>

        {/* User Profile */}
        <div 
          className="nav-user" 
          onClick={() => setActiveTab('profile')} 
          style={{ 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 12px 6px 6px',
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '12px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.12)';
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
          }}
        >
          <div 
            className="avatar" 
            style={{ 
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '700',
              borderRadius: '10px',
              color: '#fff'
            }}
          >
            {user?.name ? user.name.substring(0, 2).toUpperCase() : "DV"}
            <div style={{ 
              position: 'absolute', 
              bottom: '-2px', 
              right: '-2px', 
              width: '10px', 
              height: '10px', 
              background: '#10b981', 
              borderRadius: '50%', 
              border: '2px solid var(--bg)',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)'
            }}></div>
          </div>
          <div className="user-info-text" style={{ textAlign: 'left' }}>
            <span className="user-name" style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600',
              color: 'var(--text)',
              marginBottom: '2px'
            }}>
              {user?.name || 'Developer'}
            </span>
            <span style={{ 
              fontSize: '11px', 
              color: '#10b981', 
              fontWeight: '600',
              fontFamily: 'monospace',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{ 
                width: '6px', 
                height: '6px', 
                background: '#10b981', 
                borderRadius: '50%',
                display: 'inline-block',
                boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)'
              }}></span>
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
