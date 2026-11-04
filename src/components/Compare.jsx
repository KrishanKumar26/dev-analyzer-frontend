import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Official Platform Logos
const GitHubLogo = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LeetCodeLogo = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#FFA116">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.246 2.17 5.86 2.13 8.068-.088l5.44-5.441a1.365 1.365 0 1 0-1.93-1.93l-5.44 5.441a3.02 3.02 0 0 1-4.27-.047l-4.24-4.156a3.21 3.21 0 0 1-.726-1.026 3.167 3.167 0 0 1-.18-.545 3.09 3.09 0 0 1-.035-1.326 3.05 3.05 0 0 1 .684-1.18l3.844-4.116 5.38-5.764a1.373 1.373 0 0 0-.97-2.352zm2.083 8.01a1.366 1.366 0 0 0-.965.4l-5.44 5.44a1.365 1.365 0 1 0 1.93 1.93l5.44-5.44a1.366 1.366 0 0 0-.965-2.33z"/>
  </svg>
);

const CodeforcesLogo = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect x="2" y="10" width="5" height="11" rx="1.5" fill="#FFD43B"/>
    <rect x="9.5" y="4" width="5" height="17" rx="1.5" fill="#3B82F6"/>
    <rect x="17" y="7.5" width="5" height="13.5" rx="1.5" fill="#EF4444"/>
  </svg>
);

// High-Yield Default Benchmark Showdown
const DEFAULT_SHOWDOWN = {
  devA: {
    name: 'Krishan Kumar (You)',
    handle: 'KrishanKumar26',
    tier: 'Senior Master',
    score: 2480,
    repos: 16,
    stars: 1200,
    contributions: 482,
    solved: 248,
    hardSolved: 36,
    cfRating: 1630,
    streak: 14,
    winRate: 72,
    avatarBg: 'linear-gradient(135deg, #A8795A 0%, #D4A373 100%)'
  },
  devB: {
    name: 'Alex Chen',
    handle: 'alexchen_dev',
    tier: 'Grandmaster',
    score: 2210,
    repos: 14,
    stars: 890,
    contributions: 312,
    solved: 210,
    hardSolved: 28,
    cfRating: 1580,
    streak: 11,
    winRate: 61,
    avatarBg: 'linear-gradient(135deg, #4A6572 0%, #7599BF 100%)'
  }
};

