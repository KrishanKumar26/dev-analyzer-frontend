import React, { useState, useEffect } from 'react';
import { SkeletonRows } from './Skeleton';
import { exportToCSV, exportToPDF } from '../utils/export';
import { useApp } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Leaderboard = ({ user }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');
  const { addToast } = useApp();

  const exportColumns = [
    { key: 'rank', label: 'Rank' },
    { key: 'name', label: 'Name' },
    { key: 'platform', label: 'Platform' },
    { key: 'score', label: 'Score' },
  ];

  const buildExportRows = () =>
    filtered.map((item, i) => ({ rank: i + 1, name: item.name, platform: item.platform, score: item.score }));

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

  return (
    <div className="page active rel">
      <div className="card">
        <div className="card-title" style={{ marginBottom: '15px' }}>
          🏆 GLOBAL LEADERBOARD
          <input
            type="text"
            placeholder="Search user..."
            className="search-mini"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginLeft: '15px' }}
          />
          <div className="card-actions">
            <button className="export-btn" onClick={handleExportCSV} disabled={loading || filtered.length === 0}>⇩ CSV</button>
            <button className="export-btn" onClick={handleExportPDF} disabled={loading || filtered.length === 0}>⇩ PDF</button>
          </div>
        </div>

        {loading ? (
          <SkeletonRows count={8} />
        ) : filtered.length === 0 ? (
          <div style={{ color: 'var(--text2)', textAlign: 'center', padding: '40px' }}>No users found</div>
        ) : (
          <div className="lb-container">
            {filtered.map((item, i) => (
              <div
                key={i}
                className={`lb-row ${item.name === user?.name ? 'me' : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', padding: '12px',
                  borderRadius: '8px', marginBottom: '8px',
                  background: item.name === user?.name ? 'rgba(0,229,160,0.08)' : 'var(--bg2)',
                  border: item.name === user?.name ? '1px solid var(--primary)' : '1px solid var(--border)'
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '14px',
                  background: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--bg3)',
                  color: i < 3 ? '#000' : 'var(--text)', marginRight: '12px', flexShrink: 0
                }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--gold))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '14px', marginRight: '12px', flexShrink: 0
                }}>
                  {item.name.substring(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>
                    {item.name} {item.name === user?.name ? '(You)' : ''}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)' }}>{item.platform}</div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: i === 0 ? '#FFD700' : 'var(--primary)' }}>
                  {item.score.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={fetchLeaderboard} style={{
          marginTop: '15px', background: 'transparent',
          border: '1px solid var(--primary)', color: 'var(--primary)',
          padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
        }}>
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;