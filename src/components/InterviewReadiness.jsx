import React, { useState, useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/* ─── Benchmark Fallback (used when API returns 0 / user not connected) ── */
const BENCHMARK = {
  leetcodeSolved: 248,
  hardSolved: 36,
  cfRating: 1630,
  streak: 14,
  githubRepos: 16,
  githubStars: 1200,
  contributions: 482,
  score: 1840,
  rank: 4,
};

/* ─── Score Engine ─────────────────────────────────────────────── */
const computeReadiness = (data) => {
  const categories = [
    {
      id: 'algo',
      label: 'Algorithmic Depth',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"/>
        </svg>
      ),
      color: '#FFA116',
      bgColor: 'rgba(255, 161, 22, 0.1)',
      borderColor: 'rgba(255, 161, 22, 0.25)',
      items: [
        { label: 'LeetCode Solved', value: data.leetcodeSolved, max: 300, weight: 30, benchmark: 248 },
        { label: 'Hard Problems', value: data.hardSolved, max: 60, weight: 20, benchmark: 36 },
      ],
    },
    {
      id: 'contest',
      label: 'Contest Performance',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      color: '#7599BF',
      bgColor: 'rgba(117, 153, 191, 0.1)',
      borderColor: 'rgba(117, 153, 191, 0.25)',
      items: [
        { label: 'Codeforces Rating', value: data.cfRating, max: 2000, weight: 25, benchmark: 1630 },
        { label: 'VORTEX Global Rank', value: Math.max(0, 100 - data.rank), max: 100, weight: 10, benchmark: 96 },
      ],
    },
    {
      id: 'oss',
      label: 'Open Source Output',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      ),
      color: '#D4A373',
      bgColor: 'rgba(212, 163, 115, 0.1)',
      borderColor: 'rgba(212, 163, 115, 0.25)',
      items: [
        { label: 'GitHub Repos', value: data.githubRepos, max: 30, weight: 8, benchmark: 16 },
        { label: 'Contributions YTD', value: data.contributions, max: 600, weight: 7, benchmark: 482 },
      ],
    },
    {
      id: 'consistency',
      label: 'Consistency Signal',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
        </svg>
      ),
      color: '#E6B86A',
      bgColor: 'rgba(230, 184, 106, 0.1)',
      borderColor: 'rgba(230, 184, 106, 0.25)',
      items: [
        { label: 'Active Streak (Days)', value: data.streak, max: 30, weight: 15, benchmark: 14 },
      ],
    },
  ];

  let totalScore = 0;
  let totalWeight = 0;

  const scored = categories.map(cat => {
    const catItems = cat.items.map(item => {
      const pct = Math.min(item.value / item.max, 1);
      const pts = Math.round(pct * item.weight);
      totalScore += pts;
      totalWeight += item.weight;
      return { ...item, pct: Math.round(pct * 100), pts };
    });
    const catMax = cat.items.reduce((s, i) => s + i.weight, 0);
    const catActual = catItems.reduce((s, i) => s + i.pts, 0);
    return { ...cat, items: catItems, catPct: Math.round((catActual / catMax) * 100) };
  });

  const finalScore = Math.min(Math.round((totalScore / totalWeight) * 100), 100);
  return { categories: scored, finalScore };
};

/* ─── Readiness Verdict ────────────────────────────────────────── */
const getVerdict = (score) => {
  if (score >= 85) return {
    label: 'FAANG Ready',
    sub: 'Top-tier product companies — Google, Meta, Amazon',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.3)',
    ring: '#10B981',
    tips: []
  };
  if (score >= 70) return {
    label: 'Mid-Tier Ready',
    sub: 'Strong for Tier-2 SaaS, unicorn startups',
    color: '#D4A373',
    glow: 'rgba(212,163,115,0.3)',
    ring: '#D4A373',
    tips: ['Solve 50 more LeetCode problems', 'Reach CF rating 1700+']
  };
  if (score >= 50) return {
    label: 'Interview Practice',
    sub: 'Keep building — 3-4 more months needed',
    color: '#E6B86A',
    glow: 'rgba(230,184,106,0.3)',
    ring: '#E6B86A',
    tips: ['Focus on Data Structures & Algorithms', 'Increase daily streak', 'Solve 10 hard problems']
  };
  return {
    label: 'Not Ready Yet',
    sub: 'Need 6+ months of consistent practice',
    color: '#F87171',
    glow: 'rgba(248,113,113,0.25)',
    ring: '#F87171',
    tips: ['Start with 50 easy LeetCode', 'Build 3 GitHub projects', 'Maintain 7-day streak']
  };
};

