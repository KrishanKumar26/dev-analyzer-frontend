import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ResetPassword = () => {
  const token = new URLSearchParams(window.location.search).get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (password.length < 6) { setMsg('Password kam se kam 6 characters ka ho.'); return; }
    if (password !== confirm) { setMsg('Passwords match nahi kar rahe.'); return; }
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) { setDone(true); setMsg(data.message || 'Password reset!'); }
      else setMsg('❌ ' + (data.error || 'Reset failed'));
    } catch (err) { setMsg('❌ Network error'); }
    finally { setBusy(false); }
  };

  return (
    <div className="auth-screen">
      <div className="auth-glass-card">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Naya password set karo</p>
        </div>
        {!token ? (
          <p style={{ color: '#ff4d4f', fontSize: '14px' }}>Invalid link — koi token nahi mila.</p>
        ) : done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
            <p style={{ color: 'var(--primary)' }}>{msg}</p>
            <a href="/" style={{ color: 'var(--primary)', display: 'inline-block', marginTop: '16px' }}>← Login karo</a>
          </div>
        ) : (
          <form onSubmit={submit} className="auth-form">
            <div className="input-group">
              <label>NEW PASSWORD</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className="input-group">
              <label>CONFIRM PASSWORD</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required />
            </div>
            {msg && <p style={{ color: 'red', fontSize: '12px' }}>{msg}</p>}
            <button type="submit" className="auth-btn" disabled={busy}>{busy ? 'Saving...' : 'RESET PASSWORD ➔'}</button>
          </form>
        )}
      </div>
      <div className="auth-bg-glow"></div>
    </div>
  );
};

export default ResetPassword;
