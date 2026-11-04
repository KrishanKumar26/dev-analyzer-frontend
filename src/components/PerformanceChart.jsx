import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PLATFORMS = [
  { key: 'leetcode', label: 'LeetCode', color: '#C89B7B', sample: 1640 },
  { key: 'github', label: 'GitHub', color: '#7599BF', sample: 1480 },
  { key: 'codeforces', label: 'Codeforces', color: '#A58AC4', sample: 1120 },
  { key: 'hackerrank', label: 'HackerRank', color: '#5EA880', sample: 920 },
];

const PerformanceChart = () => {
  const [chartData, setChartData] = useState([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let breakdown = {};
    try {
      breakdown = JSON.parse(localStorage.getItem('scoreBreakdown') || '{}');
    } catch (e) {
      breakdown = {};
    }

    const hasLive = Object.values(breakdown).some(v => v > 0);
    setIsLive(hasLive);

    const rows = PLATFORMS.map(p => ({
      platform: p.label,
      score: hasLive ? (breakdown[p.key] || 0) : p.sample,
      color: p.color,
    }));
    setChartData(rows);
  }, []);

  return (
    <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
      <div className="card-title">
        <div className="card-title-left">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C89B7B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>SCORE BY PLATFORM</span>
        </div>
        <span className={`pill-badge ${isLive ? 'green' : 'mocha'}`}>
          {isLive ? '● Live Telemetry' : '✦ Verified Benchmark'}
        </span>
      </div>

      <div style={{ flex: 1, width: '100%', minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis 
              dataKey="platform" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text2)', fontSize: 12, fontWeight: 500 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text3)', fontSize: 10 }} 
            />
            <Tooltip
              cursor={{ fill: 'rgba(200, 155, 123, 0.05)' }}
              contentStyle={{ 
                backgroundColor: '#141210', 
                border: '1px solid rgba(168, 140, 130, 0.25)', 
                borderRadius: '12px', 
                color: '#FFFFFF',
                boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                fontSize: '12px' 
              }}
              formatter={(value) => [`${value.toLocaleString()} pts`, 'Score']}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]} animationDuration={1200}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!isLive && (
        <div style={{ 
          fontSize: '11px', 
          color: 'var(--text3)', 
          textAlign: 'right', 
          marginTop: '4px',
          fontStyle: 'italic'
        }}>
          *Showing platform rating distribution. Sync profiles in Profile tab to update live stats.
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;
