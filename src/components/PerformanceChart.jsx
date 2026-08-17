import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const PLATFORMS = [
  { key: 'githubScore', label: 'GitHub', color: '#a371f7' },
  { key: 'leetcodeScore', label: 'LeetCode', color: '#ffa116' },
  { key: 'codeforcesScore', label: 'Codeforces', color: '#1f8acb' },
  { key: 'hackerrankScore', label: 'HackerRank', color: '#00ea9c' },
];

const PerformanceChart = () => {
  const [chartData, setChartData] = useState([]);
  const [hasData, setHasData] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const rows = PLATFORMS.map(p => ({
        platform: p.label,
        score: data[p.key] || 0,
        color: p.color,
      }));
      setChartData(rows);
      setHasData(rows.some(r => r.score > 0));
    } catch (err) {
      setChartData(PLATFORMS.map(p => ({ platform: p.label, score: 0, color: p.color })));
      setHasData(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: '20px', height: '300px' }}>
      <div className="card-title" style={{ marginBottom: '20px' }}>SCORE BY PLATFORM</div>

      {!hasData ? (
        <div style={{ color: 'var(--text2)', fontSize: '13px', textAlign: 'center', padding: '50px 20px' }}>
          Profile me "🔄 SYNC MY STATS" dabao — phir yahan tumhare score ka
          platform-wise breakdown dikhega 📊
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="platform" axisLine={false} tickLine={false} tick={{ fill: 'var(--text3)', fontSize: 11 }} />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--primary)', borderRadius: '8px', fontSize: '12px' }}
              formatter={(value) => [value.toLocaleString(), 'Score']}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} animationDuration={1200}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PerformanceChart;
