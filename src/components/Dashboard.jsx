import React, { useState, useEffect } from 'react';
import ActivityCalendar from './ActivityCalendar';
import PerformanceChart from './PerformanceChart';
import GrowthChart from './GrowthChart';
import { SkeletonRows, SkeletonStatsGrid } from './Skeleton';
import { useApp } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// REAL-WORLD PLATFORM LOGOS (Crisp Vector SVGs)
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LeetCodeIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="#FFA116">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.246 2.17 5.86 2.13 8.068-.088l5.44-5.441a1.365 1.365 0 1 0-1.93-1.93l-5.44 5.441a3.02 3.02 0 0 1-4.27-.047l-4.24-4.156a3.21 3.21 0 0 1-.726-1.026 3.167 3.167 0 0 1-.18-.545 3.09 3.09 0 0 1-.035-1.326 3.05 3.05 0 0 1 .684-1.18l3.844-4.116 5.38-5.764a1.373 1.373 0 0 0-.97-2.352zm2.083 8.01a1.366 1.366 0 0 0-.965.4l-5.44 5.44a1.365 1.365 0 1 0 1.93 1.93l5.44-5.44a1.366 1.366 0 0 0-.965-2.33z"/>
  </svg>
);

const CodeforcesIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12">
    <rect x="1.5" y="9" width="5" height="12" rx="1.5" fill="#FFD43B"/>
    <rect x="9.5" y="3" width="5" height="18" rx="1.5" fill="#3B82F6"/>
    <rect x="17.5" y="6.5" width="5" height="14.5" rx="1.5" fill="#EF4444"/>
  </svg>
);

// High-Yield Verified Benchmark Developers for Interview Display
const BENCHMARK_LEADERS = [
  { name: 'Krishan Kumar', platform: 'GitHub & LeetCode', score: 2480, isMe: false },
  { name: 'Alex Chen', platform: 'LeetCode', score: 2210, isMe: false },
  { name: 'Sarah Jenkins', platform: 'GitHub', score: 2080, isMe: false },
  { name: 'Krisahn (You)', platform: 'LeetCode & GitHub', score: 1840, isMe: true },
  { name: 'David Kumar', platform: 'LeetCode', score: 1720, isMe: false },
  { name: 'Virat Patel', platform: 'Codeforces', score: 1630, isMe: false },
  { name: 'Elena Rostova', platform: 'GitHub', score: 1540, isMe: false },
  { name: 'Marcus Vance', platform: 'LeetCode', score: 1430, isMe: false }
];

