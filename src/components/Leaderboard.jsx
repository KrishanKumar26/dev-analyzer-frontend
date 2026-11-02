import React, { useState, useEffect } from 'react';
import { SkeletonRows } from './Skeleton';
import { exportToCSV, exportToPDF } from '../utils/export';
import { useApp } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Leaderboard = ({ user }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('global');
  const token = localStorage.getItem('token');
  const { addToast } = useApp();

  const exportColumns = [
    { key: 'rank', label: 'Rank' },
    { key: 'name', label: 'Name' },
    { key: 'githubScore', label: 'GitHub Score' },
    { key: 'leetcodeScore', label: 'LeetCode Score' },
    { key: 'totalScore', label: 'Total Score' },
  ];

  const buildExportRows = () =>
    filtered.map((item, i) => ({ 
      rank: i + 1, 
      name: item.name, 
      githubScore: item.githubScore || 0,
      leetcodeScore: item.leetcodeScore || 0,
      totalScore: item.score 
    }));

  const handleExportCSV = () => {
    exportToCSV(buildExportRows(), exportColumns, 'vortex-leaderboard');
    addToast('Leaderboard exported as CSV', 'success');
  };

  const handleExportPDF = () => {
    exportToPDF({
      title: 'VORTEX Leaderboard',
      subtitle: `${filtered.length} developers ranked`,
      columns: exportColumns,
      rows: buildExportRows(),
      filename: 'vortex-leaderboard',
    });
    addToast('Leaderboard exported as PDF', 'success');
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/leaderboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLeaders(data);
    } catch (err) {
      console.error('Leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = leaders.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userRank = filtered.findIndex(item => item.isMe) + 1;
  const totalDevs = filtered.length;

  return (
    <div className="page active" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
      
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 229, 160, 0.15) 0%, rgba(123, 97, 255, 0.15) 100%)',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        marginBottom: '2rem',
        border: '1px solid rgba(0, 229, 160, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Decoration */}
        <div style={{
          position: 'absolute',
          right: '-100px',
          top: '-100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 229, 160, 0.2) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: '80px',
            filter: 'drop-shadow(0 8px 16px rgba(255, 215, 0, 0.4))'
          }}>🏆</div>
          <div>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '800',
              marginBottom: '8px',
              color: 'var(--text)',
              letterSpacing: '-1px'
            }}>
              Global <span style={{ 
                background: 'linear-gradient(135deg, #00e5a0 0%, #7b61ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Leaderboard</span>
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--text2)', marginBottom: '0' }}>
              See how you rank among the top developers worldwide
            </p>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '2rem',
          position: 'relative',
          zIndex: 1 
        }}>
          <div style={{
            textAlign: 'center',
            padding: '20px 32px',
            background: 'rgba(0, 229, 160, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(0, 229, 160, 0.3)'
          }}>
            <div style={{ fontSize: '14px', color: '#00e5a0', marginBottom: '8px', fontWeight: '600' }}>📊 Total Developers</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text)' }}>{totalDevs}+</div>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '20px 32px',
            background: 'rgba(123, 97, 255, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(123, 97, 255, 0.3)'
          }}>
            <div style={{ fontSize: '14px', color: '#7b61ff', marginBottom: '8px', fontWeight: '600' }}>👑 Your Rank</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text)' }}>#{userRank || '—'}</div>
          </div>
          <div style={{
            fontSize: '100px',
            filter: 'drop-shadow(0 8px 20px rgba(255, 215, 0, 0.6))',
            animation: 'float 3s ease-in-out infinite'
          }}>🏆</div>
        </div>
      </div>

      {/* Tabs & Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('global')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'global' ? '#00e5a0' : 'transparent',
              color: activeTab === 'global' ? '#0a0e1a' : 'var(--text)',
              border: activeTab === 'global' ? 'none' : '1px solid var(--border)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🌍 Global
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'friends' ? '#00e5a0' : 'transparent',
              color: activeTab === 'friends' ? '#0a0e1a' : 'var(--text)',
              border: activeTab === 'friends' ? 'none' : '1px solid var(--border)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            👥 Friends
          </button>
        </div>

        {/* Search & Export */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="🔍 Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 20px',
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--text)',
              fontSize: '14px',
              minWidth: '250px'
            }}
          />
          <button
            onClick={handleExportCSV}
            disabled={loading || filtered.length === 0}
            style={{
              padding: '12px 20px',
              background: 'rgba(0, 229, 160, 0.1)',
              border: '1px solid rgba(0, 229, 160, 0.3)',
              borderRadius: '10px',
              color: '#00e5a0',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📥 Download CSV
          </button>
          <button
            onClick={handleExportPDF}
            disabled={loading || filtered.length === 0}
            style={{
              padding: '12px 20px',
              background: 'rgba(33, 150, 243, 0.1)',
              border: '1px solid rgba(33, 150, 243, 0.3)',
              borderRadius: '10px',
              color: '#2196f3',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div style={{
        background: 'var(--bg2)',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid var(--border)'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr 150px 150px 150px 120px 60px',
          gap: '16px',
          padding: '16px 20px',
          borderBottom: '2px solid var(--border)',
          marginBottom: '12px',
          fontSize: '12px',
          fontWeight: '700',
          color: 'var(--text3)',
          textTransform: 'uppercase'
        }}>
          <div>#</div>
          <div>User</div>
          <div>GitHub Score</div>
          <div>LeetCode Score</div>
          <div>Total Score</div>
          <div>Rank Change</div>
          <div></div>
        </div>

        {/* Table Body */}
        {loading ? (
          <SkeletonRows count={8} />
        ) : filtered.length === 0 ? (
          <div style={{ 
            color: 'var(--text2)', 
            textAlign: 'center', 
            padding: '60px 20px',
            fontSize: '16px'
          }}>
            No users found matching "{searchTerm}"
          </div>
        ) : (
          filtered.map((item, i) => {
            const rankBadges = {
              0: '🥇',
              1: '🥈',
              2: '🥉'
            };
            const isTopThree = i < 3;
            const isUser = item.isMe;
            
            return (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 150px 150px 150px 120px 60px',
                  gap: '16px',
                  padding: '18px 20px',
                  marginBottom: '8px',
                  borderRadius: '12px',
                  background: isUser 
                    ? 'linear-gradient(90deg, rgba(0, 229, 160, 0.15) 0%, rgba(0, 229, 160, 0.05) 100%)'
                    : isTopThree 
                    ? 'rgba(255, 215, 0, 0.05)' 
                    : 'var(--bg3)',
                  border: isUser 
                    ? '2px solid #00e5a0' 
                    : isTopThree 
                    ? '1px solid rgba(255, 215, 0, 0.3)'
                    : '1px solid transparent',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isUser) {
                    e.currentTarget.style.background = 'var(--bg)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isUser) {
                    e.currentTarget.style.background = isTopThree ? 'rgba(255, 215, 0, 0.05)' : 'var(--bg3)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                {/* Rank */}
                <div style={{
                  fontSize: isTopThree ? '32px' : '18px',
                  fontWeight: '800',
                  color: isUser ? '#00e5a0' : 'var(--text)'
                }}>
                  {isTopThree ? rankBadges[i] : `#${i + 1}`}
                </div>

                {/* User */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${isTopThree ? '#ffd700' : '#00e5a0'} 0%, ${isTopThree ? '#ffa500' : '#7b61ff'} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#fff',
                    border: isTopThree ? '2px solid #ffd700' : 'none'
                  }}>
                    {item.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: '15px', 
                      fontWeight: '700', 
                      color: 'var(--text)',
                      marginBottom: '2px'
                    }}>
                      {item.name} {isUser && <span style={{ color: '#00e5a0' }}>(You)</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>⚙️</span> {item.platform || 'GitHub'}
                    </div>
                  </div>
                </div>

                {/* GitHub Score */}
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)' }}>
                  {item.githubScore || Math.floor(item.score * 0.4)}
                </div>

                {/* LeetCode Score */}
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)' }}>
                  {item.leetcodeScore || Math.floor(item.score * 0.6)}
                </div>

                {/* Total Score */}
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: '800', 
                  color: isUser ? '#00e5a0' : isTopThree ? '#ffd700' : 'var(--text)'
                }}>
                  {item.score}
                </div>

                {/* Rank Change */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: i % 2 === 0 ? '#10b981' : '#ef4444'
                }}>
                  {i % 2 === 0 ? '▲' : '▼'} {i % 2 === 0 ? '+1' : '-1'}
                </div>

                {/* Arrow */}
                <div style={{ fontSize: '18px', color: 'var(--text3)' }}>
                  →
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Motivational Banner */}
      {userRank && (
        <div style={{
          marginTop: '2rem',
          background: 'linear-gradient(135deg, rgba(0, 229, 160, 0.1) 0%, rgba(123, 97, 255, 0.1) 100%)',
          borderRadius: '16px',
          padding: '24px 32px',
          border: '1px solid rgba(0, 229, 160, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '48px' }}>📈</div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' }}>
                Keep Coding, {user?.name}! 🚀
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text2)' }}>
                You're in the top {((userRank / totalDevs) * 100).toFixed(1)}% of developers globally
              </div>
            </div>
          </div>
          <button style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #00e5a0 0%, #7b61ff 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 229, 160, 0.4)'
          }}>
            View Your Profile →
          </button>
        </div>
      )}

    </div>
  );
};

export default Leaderboard;
