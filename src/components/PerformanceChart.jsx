import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const PerformanceChart = () => {
  const [chartData, setChartData] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const score = data.score || 0;
      setChartData([
        { day: 'Mon', score: Math.max(0, score - 800) },
        { day: 'Tue', score: Math.max(0, score - 600) },
        { day: 'Wed', score: Math.max(0, score - 400) },
        { day: 'Thu', score: Math.max(0, score - 300) },
        { day: 'Fri', score: Math.max(0, score - 200) },
        { day: 'Sat', score: Math.max(0, score - 100) },
        { day: 'Sun', score: score },
      ]);
    } catch (err) {
      setChartData([
        { day: 'Mon', score: 0 }, { day: 'Tue', score: 0 },
        { day: 'Wed', score: 0 }, { day: 'Thu', score: 0 },
        { day: 'Fri', score: 0 }, { day: 'Sat', score: 0 },
        { day: 'Sun', score: 0 },
      ]);
    }
  };

  return (
    <div className="card" style={{ marginTop: '20px', height: '300px' }}>
      <div className="card-title" style={{ marginBottom: '20px' }}>PERFORMANCE ANALYTICS</div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text3)', fontSize: 10 }} />
          <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--primary)', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: 'var(--primary)' }}
          />
          <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" animationDuration={2000} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;