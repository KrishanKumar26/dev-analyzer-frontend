import React, { useState } from 'react';

// Official Platform & System Logos (Crisp Vector SVGs)
const GitHubLogo = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LeetCodeLogo = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#FFA116">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.246 2.17 5.86 2.13 8.068-.088l5.44-5.441a1.365 1.365 0 1 0-1.93-1.93l-5.44 5.441a3.02 3.02 0 0 1-4.27-.047l-4.24-4.156a3.21 3.21 0 0 1-.726-1.026 3.167 3.167 0 0 1-.18-.545 3.09 3.09 0 0 1-.035-1.326 3.05 3.05 0 0 1 .684-1.18l3.844-4.116 5.38-5.764a1.373 1.373 0 0 0-.97-2.352zm2.083 8.01a1.366 1.366 0 0 0-.965.4l-5.44 5.44a1.365 1.365 0 1 0 1.93 1.93l5.44-5.44a1.366 1.366 0 0 0-.965-2.33z"/>
  </svg>
);

const CodeforcesLogo = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect x="2" y="10" width="5" height="11" rx="1.5" fill="#FFD43B"/>
    <rect x="9.5" y="4" width="5" height="17" rx="1.5" fill="#3B82F6"/>
    <rect x="17" y="7.5" width="5" height="13.5" rx="1.5" fill="#EF4444"/>
  </svg>
);

const HackerRankLogo = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#00EA64">
    <path d="M12 0L1.6 6v12L12 24l10.4-6V6L12 0zm3.8 14.8h-2.1v-2.3h-3.4v2.3H8.2V9.2h2.1v2.3h3.4V9.2h2.1v5.6z"/>
  </svg>
);

// High-Tech Feature SVGs
const ChartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C89B7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7599BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const TrophyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E6B86A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34"/>
    <path d="M6 4h12v6a6 6 0 0 1-12 0V4Z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8EDBB1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ShieldLockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A58AC4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <circle cx="12" cy="11" r="2"/>
    <path d="M12 13v3"/>
  </svg>
);

const DatabaseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C47C85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);

