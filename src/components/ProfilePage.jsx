import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

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

  return (
    <div className="page active rel">
      <div className="overview-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '24px' }}>
            {(profile?.name || user?.name || 'US').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="greeting">{profile?.name || user?.name}</h1>
            <p style={{ color: 'var(--text2)', fontSize: '14px' }}>{profile?.email || user?.email}</p>
            <div className="live-badge" style={{ marginTop: '8px' }}>
              <div className="live-dot"></div>
              Rank: #{profile?.rank || 9999} globally
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-primary"
            style={{ width: 'auto', padding: '10px 20px' }}
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancel ✕' : 'Edit Profile ✏️'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {editing && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-title">Edit Profile</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Full Name', key: 'name', icon: '👤' },
              { label: 'GitHub Username', key: 'githubUsername', icon: '🐙' },
              { label: 'LeetCode Username', key: 'leetcodeUsername', icon: '⚡' },
              { label: 'Codeforces Username', key: 'codeforcesUsername', icon: '🏆' },
              { label: 'HackerRank Username', key: 'hackerrankUsername', icon: '🎯' }
            ].map(({ label, key, icon }) => (
              <div key={key} className="input-group">
                <label>{icon} {label.toUpperCase()}</label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={`Enter ${label}`}
                />
              </div>
            ))}
            <button
              className="auth-btn"
              onClick={handleSave}
              disabled={saving}
              style={{ marginTop: '10px' }}
            >
              {saving ? 'Saving...' : saved ? '✅ Saved!' : 'SAVE CHANGES'}
            </button>
          </div>
        </div>
      )}

      <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
        <div className="stat-card green">
          <div className="stat-label">DEV SCORE</div>
          <div className="stat-value">{profile?.score ?? 0}</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-label">GLOBAL RANK</div>
          <div className="stat-value">#{profile?.rank ?? 9999}</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">PROBLEMS</div>
          <div className="stat-value">{profile?.problems ?? 0}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">STREAK</div>
          <div className="stat-value">{profile?.streak ?? 0}d</div>
        </div>
      </div>

      <div className="card-title" style={{ marginTop: '2rem' }}>Connected Platforms</div>
      <div className="profile-platforms" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {[
          { icon: '🐙', name: 'GitHub', handle: profile?.githubUsername },
          { icon: '⚡', name: 'LeetCode', handle: profile?.leetcodeUsername },
          { icon: '🏆', name: 'Codeforces', handle: profile?.codeforcesUsername },
          { icon: '🎯', name: 'HackerRank', handle: profile?.hackerrankUsername }
        ].map(({ icon, name, handle }) => (
          <div key={name} className={`platform-card ${handle ? 'connected' : ''}`}>
            <div className="platform-header">
              <span className="platform-icon">{icon}</span>
              <div>
                <div className="platform-name">{name}</div>
                <div className="platform-handle">@{handle || 'not connected'}</div>
              </div>
              <span className="connected-pill">{handle ? 'Connected ✅' : 'Not Set'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-title">Achievements</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {profile?.streak >= 7 && <span className="platform-badge badge-gh">🔥 {profile.streak}-Day Streak</span>}
          {profile?.problems >= 100 && <span className="platform-badge badge-lc">💎 100+ Solved</span>}
          {profile?.problems >= 500 && <span className="platform-badge badge-cf">🚀 500+ Solved</span>}
          {profile?.score >= 1000 && <span className="platform-badge badge-gh">⭐ Score 1000+</span>}
          {profile?.score >= 5000 && <span className="platform-badge badge-lc">👑 Elite Developer</span>}
          {(!profile?.streak || profile.streak < 7) && (!profile?.problems || profile.problems < 100) && (
            <span style={{ color: 'var(--text2)', fontSize: '14px' }}>
              Complete challenges to earn achievements! 🎯
            </span>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
        <div className="card-title">Update Your Stats</div>
        <ScoreUpdater token={token} onUpdate={fetchProfile} />
      </div>
    </div>
  );
};

const ScoreUpdater = ({ token, onUpdate }) => {
  const [stats, setStats] = useState({ score: '', problems: '', streak: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

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
        setMsg('✅ Stats updated!');
        setStats({ score: '', problems: '', streak: '' });
        onUpdate();
        setTimeout(() => setMsg(''), 2000);
      }
    } catch (err) {
      setMsg('❌ Error updating stats');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[
        { label: 'New Score', key: 'score', placeholder: 'e.g. 1500' },
        { label: 'Problems Solved', key: 'problems', placeholder: 'e.g. 150' },
        { label: 'Current Streak (days)', key: 'streak', placeholder: 'e.g. 10' }
      ].map(({ label, key, placeholder }) => (
        <div key={key} className="input-group">
          <label>{label.toUpperCase()}</label>
          <input
            type="number"
            value={stats[key]}
            onChange={(e) => setStats(prev => ({ ...prev, [key]: e.target.value }))}
            placeholder={placeholder}
          />
        </div>
      ))}
      {msg && <p style={{ color: 'var(--primary)', fontSize: '13px' }}>{msg}</p>}
      <button className="auth-btn" onClick={handleUpdate} disabled={saving}>
        {saving ? 'Updating...' : 'UPDATE STATS ➔'}
      </button>
    </div>
  );
};

export default ProfilePage;