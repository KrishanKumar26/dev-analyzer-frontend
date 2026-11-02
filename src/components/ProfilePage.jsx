import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ProfilePage = ({ user, setUser }) => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '',
    githubUsername: '',
    leetcodeUsername: '',
    codeforcesUsername: '',
    hackerrankUsername: ''
  });
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const token = localStorage.getItem('token');

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg('');
    try {
      const res = await fetch(`${API_URL}/api/user/sync`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSyncMsg(`✅ Synced Successfully! Score: ${data.score} · Rank: #${data.rank}`);
        setProfile(prev => ({ ...prev, score: data.score, problems: data.problems, rank: data.rank }));
        setUser(prev => ({ ...prev, score: data.score, rank: data.rank }));
        if (data.breakdown) localStorage.setItem('scoreBreakdown', JSON.stringify(data.breakdown));
      } else {
        setSyncMsg('❌ Sync failed. Please try again later.');
      }
    } catch (err) {
      setSyncMsg('❌ Network error. Please check your connection.');
    } finally {
      setSyncing(false);
    }
  };

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
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setProfile(prev => ({ ...prev, ...data }));
      setUser(prev => ({ ...prev, name: data.name }));
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const [copied, setCopied] = useState(false);
  const handleShare = () => {
    if (!profile?.id) return;
    const url = `${window.location.origin}/u/${profile.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const badgeMarkdown = profile?.id
    ? `[![Dev Score](${API_URL}/api/public/badge/${profile.id}.svg)](${window.location.origin}/u/${profile.id})`
    : '';
  const [badgeCopied, setBadgeCopied] = useState(false);
  const handleCopyBadge = () => {
    if (!badgeMarkdown) return;
    navigator.clipboard.writeText(badgeMarkdown).then(() => {
      setBadgeCopied(true);
      setTimeout(() => setBadgeCopied(false), 2000);
    }).catch(() => {});
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure? This will permanently delete your account and all data.')) return;
    try {
      await fetch(`${API_URL}/api/user/account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Delete error:', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('scoreBreakdown');
    setUser(null);
  };

  return (
    <div className="page active rel" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Profile Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 229, 160, 0.1), rgba(123, 97, 255, 0.1))', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid var(--border2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="avatar" style={{ width: '100px', height: '100px', fontSize: '36px', border: '3px solid var(--primary)', boxShadow: '0 8px 20px rgba(0, 229, 160, 0.3)' }}>
              {(profile?.name || user?.name || 'US').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: 'var(--text)' }}>
                {profile?.name || user?.name}
              </h1>
              <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '12px' }}>{profile?.email || user?.email}</p>
              <div className="live-badge">
                <div className="live-dot"></div>
                Global Rank #{profile?.rank || 9999}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="auth-btn" style={{ width: 'auto', padding: '12px 24px' }} onClick={() => setEditing(!editing)}>
              {editing ? '✕ Cancel' : '✏️ Edit Profile'}
            </button>
            <button className="refresh-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="card" style={{ marginBottom: '2rem', animation: 'fadeInPage 0.3s ease' }}>
          <div className="card-title">✏️ Edit Your Profile</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {[
              { label: 'Full Name', key: 'name', icon: '👤', placeholder: 'Enter your name' },
              { label: 'GitHub Username', key: 'githubUsername', icon: '🐙', placeholder: 'your-github-username' },
              { label: 'LeetCode Username', key: 'leetcodeUsername', icon: '⚡', placeholder: 'your-leetcode-username' },
              { label: 'Codeforces Username', key: 'codeforcesUsername', icon: '🏆', placeholder: 'your-codeforces-username' },
              { label: 'HackerRank Username', key: 'hackerrankUsername', icon: '🎯', placeholder: 'your-hackerrank-username' }
            ].map(({ label, key, icon, placeholder }) => (
              <div key={key} className="input-group">
                <label>{icon} {label}</label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
          <button className="auth-btn" onClick={handleSave} disabled={saving} style={{ marginTop: '20px', width: '100%' }}>
            {saving ? '💾 Saving...' : saved ? '✅ Saved Successfully!' : '💾 SAVE CHANGES'}
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card green">
          <div className="stat-label">DEV SCORE</div>
          <div className="stat-value">{profile?.score ?? 0}</div>
          <div className="stat-sub">Total points earned</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-label">GLOBAL RANK</div>
          <div className="stat-value">#{profile?.rank ?? 9999}</div>
          <div className="stat-sub">Worldwide ranking</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">PROBLEMS</div>
          <div className="stat-value">{profile?.problems ?? 0}</div>
          <div className="stat-sub">Total solved</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">STREAK</div>
          <div className="stat-value">{profile?.streak ?? 0}d</div>
          <div className="stat-sub">Current streak</div>
        </div>
      </div>

      {/* Connected Platforms */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-title">🔗 Connected Platforms</div>
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '20px' }}>
          Link your coding accounts to sync stats automatically
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            { icon: '🐙', name: 'GitHub', handle: profile?.githubUsername, color: 'rgba(255, 255, 255, 0.1)' },
            { icon: '⚡', name: 'LeetCode', handle: profile?.leetcodeUsername, color: 'rgba(255, 209, 102, 0.1)' },
            { icon: '🏆', name: 'Codeforces', handle: profile?.codeforcesUsername, color: 'rgba(33, 150, 243, 0.1)' },
            { icon: '🎯', name: 'HackerRank', handle: profile?.hackerrankUsername, color: 'rgba(0, 200, 117, 0.1)' }
          ].map(({ icon, name, handle, color }) => (
            <div key={name} style={{
              background: handle ? color : 'var(--bg2)',
              border: handle ? '1px solid var(--border2)' : '1px dashed var(--border)',
              borderRadius: '12px',
              padding: '20px',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }} className="platform-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '28px' }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text)' }}>{name}</div>
                  <div style={{ fontSize: '12px', color: handle ? 'var(--primary)' : 'var(--text3)', fontFamily: 'var(--mono)' }}>
                    {handle ? `@${handle}` : 'Not connected'}
                  </div>
                </div>
                <span style={{
                  fontSize: '10px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  background: handle ? 'rgba(0, 229, 160, 0.2)' : 'rgba(255, 77, 109, 0.1)',
                  color: handle ? 'var(--primary)' : 'var(--accent)',
                  fontWeight: '600'
                }}>
                  {handle ? '✓' : '✕'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Stats */}
      <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(0, 229, 160, 0.05), rgba(123, 97, 255, 0.05))' }}>
        <div className="card-title">⚡ Sync Your Stats</div>
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '16px' }}>
          Automatically fetch latest data from your connected platforms and update your Dev Score
        </p>
        <button className="auth-btn" onClick={handleSync} disabled={syncing} style={{ width: '100%', maxWidth: '400px' }}>
          {syncing ? '🔄 Syncing... (This may take a moment)' : '🔄 SYNC MY STATS'}
        </button>
        {syncMsg && (
          <p style={{ 
            color: syncMsg.includes('✅') ? 'var(--primary)' : 'var(--accent)', 
            fontSize: '14px', 
            marginTop: '12px',
            padding: '12px',
            background: 'var(--bg2)',
            borderRadius: '8px',
            border: `1px solid ${syncMsg.includes('✅') ? 'var(--primary)' : 'var(--accent)'}`
          }}>
            {syncMsg}
          </p>
        )}
      </div>

      {/* Achievements */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-title">🏅 Achievements</div>
        {(() => {
          const s = profile || {};
          const allPlatforms = s.githubUsername && s.leetcodeUsername && s.codeforcesUsername && s.hackerrankUsername;
          const list = [
            { icon: '🔥', title: 'Week Warrior', desc: '7-day streak', done: (s.streak || 0) >= 7 },
            { icon: '⚡', title: 'Month Master', desc: '30-day streak', done: (s.streak || 0) >= 30 },
            { icon: '💯', title: 'Century', desc: '100 problems', done: (s.problems || 0) >= 100 },
            { icon: '🚀', title: 'Half-K Club', desc: '500 problems', done: (s.problems || 0) >= 500 },
            { icon: '🧠', title: 'Kilo Solver', desc: '1000 problems', done: (s.problems || 0) >= 1000 },
            { icon: '⭐', title: 'Rising Star', desc: 'Dev Score 1,000+', done: (s.score || 0) >= 1000 },
            { icon: '💎', title: 'Elite Dev', desc: 'Dev Score 5,000+', done: (s.score || 0) >= 5000 },
            { icon: '👑', title: 'Legend', desc: 'Dev Score 50,000+', done: (s.score || 0) >= 50000 },
            { icon: '🌐', title: 'Fully Connected', desc: 'All 4 platforms', done: !!allPlatforms },
            { icon: '🏅', title: 'Top 10', desc: 'Global rank under 10', done: (s.rank || 9999) >= 1 && (s.rank || 9999) <= 10 },
          ];
          const unlocked = list.filter((x) => x.done).length;
          const progress = ((unlocked / list.length) * 100).toFixed(0);
          
          return (
            <>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text2)' }}>Progress: {unlocked} / {list.length} unlocked</span>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)' }}>{progress}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg3)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${progress}%`, 
                    background: 'linear-gradient(90deg, var(--primary), var(--accent2))',
                    transition: 'width 1s ease'
                  }}></div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                {list.map((a) => (
                  <div key={a.title} style={{
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    background: a.done ? 'linear-gradient(135deg, rgba(0, 229, 160, 0.1), rgba(123, 97, 255, 0.05))' : 'var(--bg2)',
                    border: a.done ? '2px solid var(--primary)' : '1px solid var(--border)',
                    opacity: a.done ? 1 : 0.5,
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{a.done ? a.icon : '🔒'}</div>
                    <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '4px', color: a.done ? 'var(--primary)' : 'var(--text)' }}>
                      {a.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{a.desc}</div>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </div>

      {/* Public Profile Link */}
      <div className="card" style={{ marginBottom: '2rem', border: '1px solid var(--primary)' }}>
        <div className="card-title">🔗 Public Profile Link</div>
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '16px' }}>
          Share your verified developer profile with recruiters, on LinkedIn, or in your resume
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <code style={{ 
            background: 'var(--bg2)', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            fontSize: '13px', 
            color: 'var(--primary)', 
            flex: 1, 
            minWidth: '200px',
            fontFamily: 'var(--mono)',
            border: '1px solid var(--border)'
          }}>
            {profile?.id ? `${window.location.origin}/u/${profile.id}` : 'Loading...'}
          </code>
          <button className="auth-btn" style={{ width: 'auto', padding: '12px 24px' }} onClick={handleShare} disabled={!profile?.id}>
            {copied ? '✅ Copied!' : '📋 Copy Link'}
          </button>
          {profile?.id && (
            <a href={`/u/${profile.id}`} target="_blank" rel="noreferrer" className="refresh-btn" style={{ textDecoration: 'none', padding: '12px 24px' }}>
              👁️ Preview
            </a>
          )}
        </div>
      </div>

      {/* README Badge */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-title">🏷️ GitHub README Badge</div>
        <p styl