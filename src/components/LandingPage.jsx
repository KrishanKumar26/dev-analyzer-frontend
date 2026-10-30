import React, { useState } from 'react';

const LandingPage = ({ onGetStarted, onSignIn }) => {
  const [email, setEmail] = useState('');

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-content">
          <div className="landing-logo">
            <div className="logo-icon-wrapper">
              <div className="pulse"></div>
              <div className="orbit-ring"></div>
            </div>
            <span className="logo-text">VOR<span className="logo-accent">TEX</span></span>
          </div>
          
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#search">Developer Search</a>
            <a href="#leaderboard">Leaderboard</a>
          </div>
          
          <div className="landing-nav-actions">
            <button className="landing-btn-secondary" onClick={onSignIn}>Sign In</button>
            <button className="landing-btn-primary" onClick={onGetStarted}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-bg-glow landing-hero-bg-glow-1"></div>
        <div className="landing-hero-bg-glow landing-hero-bg-glow-2"></div>
        
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <div className="live-dot"></div>
            <span>Real-Time Developer Analytics</span>
          </div>
          
          <h1 className="landing-hero-title">
            Your Code.<br />
            Your Progress.<br />
            <span className="gradient-text">Your Rank.</span>
          </h1>
          
          <p className="landing-hero-subtitle">
            Track your GitHub activity, explore LeetCode performance, discover developers<br />
            and compare coding progress in one place.
          </p>
          
          <div className="landing-hero-cta">
            <button className="landing-btn-hero" onClick={onGetStarted}>
              Get Started Free
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="landing-btn-secondary-large" onClick={() => document.getElementById('preview').scrollIntoView({ behavior: 'smooth' })}>
              View Dashboard Preview
            </button>
          </div>
          
          <div className="landing-stats-bar">
            <div className="landing-stat-item">
              <div className="landing-stat-value">5+</div>
              <div className="landing-stat-label">Platform Integrations</div>
            </div>
            <div className="landing-stat-divider"></div>
            <div className="landing-stat-item">
              <div className="landing-stat-value">Real-Time</div>
              <div className="landing-stat-label">Data Sync</div>
            </div>
            <div className="landing-stat-divider"></div>
            <div className="landing-stat-item">
              <div className="landing-stat-value">Secure</div>
              <div className="landing-stat-label">JWT Auth</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="preview" className="landing-preview">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Production-Ready Analytics Dashboard</h2>
            <p className="landing-section-subtitle">
              A comprehensive view of your coding journey with real-time data from GitHub and LeetCode
            </p>
          </div>
          
          <div className="landing-dashboard-preview">
            <div className="landing-preview-image">
              <div className="landing-preview-frame">
                {/* Mock Dashboard */}
                <div className="mock-dashboard">
                  <div className="mock-stats-grid">
                    <div className="mock-stat-card mock-stat-green">
                      <div className="mock-stat-label">DEV SCORE</div>
                      <div className="mock-stat-value">1,247</div>
                    </div>
                    <div className="mock-stat-card mock-stat-gold">
                      <div className="mock-stat-label">GLOBAL RANK</div>
                      <div className="mock-stat-value">#42</div>
                    </div>
                    <div className="mock-stat-card mock-stat-purple">
                      <div className="mock-stat-label">PROBLEMS</div>
                      <div className="mock-stat-value">328</div>
                    </div>
                    <div className="mock-stat-card mock-stat-red">
                      <div className="mock-stat-label">STREAK</div>
                      <div className="mock-stat-value">12d</div>
                    </div>
                  </div>
                  
                  <div className="mock-charts">
                    <div className="mock-chart">
                      <div className="mock-chart-title">GITHUB ACTIVITY</div>
                      <div className="mock-heatmap">
                        {[...Array(84)].map((_, i) => (
                          <div key={i} className="mock-heatmap-cell" style={{ 
                            opacity: Math.random() > 0.3 ? Math.random() : 0.05 
                          }}></div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mock-chart">
                      <div className="mock-chart-title">PERFORMANCE</div>
                      <div className="mock-bars">
                        <div className="mock-bar" style={{ width: '85%' }}><span>GitHub</span></div>
                        <div className="mock-bar" style={{ width: '72%' }}><span>LeetCode</span></div>
                        <div className="mock-bar" style={{ width: '65%' }}><span>Codeforces</span></div>
                        <div className="mock-bar" style={{ width: '48%' }}><span>HackerRank</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="landing-preview-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Everything You Need to Track Progress</h2>
            <p className="landing-section-subtitle">
              Powerful analytics backed by real platform data
            </p>
          </div>
          
          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <div className="landing-feature-icon">📊</div>
              <h3 className="landing-feature-title">Developer Analytics</h3>
              <p className="landing-feature-desc">
                Comprehensive performance metrics from your coding activity across multiple platforms with real-time synchronization.
              </p>
            </div>
            
            <div className="landing-feature-card">
              <div className="landing-feature-icon">🔗</div>
              <h3 className="landing-feature-title">Platform Integration</h3>
              <p className="landing-feature-desc">
                Direct integration with GitHub, LeetCode, Codeforces, HackerRank, and AtCoder for accurate data retrieval.
              </p>
            </div>
            
            <div className="landing-feature-card">
              <div className="landing-feature-icon">🏆</div>
              <h3 className="landing-feature-title">Global Leaderboard</h3>
              <p className="landing-feature-desc">
                Compare your progress with developers worldwide. Track rankings and see how you stack up against peers.
              </p>
            </div>
            
            <div className="landing-feature-card">
              <div className="landing-feature-icon">🔍</div>
              <h3 className="landing-feature-title">Developer Search</h3>
              <p className="landing-feature-desc">
                Discover and explore public developer profiles. View detailed statistics and coding activity of any developer.
              </p>
            </div>
            
            <div className="landing-feature-card">
              <div className="landing-feature-icon">🔐</div>
              <h3 className="landing-feature-title">Secure Authentication</h3>
              <p className="landing-feature-desc">
                Enterprise-grade security with JWT token-based authentication protecting your data and privacy.
              </p>
            </div>
            
            <div className="landing-feature-card">
              <div className="landing-feature-icon">💾</div>
              <h3 className="landing-feature-title">PostgreSQL Database</h3>
              <p className="landing-feature-desc">
                Reliable data persistence with PostgreSQL supporting concurrent multi-user access and data integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-how-it-works">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">How It Works</h2>
            <p className="landing-section-subtitle">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-number">01</div>
              <div className="landing-step-content">
                <h3>Connect Your Accounts</h3>
                <p>Link your GitHub, LeetCode, and other coding platform accounts to begin tracking your activity.</p>
              </div>
            </div>
            
            <div className="landing-step-arrow">→</div>
            
            <div className="landing-step">
              <div className="landing-step-number">02</div>
              <div className="landing-step-content">
                <h3>Sync Your Data</h3>
                <p>VORTEX automatically retrieves and analyzes your coding statistics from connected platforms.</p>
              </div>
            </div>
            
            <div className="landing-step-arrow">→</div>
            
            <div className="landing-step">
              <div className="landing-step-number">03</div>
              <div className="landing-step-content">
                <h3>Track & Compare</h3>
                <p>View comprehensive analytics, compare with others, and monitor your progress over time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Discovery */}
      <section id="search" className="landing-discovery">
        <div className="landing-container">
          <div className="landing-discovery-content">
            <div className="landing-discovery-text">
              <h2 className="landing-section-title">Discover Developers</h2>
              <p className="landing-section-subtitle">
                Search and explore public developer profiles. View detailed statistics, coding activity, and platform rankings of developers worldwide.
              </p>
              <ul className="landing-discovery-list">
                <li>✓ Search by username across platforms</li>
                <li>✓ View comprehensive coding statistics</li>
                <li>✓ Explore public activity feeds</li>
                <li>✓ Compare developer profiles side-by-side</li>
              </ul>
              <button className="landing-btn-primary" onClick={onGetStarted}>
                Explore Developers
              </button>
            </div>
            
            <div className="landing-discovery-visual">
              <div className="landing-discovery-card">
                <div className="landing-discovery-card-header">
                  <div className="landing-discovery-avatar">KK</div>
                  <div>
                    <div className="landing-discovery-name">Krishan Kumar</div>
                    <div className="landing-discovery-rank">Rank #42</div>
                  </div>
                </div>
                <div className="landing-discovery-stats">
                  <div className="landing-discovery-stat">
                    <span className="landing-discovery-stat-value">1,247</span>
                    <span className="landing-discovery-stat-label">Score</span>
                  </div>
                  <div className="landing-discovery-stat">
                    <span className="landing-discovery-stat-value">328</span>
                    <span className="landing-discovery-stat-label">Problems</span>
                  </div>
                  <div className="landing-discovery-stat">
                    <span className="landing-discovery-stat-value">12d</span>
                    <span className="landing-discovery-stat-label">Streak</span>
                  </div>
                </div>
                <div className="landing-discovery-platforms">
                  <span className="landing-platform-badge">🐙 GitHub</span>
                  <span className="landing-platform-badge">⚡ LeetCode</span>
                  <span className="landing-platform-badge">🏆 Codeforces</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section id="leaderboard" className="landing-leaderboard">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Global Leaderboard</h2>
            <p className="landing-section-subtitle">
              Compete with developers worldwide and track your ranking
            </p>
          </div>
          
          <div className="landing-leaderboard-preview">
            {[
              { rank: 1, name: 'Alex Chen', score: 2847, badge: '🥇' },
              { rank: 2, name: 'Priya Sharma', score: 2654, badge: '🥈' },
              { rank: 3, name: 'Michael Rodriguez', score: 2431, badge: '🥉' },
              { rank: 4, name: 'Sarah Kim', score: 2198, badge: '#4' },
              { rank: 5, name: 'James Wilson', score: 2087, badge: '#5' }
            ].map((user) => (
              <div key={user.rank} className="landing-lb-row">
                <div className="landing-lb-rank">{user.badge}</div>
                <div className="landing-lb-info">
                  <div className="landing-lb-name">{user.name}</div>
                  <div className="landing-lb-platform">Multi-Platform Developer</div>
                </div>
                <div className="landing-lb-score">{user.score.toLocaleString()}</div>
              </div>
            ))}
            
            <button className="landing-btn-primary landing-lb-cta" onClick={onGetStarted}>
              View Full Leaderboard
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-cta">
        <div className="landing-container">
          <div className="landing-cta-content">
            <h2 className="landing-cta-title">
              Ready to Track Your<br />
              Coding Journey?
            </h2>
            <p className="landing-cta-subtitle">
              Join developers who are already measuring their progress
            </p>
            <div className="landing-cta-buttons">
              <button className="landing-btn-hero" onClick={onGetStarted}>
                Get Started Free
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-content">
            <div className="landing-footer-brand">
              <div className="landing-logo">
                <div className="logo-icon-wrapper">
                  <div className="pulse"></div>
                  <div className="orbit-ring"></div>
                </div>
                <span className="logo-text">VOR<span className="logo-accent">TEX</span></span>
              </div>
              <p className="landing-footer-tagline">
                Developer Analytics Platform
              </p>
            </div>
            
            <div className="landing-footer-links">
              <div className="landing-footer-section">
                <h4>Platform</h4>
                <a href="#features">Features</a>
                <a href="#preview">Dashboard</a>
                <a href="#leaderboard">Leaderboard</a>
              </div>
              
              <div className="landing-footer-section">
                <h4>Integrations</h4>
                <a href="#" onClick={(e) => e.preventDefault()}>GitHub</a>
                <a href="#" onClick={(e) => e.preventDefault()}>LeetCode</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Codeforces</a>
              </div>
            </div>
          </div>
          
          <div className="landing-footer-bottom">
            <p>© 2024 VORTEX. Real-time developer analytics platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
