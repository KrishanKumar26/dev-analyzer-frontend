import React, { useState, useEffect } from 'react';
import ActivityCalendar from './ActivityCalendar';
import PerformanceChart from './PerformanceChart';
import GrowthChart from './GrowthChart';
import { SkeletonRows, SkeletonStatsGrid } from './Skeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Dashboard = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [profile, setProfile] = useState(null);
  const [leaderData, setLeaderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
    fetchLeaderboard();
    autoSyncDaily();
  }, []);

  // Auto-sync once daily — keeps data fresh and records growth snapshots
  const autoSyncDaily = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      if (localStorage.getItem('lastAutoSync') === today) return;
      const res = await fetch(`${API_URL}/api/user/sync`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.breakdown) localStorage.setItem('scoreBreakdown', JSON.stringify(data.breakdown));
        localStorage.setItem('lastAutoSync', today);
        fetchProfile();
      }
    } catch (e) { /* ignore */ }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
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
      const res = await fetch(`${API_URL}/api/user/leaderboard`, {
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

      <div className="ticker-bar">
        <div className="ticker-inner">
          <div className="ticker-item">SYSTEM_STATUS: <span className="up">STABLE</span></div>
          <div className="ticker-item">CORE_SCORE: <span>{devScore}</span></div>
          <div className="ticker-item">RANK: <span>#{globalRank}</span></div>
          <div className="ticker-item">STREAK: <span className="up">{streak}d</span></div>
        </div>
      </div>

      {loading ? (
        <SkeletonStatsGrid count={4} />
      ) : (
        <div className="stats-grid">
          <div className="stat-card" style={{ 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div className="stat-icon" style={{ fontSize: '28px', marginBottom: '8px' }}>🏆</div>
            <div className="stat-label">DEVELOPER SCORE</div>
            <div className="stat-value" style={{ color: '#10b981' }}>{devScore}</div>
            <div className="stat-change up">+18%</div>
          </div>
          <div className="stat-card" style={{ 
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <div className="stat-icon" style={{ fontSize: '28px', marginBottom: '8px' }}>🌍</div>
            <div className="stat-label">GLOBAL RANK</div>
            <div className="stat-value" style={{ color: '#f59e0b' }}>#{globalRank}</div>
            <div className="stat-change up">+2</div>
          </div>
          <div className="stat-card" style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(118, 75, 162, 0.05) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            <div className="stat-icon" style={{ fontSize: '28px', marginBottom: '8px' }}>✓</div>
            <div className="stat-label">PROBLEMS SOLVED</div>
            <div className="stat-value" style={{ color: '#8b5cf6' }}>{solved}</div>
            <div className="stat-change up">+12%</div>
          </div>
          <div className="stat-card" style={{ 
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <div className="stat-icon" style={{ fontSize: '28px', marginBottom: '8px' }}>🔥</div>
            <div className="stat-label">CURRENT STREAK</div>
            <div className="stat-value" style={{ color: '#ef4444' }}>{streak}d</div>
            <div className="stat-change up">+1d</div>
          </div>
        </div>
      )}

      <div className="two-col">

        <div className="left-stack">
          <div className="card">
            <div className="card-title" style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>📊</span>
              GLOBAL LEADERBOARD
              <input
                type="text"
                placeholder="Find User..."
                className="search-mini"
                style={{ marginLeft: 'auto' }}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="lb-container">
              {loading ? (
                <SkeletonRows count={5} />
              ) : filteredLeaders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text2)' }}>No users found</div>
              ) : (
                filteredLeaders.map((item, i) => {
                  const medals = ['🥇', '🥈', '🥉'];
                  return (
                    <div className={`lb-row ${item.isMe ? 'me' : ''}`} key={i}>
                      <div className={`lb-rank rank-${i + 1}`}>
                        {i < 3 ? medals[i] : `#${i + 1}`}
                      </div>
                      <div className="lb-info">
                        <div className="lb-name">
                          {item.name} {item.isMe ? '(You)' : ''}
                        </div>
                        <div className="lb-platform">{item.platform}</div>
                      </div>
                      <div className="lb-score" style={{ 
                        color: item.isMe ? '#10b981' : 'var(--text)',
                        fontWeight: item.isMe ? '700' : '600'
                      }}>{item.score}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <ActivityCalendar />
        </div>

        <div className="right-stack">
          <div className="card">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '20px' }}>💻</span>
              SKILL ANALYTICS
            </div>
            {/* Skill bars will be rendered by PerformanceChart component */}
          </div>

          <PerformanceChart />
        </div>

      </div>

      <GrowthChart />
    </div>
  );
};

export default Dashboard;