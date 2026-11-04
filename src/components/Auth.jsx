import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/* ─── Platform SVGs ─────────────────────────────────────────────── */
const GitHubSVG = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LeetCodeSVG = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="#FFA116">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.246 2.17 5.86 2.13 8.068-.088l5.44-5.441a1.365 1.365 0 1 0-1.93-1.93l-5.44 5.441a3.02 3.02 0 0 1-4.27-.047l-4.24-4.156a3.21 3.21 0 0 1-.726-1.026 3.167 3.167 0 0 1-.18-.545 3.09 3.09 0 0 1-.035-1.326 3.05 3.05 0 0 1 .684-1.18l3.844-4.116 5.38-5.764a1.373 1.373 0 0 0-.97-2.352zm2.083 8.01a1.366 1.366 0 0 0-.965.4l-5.44 5.44a1.365 1.365 0 1 0 1.93 1.93l5.44-5.44a1.366 1.366 0 0 0-.965-2.33z"/>
  </svg>
);

const CodeforcesIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18">
    <rect x="2" y="10" width="5" height="11" rx="1.5" fill="#FFD43B"/>
    <rect x="9.5" y="4" width="5" height="17" rx="1.5" fill="#3B82F6"/>
    <rect x="17" y="7.5" width="5" height="13.5" rx="1.5" fill="#EF4444"/>
  </svg>
);

/* ─── Metric Pill for Left Panel ────────────────────────────────── */
const StatPill = ({ icon, label, value, color = '#D4A373' }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(212,163,115,0.15)',
    borderRadius: '10px', padding: '10px 14px',
    marginBottom: '8px'
  }}>
    <div style={{ flexShrink: 0 }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: '15px', fontWeight: '800', color, fontFamily: 'var(--mono)' }}>{value}</div>
    </div>
    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, opacity: 0.7, animation: 'liveRadar 2s infinite' }} />
  </div>
);

