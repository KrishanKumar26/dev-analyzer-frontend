import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const PLATFORM_ICON = { GitHub: '🐙', LeetCode: '⚡', Codeforces: '🏆', HackerRank: '🎯' };

const Stat = ({ label, value, color }) => (
  <div className="stat-card" style={{ borderTop: `2px solid ${color}` }}>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
  </div>
);

const PublicProfile = ({ id }) => {
  const [data, setData] = useState(null);
  const [state, setState] = useState('loading'); // loading | ready | notfound

  useEffect(() => {
    fetch(`${API_URL}/api/public/profile/${id}`)
      .then(async (res) => {
        if (!res.ok) { setState('notfound'); return; }
        const d = await res.json();
        setData(d);
        setState('ready');
      })
      .catch(() => setState('notfound'));
  }, [id]);

  if (state === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'var(--text2)' }}>
        Loading profile…
      </div>
    );
  }

  if (state === 'notfound') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '20px' }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔍</div>
          <h2>Profile not found</h2>
          <p style={{ color: 'var(--text2)', marginTop: '8px' }}>Ye developer profile exist nahi karta.</p>
          <a href="/" style={{ color: 'var(--primary)', marginTop: '16px', display: 'inline-block' }}>← Vortex pe jao</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Brand + verified badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <span className="logo-text" style={{ fontSize: '20px', fontWeight: 'bold' }}>
            VOR<span className="logo-accent">TEX</span>
          </span>
          <span className="live-badge" style={{ fontSize: '12px' }}>
            <span style={{ color: 'var(--primary)' }}>✓ Verified Developer Profile</span>
          </span>
        </div>

        {/* Hero */}
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div className="avatar" style={{ width: '90px', height: '90px', fontSize: '30px', margin: '0 auto 16px' }}>
            {(data.name || 'DV').substring(0, 2).toUpperCase()}
          </div>
          <h1 className="greeting" style={{ marginBottom: '6px' }}>{data.name}</h1>
          <div className="live-badge" style={{ display: 'inline-flex' }}>
            <div className="live-dot"></div>
            Global Rank #{data.rank}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginTop: '20px' }}>
          <Stat label="DEV SCORE" value={(data.score ?? 0).toLocaleString()} color="var(--primary)" />
          <Stat label="GLOBAL RANK" value={`#${data.rank ?? '-'}`} color="var(--gold)" />
          <Stat label="PROBLEMS" value={(data.problems ?? 0).toLocaleString()} color="#a371f7" />
          <Stat label="STREAK" value={`${data.streak ?? 0}d`} color="#ff4d4f" />
        </div>

        {/* Platforms */}
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-title">Verified Platforms</div>
          {(!data.platforms || data.platforms.length === 0) ? (
            <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '12px' }}>Abhi koi platform connect nahi hai.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '15px' }}>
              {data.platforms.map((pf) => (
                <a
                  key={pf.platform}
                  href={pf.url}
                  target="_blank"
                  rel="noreferrer"
                  className="platform-card connected"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="platform-header">
                    <span className="platform-icon">{PLATFORM_ICON[pf.platform] || '🔗'}</span>
                    <div>
                      <div className="platform-name">{pf.platform}</div>
                      <div className="platform-handle">@{pf.username}</div>
                    </div>
                    <span className="connected-pill">View ↗</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* CTA footer */}
        <div style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text3)', fontSize: '13px' }}>
          Powered by <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Vortex Dev Analyzer</a> —
          apna developer profile banao aur real stats track karo.
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
