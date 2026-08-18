import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [busy, setBusy] = useState(false);
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
      if (Array.isArray(data)) setGoals(data);
    } catch (e) { /* ignore */ }
  };
  useEffect(() => { load(); }, []);

  const addGoal = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      await authFetch('/api/goals', { method: 'POST', body: JSON.stringify({ title, target: parseInt(target) || 1 }) });
      setTitle(''); setTarget(''); await load();
    } catch (e) { /* ignore */ } finally { setBusy(false); }
  };

  const setProgress = async (g, current) => {
    const c = Math.max(0, Math.min(current, g.target));
    setGoals((prev) => prev.map((x) => (x.id === g.id ? { ...x, current: c } : x)));
    await authFetch(`/api/goals/${g.id}`, { method: 'PUT', body: JSON.stringify({ current: c }) });
  };

  const removeGoal = async (id) => {
    await authFetch(`/api/goals/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="page active rel">
      <div className="card">
        <div className="card-title">🎯 Set a Goal</div>
        <p style={{ color: 'var(--text2)', fontSize: '13px', margin: '8px 0 12px' }}>
          e.g. "Solve 100 LeetCode", "Reach 1500 CF rating" — target set karo aur progress track karo.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goal title"
            style={{ flex: 2, minWidth: '160px', padding: '12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
          <input value={target} onChange={(e) => setTarget(e.target.value)} type="number" placeholder="Target (e.g. 100)"
            style={{ flex: 1, minWidth: '100px', padding: '12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
          <button className="auth-btn" style={{ width: 'auto', padding: '10px 24px' }} onClick={addGoal} disabled={busy}>Add</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <div className="card-title">📋 My Goals</div>
        {goals.length === 0 ? (
          <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '10px' }}>Abhi koi goal nahi. Upar se add karo.</p>
        ) : (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.current / g.target) * 100));
              const done = g.current >= g.target;
              return (
                <div key={g.id} style={{ background: 'var(--bg2)', border: `1px solid ${done ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{done ? '✅ ' : ''}{g.title}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text2)' }}>{g.current} / {g.target} ({pct}%)</div>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg3)', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: done ? 'var(--primary)' : 'linear-gradient(90deg, var(--primary), var(--gold))', transition: 'width .3s' }}></div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center' }}>
                    <button onClick={() => setProgress(g, g.current - 1)} style={{ padding: '4px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', cursor: 'pointer' }}>−</button>
                    <button onClick={() => setProgress(g, g.current + 1)} style={{ padding: '4px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', cursor: 'pointer' }}>+1</button>
                    <button onClick={() => setProgress(g, g.target)} style={{ padding: '4px 12px', background: 'transparent', border: '1px solid var(--primary)', borderRadius: '6px', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px' }}>Complete</button>
                    <button onClick={() => removeGoal(g.id)} style={{ marginLeft: 'auto', padding: '4px 12px', background: 'transparent', border: '1px solid #ff4d4f55', borderRadius: '6px', color: '#ff4d4f', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