/* ─── Auth Component ─────────────────────────────────────────────── */
const Auth = ({ setUser, setViewLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const url = isLogin ? `${API_URL}/api/auth/login` : `${API_URL}/api/auth/register`;
      const body = isLogin ? { email, password } : { name, email, password };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong!');
      localStorage.setItem('token', data.token);
      setUser({ name: data.name, email: data.email, score: data.score, rank: data.rank, streak: data.streak });
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@vortex.dev');
    setPassword('demo123');
    setIsLogin(true);
  };

  const handleForgot = async () => {
    setForgotMsg(''); setError('');
    if (!email.trim()) { setError('Enter your email address first.'); return; }
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setForgotMsg(data.message || 'Password reset link sent. Check your email.');
      else if (res.status === 503) setForgotMsg('Email service is currently not configured.');
      else setForgotMsg(data.error || 'Failed to send reset link.');
    } catch { setForgotMsg('Network error — please try again.'); }
  };

  /* ─── Styles ── */
  const s = {
    screen: {
      minHeight: '100vh', display: 'flex', background: '#070606', position: 'relative', overflow: 'hidden'
    },
    leftPanel: {
      flex: '0 0 42%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '60px 52px',
      background: 'linear-gradient(160deg, #0E0B09 0%, #130F0D 60%, #0A0808 100%)',
      borderRight: '1px solid rgba(104,83,75,0.25)',
      position: 'relative', overflow: 'hidden',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateX(0)' : 'translateX(-30px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease'
    },
    rightPanel: {
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 52px',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s'
    },
    card: {
      width: '100%', maxWidth: '420px'
    },
    brandRow: {
      display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px'
    },
    logoBox: {
      width: '42px', height: '42px', borderRadius: '12px',
      background: 'linear-gradient(135deg, #68534B, #A8795A)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 16px rgba(104,83,75,0.45)'
    },
    logoText: {
      fontSize: '24px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.02em',
      fontFamily: 'var(--mono)'
    },
    tagline: {
      fontSize: '11px', color: 'rgba(212,163,115,0.7)', fontWeight: '600',
      letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px'
    },
    headline: {
      fontSize: '30px', fontWeight: '900', color: '#FFFFFF', lineHeight: 1.2,
      marginBottom: '16px'
    },
    subtext: {
      fontSize: '13.5px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7,
      marginBottom: '32px'
    },
    divider: {
      height: '1px', background: 'linear-gradient(90deg, transparent, rgba(104,83,75,0.4), transparent)',
      margin: '24px 0'
    },
    formTitle: {
      fontSize: '22px', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px'
    },
    formSub: {
      fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '28px'
    },
    label: {
      display: 'block', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em',
      textTransform: 'uppercase', color: '#C89B7B', fontFamily: 'var(--mono)',
      marginBottom: '7px'
    },
    inputWrap: { position: 'relative', marginBottom: '16px' },
    input: {
      width: '100%', padding: '13px 16px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(104,83,75,0.35)',
      borderRadius: '10px', color: '#FFFFFF',
      fontSize: '14px', outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box'
    },
    submitBtn: {
      width: '100%', padding: '14px',
      background: 'linear-gradient(135deg, #68534B 0%, #A8795A 100%)',
      border: 'none', borderRadius: '10px',
      color: '#FFFFFF', fontSize: '14px', fontWeight: '700',
      cursor: 'pointer', letterSpacing: '0.05em',
      transition: 'opacity 0.2s, transform 0.2s',
      marginTop: '4px', fontFamily: 'var(--mono)'
    },
    demoBtn: {
      width: '100%', padding: '12px',
      background: 'transparent',
      border: '1px solid rgba(104,83,75,0.4)',
      borderRadius: '10px', color: '#C89B7B',
      fontSize: '13px', fontWeight: '600',
      cursor: 'pointer', marginTop: '10px',
      transition: 'background 0.2s, border-color 0.2s',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
    },
    switchRow: {
      textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.35)'
    },
    switchBtn: {
      color: '#D4A373', fontWeight: '700', cursor: 'pointer', background: 'none',
      border: 'none', fontSize: '13px', padding: 0
    },
    errorMsg: {
      fontSize: '12.5px', color: '#F87171',
      background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
      borderRadius: '8px', padding: '10px 14px', marginBottom: '14px',
      display: 'flex', alignItems: 'center', gap: '8px'
    },
    successMsg: {
      fontSize: '12.5px', color: '#86EFAC',
      background: 'rgba(134,239,172,0.08)', border: '1px solid rgba(134,239,172,0.2)',
      borderRadius: '8px', padding: '10px 14px', marginTop: '10px',
      textAlign: 'center'
    }
  };

  return (
    <div style={s.screen}>
      {/* Ambient glow blobs */}
      <div style={{
        position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(104,83,75,0.12) 0%, transparent 70%)',
        top: '-200px', left: '-100px', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(117,153,191,0.06) 0%, transparent 70%)',
        bottom: '-100px', right: '5%', pointerEvents: 'none'
      }} />

      {/* ── LEFT PANEL ── */}
      <div style={s.leftPanel}>
        {/* Subtle grid texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(212,163,115,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,163,115,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px', pointerEvents: 'none'
        }} />

        {/* Brand */}
        <div style={s.brandRow}>
          <div style={s.logoBox}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span style={s.logoText}>VOR<span style={{ color: '#D4A373' }}>TEX</span></span>
        </div>

        <div style={s.tagline}>Developer Intelligence Platform</div>
        <div style={s.headline}>
          Your coding journey,<br />
          <span style={{ color: '#D4A373' }}>quantified.</span>
        </div>
        <div style={s.subtext}>
          Aggregate GitHub, LeetCode, Codeforces and HackerRank telemetry into a single professional profile. Used by engineers at top-tier product companies.
        </div>

        {/* Live stats */}
        <StatPill
          icon={<LeetCodeSVG />}
          label="LeetCode Problems Solved"
          value="248 Verified"
          color="#FFA116"
        />
        <StatPill
          icon={<GitHubSVG />}
          label="GitHub Contributions YTD"
          value="482 Commits"
          color="#D4A373"
        />
        <StatPill
          icon={<CodeforcesIcon />}
          label="Codeforces Peak Rating"
          value="1,630 · Specialist"
          color="#7599BF"
        />

        <div style={{ ...s.divider, marginTop: '28px' }} />

        {/* Trust badges */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { label: '12,000+', sub: 'Engineers' },
            { label: '#4', sub: 'Global Rank' },
            { label: '1,840', sub: 'VORTEX Score' },
          ].map(b => (
            <div key={b.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#D4A373', fontFamily: 'var(--mono)' }}>{b.label}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{b.sub}</div>
            </div>
          ))}
        </div>

        {/* Back to home */}
        {setViewLanding && (
          <button
            onClick={() => setViewLanding(true)}
            style={{
              marginTop: '32px', background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.3)', fontSize: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#D4A373'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Homepage
          </button>
        )}
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={s.rightPanel}>
        <div style={s.card}>

          {/* Tab switcher */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.04)',
            borderRadius: '10px', padding: '4px', marginBottom: '32px',
            border: '1px solid rgba(104,83,75,0.2)'
          }}>
            {['Sign In', 'Register'].map((tab, i) => {
              const active = i === 0 ? isLogin : !isLogin;
              return (
                <button
                  key={tab}
                  onClick={() => { setIsLogin(i === 0); setError(''); setForgotMsg(''); }}
                  style={{
                    flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
                    borderRadius: '7px', fontSize: '13px', fontWeight: '700',
                    transition: 'background 0.2s, color 0.2s',
                    background: active ? 'linear-gradient(135deg, #68534B, #A8795A)' : 'transparent',
                    color: active ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
                    fontFamily: 'var(--mono)', letterSpacing: '0.03em'
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div style={s.formTitle}>{isLogin ? 'Welcome back' : 'Create account'}</div>
          <div style={s.formSub}>{isLogin ? 'Sign in to your VORTEX dashboard' : 'Join the developer intelligence network'}</div>

          {/* Error */}
          {error && (
            <div style={s.errorMsg}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name field (register only) */}
            {!isLogin && (
              <div style={s.inputWrap}>
                <label style={s.label}>Full Name</label>
                <input
                  style={s.input}
                  type="text"
                  placeholder="Krishan Kumar"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  onFocus={e => { e.target.style.borderColor = '#A8795A'; e.target.style.boxShadow = '0 0 0 3px rgba(104,83,75,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(104,83,75,0.35)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            )}

            {/* Email */}
            <div style={s.inputWrap}>
              <label style={s.label}>Email Address</label>
              <input
                style={s.input}
                type="email"
                placeholder="name@vortex.dev"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                onFocus={e => { e.target.style.borderColor = '#A8795A'; e.target.style.boxShadow = '0 0 0 3px rgba(104,83,75,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(104,83,75,0.35)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Password */}
            <div style={s.inputWrap}>
              <label style={s.label}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{ ...s.input, paddingRight: '44px' }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  onFocus={e => { e.target.style.borderColor = '#A8795A'; e.target.style.boxShadow = '0 0 0 3px rgba(104,83,75,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(104,83,75,0.35)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                    color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center'
                  }}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            {isLogin && (
              <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '16px' }}>
                <button type="button" onClick={handleForgot} style={{
                  background: 'none', border: 'none', color: 'rgba(212,163,115,0.65)',
                  fontSize: '12px', cursor: 'pointer', fontWeight: '600'
                }}>
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              style={{ ...s.submitBtn, opacity: isLoading ? 0.7 : 1 }}
              disabled={isLoading}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px', height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid #FFFFFF',
                    borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                  }} />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </span>
              ) : (
                isLogin ? 'Sign In to VORTEX →' : 'Create Account →'
              )}
            </button>

            {/* 1-Click Demo Login */}
            {isLogin && (
              <button
                type="button"
                onClick={handleDemoLogin}
                style={s.demoBtn}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(104,83,75,0.12)'; e.currentTarget.style.borderColor = 'rgba(212,163,115,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(104,83,75,0.4)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                1-Click Demo Login
              </button>
            )}
          </form>

          {/* Forgot msg */}
          {forgotMsg && <div style={s.successMsg}>{forgotMsg}</div>}

          {/* Divider */}
          <div style={s.divider} />

          {/* Switch mode */}
          <div style={s.switchRow}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button style={s.switchBtn} onClick={() => { setIsLogin(!isLogin); setError(''); setForgotMsg(''); }}>
              {isLogin ? 'Register here' : 'Sign In'}
            </button>
          </div>

          {/* Footer seal */}
          <div style={{
            marginTop: '32px', textAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>
              VORTEX · ENTERPRISE GRADE SECURITY · TLS 1.3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
