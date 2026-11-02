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
    <div className="page active rel" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      
      {/* Profile Header - Modern Design */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.08))', 
        padding: '2.5rem', 
        borderRadius: '20px', 
        marginBottom: '2rem', 
        border: '1px solid rgba(139, 92, 246, 0.2)',
        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div className="avatar" style={{ 
              width: '110px', 
              height: '110px', 
              fontSize: '40px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: '4px solid rgba(255, 255, 255, 0.1)', 
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
            }}>
              {(profile?.name || user?.name || 'DV').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px', color: 'var(--text)', letterSpacing: '-0.5px' }}>
                {profile?.name || user?.name || 'Developer'}
              </h1>
              <p style={{ color: 'var(--text2)', fontSize: '15px', marginBottom: '14px', opacity: 0.8 }}>
                {profile?.email || user?.email}
              </p>
              <div className="live-badge" style={{ 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '8px 16px',
                borderRadius: '12px'
              }}>
                <div className="live-dot" style={{ background: '#8b5cf6' }}></div>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Global Rank #{profile?.rank || '9,999'}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="auth-btn" style={{ 
              width: 'auto', 
              padding: '12px 28px',
              background: editing ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: editing ? '2px solid rgba(139, 92, 246, 0.5)' : 'none',
              color: editing ? 'var(--text)' : '#fff'
            }} onClick={() => setEditing(!editing)}>
              {editing ? '✕ Cancel' : '✏️ Edit Profile'}
            </button>
            <button className="refresh-btn" style={{ padding: '12px 28px' }} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form - Modern Design */}
      {editing && (
        <div className="card" style={{ 
          marginBottom: '2rem', 
          animation: 'fadeInPage 0.3s ease',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03), rgba(168, 85, 247, 0.03))',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <div className="card-title" style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
            Edit Your Profile
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
            {[
              { label: 'Full Name', key: 'name', placeholder: 'Enter your full name' },
              { label: 'GitHub Username', key: 'githubUsername', placeholder: 'github-username' },
              { label: 'LeetCode Username', key: 'leetcodeUsername', placeholder: 'leetcode-username' },
              { label: 'Codeforces Handle', key: 'codeforcesUsername', placeholder: 'codeforces-handle' },
              { label: 'HackerRank Username', key: 'hackerrankUsername', placeholder: 'hackerrank-username' }
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="input-group">
                <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text2)' }}>
                  {label}
                </label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                />
              </div>
            ))}
          </div>
          <button 
            className="auth-btn" 
            onClick={handleSave} 
            disabled={saving} 
            style={{ 
              marginTop: '24px', 
              width: '100%',
              background: saved ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '14px',
              fontSize: '15px',
              fontWeight: '700'
            }}
          >
            {saving ? 'Saving Changes...' : saved ? '✓ Saved Successfully!' : 'Save Changes'}
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

      {/* Connected Platforms - Modern Cards */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-title" style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
          Connected Platforms
        </div>
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
          Link your coding accounts to automatically sync your statistics
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[
            { name: 'GitHub', handle: profile?.githubUsername, gradient: 'linear-gradient(135deg, #24292e 0%, #4a5568 100%)', icon: '💻' },
            { name: 'LeetCode', handle: profile?.leetcodeUsername, gradient: 'linear-gradient(135deg, #ffa116 0%, #ff6b35 100%)', icon: '⚡' },
            { name: 'Codeforces', handle: profile?.codeforcesUsername, gradient: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)', icon: '🏅' },
            { name: 'HackerRank', handle: profile?.hackerrankUsername, gradient: 'linear-gradient(135deg, #00c853 0%, #00b248 100%)', icon: '🎯' }
          ].map(({ name, handle, gradient, icon }) => (
            <div key={name} style={{
              background: handle ? `${gradient}, var(--bg2)` : 'var(--bg2)',
              backgroundBlendMode: handle ? 'overlay' : 'normal',
              border: handle ? '1px solid rgba(139, 92, 246, 0.2)' : '1px dashed var(--border)',
              borderRadius: '14px',
              padding: '24px',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }} className="platform-card">
              {handle && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '10px',
                  height: '10px',
                  background: '#10b981',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)'
                }}></div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                <span style={{ fontSize: '32px' }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '17px', color: 'var(--text)', marginBottom: '4px' }}>{name}</div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: handle ? '#8b5cf6' : 'var(--text3)', 
                    fontFamily: 'var(--mono)',
                    fontWeight: '500'
                  }}>
                    {handle ? `@${handle}` : 'Not connected'}
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: '11px',
                padding: '6px 12px',
                borderRadius: '20px',
                background: handle ? 'rgba(139, 92, 246, 0.15)' : 'rgba(156, 163, 175, 0.1)',
                color: handle ? '#8b5cf6' : 'var(--text3)',
                fontWeight: '700',
                textAlign: 'center',
                border: handle ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--border)'
              }}>
                {handle ? '✓ Connected' : '○ Disconnected'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Stats - Professional Card */}
      <div className="card" style={{ 
        marginBottom: '2rem', 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))',
        border: '1px solid rgba(139, 92, 246, 0.2)'
      }}>
        <div className="card-title" style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
          Sync Statistics
        </div>
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
          Fetch the latest data from your connected platforms and update your Dev Score
        </p>
        <button 
          className="auth-btn" 
          onClick={handleSync} 
          disabled={syncing} 
          style={{ 
            width: '100%', 
            maxWidth: '450px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '14px 28px',
            fontSize: '15px',
            fontWeight: '700',
            opacity: syncing ? 0.7 : 1
          }}
        >
          {syncing ? 'Syncing... Please wait' : 'Sync Now'}
        </button>
        {syncMsg && (
          <div style={{ 
            color: syncMsg.includes('✅') ? '#10b981' : '#ef4444', 
            fontSize: '14px', 
            marginTop: '16px',
            padding: '14px 18px',
            background: syncMsg.includes('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '10px',
            border: `1px solid ${syncMsg.includes('✅') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            fontWeight: '500'
          }}>
            {syncMsg}
          </div>
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

      {/* Public Profile Link - Clean Design */}
      <div className="card" style={{ 
        marginBottom: '2rem', 
        border: '1px solid rgba(139, 92, 246, 0.3)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03), rgba(168, 85, 247, 0.03))'
      }}>
        <div className="card-title" style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
          Share Your Profile
        </div>
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
          Share your verified developer profile with recruiters or on LinkedIn
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <code style={{ 
            background: 'var(--bg2)', 
            padding: '14px 18px', 
            borderRadius: '10px', 
            fontSize: '13px', 
            color: '#8b5cf6', 
            flex: 1, 
            minWidth: '220px',
            fontFamily: 'var(--mono)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            fontWeight: '500'
          }}>
            {profile?.id ? `${window.location.origin}/u/${profile.id}` : 'Loading...'}
          </code>
          <button 
            className="auth-btn" 
            style={{ 
              width: 'auto', 
              padding: '14px 28px',
              background: copied ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }} 
            onClick={handleShare} 
            disabled={!profile?.id}
          >
            {copied ? '✓ Copied' : 'Copy Link'}
          </button>
          {profile?.id && (
            <a href={`/u/${profile.id}`} target="_blank" rel="noreferrer" className="refresh-btn" style={{ textDecoration: 'none', padding: '14px 28px' }}>
              Preview
            </a>
          )}
        </div>
      </div>

      {/* README Badge - Modern Look */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-title" style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
          GitHub README Badge
        </div>
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '18px', lineHeight: '1.6' }}>
          Add this badge to your GitHub README to showcase your Dev Score
        </p>
        {profile?.id && (
          <div style={{ marginBottom: '18px', padding: '16px', background: 'var(--bg2)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <img src={`${API_URL}/api/public/badge/${profile.id}.svg`} alt="Dev Score badge" style={{ height: '30px' }} />
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'stretch' }}>
          <code style={{ 
            background: 'var(--bg2)', 
            padding: '14px 18px', 
            borderRadius: '10px', 
            fontSize: '12px', 
            color: 'var(--text)', 
            flex: 1, 
            minWidth: '240px', 
            overflowX: 'auto', 
            fontFamily: 'var(--mono)',
            border: '1px solid var(--border)',
            fontWeight: '500'
          }}>
            {badgeMarkdown || 'Loading...'}
          </code>
          <button 
            className="auth-btn" 
            style={{ 
              width: 'auto', 
              padding: '14px 28px',
              background: badgeCopied ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }} 
            onClick={handleCopyBadge} 
            disabled={!badgeMarkdown}
          >
            {badgeCopied ? '✓ Copied' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Manual Stats Update - Clean */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-title" style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
          Update Statistics Manually
        </div>
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
          Manually adjust your statistics if automatic sync is unavailable
        </p>
        <ScoreUpdater token={token} onUpdate={fetchProfile} />
      </div>

      {/* Danger Zone - Professional Warning */}
      <div className="card" style={{ 
        marginBottom: '3rem', 
        border: '1px solid rgba(239, 68, 68, 0.3)', 
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.02), rgba(220, 38, 38, 0.02))'
      }}>
        <div className="card-title" style={{ color: '#ef4444', fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
          Account Deletion
        </div>
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
          Warning: This will permanently delete all your data including scores, achievements, and connections. This action cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          style={{
            background: 'transparent', 
            border: '2px solid #ef4444', 
            color: '#ef4444',
            padding: '12px 28px', 
            borderRadius: '10px', 
            cursor: 'pointer', 
            fontWeight: '700', 
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(239, 68, 68, 0.1)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

const ScoreUpdater = ({ token, onUpdate }) => {
  const [stats, setStats] = useState({ score: '', problems: '', streak: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const handleUpdate = async () => {
    setSaving(true);
    setMsg('');
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
        setMsg('✅ Stats updated successfully!');
        setStats({ score: '', problems: '', streak: '' });
        onUpdate();
        setTimeout(() => setMsg(''), 3000);
      } else {
        setMsg('❌ Failed to update stats');
      }
    } catch (err) {
      setMsg('❌ Network error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
      {[
        { label: 'Dev Score', key: 'score', placeholder: 'e.g. 1500' },
        { label: 'Problems Solved', key: 'problems', placeholder: 'e.g. 150' },
        { label: 'Current Streak', key: 'streak', placeholder: 'e.g. 10 days' }
      ].map(({ label, key, placeholder }) => (
        <div key={key} className="input-group">
          <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text2)' }}>
            {label}
          </label>
          <input
            type="number"
            value={stats[key]}
            onChange={(e) => setStats(prev => ({ ...prev, [key]: e.target.value }))}
            placeholder={placeholder}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          />
        </div>
      ))}
      <div style={{ gridColumn: '1 / -1' }}>
        {msg && (
          <div style={{ 
            color: msg.includes('✅') ? '#10b981' : '#ef4444', 
            fontSize: '14px', 
            marginBottom: '14px',
            padding: '12px 16px',
            background: msg.includes('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '10px',
            border: `1px solid ${msg.includes('✅') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            fontWeight: '500'
          }}>
            {msg}
          </div>
        )}
        <button 
          className="auth-btn" 
          onClick={handleUpdate} 
          disabled={saving} 
          style={{ 
            width: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '14px',
            fontSize: '15px',
            fontWeight: '700'
          }}
        >
          {saving ? 'Updating...' : 'Update Statistics'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
