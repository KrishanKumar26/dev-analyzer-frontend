import React, { useState, useEffect } from 'react';

const API_URL = "https://YOUR-BACKEND.up.railway.app"; // 👈 yaha apna Railway URL daalo

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
      <div style={{ textAlign: 'center', padding: '60px' }}>
        Loading...
      </div>
    );
  }

  return (
    <div>

      {githubData ? (
        <div>
          <h3>GitHub</h3>
          <p>{githubData.public_repos} Repos</p>
        </div>
      ) : <NotSetCard icon="🐙" name="GitHub" field="githubUsername" />}

      {leetcodeData ? (
        <div>
          <h3>LeetCode</h3>
          <p>{leetcodeData.totalSolved} Solved</p>
        </div>
      ) : <NotSetCard icon="⚡" name="LeetCode" field="leetcodeUsername" />}

    </div>
  );
};

export default Activity;