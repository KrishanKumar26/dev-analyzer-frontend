import React, { useState, useEffect } from 'react';
import ActivityCalendar from './ActivityCalendar';
import PerformanceChart from './PerformanceChart';

const Dashboard = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [profile, setProfile] = useState(null);
  const [leaderData, setLeaderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
    fetchLeaderboard();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/user/leaderboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLeaderData(data);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Real data ya fallback
  const devScore = profile?.score ?? user?.score ?? 0;
  const globalRank = profile?.rank ?? user?.rank ?? 9999;
  const solved = profile?.problems ?? user?.problems ?? 0;
  const streak = profile?.streak ?? user?.streak ?? 0;
  const userName = profile?.name ?? user?.name ?? 'User';

  const filteredLeaders = leaderData.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page active rel">
      {/* 1. Top Ticker Bar */}
      <div className="ticker-bar">
        <div className="ticker-inner">
          <div className="ticker-item">SYSTEM_STATUS: <span className="up">STABLE</span></div>
          <div className="ticker-item">CORE_SCORE: <span>{devScore}</span></div>
          <div className="ticker-item">RANK: <span>#{globalRank}</span></div>
          <div className="ticker-item">STREAK: <span className="up">{streak}d</span></div>
        </div>
      </div>

      {/* 2. Main Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-label">DEV SCORE</div>
          <div className="stat-value">{devScore}</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-label">GLOBAL RANK</div>
          <div className="stat-value">#{globalRank}</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">PROBLEMS</div>
          <div className="stat-value">{solved}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">STREAK</div>
          <div className="stat-value">{streak}d</div>
        </div>
      </div>

      {/* 3. Two Column Layout */}
      <div className="two-col">

        {/* LEFT STACK */}
        <div className="left-stack">
          <div className="card">
            <div className="card-title" style={{ marginBottom: '15px' }}>
              GLOBAL LEADERBOARD
              <input
                type="text"
                placeholder="Find User..."
                className="search-mini"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="lb-container">
              {loading ? (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                  Loading...
                </div>
              ) : filteredLeaders.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                  No users yet
                </div>
              ) : (
                filteredLeaders.map((item, i) => (
                  <div
                    className={`lb-row ${item.name === userName ? 'me' : ''}`}
                    key={i}
                  >
                    <div className={`lb-rank rank-${i + 1}`}>#{i + 1}</div>
                    <div className="lb-info">
                      <div className="lb-name">
                        {item.name} {item.name === userName ? '(You)' : ''}
                      </div>
                      <div className="lb-platform">{item.platform}</div>
                    </div>
                    <div className="lb-score">{item.score}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <ActivityCalendar />
        </div>

        {/* RIGHT STACK */}
        <div className="right-stack">
          <div className="card">
            <div className="card-title">SKILL ANALYTICS</div>
            <div style={{ position: 'relative', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <svg width="150" height="150" viewBox="0 0 100 100">
                <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="var(--border)" strokeWidth="0.5" />
                <polygon points="50,20 80,35 85,70 50,80 20,65 25,40" fill="rgba(0, 229, 160, 0.2)" stroke="var(--primary)" strokeWidth="1.5">
                  <animate attributeName="points" dur="4s" repeatCount="indefinite" values="50,20 80,35 85,70 50,80 20,65 25,40; 50,15 85,30 90,75 50,85 15,70 10,35; 50,20 80,35 85,70 50,80 20,65 25,40" />
                </polygon>
              </svg>
            </div>
            <div className="rating-item" style={{ marginTop: '10px' }}>
              <div className="rating-label">GITHUB</div>
              <div className="rating-bar-bg">
                <div className="rating-bar-fill" style={{ width: '85%', background: 'var(--primary)' }}></div>
              </div>
            </div>
            <div className="rating-item">
              <div className="rating-label">LEETCODE</div>
              <div className="rating-bar-bg">
                <div className="rating-bar-fill" style={{ width: '65%', background: 'var(--gold)' }}></div>
              </div>
            </div>
          </div>

          <PerformanceChart />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;