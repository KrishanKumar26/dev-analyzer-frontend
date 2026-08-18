import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const GrowthChart = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API_URL}/api/user/history`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setData(d); })
      .catch(() => {});
  }, []);

  return (
    <div className="card" style={{ marginTop: '20px', height: '300px' }}>
      <div className="card-title" style={{ marginBottom: '20px' }}>📈 SCORE GROWTH OVER TIME</div>
      {data.length < 2 ? (
        <div style={{ color: 'var(--text2)', fontSize: '13px', textAlign: 'center', padding: '50px 20px' }}>
          Roz app kholo / "SYNC MY STATS" dabao — har din ka snapshot store hota hai, aur yahan
          tumhara score-growth chart banega. (Kam se kam 2 din ka data chahiye.)
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--primary)', borderRadius: '8px', fontSize: '12px' }} />
            <Line type="monotone" dataKey="score" name="Dev Score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 3 }} animationDuration={1200} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GrowthChart;
