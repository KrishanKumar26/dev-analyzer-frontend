import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Groups = () => {
  const [myGroups, setMyGroups] = useState([]);
  const [selected, setSelected] = useState(null); // { name, code, leaderboard }
  const [createName, setCreateName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const token = localStorage.getItem('token');

  const authFetch = (path, opts = {}) =>
    fetch(`${API_URL}${path}`, {
      ...opts,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
    });

  const loadMine = async () => {
    try {
      const res = await authFetch('/api/groups/mine');
      const data = await res.json();
      if (Array.isArray(data)) setMyGroups(data);
    } catch (e) { /* ignore */ }
  };

  useEffect(() => { loadMine(); }, []);

  const openGroup = async (code) => {
    setBusy(true);
    try {
      const res = await authFetch(`/api/groups/${code}/leaderboard`);
      const data = await res.json();
      if (res.ok) setSelected(data);
    } catch (e) { /* ignore */ } finally { setBusy(false); }
  };

  const createGroup = async () => {
    if (!createName.trim()) return;
    setBusy(true); setMsg('');
    try {
      const res = await authFetch('/api/groups/create', { method: 'POST', body: JSON.stringify({ name: createName }) });
      const data = await res.json();
      if (res.ok) {
        setMsg(`✅ "${data.name}" bana! Code: ${data.code} — friends ko bhejo`);
        setCreateName('');
        await loadMine();
      } else setMsg('❌ ' + (data.error || 'Failed'));
    } catch (e) { setMsg('❌ Failed'); } finally { setBusy(false); }
  };

  const joinGroup = async () => {
    if (!joinCode.trim()) return;
    setBusy(true); setMsg('');
    try {
      const res = await authFetch('/api/groups/join', { method: 'POST', body: JSON.stringify({ code: joinCode }) });
      const data = await res.json();
      if (res.ok) {
        setMsg(`✅ Joined "${data.name}"`);
        setJoinCode('');
        await loadMine();
        openGroup(data.code);
      } else setMsg('❌ ' + (data.error || 'Group not found'));
    } catch (e) { setMsg('❌ Failed'); } finally { setBusy(false); }
  };

  const leaveGroup = async (code) => {
    if (!window.confirm('Group chhodna hai?')) return;
    await authFetch(`/api/groups/${code}/leave`, { method: 'DELETE' });
    if (selected?.code === code) setSelected(null);
    loadMine();
  };

  const medal = (i) => (i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`);

  return (
    <div className="page active rel">
      {/* Create + Join */}
      <div className="two-col">
        <div className="card">
          <div className="card-title">➕ Create a Group</div>
          <p style={{ color: 'var(--text2)', fontSize: '13px', margin: '8px 0 12px' }}>
            College, company ya friends ka private league banao.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="e.g. IIT Delhi Coders"
              style={{ flex: 1, minWidth: '160px', padding: '12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
            <button className="auth-btn" style={{ width: 'auto', padding: '10px 20px' }} onClick={createGroup} disabled={busy}>Create</button>
          </div>
        </div>

        <div className="card">
          <div className="card-title">🔑 Join a Group</div>
          <p style={{ color: 'var(--text2)', fontSize: '13px', margin: '8px 0 12px' }}>
            Kisi ne code diya? Yahan daal ke join karo.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="GROUP CODE"
              style={{ flex: 1, minWidth: '160px', padding: '12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '2px' }} />
            <button className="auth-btn" style={{ width: 'auto', padding: '10px 20px' }} onClick={joinGroup} disabled={busy}>Join</button>
          </div>
        </div>
      </div>

      {msg && <div className="card" style={{ marginTop: '16px', padding: '12px 16px', color: 'var(--primary)', fontSize: '14px' }}>{msg}</div>}

      {/* My groups */}
      <div className="card" style={{ marginTop: '16px' }}>
        <div className="card-title">🏆 My Groups</div>
        {myGroups.length === 0 ? (
          <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '10px' }}>Abhi koi group nahi. Upar se banao ya join karo.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
            {myGroups.map((g) => (
              <div key={g.code} className={`platform-card ${selected?.code === g.code ? 'connected' : ''}`}
                style={{ cursor: 'pointer', padding: '14px' }} onClick={() => openGroup(g.code)}>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{g.name}</div>
                <div style={{ color: 'var(--text2)', fontSize: '12px', marginTop: '4px' }}>
                  {g.members} member{g.members === 1 ? '' : 's'} · <span style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{g.code}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); leaveGroup(g.code); }}
                  style={{ marginTop: '8px', background: 'transparent', border: '1px solid #ff4d4f55', color: '#ff4d4f', fontSize: '11px', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}>Leave</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected group leaderboard */}
      {selected && (
        <div className="card" style={{ marginTop: '16px' }}>
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span>🏅 {selected.name}</span>
            <span style={{ fontSize: '12px', color: 'var(--text2)' }}>Share code: <b style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{selected.code}</b></span>
          </div>
          <div className="lb-container" style={{ marginTop: '12px' }}>
            {(selected.leaderboard || []).length === 0 ? (
              <div style={{ color: 'var(--text2)', textAlign: 'center', padding: '20px' }}>No members yet</div>
            ) : (
              selected.leaderboard.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', padding: '12px', borderRadius: '8px', marginBottom: '8px',
                  background: item.isMe ? 'rgba(0,229,160,0.08)' : 'var(--bg2)',
                  border: item.isMe ? '1px solid var(--primary)' : '1px solid var(--border)',
                }}>
                  <div style={{ width: '40px', fontWeight: 'bold', fontSize: '14px' }}>{medal(i)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.name} {item.isMe ? '(You)' : ''}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text2)' }}>{item.problems} problems</div>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--primary)' }}>{(item.score || 0).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
