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

// Generate realistic preview pattern if user hasn't synced GitHub yet
const SAMPLE_ACTIVITY = Array.from({ length: 84 }, (_, i) => {
  const seed = (i * 17 + (i % 7) * 31) % 100;
  let count = 0;
  if (seed > 80) count = 8;
  else if (seed > 60) count = 4;
  else if (seed > 35) count = 2;
  else if (seed > 15) count = 1;
  return { count, date: `Day -${84 - i}` };
});

const getColor = (level) => {
  switch (level) {
    case 0: return 'rgba(255, 255, 255, 0.04)';
    case 1: return 'rgba(104, 83, 75, 0.4)';
    case 2: return 'rgba(200, 155, 123, 0.45)';
    case 3: return 'rgba(200, 155, 123, 0.75)';
    case 4: return '#C89B7B';
    default: return 'rgba(255, 255, 255, 0.04)';
  }
};

const ActivityCalendar = () => {
  const [days, setDays] = useState([]);          // last 84 days: {date, count}
  const [total, setTotal] = useState(null);
  const [isLive, setIsLive] = useState(false);
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
      if (!profile.githubUsername) {
        setDays(SAMPLE_ACTIVITY);
        setTotal(148);
        setIsLive(false);
        return;
      }

      const res = await fetch(
        `${API_URL}/api/user/github-contributions/${profile.githubUsername}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok || data.error || !Array.isArray(data.days)) {
        setDays(SAMPLE_ACTIVITY);
        setTotal(148);
        setIsLive(false);
        return;
      }

      setDays(data.days.slice(-84)); // last 12 weeks
      setTotal(data.totalContributions);
      setIsLive(true);
    } catch (err) {
      setDays(SAMPLE_ACTIVITY);
      setTotal(148);
      setIsLive(false);
    }
  };

  const headerRight = isLive 
    ? `${total} CONTRIBUTIONS THIS YEAR`
    : `148 CONTRIBUTIONS (PREVIEW)`;

  return (
    <div className="card">
      <div className="card-title">
        <div className="card-title-left">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C89B7B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>GITHUB ACTIVITY HEATMAP</span>
        </div>
        <span className={`pill-badge ${isLive ? 'green' : 'mocha'}`}>
          {headerRight}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(7, 1fr)',
        gridAutoFlow: 'column',
        gap: '4px',
        marginTop: '15px'
      }}>
        {days.map((d, i) => {
          const level = levelFor(d.count);
          return (
            <div
              key={i}
              className="heatmap-cell"
              style={{
                width: '100%',
                aspectRatio: '1/1',
                borderRadius: '3px',
                backgroundColor: getColor(level),
                boxShadow: level === 4 ? '0 0 10px rgba(200, 155, 123, 0.4)' : 'none',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
              title={d.date ? `${d.date}: ${d.count} contribution${d.count === 1 ? '' : 's'}` : 'No data'}
            />
          );
        })}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '16px',
        fontSize: '11px',
        color: 'var(--text3)'
      }}>
        <span style={{ fontStyle: 'italic' }}>
          {isLive ? '● Live GitHub sync' : '*Connect GitHub in Profile settings to sync personal graph.'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Less</span>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.04)' }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(104, 83, 75, 0.4)' }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(200, 155, 123, 0.55)' }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#C89B7B' }}></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;
