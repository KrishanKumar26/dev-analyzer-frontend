import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// High-Yield Developer Goals for Interview Showcase
const BENCHMARK_GOALS = [
  { id: 'b1', title: 'Solve 150 LeetCode Mediums & Hard Patterns', current: 118, target: 150 },
  { id: 'b2', title: 'Master Distributed Systems & System Design Guild', current: 8, target: 10 },
  { id: 'b3', title: '50 Production Open-Source Commits & Reviews', current: 36, target: 50 }
];

const TargetSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C89B7B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const CheckSvg = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5EA880" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const TrashSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [busy, setBusy] = useState(false);
  const { addToast } = useApp() || {};
  const token = localStorage.getItem('token');

  const authFetch = (path, opts = {}) =>
    fetch(`${API_URL}${path}`, {
      ...opts,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
    });

  const load = async () => {
    try {
      const res = await authFetch('/api/goals');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setGoals(data);
      } else {
        setGoals(BENCHMARK_GOALS);
      }
    } catch (e) {
      setGoals(BENCHMARK_GOALS);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addGoal = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      await authFetch('/api/goals', { method: 'POST', body: JSON.stringify({ title, target: parseInt(target) || 10 }) });
      setTitle('');
      setTarget('');
      if (addToast) addToast('Milestone target created', 'success');
      await load();
    } catch (e) {
      const newGoal = { id: 'local_' + Date.now(), title, current: 0, target: parseInt(target) || 10 };
      setGoals(prev => [newGoal, ...prev]);
      setTitle('');
      setTarget('');
      if (addToast) addToast('Milestone target saved locally', 'success');
    } finally {
      setBusy(false);
    }
  };

  const setProgress = async (g, current) => {
    const c = Math.max(0, Math.min(current, g.target));
    setGoals((prev) => prev.map((x) => (x.id === g.id ? { ...x, current: c } : x)));
    try {
      await authFetch(`/api/goals/${g.id}`, { method: 'PUT', body: JSON.stringify({ current: c }) });
    } catch (e) { /* local fallback */ }
  };

  const removeGoal = async (id) => {
    setGoals(prev => prev.filter(x => x.id !== id));
    try {
      await authFetch(`/api/goals/${id}`, { method: 'DELETE' });
      if (addToast) addToast('Milestone target removed', 'info');
    } catch (e) { /* local fallback */ }
  };

  return (
    <div className="page active rel" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 60px' }}>

      {/* Atmospheric Hero */}
      <div className="overview-hero" style={{ marginBottom: '24px' }}>
        <div className="overview-hero-text">
          <div className="pill-badge mocha" style={{ marginBottom: '12px' }}>
            <span className="live-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C89B7B', animation: 'liveRadar 2s infinite' }}></span>
            <span>DEVELOPER TARGETS & VELOCITY</span>
          </div>
          <h1 className="overview-hero-title">
            Coding Milestones & Targets <span style={{ color: '#D4A373' }}>✦</span>
          </h1>
          <p className="overview-hero-subtitle">
            Set quantitative competitive programming objectives, track algorithmic sprint velocity, and conquer milestones.
          </p>
        </div>
      </div>

      {/* Set a Goal Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <div className="card-title-left">
            <TargetSvg />
            <span>CREATE MILESTONE OBJECTIVE</span>
          </div>
          <span className="pill-badge mocha">Custom Velocity</span>
        </div>

        <p style={{ color: 'var(--text2)', fontSize: '13px', margin: '4px 0 16px', lineHeight: '1.5' }}>
          e.g. "Solve 100 Hard LeetCode Problems", "Achieve 1800 Codeforces Rating", "Contribute 20 Linux PRs".
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Milestone title..."
            style={{
              flex: 3,
              minWidth: '220px',
              padding: '12px 16px',
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '13.5px'
            }}
          />
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            type="number"
            placeholder="Target count (e.g. 50)"
            style={{
              flex: 1,
              minWidth: '140px',
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
            onClick={addGoal}
            disabled={busy}
            style={{ padding: '12px 24px', opacity: busy ? 0.7 : 1 }}
          >
            <span>{busy ? 'Saving...' : 'Add Milestone'}</span>
          </button>
        </div>
      </div>

      {/* Active Milestones List */}
      <div className="card">
        <div className="card-title">
          <div className="card-title-left">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C89B7B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span>TRACKED OBJECTIVES</span>
          </div>
          <span className="pill-badge neutral">{goals.length} Active Targets</span>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
            const done = g.current >= g.target;
            return (
              <div
                key={g.id}
                style={{
                  background: done 
                    ? 'linear-gradient(180deg, #1C1814 0%, #14110E 100%)' 
                    : 'rgba(255, 255, 255, 0.02)',
                  border: done 
                    ? '1px solid rgba(212, 163, 115, 0.45)' 
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {done && <CheckSvg />}
                    <span style={{ fontWeight: '700', fontSize: '15px', color: done ? '#D4A373' : '#FFFFFF' }}>
                      {g.title}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
                    <span style={{ color: '#D4A373', fontWeight: '700' }}>{g.current}</span> / {g.target} ({pct}%)
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: '7px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', marginTop: '12px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: done 
                      ? 'linear-gradient(90deg, #5EA880, #8EDBB1)' 
                      : 'linear-gradient(90deg, #A8795A, #D4A373)',
                    borderRadius: '10px',
                    transition: 'width .35s ease'
                  }}></div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '14px', alignItems: 'center' }}>
                  <button
                    onClick={() => setProgress(g, g.current - 1)}
                    style={{
                      padding: '4px 14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    −
                  </button>
                  <button
                    onClick={() => setProgress(g, g.current + 1)}
                    style={{
                      padding: '4px 14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    +1
                  </button>
                  <button
                    onClick={() => setProgress(g, g.target)}
                    style={{
                      padding: '4px 14px',
                      background: 'rgba(104, 83, 75, 0.2)',
                      border: '1px solid rgba(212, 163, 115, 0.35)',
                      borderRadius: '8px',
                      color: '#D4A373',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    Complete Target
                  </button>
                  <button
                    onClick={() => removeGoal(g.id)}
                    style={{
                      marginLeft: 'auto',
                      padding: '4px 12px',
                      background: 'transparent',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      color: '#EF4444',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <TrashSvg />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Goals;