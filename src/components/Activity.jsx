import React, { useState, useEffect } from 'react';
import { SkeletonStatsGrid } from './Skeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const StatBadge = ({ label, value, color }) => (
  <div style={{
    background: 'var(--bg3)', padding: '8px 14px',
    borderRadius: '8px', textAlign: 'center',
    border: `1px solid ${color}44`
  }}>
    <div style={{ fontSize: '18px', fontWeight: 'bold', color }}>{value}</div>
    <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{label}</div>
  </div>
);

const NotSetCard = ({ icon, name, field }) => (
  <div className="card" style={{
    marginBottom: '20px', textAlign: 'center', padding: '25px',
    border: '1px dashed var(--border)'
  }}>
    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
    <div style={{ color: 'var(--text2)', fontSize: '14px' }}>{name} connected nahi hai</div>
    <div style={{ color: 'var(--text2)', fontSize: '12px', marginTop: '4px' }}>
      Profile - Edit Profile mein {field} daalo
    </div>
  </div>
);

const Activity = () => {
  const [profile, setProfile] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);

      if (data.githubUsername) fetchGithub(data.githubUsername);
      if (data.leetcodeUsername) fetchLeetcode(data.leetcodeUsername);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGithub = async (username) => {
    try {
      const res = await fetch(`${API_URL}/api/user/github/${username}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setGithubData(data);
    } catch (err) {
      console.error('GitHub error:', err);
    }
  };

  const fetchLeetcode = async (username) => {
    try {
      const res = await fetch(
        'https://leetcode-api-freeend.vercel.app/userProfile/' + username
      );
      if (res.ok) {
        const data = await res.json();
        setLeetcodeData({
          totalSolved: data.totalSolved || 0,
          easySolved: data.easySolved || 0,
          mediumSolved: data.mediumSolved || 0,
          hardSolved: data.hardSolved || 0,
          ranking: data.ranking || 0,
          acceptanceRate: data.acceptanceRate || 0
        });
      }
    } catch (err) {
      console.error('LeetCode API failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="page active rel">
        <SkeletonStatsGrid count={4} />
      </div>
    );
  }

  return (
    <div className="page active rel">

      {githubData ? (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-title">🐙 GITHUB</div>
          <div className="stats-grid">
            <div className="stat-card green">
              <div className="stat-label">PUBLIC REPOS</div>
              <div className="stat-value">{githubData.public_repos ?? 0}</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">FOLLOWERS</div>
              <div className="stat-value">{githubData.followers ?? 0}</div>
            </div>
          </div>
        </div>
      ) : <NotSetCard icon="🐙" name="GitHub" field="githubUsername" />}

      {leetcodeData ? (
        <div className="card">
          <div className="card-title">⚡ LEETCODE</div>
          <div className="stats-grid">
            <div className="stat-card green">
              <div className="stat-label">TOTAL SOLVED</div>
              <div className="stat-value">{leetcodeData.totalSolved}</div>
            </div>
            <div className="stat-card gold">
              <div className="stat-label">EASY</div>
              <div className="stat-value">{leetcodeData.easySolved}</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">MEDIUM</div>
              <div className="stat-value">{leetcodeData.mediumSolved}</div>
            </div>
            <div className="stat-card red">
              <div className="stat-label">HARD</div>
              <div className="stat-value">{leetcodeData.hardSolved}</div>
            </div>
          </div>
        </div>
      ) : <NotSetCard icon="⚡" name="LeetCode" field="leetcodeUsername" />}

    </div>
  );
};

export default Activity;