/* ─── Animated Circular Score Ring ────────────────────────────── */
const ScoreRing = ({ score, color, glow }) => {
  const [displayed, setDisplayed] = useState(0);
  const [ringFill, setRingFill] = useState(0);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const delay = setTimeout(() => {
      let current = 0;
      const step = score / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= score) {
          current = score;
          clearInterval(timer);
        }
        setDisplayed(Math.round(current));
        setRingFill(Math.round(current));
      }, 16);
      return () => clearInterval(timer);
    }, 400);
    return () => clearTimeout(delay);
  }, [score]);

  const strokeDash = (ringFill / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: '220px', height: '220px', flexShrink: 0 }}>
      <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx="110" cy="110" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14"/>
        {/* Filled arc */}
        <circle
          cx="110" cy="110" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.05s linear', filter: `drop-shadow(0 0 10px ${glow})` }}
        />
        {/* Subtle secondary track */}
        <circle cx="110" cy="110" r={radius - 20} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
      </svg>

      {/* Center content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ fontSize: '54px', fontWeight: '900', color, fontFamily: 'var(--mono)', lineHeight: 1, letterSpacing: '-0.03em' }}>
          {displayed}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '600', marginTop: '4px', letterSpacing: '0.08em' }}>
          OUT OF 100
        </div>
      </div>
    </div>
  );
};

/* ─── Category Bar ─────────────────────────────────────────────── */
const CategoryBar = ({ cat, mounted }) => (
  <div style={{
    background: cat.bgColor,
    border: `1px solid ${cat.borderColor}`,
    borderRadius: '14px',
    padding: '18px 20px',
    marginBottom: '12px',
    animation: 'slideUpFade 0.4s ease both'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: cat.color }}>
        {cat.icon}
        <span style={{ fontWeight: '700', fontSize: '14px', color: cat.color }}>{cat.label}</span>
      </div>
      <div style={{
        background: `${cat.color}22`,
        border: `1px solid ${cat.color}44`,
        borderRadius: '8px',
        padding: '3px 12px',
        fontSize: '13px',
        fontWeight: '800',
        color: cat.color,
        fontFamily: 'var(--mono)'
      }}>
        {cat.catPct}%
      </div>
    </div>

    {cat.items.map((item, i) => (
      <div key={i} style={{ marginBottom: i < cat.items.length - 1 ? '12px' : 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.55)', fontWeight: '600' }}>{item.label}</span>
          <span style={{ fontSize: '12.5px', color: '#FFFFFF', fontWeight: '800', fontFamily: 'var(--mono)' }}>
            {item.value.toLocaleString()} <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: '400' }}>/ {item.max.toLocaleString()}</span>
          </span>
        </div>
        <div style={{ height: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: mounted ? `${item.pct}%` : '0%',
            background: `linear-gradient(90deg, ${cat.color}88, ${cat.color})`,
            borderRadius: '6px',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: `${0.3 + i * 0.1}s`
          }} />
        </div>
      </div>
    ))}
  </div>
);

