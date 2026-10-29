import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// GitHub contribution count -> intensity level (0-4)
const levelFor = (count) => {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
};

const getColor = (level) => {
  switch (level) {
    case 0: return 'var(--bg3)';
    case 1: return 'rgba(0, 229, 160, 0.2)';
    case 2: return 'rgba(0, 229, 160, 0.4)';
    case 3: return 'rgba(0, 229, 160, 0.7)';
    case 4: return 'var(--primary)';
    default: return 'var(--bg3)';
  }
};

const ActivityCalendar = () => {
  const [days, setDays] = useState([]);          // last 84 days: {date, count}
  const [total, setTotal] = useState(null);
  const [state, setState] = useState('loading'); // loading | ready | nogithub | error
  const token = localStorage.getItem('token');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const p = await fetch(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profile = await p.json();
      if (!profile.githubUsername) { setState('nogithub'); return; }

      const res = await fetch(
        `${API_URL}/api/user/github-contributions/${profile.githubUsername}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok || data.error || !Array.isArray(data.days)) { setState('error'); return; }

      setDays(data.days.slice(-84)); // last 12 weeks
      setTotal(data.totalContributions);
      setState('ready');
    } catch (err) {
      console.error('Contributions error:', err);
      setState('error');
    }
  };

  const headerRight =
    state === 'ready' ? `${total} CONTRIBUTIONS THIS YEAR`
    : state === 'loading' ? 'Loading...'
    : state === 'nogithub' ? 'Connect GitHub'
    : 'Unavailable';

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>GITHUB HEATMAP</span>
        <span className="badge-sm" style={{ color: 'var(--primary)' }}>{headerRight}</span>
      </div>

      {state === 'nogithub' ? (
        <div style={{ color: 'var(--text2)', fontSize: '13px', textAlign: 'center', padding: '30px' }}>
          Profile → Edit Profile me apna GitHub username daalo, phir yahan asli activity dikhegi 🐙
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(7, 1fr)',
          gridAutoFlow: 'column',
          gap: '4px',
          marginTop: '15px'
        }}>
          {(days.length ? days : Array.from({ length: 84 }, () => ({ count: 0, date: '' }))).map((d, i) => {
            const level = levelFor(d.count);
            return (
              <div
                key={i}
                className="heatmap-cell"
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '2px',
                  backgroundColor: getColor(level),
                  boxShadow: level === 4 ? '0 0 10px var(--primary)' : 'none',
                  cursor: 'pointer'
                }}
                title={d.date ? `${d.date}: ${d.count} contribution${d.count === 1 ? '' : 's'}` : 'No data'}
              />
            );
          })}
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: '15px',
        fontSize: '10px',
        color: 'var(--text3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>Less</span>
          <div style={{ width: '8px', height: '8px', background: 'var(--bg3)' }}></div>
          <div style={{ width: '8px', height: '8px', background: 'rgba(0, 229, 160, 0.4)' }}></div>
          <div style={{ width: '8px', height: '8px', background: 'var(--primary)' }}></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;