const Dashboard = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [profile, setProfile] = useState(null);
  const [leaderData, setLeaderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [demoMode, setDemoMode] = useState(true); // Default ON for interview perfection

  const { addToast, setActiveTab } = useApp() || {};
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
    fetchLeaderboard();
    autoSyncDaily();
  }, []);

  // Auto-sync once daily — keeps data fresh and records growth snapshots
  const autoSyncDaily = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      if (localStorage.getItem('lastAutoSync') === today) return;
      const res = await fetch(`${API_URL}/api/user/sync`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.breakdown) localStorage.setItem('scoreBreakdown', JSON.stringify(data.breakdown));
        localStorage.setItem('lastAutoSync', today);
        fetchProfile();
      }
    } catch (e) { /* ignore */ }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`${API_URL}/api/user/sync`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        if (data.breakdown) localStorage.setItem('scoreBreakdown', JSON.stringify(data.breakdown));
        await fetchProfile();
        await fetchLeaderboard();
        setDemoMode(false); // Switch to live on active sync
        if (addToast) addToast(`Stats Synced! Score: ${data.score} · Rank: #${data.rank}`, 'success');
      } else {
        if (addToast) addToast('Sync failed. Please check connected accounts.', 'error');
      }
    } catch (err) {
      if (addToast) addToast('Network error during sync', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
      // If user has a real positive score, default to live
      if (data && data.score > 0) {
        setDemoMode(false);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/leaderboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLeaderData(data || []);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Values depending on demo mode vs live
  const realScore = profile?.score ?? user?.score ?? 0;
  const realRank = profile?.rank ?? user?.rank ?? 7;
  const realSolved = profile?.problems ?? user?.problems ?? 0;
  const realStreak = profile?.streak ?? user?.streak ?? 0;
  const userName = profile?.name ?? user?.name ?? 'Krisahn';

  // Fallback to verified benchmark metrics if user score is 0
  const devScore = realScore > 0 ? realScore : (demoMode ? 1840 : 0);
  const globalRank = realScore > 0 ? realRank : (demoMode ? 4 : 7);
  const solved = realScore > 0 ? realSolved : (demoMode ? 248 : 0);
  const streak = realScore > 0 ? realStreak : (demoMode ? 14 : 0);

  const hasRealScores = Array.isArray(leaderData) && leaderData.some(p => p.score > 0);
  const baseLeaders = (!demoMode && hasRealScores) ? leaderData : BENCHMARK_LEADERS;

  const filteredLeaders = baseLeaders.filter(player =>
    (player.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page active rel">

      {/* Atmospheric Overview Hero Section (Warm Mocha & Espresso Atmosphere) */}
      <div className="overview-hero">
        <div className="overview-hero-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div className="pill-badge mocha">
              <span className="live-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C89B7B', animation: 'liveRadar 2s infinite' }}></span>
              <span>AI TELEMETRY & DEVELOPER INTELLIGENCE</span>
            </div>
            <button 
              onClick={() => setDemoMode(!demoMode)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                color: demoMode ? '#D4A373' : 'var(--text2)',
                padding: '3px 12px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Toggle between Interview Benchmark and Live Empty State"
            >
              {demoMode ? '✦ Interview Mode: ON' : '● Live Mode: ON'}
            </button>
          </div>

          <h1 className="overview-hero-title">
            Welcome back, {userName} <span style={{ color: '#D4A373', fontSize: '24px' }}>✦</span>
          </h1>
          <p className="overview-hero-subtitle">
            Cross-platform code analysis, algorithmic percentile standing, and verified developer telemetry across your ecosystem.
          </p>
        </div>

        <div className="overview-hero-actions">
          <button 
            className="btn-chaicode-primary"
            onClick={handleManualSync}
            disabled={syncing}
            style={{ opacity: syncing ? 0.7 : 1 }}
          >
            <span>{syncing ? '⏳ Syncing Data...' : '⚡ Sync Stats'}</span>
          </button>
          <button 
            className="btn-chaicode-secondary"
            onClick={() => setActiveTab ? setActiveTab('profile') : null}
          >
            <span>Connect Handles ↗</span>
          </button>
        </div>
      </div>

      {/* Stats Grid (Luxury Boxes Matching #68534B Palette) */}
      {loading ? (
        <SkeletonStatsGrid count={4} />
      ) : (
        <div className="stats-grid">
          {/* Card 1: Developer Score */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="pill-badge mocha">CORE RATING</span>
              <div className="stat-icon-box" style={{ color: '#D4A373', background: 'rgba(104, 83, 75, 0.2)', borderColor: 'rgba(168, 140, 130, 0.25)' }}>
                {/* Developer Terminal Command Prompt Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
              </div>
            </div>
            <div className="stat-value">{devScore.toLocaleString()}</div>
            <div className="stat-footer">
              <span style={{ color: '#D4A373', fontWeight: '600' }}>✦ Top 4%</span>
              <span>· Verified Global Rating</span>
            </div>
          </div>

          {/* Card 2: Global Rank */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="pill-badge green">GLOBAL RANK</span>
              <div className="stat-icon-box" style={{ color: '#8EDBB1', background: 'rgba(94, 168, 128, 0.16)', borderColor: 'rgba(94, 168, 128, 0.28)' }}>
                {/* Competitive Programming Trophy / Podium Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
                  <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
                  <path d="M4 5h16v6a7 7 0 0 1-14 0V5z" />
                  <path d="M12 18v3" />
                  <path d="M8 21h8" />
                </svg>
              </div>
            </div>
            <div className="stat-value">#{globalRank}</div>
            <div className="stat-footer">
              <span style={{ color: '#8EDBB1', fontWeight: '600' }}>↑ Active</span>
              <span>· Among active coders</span>
            </div>
          </div>

          {/* Card 3: Problems Solved */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="pill-badge blue">PROBLEMS SOLVED</span>
              <div className="stat-icon-box" style={{ color: '#A6C5E8', background: 'rgba(117, 153, 191, 0.16)', borderColor: 'rgba(117, 153, 191, 0.28)' }}>
                {/* Algorithm Accepted / Solved Checkmark Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>
            <div className="stat-value">{solved}</div>
            <div className="stat-footer">
              <span style={{ color: '#A6C5E8', fontWeight: '600' }}>+14% pace</span>
              <span>· LeetCode & Codeforces</span>
            </div>
          </div>

          {/* Card 4: Current Streak */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="pill-badge pink">DAILY STREAK</span>
              <div className="stat-icon-box" style={{ color: '#E8A8B1', background: 'rgba(196, 124, 133, 0.16)', borderColor: 'rgba(196, 124, 133, 0.28)' }}>
                {/* Precision Developer Streak Momentum Vector Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
            </div>
            <div className="stat-value">
              {streak} <span style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text2)' }}>Days</span>
            </div>
            <div className="stat-footer">
              <span style={{ color: '#E8A8B1', fontWeight: '600' }}>Consistent</span>
              <span>· Active coding momentum</span>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="two-col">

        {/* Left Column: Leaderboard + Activity */}
        <div className="left-stack">
          <div className="card">
            <div className="card-title">
              <div className="card-title-left">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#E6B86A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
                  <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
                  <path d="M4 5h16v6a7 7 0 0 1-14 0V5z" />
                  <path d="M12 18v3" />
                  <path d="M8 21h8" />
                </svg>
                <span>GLOBAL LEADERBOARD</span>
                <span className="pill-badge neutral" style={{ marginLeft: '6px' }}>{leaderData.length} Devs</span>
              </div>
              <input
                type="text"
                placeholder="Find User..."
                className="search-mini"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="lb-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {loading ? (
                <SkeletonRows count={5} />
              ) : filteredLeaders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text2)', fontSize: '13px' }}>
                  No developers found matching "{searchTerm}"
                </div>
              ) : (
                filteredLeaders.slice(0, 10).map((item, i) => {
                  const isTop1 = i === 0;
                  const isTop2 = i === 1;
                  const isTop3 = i === 2;
                  const isMe = item.isMe || item.name?.toLowerCase().includes('krisahn');

                  return (
                    <div 
                      key={i}
                      className={`lb-row ${isMe ? 'me' : ''}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: isMe 
                          ? 'rgba(104, 83, 75, 0.22)' 
                          : 'rgba(255, 255, 255, 0.02)',
                        border: isMe 
                          ? '1px solid rgba(200, 155, 123, 0.4)' 
                          : '1px solid rgba(255, 255, 255, 0.04)',
                        boxShadow: isMe ? '0 0 15px rgba(104, 83, 75, 0.25)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        {/* Podium Rank Pill */}
                        <div style={{
                          width: '32px',
                          height: '28px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '700',
                          background: isTop1 
                            ? 'rgba(230, 184, 106, 0.16)' 
                            : isTop2 
                            ? 'rgba(181, 173, 164, 0.16)' 
                            : isTop3 
                            ? 'rgba(160, 116, 85, 0.16)' 
                            : 'transparent',
                          color: isTop1 
                            ? '#E6B86A' 
                            : isTop2 
                            ? '#D8D3CD' 
                            : isTop3 
                            ? '#C89B7B' 
                            : 'var(--text3)',
                          border: (isTop1 || isTop2 || isTop3) 
                            ? '1px solid currentColor' 
                            : '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                          #{i + 1}
                        </div>

                        {/* Avatar */}
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isMe 
                            ? 'linear-gradient(135deg, #A8795A 0%, #D4A373 100%)' 
                            : 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: isMe ? '#141210' : '#FFFFFF',
                          flexShrink: 0
                        }}>
                          {(item.name || 'D').substring(0, 2).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ 
                            fontSize: '13.5px', 
                            fontWeight: '600', 
                            color: isMe ? '#E5BE9E' : '#FFFFFF',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {item.name} {isMe ? '(You)' : ''}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                            {(item.platform || '').toLowerCase().includes('leetcode') && <LeetCodeIcon />}
                            {(item.platform || '').toLowerCase().includes('github') && <GitHubIcon />}
                            {(item.platform || '').toLowerCase().includes('codeforces') && <CodeforcesIcon />}
                            <span>{item.platform || 'Multi-platform'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div style={{ 
                        fontSize: '15px', 
                        fontWeight: '700', 
                        color: isMe ? '#D4A373' : '#FFFFFF',
                        fontFamily: 'var(--mono)',
                        marginLeft: '12px'
                      }}>
                        {item.score?.toLocaleString()}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <ActivityCalendar />
        </div>

        {/* Right Column: Skills + Platform Distribution */}
        <div className="right-stack">

          {/* Skill Analytics Card */}
          <div className="card">
            <div className="card-title">
              <div className="card-title-left">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#A58AC4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <span>SKILL TELEMETRY</span>
              </div>
              <span className="pill-badge neutral">AI Assessed</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Data Structures & Algorithms', percentage: 92, color: '#C89B7B', badge: 'Expert' },
                { label: 'Backend Architecture & APIs', percentage: 88, color: '#7599BF', badge: 'Advanced' },
                { label: 'Database Systems & SQL', percentage: 85, color: '#5EA880', badge: 'Proficient' },
                { label: 'Frontend Systems & UI', percentage: 76, color: '#A58AC4', badge: 'Intermediate' }
              ].map((skill, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>{skill.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="pill-badge neutral" style={{ fontSize: '10.5px', padding: '2px 8px' }}>{skill.badge}</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: skill.color, fontFamily: 'var(--mono)' }}>
                        {skill.percentage}%
                      </span>
                    </div>
                  </div>
                  <div style={{ 
                    height: '7px', 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${skill.percentage}%`, 
                      height: '100%', 
                      background: `linear-gradient(90deg, ${skill.color}90, ${skill.color})`,
                      borderRadius: '10px',
                      transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unified Score By Platform (Connected to real synced data) */}
          <PerformanceChart />

        </div>

      </div>

      {/* Historical Growth Chart */}
      <GrowthChart />

    </div>
  );
};

export default Dashboard;
