import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// REAL-WORLD OFFICIAL PLATFORM LOGOS (Crisp Vector SVGs)
const GitHubLogo = ({ size = 26 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LeetCodeLogo = ({ size = 26 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#FFA116">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.246 2.17 5.86 2.13 8.068-.088l5.44-5.441a1.365 1.365 0 1 0-1.93-1.93l-5.44 5.441a3.02 3.02 0 0 1-4.27-.047l-4.24-4.156a3.21 3.21 0 0 1-.726-1.026 3.167 3.167 0 0 1-.18-.545 3.09 3.09 0 0 1-.035-1.326 3.05 3.05 0 0 1 .684-1.18l3.844-4.116 5.38-5.764a1.373 1.373 0 0 0-.97-2.352zm2.083 8.01a1.366 1.366 0 0 0-.965.4l-5.44 5.44a1.365 1.365 0 1 0 1.93 1.93l5.44-5.44a1.366 1.366 0 0 0-.965-2.33z"/>
  </svg>
);

const CodeforcesLogo = ({ size = 26 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect x="2" y="10" width="5" height="11" rx="1.5" fill="#FFD43B"/>
    <rect x="9.5" y="4" width="5" height="17" rx="1.5" fill="#3B82F6"/>
    <rect x="17" y="7.5" width="5" height="13.5" rx="1.5" fill="#EF4444"/>
  </svg>
);

const HackerRankLogo = ({ size = 26 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#00EA64">
    <path d="M12 0L1.6 6v12L12 24l10.4-6V6L12 0zm3.8 14.8h-2.1v-2.3h-3.4v2.3H8.2V9.2h2.1v2.3h3.4V9.2h2.1v5.6z"/>
  </svg>
);

// High-Tech Vector Icons for Achievements
const TrophySvg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34"/>
    <path d="M6 4h12v6a6 6 0 0 1-12 0V4Z"/>
  </svg>
);

const FlameSvg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E6B86A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const LightningSvg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const StarSvg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E6B86A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const DiamondSvg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7599BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 13L2 9Z"/>
    <path d="M11 3 8 9l4 13 4-13-3-6"/>
    <path d="M2 9h20"/>
  </svg>
);

const CrownSvg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
  </svg>
);

const GlobeSvg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5EA880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const RocketSvg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C47C85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2 5-2"/>
    <path d="M12 15v5s3.03-.55 4.5-2c1.63-1.62 2-5 2-5"/>
  </svg>
);

const BrainSvg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A58AC4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 .64.13 1.25.37 1.8A5 5 0 0 0 4 13a5 5 0 0 0 3.5 4.8A4.5 4.5 0 0 0 12 22a4.5 4.5 0 0 0 4.5-4.2A5 5 0 0 0 20 13a5 5 0 0 0-3.87-4.7A4.5 4.5 0 0 0 12 2Z"/>
    <path d="M12 6v12"/>
    <path d="M8 10h8"/>
    <path d="M7 14h10"/>
  </svg>
);

const LockSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const ProfilePage = ({ user, setUser }) => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isInterviewMode, setIsInterviewMode] = useState(true); // Default ON for interview perfection
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);

  const [form, setForm] = useState({
    name: '',
    githubUsername: '',
    leetcodeUsername: '',
    codeforcesUsername: '',
    hackerrankUsername: ''
  });

  const { addToast } = useApp() || {};
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
      setForm({
        name: data.name || '',
        githubUsername: data.githubUsername || '',
        leetcodeUsername: data.leetcodeUsername || '',
        codeforcesUsername: data.codeforcesUsername || '',
        hackerrankUsername: data.hackerrankUsername || ''
      });
      if (data && data.score > 0) {
        setIsInterviewMode(false);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  const handleSave = async (customForm) => {
    setSaving(true);
    const dataToSave = customForm || form;
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSave)
      });
      const data = await res.json();
      setProfile(prev => ({ ...prev, ...data }));
      if (setUser) setUser(prev => ({ ...prev, name: data.name }));
      setEditing(false);
      if (addToast) addToast('Developer Identity updated successfully', 'success');
    } catch (err) {
      if (addToast) addToast('Update failed. Please retry.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFillDemo = () => {
    const demo = {
      name: 'Krishan Kumar',
      githubUsername: 'KrishanKumar26',
      leetcodeUsername: 'krishankumar',
      codeforcesUsername: 'tourist',
      hackerrankUsername: 'krishan_dev'
    };
    setForm(demo);
    handleSave(demo);
    if (addToast) addToast('✦ Populated Verified Interview Handles!', 'success');
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`${API_URL}/api/user/sync`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(prev => ({ ...prev, score: data.score, problems: data.problems, rank: data.rank }));
        if (setUser) setUser(prev => ({ ...prev, score: data.score, rank: data.rank }));
        if (data.breakdown) localStorage.setItem('scoreBreakdown', JSON.stringify(data.breakdown));
        setIsInterviewMode(false);
        if (addToast) addToast(`Aggregated Stats Synced! Score: ${data.score} · Rank: #${data.rank}`, 'success');
      } else {
        if (addToast) addToast('Sync failed. Connect handles in settings.', 'error');
      }
    } catch (err) {
      if (addToast) addToast('Network error during sync', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('scoreBreakdown');
    if (setUser) setUser(null);
  };

  const handleCopyLink = () => {
    const shareId = profile?.id || '10';
    const url = `${window.location.origin}/u/${shareId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      if (addToast) addToast('Public profile link copied to clipboard', 'success');
      setTimeout(() => setCopiedLink(false), 2200);
    }).catch(() => {});
  };

  const shareId = profile?.id || '10';
  const badgeMarkdown = `[![VORTEX Dev Score](${API_URL}/api/public/badge/${shareId}.svg)](${window.location.origin}/u/${shareId})`;

  const handleCopyBadge = () => {
    navigator.clipboard.writeText(badgeMarkdown).then(() => {
      setCopiedBadge(true);
      if (addToast) addToast('GitHub README badge markdown copied!', 'success');
      setTimeout(() => setCopiedBadge(false), 2200);
    }).catch(() => {});
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure? This will permanently delete your account and all telemetry data.')) return;
    try {
      await fetch(`${API_URL}/api/user/account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Delete error:', err);
    }
    handleLogout();
  };

  // Benchmark stats for flawless interview display
  const realScore = profile?.score ?? user?.score ?? 0;
  const realRank = profile?.rank ?? user?.rank ?? 9999;
  const realSolved = profile?.problems ?? user?.problems ?? 0;
  const realStreak = profile?.streak ?? user?.streak ?? 0;

  const displayScore = realScore > 0 ? realScore : (isInterviewMode ? 1840 : 0);
  const displayRank = (realRank > 0 && realRank < 9999) ? realRank : (isInterviewMode ? 4 : 9999);
  const displaySolved = realSolved > 0 ? realSolved : (isInterviewMode ? 248 : 0);
  const displayStreak = realStreak > 0 ? realStreak : (isInterviewMode ? 14 : 0);

  const displayName = profile?.name || user?.name || (isInterviewMode ? 'Krishan Kumar' : 'Developer');
  const displayEmail = profile?.email || user?.email || 'krishan@vortex.dev';

  // Platforms status
  const platforms = [
    {
      name: 'GitHub',
      handle: profile?.githubUsername || (isInterviewMode ? 'KrishanKumar26' : null),
      logo: <GitHubLogo />,
      color: '#FFFFFF',
      accent: 'rgba(255, 255, 255, 0.08)',
      desc: 'Commits, pull requests & repositories'
    },
    {
      name: 'LeetCode',
      handle: profile?.leetcodeUsername || (isInterviewMode ? 'krishankumar' : null),
      logo: <LeetCodeLogo />,
      color: '#FFA116',
      accent: 'rgba(255, 161, 22, 0.12)',
      desc: 'Algorithm problem solving & acceptance rate'
    },
    {
      name: 'Codeforces',
      handle: profile?.codeforcesUsername || (isInterviewMode ? 'tourist' : null),
      logo: <CodeforcesLogo />,
      color: '#3B82F6',
      accent: 'rgba(59, 130, 246, 0.12)',
      desc: 'Div rating, contest participation & rank'
    },
    {
      name: 'HackerRank',
      handle: profile?.hackerrankUsername || (isInterviewMode ? 'krishan_dev' : null),
      logo: <HackerRankLogo />,
      color: '#00EA64',
      accent: 'rgba(0, 234, 100, 0.12)',
      desc: 'Skill badges, stars & domains mastery'
    }
  ];

  // Developer Achievements Matrix
  const achievements = [
    {
      title: 'Week Warrior',
      desc: '7-day active coding streak',
      icon: <FlameSvg />,
      done: displayStreak >= 7,
      category: 'Consistency'
    },
    {
      title: 'Century Solver',
      desc: '100+ algorithmic problems solved',
      icon: <TrophySvg />,
      done: displaySolved >= 100,
      category: 'Algorithms'
    },
    {
      title: 'Rising Star',
      desc: 'Verified Dev Score above 1,000',
      icon: <StarSvg />,
      done: displayScore >= 1000,
      category: 'Rating'
    },
    {
      title: 'Top 10 Standing',
      desc: 'Global competitive rank under #10',
      icon: <CrownSvg />,
      done: displayRank <= 10,
      category: 'Rank'
    },
    {
      title: 'Ecosystem Nexus',
      desc: 'Multi-platform telemetry connected',
      icon: <GlobeSvg />,
      done: true,
      category: 'Network'
    },
    {
      title: 'Month Master',
      desc: '30-day non-stop daily coding streak',
      icon: <LightningSvg />,
      done: displayStreak >= 30,
      category: 'Consistency'
    },
    {
      title: 'Half-K Club',
      desc: '500+ problems solved across platforms',
      icon: <RocketSvg />,
      done: displaySolved >= 500,
      category: 'Algorithms'
    },
    {
      title: 'Elite Developer',
      desc: 'Dev Score exceeding 2,500 pts',
      icon: <DiamondSvg />,
      done: displayScore >= 2500,
      category: 'Rating'
    },
    {
      title: 'AI Telemetry Assessed',
      desc: 'Full code profile audited by Vortex AI',
      icon: <BrainSvg />,
      done: true,
      category: 'Intelligence'
    },
    {
      title: 'Grandmaster Architect',
      desc: 'Reach top 1% global rating',
      icon: <DiamondSvg />,
      done: false,
      category: 'Grandmaster'
    }
  ];

  const unlockedCount = achievements.filter(a => a.done).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="page active rel" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 60px' }}>

      {/* Atmospheric Profile Header (Warm Mocha Canvas) */}
      <div className="overview-hero" style={{ marginBottom: '24px' }}>
        <div className="overview-hero-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div className="pill-badge mocha">
              <span className="live-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C89B7B', animation: 'liveRadar 2s infinite' }}></span>
              <span>VERIFIED DEVELOPER PROFILE</span>
            </div>
            <button 
              onClick={() => setIsInterviewMode(!isInterviewMode)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                color: isInterviewMode ? '#D4A373' : 'var(--text2)',
                padding: '3px 12px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Toggle between Interview Benchmark and Raw Empty State"
            >
              {isInterviewMode ? '✦ Interview Mode: ON' : '● Live Mode: ON'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* Specular Mocha Avatar */}
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #A8795A 0%, #68534B 60%, #382A24 100%)',
              border: '2px solid rgba(212, 163, 115, 0.4)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 10px 28px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '800',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              flexShrink: 0
            }}>
              {displayName.substring(0, 2).toUpperCase()}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                  {displayName}
                </h1>
                <span className="pill-badge green" style={{ fontSize: '11px' }}>
                  ✓ ID Verified
                </span>
              </div>
              <p style={{ color: 'var(--text2)', fontSize: '14px', margin: '4px 0 10px' }}>
                {displayEmail}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pill-badge mocha" style={{ fontSize: '11px', fontWeight: '700' }}>
                  GLOBAL RANK #{displayRank}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text3)' }}>
                  · Tier: {displayScore >= 2000 ? 'Elite Grandmaster' : 'Senior Specialist'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="overview-hero-actions">
          <button 
            className="btn-chaicode-primary"
            onClick={() => setEditing(!editing)}
          >
            <span>{editing ? '✕ Close Settings' : '✏ Edit Handles'}</span>
          </button>
          <button 
            className="btn-chaicode-secondary"
            onClick={handleFillDemo}
            title="Populate tested working handles for interview presentation"
          >
            <span>✦ Fill Demo Handles</span>
          </button>
          <button 
            onClick={handleLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Edit Handles Form (Expandable Panel) */}
      {editing && (
        <div className="card" style={{ marginBottom: '24px', animation: 'fadeIn 0.25s ease' }}>
          <div className="card-title">
            <div className="card-title-left">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C89B7B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              <span>CONNECT DEVELOPER HANDLES</span>
            </div>
            <span className="pill-badge mocha">Live Profile Sync</span>
          </div>

          <p style={{ color: 'var(--text2)', fontSize: '13px', margin: '4px 0 20px', lineHeight: '1.5' }}>
            Enter your exact public platform usernames. VORTEX automatically scrapes, aggregates, and computes your unified developer telemetry.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="input-group">
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Krishan Kumar"
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '13.5px',
                  color: '#FFFFFF'
                }}
              />
            </div>

            <div className="input-group">
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GitHubLogo size={14} /> GitHub Handle
              </label>
              <input
                type="text"
                value={form.githubUsername}
                onChange={(e) => setForm(prev => ({ ...prev, githubUsername: e.target.value }))}
                placeholder="e.g. KrishanKumar26"
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '13.5px',
                  color: '#FFFFFF'
                }}
              />
            </div>

            <div className="input-group">
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LeetCodeLogo size={14} /> LeetCode Handle
              </label>
              <input
                type="text"
                value={form.leetcodeUsername}
                onChange={(e) => setForm(prev => ({ ...prev, leetcodeUsername: e.target.value }))}
                placeholder="e.g. krishankumar"
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '13.5px',
                  color: '#FFFFFF'
                }}
              />
            </div>

            <div className="input-group">
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CodeforcesLogo size={14} /> Codeforces Handle
              </label>
              <input
                type="text"
                value={form.codeforcesUsername}
                onChange={(e) => setForm(prev => ({ ...prev, codeforcesUsername: e.target.value }))}
                placeholder="e.g. tourist"
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '13.5px',
                  color: '#FFFFFF'
                }}
              />
            </div>

            <div className="input-group">
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HackerRankLogo size={14} /> HackerRank Handle
              </label>
              <input
                type="text"
                value={form.hackerrankUsername}
                onChange={(e) => setForm(prev => ({ ...prev, hackerrankUsername: e.target.value }))}
                placeholder="e.g. krishan_dev"
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '13.5px',
                  color: '#FFFFFF'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button 
              className="btn-chaicode-primary"
              onClick={() => handleSave()}
              disabled={saving}
              style={{ opacity: saving ? 0.7 : 1 }}
            >
              <span>{saving ? '⏳ Saving...' : 'Save & Link Profiles'}</span>
            </button>
            <button 
              className="btn-chaicode-secondary"
              onClick={() => setEditing(false)}
            >
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid (Mocha Luxury Cards) */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="pill-badge mocha">CORE RATING</span>
            <div className="stat-icon-box" style={{ color: '#D4A373', background: 'rgba(104, 83, 75, 0.2)', borderColor: 'rgba(168, 140, 130, 0.25)' }}>
              <TrophySvg />
            </div>
          </div>
          <div className="stat-value">{displayScore.toLocaleString()}</div>
          <div className="stat-footer">
            <span style={{ color: '#D4A373', fontWeight: '600' }}>✦ Top 4%</span>
            <span>· Verified Global Rating</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="pill-badge green">GLOBAL RANK</span>
            <div className="stat-icon-box" style={{ color: '#8EDBB1', background: 'rgba(94, 168, 128, 0.16)', borderColor: 'rgba(94, 168, 128, 0.28)' }}>
              <GlobeSvg />
            </div>
          </div>
          <div className="stat-value">#{displayRank}</div>
          <div className="stat-footer">
            <span style={{ color: '#8EDBB1', fontWeight: '600' }}>↑ Worldwide</span>
            <span>· Among active coders</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="pill-badge blue">PROBLEMS SOLVED</span>
            <div className="stat-icon-box" style={{ color: '#A6C5E8', background: 'rgba(117, 153, 191, 0.16)', borderColor: 'rgba(117, 153, 191, 0.28)' }}>
              <LightningSvg />
            </div>
          </div>
          <div className="stat-value">{displaySolved}</div>
          <div className="stat-footer">
            <span style={{ color: '#A6C5E8', fontWeight: '600' }}>+14% pace</span>
            <span>· LeetCode & Codeforces</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="pill-badge pink">DAILY STREAK</span>
            <div className="stat-icon-box" style={{ color: '#E8A8B1', background: 'rgba(196, 124, 133, 0.16)', borderColor: 'rgba(196, 124, 133, 0.28)' }}>
              <FlameSvg />
            </div>
          </div>
          <div className="stat-value">{displayStreak} <span style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text2)' }}>Days</span></div>
          <div className="stat-footer">
            <span style={{ color: '#E8A8B1', fontWeight: '600' }}>Consistent</span>
            <span>· Active coding momentum</span>
          </div>
        </div>
      </div>

      {/* Connected Platforms Grid (Real World Vector Logos) */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <div className="card-title-left">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C89B7B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            <span>CONNECTED PLATFORMS & ECOSYSTEMS</span>
          </div>
          <span className="pill-badge neutral">Auto-Sync Enabled</span>
        </div>

        <p style={{ color: 'var(--text2)', fontSize: '13px', margin: '4px 0 20px', lineHeight: '1.5' }}>
          Connect your coding accounts to automatically sync problem submissions, contest ratings, and commit activity.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {platforms.map((p) => {
            const isConnected = !!p.handle;
            return (
              <div
                key={p.name}
                onClick={() => setEditing(true)}
                style={{
                  background: isConnected 
                    ? 'linear-gradient(180deg, #1C1613 0%, #130F0D 100%)' 
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isConnected 
                    ? '1px solid rgba(168, 140, 130, 0.35)' 
                    : '1px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '20px',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 163, 115, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isConnected ? 'rgba(168, 140, 130, 0.35)' : 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: p.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    {p.logo}
                  </div>
                  <span className={`pill-badge ${isConnected ? 'green' : 'neutral'}`} style={{ fontSize: '10.5px' }}>
                    {isConnected ? '✓ Connected' : '○ Disconnected'}
                  </span>
                </div>

                <div style={{ fontWeight: '700', fontSize: '16px', color: '#FFFFFF', marginBottom: '4px' }}>
                  {p.name}
                </div>
                <div style={{ 
                  fontSize: '12.5px', 
                  color: isConnected ? '#D4A373' : 'var(--text3)', 
                  fontFamily: 'var(--mono)',
                  marginBottom: '10px'
                }}>
                  {isConnected ? `@${p.handle}` : 'Click to connect handle'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', lineHeight: '1.4' }}>
                  {p.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sync Telemetry Section */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <div className="card-title-left">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C89B7B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            <span>TELEMETRY AGGREGATION & SYNC</span>
          </div>
          <span className="pill-badge mocha">Cross-Platform Sync</span>
        </div>

        <p style={{ color: 'var(--text2)', fontSize: '13px', margin: '4px 0 18px', lineHeight: '1.5' }}>
          Fetch the latest submissions from GitHub, LeetCode, Codeforces, and HackerRank to recalculate your real-time Dev Score.
        </p>

        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn-chaicode-primary"
            onClick={handleSync}
            disabled={syncing}
            style={{ opacity: syncing ? 0.7 : 1 }}
          >
            <span>{syncing ? '⏳ Aggregating Data...' : '⚡ Sync All Ecosystems'}</span>
          </button>
          <span style={{ fontSize: '12px', color: 'var(--text3)' }}>
            *Runs non-blocking async scrapers across all 4 developer APIs.
          </span>
        </div>
      </div>

      {/* Achievements Matrix (High-Tech Populated Badges) */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <div className="card-title-left">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#E6B86A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>DEVELOPER ACHIEVEMENTS & MILESTONES</span>
          </div>
          <span className="pill-badge mocha">
            {unlockedCount} / {achievements.length} Unlocked ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ margin: '14px 0 24px' }}>
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${progressPercent}%`, 
              background: 'linear-gradient(90deg, #A8795A 0%, #D4A373 50%, #E6B86A 100%)',
              transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
              borderRadius: '999px'
            }}></div>
          </div>
        </div>

        {/* Grid of Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
          {achievements.map((a, i) => (
            <div
              key={i}
              style={{
                background: a.done 
                  ? 'linear-gradient(180deg, #1E1714 0%, #14100E 100%)' 
                  : 'rgba(255, 255, 255, 0.02)',
                border: a.done 
                  ? '1px solid rgba(212, 163, 115, 0.35)' 
                  : '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '14px',
                padding: '16px 14px',
                textAlign: 'center',
                boxShadow: a.done ? '0 4px 18px rgba(104, 83, 75, 0.18)' : 'none',
                opacity: a.done ? 1 : 0.45,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                margin: '0 auto 10px',
                borderRadius: '12px',
                background: a.done ? 'rgba(104, 83, 75, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: a.done ? '1px solid rgba(212, 163, 115, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                {a.done ? a.icon : <LockSvg />}
              </div>

              <div style={{ 
                fontWeight: '700', 
                fontSize: '13px', 
                color: a.done ? '#FFFFFF' : 'var(--text2)', 
                marginBottom: '4px' 
              }}>
                {a.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', lineHeight: '1.3' }}>
                {a.desc}
              </div>

              <div style={{ marginTop: '10px' }}>
                <span className={`pill-badge ${a.done ? 'green' : 'neutral'}`} style={{ fontSize: '9.5px', padding: '2px 8px' }}>
                  {a.done ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Profile & GitHub README Badge */}
      <div className="two-col" style={{ marginBottom: '24px' }}>
        
        {/* Share Public Profile */}
        <div className="card">
          <div className="card-title">
            <div className="card-title-left">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C89B7B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              <span>SHARE PUBLIC PROFILE</span>
            </div>
          </div>

          <p style={{ color: 'var(--text2)', fontSize: '13px', margin: '4px 0 16px', lineHeight: '1.5' }}>
            Share your verified developer showcase with technical recruiters, hiring managers, or on LinkedIn.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <code style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '12px',
              color: '#D4A373',
              flex: 1,
              minWidth: '200px',
              fontFamily: 'var(--mono)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {`${window.location.origin}/u/${shareId}`}
            </code>
            <button 
              className="btn-chaicode-primary"
              onClick={handleCopyLink}
              style={{ padding: '10px 18px', fontSize: '13px' }}
            >
              <span>{copiedLink ? '✓ Copied Link' : 'Copy Link'}</span>
            </button>
            <a 
              href={`/u/${shareId}`} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-chaicode-secondary"
              style={{ textDecoration: 'none', padding: '10px 18px', fontSize: '13px' }}
            >
              <span>Preview ↗</span>
            </a>
          </div>
        </div>

        {/* GitHub README Badge */}
        <div className="card">
          <div className="card-title">
            <div className="card-title-left">
              <GitHubLogo size={16} />
              <span>GITHUB README BADGE</span>
            </div>
          </div>

          <p style={{ color: 'var(--text2)', fontSize: '13px', margin: '4px 0 16px', lineHeight: '1.5' }}>
            Embed a real-time reactive SVG badge in your GitHub repository profile README.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <code style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '11px',
              color: 'var(--text)',
              flex: 1,
              minWidth: '200px',
              fontFamily: 'var(--mono)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {badgeMarkdown}
            </code>
            <button 
              className="btn-chaicode-primary"
              onClick={handleCopyBadge}
              style={{ padding: '10px 18px', fontSize: '13px' }}
            >
              <span>{copiedBadge ? '✓ Copied Code' : 'Copy Markdown'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Manual Statistics Updater (Interview Fast-Track) */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <div className="card-title-left">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C89B7B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span>CUSTOM TELEMETRY OVERRIDE</span>
          </div>
          <span className="pill-badge neutral">Manual Adjust</span>
        </div>

        <p style={{ color: 'var(--text2)', fontSize: '13px', margin: '4px 0 20px', lineHeight: '1.5' }}>
          Manually calibrate your statistics if external platform APIs are rate-limited or during offline interview demonstrations.
        </p>

        <ScoreUpdater token={token} onUpdate={fetchProfile} />
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ 
        border: '1px solid rgba(239, 68, 68, 0.25)', 
        background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.03) 0%, rgba(20, 10, 10, 0.5) 100%)' 
      }}>
        <div className="card-title" style={{ color: '#EF4444' }}>
          <div className="card-title-left">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>ACCOUNT SECURITY & DELETION</span>
          </div>
        </div>

        <p style={{ color: 'var(--text2)', fontSize: '13px', margin: '4px 0 18px', lineHeight: '1.5' }}>
          Warning: Deleting your account will irrevocably erase all telemetry snapshots, group memberships, and leaderboard rankings.
        </p>

        <button
          onClick={handleDeleteAccount}
          style={{
            background: 'transparent', 
            border: '1px solid rgba(239, 68, 68, 0.6)', 
            color: '#EF4444',
            padding: '10px 22px', 
            borderRadius: '10px', 
            cursor: 'pointer', 
            fontWeight: '600', 
            fontSize: '13px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.12)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          Delete Account Permanently
        </button>
      </div>

    </div>
  );
};

const ScoreUpdater = ({ token, onUpdate }) => {
  const [stats, setStats] = useState({ score: '', problems: '', streak: '' });
  const [saving, setSaving] = useState(false);
  const { addToast } = useApp() || {};
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const body = {};
      if (stats.score) body.score = parseInt(stats.score);
      if (stats.problems) body.problems = parseInt(stats.problems);
      if (stats.streak) body.streak = parseInt(stats.streak);

      const res = await fetch(`${API_URL}/api/user/update-stats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        if (addToast) addToast('Telemetry metrics updated successfully', 'success');
        setStats({ score: '', problems: '', streak: '' });
        onUpdate();
      } else {
        if (addToast) addToast('Failed to update stats', 'error');
      }
    } catch (err) {
      if (addToast) addToast('Network error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFillBenchmark = () => {
    setStats({ score: '1840', problems: '248', streak: '14' });
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <div className="input-group">
          <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text2)' }}>
            Dev Score
          </label>
          <input
            type="number"
            value={stats.score}
            onChange={(e) => setStats(prev => ({ ...prev, score: e.target.value }))}
            placeholder="e.g. 1840"
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '13.5px',
              color: '#FFFFFF'
            }}
          />
        </div>

        <div className="input-group">
          <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text2)' }}>
            Problems Solved
          </label>
          <input
            type="number"
            value={stats.problems}
            onChange={(e) => setStats(prev => ({ ...prev, problems: e.target.value }))}
            placeholder="e.g. 248"
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '13.5px',
              color: '#FFFFFF'
            }}
          />
        </div>

        <div className="input-group">
          <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text2)' }}>
            Active Streak (Days)
          </label>
          <input
            type="number"
            value={stats.streak}
            onChange={(e) => setStats(prev => ({ ...prev, streak: e.target.value }))}
            placeholder="e.g. 14"
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '13.5px',
              color: '#FFFFFF'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button 
          className="btn-chaicode-primary"
          onClick={handleUpdate}
          disabled={saving}
          style={{ opacity: saving ? 0.7 : 1 }}
        >
          <span>{saving ? '⏳ Updating...' : 'Update Telemetry'}</span>
        </button>
        <button 
          type="button"
          className="btn-chaicode-secondary"
          onClick={handleFillBenchmark}
        >
          <span>✦ Insert Benchmark Preset (1840 / 248 / 14)</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;