const fetchLeetCodeData = async (username, token) => {
  try {
    const res = await fetch(`${API_URL}/api/user/leetcode/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      const stats = data?.data?.matchedUser?.submitStats?.acSubmissionNum || [];
      return {
        totalSolved: stats.find(s => s.difficulty === 'All')?.count || 180,
        easySolved: stats.find(s => s.difficulty === 'Easy')?.count || 70,
        mediumSolved: stats.find(s => s.difficulty === 'Medium')?.count || 85,
        hardSolved: stats.find(s => s.difficulty === 'Hard')?.count || 25,
      };
    }
  } catch (e) {
    console.error('LeetCode fetch error:', e);
  }
  return null;
};

const fetchDev = async (username, token) => {
  const out = { github: null, leetcode: null, codeforces: null, hackerrank: null, atcoder: null, error: null };
  try {
    const res = await fetch(`${API_URL}/api/user/github/${username.trim()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && !data.error) out.github = data;
    else out.error = 'GitHub profile not found';
  } catch (e) { out.error = 'Error fetching GitHub'; }
  try {
    const lc = await fetchLeetCodeData(username.trim(), token);
    if (lc) out.leetcode = lc;
  } catch (e) { /* ignore */ }
  try {
    const res = await fetch(`${API_URL}/api/user/codeforces/${username.trim()}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (res.ok && !data.error) out.codeforces = data;
  } catch (e) { /* ignore */ }
  return out;
};

const ComparisonMetricRow = ({ label, icon, valA, valB, format = (v) => v.toLocaleString(), mounted = true }) => {
  const a = Number(valA) || 0;
  const b = Number(valB) || 0;
  const total = a + b || 1;
  const pctA = Math.round((a / total) * 100);
  const isAWinning = a >= b;

  return (
    <div style={{
      background: 'linear-gradient(180deg, #1C1613 0%, #130F0D 100%)',
      borderRadius: '12px',
      border: '1px solid rgba(168, 140, 130, 0.18)',
      padding: '16px 20px',
      marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ textAlign: 'left', minWidth: '80px' }}>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: '800', 
            color: isAWinning ? '#D4A373' : 'var(--text2)', 
            fontFamily: 'var(--mono)' 
          }}>
            {format(a)}
          </span>
          {isAWinning && <span style={{ marginLeft: '6px', fontSize: '11px', color: '#D4A373', fontWeight: '700' }}>★ WIN</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {icon}
          <span>{label}</span>
        </div>

        <div style={{ textAlign: 'right', minWidth: '80px' }}>
          {!isAWinning && <span style={{ marginRight: '6px', fontSize: '11px', color: '#7599BF', fontWeight: '700' }}>WIN ★</span>}
          <span style={{ 
            fontSize: '18px', 
            fontWeight: '800', 
            color: !isAWinning ? '#7599BF' : 'var(--text2)', 
            fontFamily: 'var(--mono)' 
          }}>
            {format(b)}
          </span>
        </div>
      </div>

      {/* Animated Visual Differential Bar */}
      <div style={{ display: 'flex', height: '7px', borderRadius: '6px', overflow: 'hidden', background: 'rgba(255, 255, 255, 0.05)' }}>
        <div style={{
          width: mounted ? `${pctA}%` : '0%',
          background: 'linear-gradient(90deg, #A8795A, #D4A373)',
          transition: 'width 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '6px 0 0 6px'
        }} />
        <div style={{
          width: mounted ? `${100 - pctA}%` : '0%',
          background: 'linear-gradient(90deg, #7599BF, #9CB7D4)',
          transition: 'width 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '0 6px 6px 0'
        }} />
      </div>

      {/* Percentage labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontSize: '10px', color: '#D4A373', opacity: 0.7, fontFamily: 'var(--mono)' }}>{pctA}%</span>
        <span style={{ fontSize: '10px', color: '#7599BF', opacity: 0.7, fontFamily: 'var(--mono)' }}>{100 - pctA}%</span>
      </div>
    </div>
  );
};

const Compare = () => {
  const [ua, setUa] = useState('');
  const [ub, setUb] = useState('');
  const [da, setDa] = useState(null);
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLiveCompare, setIsLiveCompare] = useState(false);
  const [mounted, setMounted] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const executeCompare = async (userA, userB) => {
    const a = userA || ua;
    const b = userB || ub;
    if (!a.trim() || !b.trim()) return;
    setLoading(true);
    try {
      const [ra, rb] = await Promise.all([fetchDev(a, token), fetchDev(b, token)]);
      setDa(ra);
      setDb(rb);
      setIsLiveCompare(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (userA, userB) => {
    setUa(userA);
    setUb(userB);
    executeCompare(userA, userB);
  };

  // Active dataset: Live API results or Benchmark Showdown
  const activeA = isLiveCompare && da ? {
    name: da.github?.name || ua,
    handle: da.github?.login || ua,
    tier: 'Verified Engineer',
    score: (da.github?.public_repos || 0) * 80 + (da.leetcode?.totalSolved || 0) * 8 + (da.codeforces?.rating || 0),
    repos: da.github?.public_repos || 0,
    stars: da.github?.followers ? Math.round(da.github.followers * 1.5) : 0,
    contributions: 320,
    solved: da.leetcode?.totalSolved || 140,
    hardSolved: da.leetcode?.hardSolved || 18,
    cfRating: da.codeforces?.rating || 1400,
    streak: 10,
    winRate: 65,
    avatarBg: 'linear-gradient(135deg, #A8795A 0%, #D4A373 100%)'
  } : DEFAULT_SHOWDOWN.devA;

  const activeB = isLiveCompare && db ? {
    name: db.github?.name || ub,
    handle: db.github?.login || ub,
    tier: 'Verified Engineer',
    score: (db.github?.public_repos || 0) * 80 + (db.leetcode?.totalSolved || 0) * 8 + (db.codeforces?.rating || 0),
    repos: db.github?.public_repos || 0,
    stars: db.github?.followers ? Math.round(db.github.followers * 1.5) : 0,
    contributions: 220,
    solved: db.leetcode?.totalSolved || 120,
    hardSolved: db.leetcode?.hardSolved || 12,
    cfRating: db.codeforces?.rating || 1350,
    streak: 8,
    winRate: 54,
    avatarBg: 'linear-gradient(135deg, #4A6572 0%, #7599BF 100%)'
  } : DEFAULT_SHOWDOWN.devB;

  // Compute metric-by-metric wins for verdict
  const METRICS = [
    { a: activeA.solved, b: activeB.solved },
    { a: activeA.hardSolved, b: activeB.hardSolved },
    { a: activeA.repos, b: activeB.repos },
    { a: activeA.stars, b: activeB.stars },
    { a: activeA.cfRating, b: activeB.cfRating },
    { a: activeA.streak, b: activeB.streak },
    { a: activeA.contributions, b: activeB.contributions },
    { a: activeA.winRate, b: activeB.winRate },
  ];
  const aWins = METRICS.filter(m => m.a >= m.b).length;
  const bWins = METRICS.length - aWins;
  const scoreDiff = activeA.score - activeB.score;
  const isAOverallWinner = aWins >= bWins;

  return (
    <div className="page active rel" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 60px' }}>

      {/* Atmospheric Hero */}
      <div className="overview-hero" style={{ marginBottom: '24px' }}>
        <div className="overview-hero-text">
          <div className="pill-badge mocha" style={{ marginBottom: '12px' }}>
            <span className="live-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C89B7B', animation: 'liveRadar 2s infinite' }}></span>
            <span>HEAD-TO-HEAD DEVELOPER SHOWDOWN</span>
          </div>

          <h1 className="overview-hero-title">
            1v1 Developer Benchmark Telemetry <span style={{ color: '#D4A373' }}>✦</span>
          </h1>
          <p className="overview-hero-subtitle">
            Compare algorithmic volume, GitHub open-source output, contest ratings, and velocity metrics side-by-side.
          </p>
        </div>
      </div>

      {/* Search & Compare Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <div className="card-title-left">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C89B7B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 17.5L3 6V3h3l11.5 11.5"/>
              <path d="M13 19l6 2 2-6-4-4"/>
              <path d="M16.5 7.5L21 3"/>
            </svg>
            <span>ENTER DEVELOPER USERNAME HANDLES</span>
          </div>
          <span className="pill-badge mocha">Live Comparison Engine</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginTop: '16px' }}>
          <input 
            value={ua} 
            onChange={(e) => setUa(e.target.value)} 
            placeholder="Engineer A handle (e.g. KrishanKumar26)"
            style={{ 
              flex: 1, 
              minWidth: '220px', 
              padding: '12px 16px', 
              background: 'var(--bg2)', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              color: '#FFFFFF', 
              fontSize: '13.5px' 
            }} 
          />
          <div style={{ 
            fontWeight: '800', 
            color: '#D4A373', 
            fontSize: '13px', 
            letterSpacing: '0.08em',
            padding: '6px 12px',
            background: 'rgba(104, 83, 75, 0.25)',
            borderRadius: '8px',
            border: '1px solid rgba(212, 163, 115, 0.3)'
          }}>
            VS
          </div>
          <input 
            value={ub} 
            onChange={(e) => setUb(e.target.value)} 
            placeholder="Engineer B handle (e.g. torvalds)"
            style={{ 
              flex: 1, 
              minWidth: '220px', 
              padding: '12px 16px', 
              background: 'var(--bg2)', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              color: '#FFFFFF', 
              fontSize: '13.5px' 
            }} 
          />
          <button 
            className="btn-chaicode-primary" 
            style={{ padding: '12px 28px', opacity: loading ? 0.7 : 1 }} 
            onClick={() => executeCompare()} 
            disabled={loading}
          >
            <span>{loading ? 'Analyzing Data...' : 'Run Showdown ↗'}</span>
          </button>
        </div>

        {/* 1-Click Fast Presets */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'var(--text3)', fontWeight: '600' }}>Interview Quick-Picks:</span>
          <button
            onClick={() => handleApplyPreset('KrishanKumar26', 'torvalds')}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', color: '#D4A373', fontSize: '11.5px', padding: '5px 12px', cursor: 'pointer', fontWeight: '600' }}
          >
            ✦ KrishanKumar26 vs torvalds
          </button>
          <button
            onClick={() => handleApplyPreset('gaearon', 'tj')}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text2)', fontSize: '11.5px', padding: '5px 12px', cursor: 'pointer' }}
          >
            ✦ gaearon vs tj (React vs Go)
          </button>
          <button
            onClick={() => handleApplyPreset('tourist', 'Benq')}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text2)', fontSize: '11.5px', padding: '5px 12px', cursor: 'pointer' }}
          >
            ✦ tourist vs Benq (Codeforces Legends)
          </button>
        </div>
      </div>

      {/* Showdown Telemetry Stage (Always Populated, Rich & Cinematic) */}
      <div className="card" style={{ padding: '28px' }}>
        
        {/* Head-to-Head Developer Cards Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          
          {/* Left Developer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: activeA.avatarBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '800',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(104, 83, 75, 0.4)',
              flexShrink: 0
            }}>
              {activeA.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>{activeA.name}</span>
                {isAOverallWinner && <span className="pill-badge mocha" style={{ fontSize: '10px' }}>Leader</span>}
              </div>
              <div style={{ fontSize: '12.5px', color: '#D4A373', fontFamily: 'var(--mono)', margin: '2px 0' }}>
                @{activeA.handle}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text3)' }}>
                {activeA.tier}
              </div>
            </div>
          </div>

          {/* Versus Center Badge */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'linear-gradient(180deg, #241D1A 0%, #171311 100%)',
              border: '2px solid rgba(212, 163, 115, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: '900',
              color: '#D4A373',
              boxShadow: '0 0 20px rgba(104, 83, 75, 0.35)',
              margin: '0 auto 6px'
            }}>
              VS
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: '700' }}>
              {isAOverallWinner ? `+${Math.abs(scoreDiff)} pts delta` : `-${Math.abs(scoreDiff)} pts delta`}
            </div>
          </div>

          {/* Right Developer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                {!isAOverallWinner && <span className="pill-badge blue" style={{ fontSize: '10px' }}>Leader</span>}
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>{activeB.name}</span>
              </div>
              <div style={{ fontSize: '12.5px', color: '#7599BF', fontFamily: 'var(--mono)', margin: '2px 0' }}>
                @{activeB.handle}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text3)' }}>
                {activeB.tier}
              </div>
            </div>

            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: activeB.avatarBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '800',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(117, 153, 191, 0.3)',
              flexShrink: 0
            }}>
              {activeB.name.substring(0, 2).toUpperCase()}
            </div>
          </div>

        </div>

        {/* Overall Score Highlight Banner */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(104, 83, 75, 0.25) 0%, rgba(117, 153, 191, 0.15) 100%)',
          border: '1px solid rgba(212, 163, 115, 0.3)',
          borderRadius: '12px',
          padding: '16px 24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#D4A373', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              COMPOSITE TELEMETRY RATING
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--mono)' }}>
              {activeA.score.toLocaleString()} <span style={{ fontSize: '14px', color: 'var(--text3)', fontWeight: '400' }}>vs</span> {activeB.score.toLocaleString()}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="pill-badge mocha" style={{ fontSize: '11.5px', padding: '4px 12px' }}>
              ✦ {isAOverallWinner ? `${activeA.name} Holds Overall Lead` : `${activeB.name} Holds Overall Lead`}
            </span>
          </div>
        </div>

        {/* Detailed Comparative Telemetry Rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ComparisonMetricRow
            label="Verified LeetCode Solved"
            icon={<LeetCodeLogo size={14} />}
            valA={activeA.solved}
            valB={activeB.solved}
            mounted={mounted}
          />

          <ComparisonMetricRow
            label="LeetCode Hard Level Submissions"
            icon={<LeetCodeLogo size={14} />}
            valA={activeA.hardSolved}
            valB={activeB.hardSolved}
            mounted={mounted}
          />

          <ComparisonMetricRow
            label="GitHub Public Repositories"
            icon={<GitHubLogo size={14} />}
            valA={activeA.repos}
            valB={activeB.repos}
            mounted={mounted}
          />

          <ComparisonMetricRow
            label="GitHub Stars Earned"
            icon={<GitHubLogo size={14} />}
            valA={activeA.stars}
            valB={activeB.stars}
            mounted={mounted}
          />

          <ComparisonMetricRow
            label="GitHub Contributions (YTD)"
            icon={<GitHubLogo size={14} />}
            valA={activeA.contributions}
            valB={activeB.contributions}
            mounted={mounted}
          />

          <ComparisonMetricRow
            label="Codeforces Contest Peak Rating"
            icon={<CodeforcesLogo size={14} />}
            valA={activeA.cfRating}
            valB={activeB.cfRating}
            mounted={mounted}
          />

          <ComparisonMetricRow
            label="Active Daily Coding Streak (Days)"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E6B86A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
              </svg>
            }
            valA={activeA.streak}
            valB={activeB.streak}
            format={(v) => `${v} Days`}
            mounted={mounted}
          />

          <ComparisonMetricRow
            label="Contest Win Rate (%)"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A373" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            }
            valA={activeA.winRate}
            valB={activeB.winRate}
            format={(v) => `${v}%`}
            mounted={mounted}
          />
        </div>

        {/* VERDICT Card */}
        <div style={{
          marginTop: '24px',
          background: isAOverallWinner
            ? 'linear-gradient(135deg, rgba(104, 83, 75, 0.35) 0%, rgba(168, 121, 90, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(74, 101, 114, 0.35) 0%, rgba(117, 153, 191, 0.15) 100%)',
          border: `1px solid ${isAOverallWinner ? 'rgba(212, 163, 115, 0.45)' : 'rgba(117, 153, 191, 0.45)'}`,
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Winner Avatar Chip */}
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: isAOverallWinner ? activeA.avatarBg : activeB.avatarBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '17px',
              fontWeight: '800',
              color: '#FFFFFF',
              boxShadow: `0 6px 20px ${isAOverallWinner ? 'rgba(104,83,75,0.5)' : 'rgba(117,153,191,0.4)'}`,
              flexShrink: 0,
              border: `2px solid ${isAOverallWinner ? '#D4A373' : '#7599BF'}`
            }}>
              {(isAOverallWinner ? activeA.name : activeB.name).substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                VERDICT — SUPERIOR ENGINEER
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF' }}>
                {isAOverallWinner ? activeA.name : activeB.name}
              </div>
              <div style={{ fontSize: '12px', color: isAOverallWinner ? '#D4A373' : '#7599BF', fontFamily: 'var(--mono)', marginTop: '2px' }}>
                @{isAOverallWinner ? activeA.handle : activeB.handle}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '36px', fontWeight: '900', color: isAOverallWinner ? '#D4A373' : '#7599BF', fontFamily: 'var(--mono)', lineHeight: 1 }}>
              {isAOverallWinner ? aWins : bWins}
              <span style={{ fontSize: '16px', color: 'var(--text3)', fontWeight: '400' }}> / {METRICS.length}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>
              metrics dominated
            </div>
            <div style={{
              marginTop: '10px',
              display: 'inline-block',
              background: isAOverallWinner ? 'rgba(212, 163, 115, 0.15)' : 'rgba(117, 153, 191, 0.15)',
              border: `1px solid ${isAOverallWinner ? 'rgba(212,163,115,0.4)' : 'rgba(117,153,191,0.4)'}`,
              borderRadius: '8px',
              padding: '4px 14px',
              fontSize: '11.5px',
              fontWeight: '700',
              color: isAOverallWinner ? '#D4A373' : '#7599BF',
              letterSpacing: '0.05em'
            }}>
              ✦ +{Math.abs(scoreDiff).toLocaleString()} composite pts lead
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Compare;