/* ─── Main Component ───────────────────────────────────────────── */
const InterviewReadiness = ({ user }) => {
  const [mounted, setMounted] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [inputs, setInputs] = useState({ ...BENCHMARK });
  const [liveData, setLiveData] = useState(null);
  const [fetchState, setFetchState] = useState('loading'); // 'loading' | 'real' | 'fallback'
  const token = localStorage.getItem('token');

  /* Fetch real profile + platform data from API */
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const [profileRes, leetRes, cfRes, ghRes] = await Promise.allSettled([
          fetch(`${API_URL}/api/user/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/user/leetcode-stats`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/user/codeforces-stats`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/user/github-stats`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const profile = profileRes.status === 'fulfilled' && profileRes.value.ok
          ? await profileRes.value.json() : null;
        const leet = leetRes.status === 'fulfilled' && leetRes.value.ok
          ? await leetRes.value.json() : null;
        const cf = cfRes.status === 'fulfilled' && cfRes.value.ok
          ? await cfRes.value.json() : null;
        const gh = ghRes.status === 'fulfilled' && ghRes.value.ok
          ? await ghRes.value.json() : null;

        // Build real data object — fallback field by field
        const real = {
          leetcodeSolved: leet?.totalSolved || leet?.data?.matchedUser?.submitStats?.acSubmissionNum?.find(s => s.difficulty === 'All')?.count || profile?.problems || 0,
          hardSolved:     leet?.hardSolved || leet?.data?.matchedUser?.submitStats?.acSubmissionNum?.find(s => s.difficulty === 'Hard')?.count || 0,
          cfRating:       cf?.rating || cf?.data?.result?.[0]?.rating || 0,
          streak:         profile?.streak || user?.streak || 0,
          githubRepos:    gh?.public_repos || 0,
          githubStars:    gh?.followers || 0,
          contributions:  gh?.contributions || 0,
          score:          profile?.score || user?.score || 0,
          rank:           profile?.rank || user?.rank || 99,
        };

        // If score > 0, it's real data; otherwise fall back to benchmark
        const hasRealData = real.score > 0 || real.leetcodeSolved > 0 || real.cfRating > 0;
        if (hasRealData) {
          setLiveData(real);
          setInputs(real);
          setFetchState('real');
        } else {
          setLiveData(BENCHMARK);
          setInputs(BENCHMARK);
          setFetchState('fallback');
        }
      } catch (err) {
        console.error('Readiness fetch error:', err);
        setLiveData(BENCHMARK);
        setInputs(BENCHMARK);
        setFetchState('fallback');
      }
    };

    fetchRealData();
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, [token]);

  const data = customMode ? inputs : (liveData || BENCHMARK);
  const { categories, finalScore } = computeReadiness(data);
  const verdict = getVerdict(finalScore);

  const companyTargets = [
    { name: 'Google / Meta', min: 88, color: '#10B981' },
    { name: 'Amazon / Apple', min: 78, color: '#D4A373' },
    { name: 'Unicorn Startups', min: 65, color: '#7599BF' },
    { name: 'Tier-2 SaaS', min: 50, color: '#A58AC4' },
    { name: 'Any Tech Company', min: 30, color: 'rgba(255,255,255,0.3)' },
  ];

  return (
    <div className="page active rel" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 60px' }}>

      {/* Hero */}
      <div className="overview-hero" style={{ marginBottom: '28px' }}>
        <div className="overview-hero-text">
          <div className="pill-badge mocha" style={{ marginBottom: '12px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: verdict.color, animation: 'liveRadar 2s infinite', display: 'inline-block' }} />
            <span>REAL-TIME INTERVIEW INTELLIGENCE</span>
          </div>
          <h1 className="overview-hero-title">
            Interview Readiness <span style={{ color: '#D4A373' }}>Score Engine</span>
          </h1>
          <p className="overview-hero-subtitle">
            Algorithmic composite scoring across LeetCode depth, contest performance, open source output, and consistency signals.
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          {/* Data source badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '20px',
            background: fetchState === 'real'
              ? 'rgba(16,185,129,0.1)'
              : fetchState === 'loading'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(212,163,115,0.1)',
            border: `1px solid ${fetchState === 'real' ? 'rgba(16,185,129,0.3)' : fetchState === 'loading' ? 'rgba(255,255,255,0.1)' : 'rgba(212,163,115,0.3)'}`,
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: fetchState === 'real' ? '#10B981' : fetchState === 'loading' ? 'rgba(255,255,255,0.3)' : '#D4A373',
              animation: fetchState === 'loading' ? 'none' : 'liveRadar 2s infinite'
            }} />
            <span style={{
              fontSize: '11px', fontWeight: '700',
              color: fetchState === 'real' ? '#10B981' : fetchState === 'loading' ? 'rgba(255,255,255,0.3)' : '#D4A373',
              fontFamily: 'var(--mono)', letterSpacing: '0.06em'
            }}>
              {fetchState === 'loading' ? 'Fetching...' : fetchState === 'real' ? 'LIVE API DATA' : 'BENCHMARK DEMO'}
            </span>
          </div>

          <button
            onClick={() => setCustomMode(!customMode)}
            style={{
              padding: '10px 20px',
              background: customMode ? 'rgba(212,163,115,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${customMode ? 'rgba(212,163,115,0.5)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '10px',
              color: customMode ? '#D4A373' : 'rgba(255,255,255,0.5)',
              fontSize: '12.5px', fontWeight: '700',
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            {customMode ? 'Custom Mode ON' : 'Try Custom Mode'}
          </button>
          {!customMode && fetchState === 'fallback' && (
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', textAlign: 'right' }}>
              Connect handles in Profile to see real data
            </span>
          )}
        </div>
      </div>

      {/* Custom Input Panel */}
      {customMode && (
        <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
          <div style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: '#D4A373', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            ✦ Enter Your Stats
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {[
              { key: 'leetcodeSolved', label: 'LC Solved', placeholder: '0–500' },
              { key: 'hardSolved', label: 'Hard Problems', placeholder: '0–100' },
              { key: 'cfRating', label: 'CF Rating', placeholder: '0–2000' },
              { key: 'streak', label: 'Streak (Days)', placeholder: '0–30' },
              { key: 'githubRepos', label: 'GitHub Repos', placeholder: '0–50' },
              { key: 'contributions', label: 'Contributions', placeholder: '0–600' },
              { key: 'rank', label: 'VORTEX Rank', placeholder: '1–100' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '10px', color: '#C89B7B', fontFamily: 'var(--mono)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {f.label}
                </label>
                <input
                  type="number"
                  value={inputs[f.key]}
                  placeholder={f.placeholder}
                  onChange={e => setInputs(p => ({ ...p, [f.key]: Number(e.target.value) || 0 }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(104,83,75,0.35)',
                    borderRadius: '8px', color: '#FFFFFF',
                    fontSize: '14px', outline: 'none',
                    fontFamily: 'var(--mono)', boxSizing: 'border-box'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* LEFT — Score Ring + Verdict */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Score Card */}
          <div style={{
            background: 'linear-gradient(180deg, #1C1613 0%, #120F0D 100%)',
            border: `1px solid ${verdict.color}44`,
            borderRadius: '20px',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: `0 0 40px ${verdict.glow}, inset 0 1px 0 rgba(255,255,255,0.07)`,
            animation: 'slideUpFade 0.5s ease both'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <ScoreRing score={finalScore} color={verdict.color} glow={verdict.glow} />
            </div>

            <div style={{
              display: 'inline-block',
              background: `${verdict.color}18`,
              border: `1px solid ${verdict.color}44`,
              borderRadius: '10px',
              padding: '8px 20px',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '16px', fontWeight: '900', color: verdict.color, letterSpacing: '0.04em' }}>
                {verdict.label}
              </span>
            </div>

            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
              {verdict.sub}
            </div>
          </div>

          {/* Company Target Bands */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: '#D4A373', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
              Target Company Bands
            </div>
            {companyTargets.map((c, i) => {
              const achieved = finalScore >= c.min;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', marginBottom: '6px',
                  background: achieved ? `${c.color}10` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${achieved ? c.color + '35' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: achieved ? c.color : 'rgba(255,255,255,0.15)',
                      boxShadow: achieved ? `0 0 8px ${c.color}` : 'none',
                      flexShrink: 0
                    }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: achieved ? '#FFFFFF' : 'rgba(255,255,255,0.35)' }}>
                      {c.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--mono)' }}>{c.min}+</span>
                    {achieved ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Tips */}
          {verdict.tips.length > 0 && (
            <div style={{
              background: 'rgba(212,163,115,0.07)',
              border: '1px solid rgba(212,163,115,0.2)',
              borderRadius: '14px',
              padding: '18px 20px'
            }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: '#D4A373', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                ✦ Next Actions to Improve
              </div>
              {verdict.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: i < verdict.tips.length - 1 ? '10px' : 0 }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4A373', marginTop: '5px', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Category Breakdown */}
        <div>
          <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Score Breakdown — 4 Signal Categories
          </div>

          {categories.map((cat, i) => (
            <CategoryBar key={cat.id} cat={cat} mounted={mounted} />
          ))}

          {/* Overall composite bar */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(104,83,75,0.3) 0%, rgba(212,163,115,0.1) 100%)',
            border: '1px solid rgba(212,163,115,0.35)',
            borderRadius: '14px',
            padding: '20px 22px',
            marginTop: '4px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Composite Interview Score</div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: verdict.color, fontFamily: 'var(--mono)' }}>
                {finalScore}<span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', fontWeight: '400' }}>/100</span>
              </div>
            </div>
            <div style={{ height: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: mounted ? `${finalScore}%` : '0%',
                background: `linear-gradient(90deg, ${verdict.color}88, ${verdict.color}, ${verdict.color}CC)`,
                borderRadius: '10px',
                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: '0.5s',
                boxShadow: `0 0 16px ${verdict.glow}`
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--mono)' }}>0 — Not Ready</span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--mono)' }}>100 — FAANG Ready</span>
            </div>
          </div>

          {/* Share / Export row */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              onClick={() => {
                const text = `My VORTEX Interview Readiness Score: ${finalScore}/100 — ${verdict.label}\nPowered by vortex.dev`;
                navigator.clipboard?.writeText(text);
              }}
              className="btn-chaicode-secondary"
              style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              Share Score
            </button>
            <button
              onClick={() => setInputs(liveData || BENCHMARK)}
              className="btn-chaicode-secondary"
              style={{ padding: '12px 20px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewReadiness;

