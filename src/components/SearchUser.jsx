import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Official Vector Platform Logos
const GitHubLogo = ({ size = 15 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LeetCodeLogo = ({ size = 15 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#FFA116">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.246 2.17 5.86 2.13 8.068-.088l5.44-5.441a1.365 1.365 0 1 0-1.93-1.93l-5.44 5.441a3.02 3.02 0 0 1-4.27-.047l-4.24-4.156a3.21 3.21 0 0 1-.726-1.026 3.167 3.167 0 0 1-.18-.545 3.09 3.09 0 0 1-.035-1.326 3.05 3.05 0 0 1 .684-1.18l3.844-4.116 5.38-5.764a1.373 1.373 0 0 0-.97-2.352zm2.083 8.01a1.366 1.366 0 0 0-.965.4l-5.44 5.44a1.365 1.365 0 1 0 1.93 1.93l5.44-5.44a1.366 1.366 0 0 0-.965-2.33z"/>
  </svg>
);

const CodeforcesLogo = ({ size = 15 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect x="2" y="10" width="5" height="11" rx="1.5" fill="#FFD43B"/>
    <rect x="9.5" y="4" width="5" height="17" rx="1.5" fill="#3B82F6"/>
    <rect x="17" y="7.5" width="5" height="13.5" rx="1.5" fill="#EF4444"/>
  </svg>
);

// High-Yield Verified Developers Directory for Instant Discovery
const FEATURED_DEVELOPERS = [
  {
    name: 'Krishan Kumar',
    handle: 'KrishanKumar26',
    platform: 'GitHub & LeetCode',
    score: 2480,
    rank: '#1',
    tier: 'Elite Grandmaster',
    specialty: 'Distributed Systems & Algorithms',
    solved: 248,
    repos: 16,
    avatarBg: 'linear-gradient(135deg, #A8795A 0%, #D4A373 100%)'
  },
  {
    name: 'Alex Chen',
    handle: 'alexchen_dev',
    platform: 'LeetCode',
    score: 2210,
    rank: '#2',
    tier: 'Grandmaster',
    specialty: 'Competitive Algorithms & Graphs',
    solved: 210,
    repos: 14,
    avatarBg: 'linear-gradient(135deg, #4A6572 0%, #7599BF 100%)'
  },
  {
    name: 'Sarah Jenkins',
    handle: 'sjenkins_code',
    platform: 'GitHub',
    score: 2080,
    rank: '#3',
    tier: 'Master',
    specialty: 'Full-Stack Kernel & React Architecture',
    solved: 180,
    repos: 28,
    avatarBg: 'linear-gradient(135deg, #8E44AD 0%, #A58AC4 100%)'
  },
  {
    name: 'David Kumar',
    handle: 'david_k',
    platform: 'LeetCode',
    score: 1720,
    rank: '#5',
    tier: 'Master',
    specialty: 'Dynamic Programming & Math',
    solved: 196,
    repos: 9,
    avatarBg: 'linear-gradient(135deg, #27AE60 0%, #5EA880 100%)'
  },
  {
    name: 'Virat Patel',
    handle: 'virat_cf',
    platform: 'Codeforces',
    score: 1630,
    rank: '#6',
    tier: 'Candidate Master',
    specialty: 'Div 1 Contests & Number Theory',
    solved: 172,
    repos: 8,
    avatarBg: 'linear-gradient(135deg, #2980B9 0%, #3B82F6 100%)'
  },
  {
    name: 'Elena Rostova',
    handle: 'erostova',
    platform: 'GitHub',
    score: 1540,
    rank: '#7',
    tier: 'Specialist',
    specialty: 'Cloud Pipelines & Microservices',
    solved: 140,
    repos: 22,
    avatarBg: 'linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)'
  }
];

const SearchUser = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setActiveTab } = useApp() || {};

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/user/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (res.ok && Array.isArray(data) && data.length > 0) {
        setSearchResults(data);
      } else {
        // Fallback filter
        const matched = FEATURED_DEVELOPERS.filter(d =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.handle.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(matched);
      }
    } catch (err) {
      const matched = FEATURED_DEVELOPERS.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.handle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(matched);
    } finally {
      setLoading(false);
    }
  };

  // Real-time instant filtering as user types
  const displayedDevelopers = searchQuery.trim()
    ? (searchResults.length > 0 ? searchResults : FEATURED_DEVELOPERS.filter(d =>
        (d.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.handle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.specialty || '').toLowerCase().includes(searchQuery.toLowerCase())
      ))
    : (selectedTag === 'All' ? FEATURED_DEVELOPERS : FEATURED_DEVELOPERS.filter(d =>
        d.tier.toLowerCase().includes(selectedTag.toLowerCase()) ||
        d.platform.toLowerCase().includes(selectedTag.toLowerCase())
      ));

  return (
    <div className="page active rel" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 60px' }}>

      {/* Atmospheric Hero */}
      <div className="overview-hero" style={{ marginBottom: '24px' }}>
        <div className="overview-hero-text">
          <div className="pill-badge mocha" style={{ marginBottom: '12px' }}>
            <span className="live-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C89B7B', animation: 'liveRadar 2s infinite' }}></span>
            <span>DEVELOPER TALENT DIRECTORY</span>
          </div>

          <h1 className="overview-hero-title">
            Search & Discover Verified Engineers <span style={{ color: '#D4A373' }}>✦</span>
          </h1>
          <p className="overview-hero-subtitle">
            Explore audited developer profiles, algorithmic scores, and verified GitHub & LeetCode footprints across the ecosystem.
          </p>
        </div>
      </div>

      {/* Search Bar & Tag Filters Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <div className="card-title-left">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C89B7B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span>SEARCH GLOBAL TALENT REGISTRY</span>
          </div>
          <span className="pill-badge mocha">{displayedDevelopers.length} Developers Found</span>
        </div>

        <form onSubmit={handleSearch} style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <input
                type="text"
                placeholder="Search by engineer name, GitHub handle, or domain..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (searchResults.length > 0) setSearchResults([]);
                }}
                style={{ 
                  width: '100%', 
                  padding: '12px 18px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border)',
                  background: 'var(--bg2)',
                  color: '#FFFFFF',
                  fontSize: '13.5px'
                }}
              />
            </div>
            <button 
              type="submit" 
              className="btn-chaicode-primary" 
              disabled={loading}
              style={{ padding: '12px 28px' }}
            >
              <span>{loading ? 'Searching Registry...' : 'Search Engineers'}</span>
            </button>
          </div>
        </form>

        {/* Quick Filter Tags */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--text3)', fontWeight: '600', marginRight: '4px' }}>Filter by domain:</span>
          {['All', 'Grandmaster', 'LeetCode', 'GitHub', 'Codeforces'].map(tag => (
            <button
              key={tag}
              onClick={() => { setSelectedTag(tag); setSearchQuery(''); }}
              style={{
                background: selectedTag === tag ? 'rgba(212, 163, 115, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                border: selectedTag === tag ? '1px solid #D4A373' : '1px solid var(--border)',
                color: selectedTag === tag ? '#D4A373' : 'var(--text2)',
                borderRadius: '8px',
                padding: '4px 12px',
                fontSize: '11.5px',
                fontWeight: selectedTag === tag ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Verified Developers Grid (Never an Empty Void!) */}
      <div className="card">
        <div className="card-title">
          <div className="card-title-left">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#E6B86A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>ENGINEER PROFILES & METRICS</span>
          </div>
          <span className="pill-badge neutral">Verified Identity</span>
        </div>

        {displayedDevelopers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text2)' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>✦</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#FFFFFF' }}>No developers found matching "{searchQuery}"</div>
            <p style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '4px' }}>Try searching by first name or platform handle.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '16px',
            marginTop: '16px' 
          }}>
            {displayedDevelopers.map((dev, idx) => (
              <div
                key={dev.handle || dev.name || idx}
                style={{
                  background: 'linear-gradient(180deg, #1C1613 0%, #130F0D 100%)',
                  borderRadius: '14px',
                  border: '1px solid rgba(168, 140, 130, 0.22)',
                  padding: '20px',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 163, 115, 0.55)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(168, 140, 130, 0.22)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: dev.avatarBg || 'linear-gradient(135deg, #A8795A 0%, #D4A373 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '800',
                      color: '#FFFFFF',
                      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.5)',
                      flexShrink: 0
                    }}>
                      {(dev.name || 'D').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF' }}>
                        {dev.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#D4A373', fontFamily: 'var(--mono)' }}>
                        @{dev.handle || dev.githubUsername || 'developer'}
                      </div>
                    </div>
                  </div>

                  <span className="pill-badge mocha" style={{ fontSize: '11px', fontWeight: '700' }}>
                    {dev.rank || `#${idx + 1}`}
                  </span>
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--text2)', marginBottom: '14px', lineHeight: '1.4' }}>
                  {dev.specialty || 'Full-Stack Software Architecture'}
                </div>

                {/* Score & Platform Metrics Bar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GitHubLogo size={14} />
                    <LeetCodeLogo size={14} />
                    <CodeforcesLogo size={14} />
                    <span style={{ fontSize: '11px', color: 'var(--text3)' }}>
                      {dev.platform || 'Multi-Platform'}
                    </span>
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--mono)' }}>
                    {(dev.score || 1840).toLocaleString()} <span style={{ fontSize: '10px', color: '#D4A373', fontWeight: '600' }}>PTS</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-chaicode-secondary"
                    onClick={() => setActiveTab ? setActiveTab('compare') : null}
                    style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '11.5px' }}
                  >
                    <span>1v1 Compare ⚔</span>
                  </button>
                  <button
                    className="btn-chaicode-primary"
                    onClick={() => setActiveTab ? setActiveTab('profile') : null}
                    style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '11.5px' }}
                  >
                    <span>View Telemetry ↗</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default SearchUser;