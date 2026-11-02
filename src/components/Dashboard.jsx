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
            background: 'var(--bg3)',
            border: '1px solid var(--border)'
          }}>
            <div className="stat-icon" style={{ fontSize: '28px', marginBottom: '8px' }}>🏆</div>
            <div className="stat-label">DEVELOPER SCORE</div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>{devScore}</div>
            <div className="stat-change up">+18%</div>
          </div>
          <div className="stat-card" style={{ 
            background: 'var(--bg3)',
            border: '1px solid var(--border)'
          }}>
            <div className="stat-icon" style={{ fontSize: '28px', marginBottom: '8px' }}>🌍</div>
            <div className="stat-label">GLOBAL RANK</div>
            <div className="stat-value" style={{ color: 'var(--gold)' }}>#{globalRank}</div>
            <div className="stat-change up">+2</div>
          </div>
          <div className="stat-card" style={{ 
            background: 'var(--bg3)',
            border: '1px solid var(--border)'
          }}>
            <div className="stat-icon" style={{ fontSize: '28px', marginBottom: '8px' }}>✓</div>
            <div className="stat-label">PROBLEMS SOLVED</div>
            <div className="stat-value" style={{ color: 'var(--accent2)' }}>{solved}</div>
            <div className="stat-change up">+12%</div>
          </div>
          <div className="stat-card" style={{ 
            background: 'var(--bg3)',
            border: '1px solid var(--border)'
          }}>
            <div className="stat-icon" style={{ fontSize: '28px', marginBottom: '8px' }}>🔥</div>
            <div className="stat-label">CURRENT STREAK</div>
            <div className="stat-value" style={{ color: 'var(--accent)' }}>{streak}d</div>
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
          {/* Skill Analytics Card */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <span style={{ fontSize: '18px' }}>💻</span>
              SKILL ANALYTICS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'DSA', percentage: 92, color: '#06b6d4' },
                { label: 'Backend', percentage: 88, color: '#8b5cf6' },
                { label: 'SQL', percentage: 85, color: '#10b981' },
                { label: 'Frontend', percentage: 72, color: '#a855f7' }
              ].map((skill, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>{skill.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: skill.color }}>{skill.percentage}%</span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    background: 'var(--bg3)', 
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${skill.percentage}%`, 
                      height: '100%', 
                      background: skill.color,
                      borderRadius: '10px',
                      transition: 'width 1s ease'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score by Platform Card */}
          <div className="card">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <span style={{ fontSize: '18px' }}>📊</span>
              SCORE BY PLATFORM
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '200px' }}>
              {[
                { name: 'GitHub', score: 2100, maxScore: 3000, color: '#10b981', icon: '⚡' },
                { name: 'LeetCode', score: 1900, maxScore: 3000, color: '#2196f3', icon: '💡' },
                { name: 'Codeforces', score: 1400, maxScore: 3000, color: '#a855f7', icon: '🏆' },
                { name: 'HackerRank', score: 1600, maxScore: 3000, color: '#f59e0b', icon: '🎯' }
              ].map((platform, idx) => {
                const heightPercent = (platform.score / platform.maxScore) * 100;
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '100%', 
                      height: `${heightPercent}%`,
                      background: `linear-gradient(180deg, ${platform.color} 0%, ${platform.color}80 100%)`,
                      borderRadius: '8px 8px 0 0',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      paddingTop: '8px',
                      position: 'relative',
                      transition: 'height 1s ease'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                        {(platform.score / 1000).toFixed(1)}k
                      </span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', marginBottom: '4px' }}>{platform.icon}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text2)', fontWeight: '600' }}>{platform.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border)'
            }}>
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>0</span>
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>1k</span>
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>2k</span>
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>3k</span>
            </div>
          </div>

          <PerformanceChart />
        </div>

      </div>

      <GrowthChart />
    </div>
  );
};

export default Dashboard;