const LandingPage = ({ onGetStarted, onSignIn, onDirectApp }) => {
  return (
    <div className="landing-page" style={{ background: '#070606', color: '#FFFFFF', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="landing-nav" style={{ 
        background: 'rgba(10, 8, 7, 0.85)', 
        backdropFilter: 'blur(16px)', 
        borderBottom: '1px solid rgba(168, 140, 130, 0.18)' 
      }}>
        <div className="landing-nav-content">
          <div className="landing-logo">
            <div className="logo-icon-wrapper" style={{ borderColor: 'rgba(200, 155, 123, 0.4)' }}>
              <div className="pulse" style={{ background: '#C89B7B' }}></div>
              <div className="orbit-ring" style={{ borderColor: 'rgba(200, 155, 123, 0.25)' }}></div>
            </div>
            <span className="logo-text" style={{ letterSpacing: '0.08em' }}>
              VOR<span className="logo-accent" style={{ color: '#D4A373' }}>TEX</span>
            </span>
          </div>
          
          <div className="landing-nav-links">
            <a href="#features" style={{ color: 'var(--text2)', transition: 'color 0.2s' }}>Features</a>
            <a href="#preview" style={{ color: 'var(--text2)', transition: 'color 0.2s' }}>Telemetry Preview</a>
            <a href="#search" style={{ color: 'var(--text2)', transition: 'color 0.2s' }}>Talent Index</a>
            <a href="#leaderboard" style={{ color: 'var(--text2)', transition: 'color 0.2s' }}>Leaderboard</a>
          </div>
          
          <div className="landing-nav-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {onDirectApp && (
              <button 
                onClick={onDirectApp}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(168, 140, 130, 0.25)',
                  color: 'var(--text2)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Go to App →
              </button>
            )}
            <button className="landing-btn-secondary" onClick={onSignIn} style={{ borderColor: 'rgba(168, 140, 130, 0.3)' }}>
              Sign In
            </button>
            <button className="btn-chaicode-primary" onClick={onGetStarted} style={{ padding: '8px 20px', fontSize: '13px' }}>
              <span>Get Started ↗</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Atmospheric Hero Section */}
      <section className="landing-hero" style={{ 
        padding: '160px 2rem 100px', 
        position: 'relative', 
        textAlign: 'center', 
        background: 'radial-gradient(circle at 50% 20%, rgba(104, 83, 75, 0.18) 0%, transparent 65%)' 
      }}>
        <div className="landing-hero-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="pill-badge mocha" style={{ margin: '0 auto 20px', display: 'inline-flex', padding: '6px 14px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C89B7B', animation: 'liveRadar 2s infinite' }}></span>
            <span>ENTERPRISE DEVELOPER TELEMETRY ENGINE</span>
          </div>
          
          <h1 className="landing-hero-title" style={{ 
            fontSize: '56px', 
            fontWeight: '800', 
            letterSpacing: '-0.03em', 
            lineHeight: '1.1', 
            margin: '0 0 24px', 
            fontFamily: 'var(--sans)' 
          }}>
            Your Code. Your Velocity.<br />
            <span style={{ 
              background: 'linear-gradient(135deg, #FFFFFF 30%, #D4A373 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              Your Verified Dev Rank.
            </span>
          </h1>
          
          <p className="landing-hero-subtitle" style={{ 
            fontSize: '17px', 
            color: 'var(--text2)', 
            maxWidth: '680px', 
            margin: '0 auto 36px', 
            lineHeight: '1.6' 
          }}>
            Aggregate real commits, algorithmic problem solving, contest ratings, and velocity benchmarks across GitHub, LeetCode, Codeforces, and HackerRank in a single obsidian dashboard.
          </p>
          
          <div className="landing-hero-cta" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-chaicode-primary" onClick={onGetStarted} style={{ padding: '14px 34px', fontSize: '15px' }}>
              <span>Launch Developer Dashboard ↗</span>
            </button>
            <button 
              className="btn-chaicode-secondary" 
              onClick={() => document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '14px 28px', fontSize: '15px' }}
            >
              <span>Explore Telemetry Preview ↓</span>
            </button>
          </div>
          
          {/* Key Metrics Strip */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            marginTop: '56px',
            padding: '20px',
            background: 'linear-gradient(180deg, rgba(28, 22, 19, 0.7) 0%, rgba(19, 15, 13, 0.7) 100%)',
            border: '1px solid rgba(168, 140, 130, 0.22)',
            borderRadius: '14px',
            maxWidth: '680px',
            margin: '56px auto 0'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--mono)' }}>4+</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Bridges</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(168, 140, 130, 0.2)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#D4A373', fontFamily: 'var(--mono)' }}>Sub-Sec</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Aggregation</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(168, 140, 130, 0.2)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#8EDBB1', fontFamily: 'var(--mono)' }}>Verified</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interview Telemetry</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="preview" style={{ padding: '80px 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="pill-badge mocha" style={{ marginBottom: '10px' }}>LIVE TELEMETRY VIEW</span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', margin: '8px 0' }}>
            Production Developer Analytics
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '15px' }}>
            Real-time developer score, platform breakdown, and consistency tracking.
          </p>
        </div>
        
        {/* Mock Executive Dashboard Frame */}
        <div style={{
          background: 'linear-gradient(180deg, #181311 0%, #0F0C0B 100%)',
          border: '1px solid rgba(168, 140, 130, 0.28)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(104, 83, 75, 0.15)'
        }}>
          {/* Top KPI Metrics Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginBottom: '20px'
          }}>
            <div style={{ background: '#1C1613', border: '1px solid rgba(212, 163, 115, 0.3)', borderRadius: '12px', padding: '16px 20px' }}>
              <div style={{ fontSize: '11px', color: '#D4A373', fontFamily: 'var(--mono)', fontWeight: '700' }}>DEV SCORE</div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--mono)', margin: '4px 0' }}>1,840</div>
              <div style={{ fontSize: '11px', color: '#8EDBB1' }}>▲ Top 2% Developer Velocity</div>
            </div>

            <div style={{ background: '#1C1613', border: '1px solid rgba(168, 140, 130, 0.2)', borderRadius: '12px', padding: '16px 20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>GLOBAL RANK</div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: '#D4A373', fontFamily: 'var(--mono)', margin: '4px 0' }}>#4</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Among 1,420+ Verified Engineers</div>
            </div>

            <div style={{ background: '#1C1613', border: '1px solid rgba(168, 140, 130, 0.2)', borderRadius: '12px', padding: '16px 20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>PROBLEMS SOLVED</div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--mono)', margin: '4px 0' }}>248</div>
              <div style={{ fontSize: '11px', color: '#FFA116' }}>LeetCode Medium & Hard Focus</div>
            </div>

            <div style={{ background: '#1C1613', border: '1px solid rgba(168, 140, 130, 0.2)', borderRadius: '12px', padding: '16px 20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>ACTIVE STREAK</div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--mono)', margin: '4px 0' }}>14d</div>
              <div style={{ fontSize: '11px', color: '#8EDBB1' }}>✦ 100% Daily Commit Consistency</div>
            </div>
          </div>

          {/* Platform Performance Visualizer */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(168, 140, 130, 0.18)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
              Integrated Platform Telemetry
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: '600' }}>
                    <GitHubLogo size={15} /> GitHub Velocity & Contributions
                  </span>
                  <span style={{ color: '#D4A373', fontFamily: 'var(--mono)', fontWeight: '700' }}>92% Mastery</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #A8795A, #D4A373)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: '600' }}>
                    <LeetCodeLogo size={15} /> LeetCode Algorithms & DSA
                  </span>
                  <span style={{ color: '#FFA116', fontFamily: 'var(--mono)', fontWeight: '700' }}>85% Mastery</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #FFA116, #FFB84D)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: '600' }}>
                    <CodeforcesLogo size={15} /> Codeforces Competitive Rating
                  </span>
                  <span style={{ color: '#7599BF', fontFamily: 'var(--mono)', fontWeight: '700' }}>78% Mastery</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #4A6572, #7599BF)' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '80px 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="pill-badge mocha" style={{ marginBottom: '10px' }}>CORE ARCHITECTURE</span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', margin: '8px 0' }}>
            Engineered for Modern Developers
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '15px' }}>
            Production-grade developer telemetry backed by real platform APIs.
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '14px' }}><ChartIcon /></div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 8px' }}>Developer Velocity Score</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text2)', margin: 0, lineHeight: '1.5' }}>
              Multi-factor scoring algorithm weighing public commits, solved algorithm difficulty, contest rating, and streak longevity.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '14px' }}><LinkIcon /></div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 8px' }}>Ecosystem Connectors</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text2)', margin: 0, lineHeight: '1.5' }}>
              Direct live connectors for GitHub, LeetCode, Codeforces, HackerRank, and AtCoder with automatic caching.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '14px' }}><TrophyIcon /></div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 8px' }}>Global Leaderboards</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text2)', margin: 0, lineHeight: '1.5' }}>
              Filter developer standing worldwide by score, algorithm count, or platform focus with live ranking recalculation.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '14px' }}><SearchIcon /></div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 8px' }}>Talent Discovery Index</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text2)', margin: 0, lineHeight: '1.5' }}>
              Instant typeahead search across verified engineers with domain tags, rating badges, and 1-click profiles.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '14px' }}><ShieldLockIcon /></div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 8px' }}>Secure Identity & JWT</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text2)', margin: 0, lineHeight: '1.5' }}>
              Enterprise-grade authentication with signed JWT tokens, secure session storage, and rate-limited endpoints.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '14px' }}><DatabaseIcon /></div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 8px' }}>PostgreSQL High-Yield DB</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text2)', margin: 0, lineHeight: '1.5' }}>
              High-concurrency relational data store ensuring zero data loss and instant score aggregates across thousands of users.
            </p>
          </div>
        </div>
      </section>

      {/* Talent Search Preview Section */}
      <section id="search" style={{ padding: '80px 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(180deg, #1A1412 0%, #120E0D 100%)',
          border: '1px solid rgba(168, 140, 130, 0.25)',
          borderRadius: '16px',
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          alignItems: 'center'
        }}>
          <div>
            <span className="pill-badge mocha" style={{ marginBottom: '12px' }}>TALENT DISCOVERY</span>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF', margin: '8px 0 14px' }}>
              Discover & Compare Engineers Side-by-Side
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              Evaluate candidate velocity, compare head-to-head metrics with the 1v1 showdown engine, and share verified public badge widgets.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#D4A373' }}>✦</span> Search by GitHub, LeetCode, or Codeforces handles
              </div>
              <div style={{ fontSize: '13px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#D4A373' }}>✦</span> Compare 6 key metrics with relative differential bars
              </div>
              <div style={{ fontSize: '13px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#D4A373' }}>✦</span> Embed live SVG badge markdown in your GitHub README
              </div>
            </div>
            <button className="btn-chaicode-primary" onClick={onGetStarted}>
              <span>Explore Developer Directory ↗</span>
            </button>
          </div>

          {/* Engineer Showcase Card */}
          <div style={{
            background: 'linear-gradient(180deg, #221B17 0%, #171210 100%)',
            border: '1px solid rgba(212, 163, 115, 0.35)',
            borderRadius: '14px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #A8795A 0%, #D4A373 100%)',
                color: '#070606',
                fontWeight: '800',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                KK
              </div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: '800', color: '#FFFFFF' }}>Krishan Kumar</div>
                <div style={{ fontSize: '12px', color: '#D4A373', fontFamily: 'var(--mono)' }}>Senior Full-Stack Engineer · Rank #4</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--text3)' }}>DEV SCORE</div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--mono)' }}>1,840</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--text3)' }}>SOLVED</div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFA116', fontFamily: 'var(--mono)' }}>248</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--text3)' }}>STREAK</div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#8EDBB1', fontFamily: 'var(--mono)' }}>14d</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="pill-badge neutral" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <GitHubLogo size={13} /> KrishanKumar26
              </span>
              <span className="pill-badge neutral" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <LeetCodeLogo size={13} /> krishankumar
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section id="leaderboard" style={{ padding: '80px 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="pill-badge mocha" style={{ marginBottom: '10px' }}>GLOBAL BENCHMARK</span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', margin: '8px 0' }}>
            Worldwide Developer Standings
          </h2>
        </div>
        
        <div style={{
          background: 'linear-gradient(180deg, #1C1613 0%, #120E0D 100%)',
          border: '1px solid rgba(168, 140, 130, 0.22)',
          borderRadius: '14px',
          overflow: 'hidden'
        }}>
          {[
            { rank: 1, name: 'Alex Chen', score: 2847, handle: 'alexchen_dev', isTop: true },
            { rank: 2, name: 'Priya Sharma', score: 2654, handle: 'priyacodes', isTop: true },
            { rank: 3, name: 'Michael Rodriguez', score: 2431, handle: 'mrodriguez', isTop: true },
            { rank: 4, name: 'Krishan Kumar (You)', score: 1840, handle: 'KrishanKumar26', isMe: true },
            { rank: 5, name: 'Sarah Kim', score: 1720, handle: 'sarah_k', isTop: false }
          ].map((dev) => (
            <div 
              key={dev.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid rgba(168, 140, 130, 0.1)',
                background: dev.isMe ? 'rgba(200, 155, 123, 0.08)' : 'transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: dev.rank === 1 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                              dev.rank === 2 ? 'linear-gradient(135deg, #E0E0E0, #9E9E9E)' :
                              dev.rank === 3 ? 'linear-gradient(135deg, #CD7F32, #8B4513)' : 'rgba(255, 255, 255, 0.06)',
                  color: dev.rank <= 3 ? '#070606' : '#D4A373',
                  fontWeight: '800',
                  fontSize: '12px',
                  fontFamily: 'var(--mono)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  #{dev.rank}
                </span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: dev.isMe ? '#D4A373' : '#FFFFFF' }}>
                    {dev.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                    @{dev.handle}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--mono)' }}>
                {dev.score.toLocaleString()} <span style={{ fontSize: '11px', color: 'var(--text3)' }}>PTS</span>
              </div>
            </div>
          ))}
          
          <div style={{ padding: '16px', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
            <button className="btn-chaicode-primary" onClick={onGetStarted} style={{ padding: '8px 24px', fontSize: '12.5px' }}>
              <span>View Full 100+ Leaderboard ↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={{ 
        padding: '90px 2rem', 
        textAlign: 'center', 
        background: 'radial-gradient(circle at 50% 50%, rgba(104, 83, 75, 0.22) 0%, transparent 70%)' 
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.2', margin: '0 0 16px' }}>
            Elevate Your Developer Presence.
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 28px' }}>
            Ready to show recruiters and interviewers your real engineering velocity backed by live platform data?
          </p>
          <button className="btn-chaicode-primary" onClick={onGetStarted} style={{ padding: '15px 36px', fontSize: '15px' }}>
            <span>Create Your Verified Profile Now ↗</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid rgba(168, 140, 130, 0.18)', 
        padding: '40px 2rem', 
        background: '#050404' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--mono)', fontWeight: '800', fontSize: '16px', color: '#FFFFFF' }}>
              VOR<span style={{ color: '#D4A373' }}>TEX</span>
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text3)' }}>
              · Production Developer Analytics & Benchmark Platform
            </span>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text3)' }}>
            © 2026 VORTEX. Powered by ChaiCode obsidian theme.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
