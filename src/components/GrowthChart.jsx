import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const GrowthChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const fetchGrowthData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/user/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setChartData(data || []);
      }
    } catch (err) {
      console.error('Growth data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-title">📈 GROWTH TIMELINE</div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loader-mini"></div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="card">
        <div className="card-title">📈 GROWTH TIMELINE</div>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
          No growth data yet. Sync your data to start tracking!
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">📈 GROWTH TIMELINE</div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" stroke="var(--text-dim)" />
          <YAxis stroke="var(--text-dim)" />
          <Tooltip 
            contentStyle={{ 
              background: 'var(--card)', 
              border: '1px solid var(--border)',
              borderRadius: '8px'
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="var(--primary)" 
            strokeWidth={2}
            dot={{ fill: 'var(--primary)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthChart;
