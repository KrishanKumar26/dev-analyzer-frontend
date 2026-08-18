import React, { useState } from 'react';
import { fetchLeetCode } from '../utils/leetcode';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const fetchDev = async (username, token) => {
  const out = { github: null, leetcode: null, codeforces: null, hackerrank: null, error: null };
  try {
    const res = await fetch(`${API_URL}/api/user/github/${username.trim()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && !data.error) out.github = data;
    else out.error = 'GitHub user not found';
  } catch (e) { out.error = 'Error fetching'; }
  try {
    const lc = await fetchLeetCode(API_URL, username.trim(), token);
    if (lc) out.leetcode = lc;
  } catch (e) { /* ignore */ }
  try {
    const res = await fetch(`${API_URL}/api/user/codeforces/${username.trim()}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (res.ok && !data.error) out.codeforces = data;
  } catch (e) { /* ignore */ }
  try {
    const res = await fetch(`${API_URL}/api/user/hackerrank/${username.trim()}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (res.ok && !data.error) out.hackerrank = data;
  } catch (e) { /* ignore */ }
  return out;
};

const Stat = ({ label, a, b }) => {
  const av = Number(a) || 0, bv = Number(b) || 0;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ textAlign: 'right', fontWeight: 'bold', color: av >= bv ? 'var(--primary)' : 'var(--text2)', fontSize: '16px' }}>{av.toLocaleString()}</div>
      <div style={{ padding: '0 16px', fontSize: '11px', color: 'var(--text3)', textAlign: 'center', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ textAlign: 'left', fontWeight: 'bold', color: bv >= av ? 'var(--primary)' : 'var(--text2)', fontSize: '16px' }}>{bv.toLocaleString()}</div>
    </div>
  );
};

const Compare = () => {
  const [ua, setUa] = useState('');
  const [ub, setUb] = useState('');
  const [da, setDa] = useState(null);
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const go = async () => {
    if (!ua.trim() || !ub.trim()) return;
    setLoading(true); setDa(null); setDb(null);
    const [ra, rb] = await Promise.all([fetchDev(ua, token), fetchDev(ub, token)]);
    setDa(ra); setDb(rb); setLoading(false);
  };

  return (
    <div className="page active rel">
      <div className="card">
        <div className="card-title">⚔️ 1v1 Developer Compare</div>
        <p style={{ color: 'var(--text2)', fontSize: '13px', margin: '8px 0 15px' }}>
          Do developers ke username daalo — GitHub, LeetCode, Codeforces, HackerRank sab side-by-side (real data). Same handle assume hota hai.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={ua} onChange={(e) => setUa(e.target.value)} placeholder="GitHub username A"
            style={{ flex: 1, minWidth: '140px', padding: '12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
          <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>VS</span>
          <input value={ub} onChange={(e) => setUb(e.target.value)} placeholder="GitHub username B"
            style={{ flex: 1, minWidth: '140px', padding: '12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
          <button className="auth-btn" style={{ width: 'auto', padding: '10px 24px' }} onClick={go} disabled={loading}>{loading ? '...' : 'Compare'}</button>
        </div>
      </div>

      {da && db && (
        <div className="card" style={{ marginTop: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{da.github?.login || ua}</div>
              {da.error && <div style={{ color: '#ff4d4f', fontSize: '11px' }}>{da.error}</div>}
            </div>
            <div style={{ padding: '0 16px', fontSize: '13px', color: 'var(--primary)' }}>⚔️</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{db.github?.login || ub}</div>
              {db.error && <div style={{ color: '#ff4d4f', fontSize: '11px' }}>{db.error}</div>}
            </div>
          </div>
          <Stat label="GitHub Repos" a={da.github?.public_repos} b={db.github?.public_repos} />
          <Stat label="Followers" a={da.github?.followers} b={db.github?.followers} />
          <Stat label="LeetCode Solved" a={da.leetcode?.totalSolved} b={db.leetcode?.totalSolved} />
          <Stat label="LC Hard" a={da.leetcode?.hardSolved} b={db.leetcode?.hardSolved} />
          <Stat label="Codeforces Rating" a={da.codeforces?.rating} b={db.codeforces?.rating} />
          <Stat label="CF Problems" a={da.codeforces?.solved} b={db.codeforces?.solved} />
          <Stat label="HackerRank Stars" a={da.hackerrank?.totalStars} b={db.hackerrank?.totalStars} />
          <Stat label="HR Solved" a={da.hackerrank?.totalSolved} b={db.hackerrank?.totalSolved} />
        </div>
      )}
    </div>
  );
};

export default Compare;
