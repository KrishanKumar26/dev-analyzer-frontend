import React, { useState, useEffect } from 'react';

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

const Activity = ({ user }) => {
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
    const res = await fetch('http://localhost:8081/api/user/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setProfile(data);
    if (data.githubUsername) fetchGithub(data.githubUsername);
    if (data.leetcodeUsername) fetchLeetcode(data.leetcodeUsername); // ab seedha API call hogi
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const fetchGithub = async (username) => {
    try {
      const res = await fetch('http://localhost:8081/api/user/github/' + username, {
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
    // Best free LeetCode API
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
      return;
    }
  } catch (err) {
    console.error('LeetCode API failed:', err);
  }
};
  if (loading) {
    return (
      <div className="page active rel" style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ color: 'var(--primary)', fontSize: '16px' }}>Loading platforms...</div>
      </div>
    );
  }

  const activityItems = [
    { icon: '⚡', text: 'Solved ' + (profile?.problems || 0) + ' problems total', time: 'Total' },
    { icon: '🔥', text: (profile?.streak || 0) + ' day streak', time: 'Ongoing' },
    { icon: '🏆', text: 'Global Rank #' + (profile?.rank || 9999), time: 'Current' },
    { icon: '💎', text: 'Dev Score: ' + (profile?.score || 0), time: 'Current' },
  ];

  if (githubData) {
    activityItems.push({ icon: '🐙', text: githubData.public_repos + ' GitHub repos', time: 'GitHub' });
  }
  if (leetcodeData) {
    activityItems.push({ icon: '⚡', text: (leetcodeData.totalSolved || 0) + ' LeetCode solved', time: 'LeetCode' });
  }

  return (
    <div className="page active rel">

      {githubData && !githubData.error ? (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-title">🐙 GITHUB PROFILE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
            <img
              src={githubData.avatar_url}
              alt="avatar"
              style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--primary)' }}
            />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{githubData.name || githubData.login}</div>
              <div style={{ color: 'var(--text2)', fontSize: '13px' }}>@{githubData.login}</div>
              {githubData.bio && (
                <div style={{ color: 'var(--text2)', fontSize: '12px', marginTop: '4px' }}>{githubData.bio}</div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '15px', flexWrap: 'wrap' }}>
            <StatBadge label="Repos" value={githubData.public_repos} color="var(--primary)" />
            <StatBadge label="Followers" value={githubData.followers} color="var(--gold)" />
            <StatBadge label="Following" value={githubData.following} color="var(--text2)" />
          </div>
        </div>
      ) : (
        <NotSetCard icon="🐙" name="GitHub" field="githubUsername" />
      )}

      {leetcodeData && !leetcodeData.error ? (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-title">⚡ LEETCODE PROFILE</div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '15px', flexWrap: 'wrap' }}>
            <StatBadge label="Total Solved" value={leetcodeData.totalSolved || 0} color="var(--primary)" />
            <StatBadge label="Easy" value={leetcodeData.easySolved || 0} color="#00b8a3" />
            <StatBadge label="Medium" value={leetcodeData.mediumSolved || 0} color="#FFA116" />
            <StatBadge label="Hard" value={leetcodeData.hardSolved || 0} color="#FF375F" />
          </div>
        </div>
      ) : (
        <NotSetCard icon="⚡" name="LeetCode" field="leetcodeUsername" />
      )}

      {profile?.codeforcesUsername ? (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-title">🏆 CODEFORCES</div>
          <div style={{ color: 'var(--text2)', fontSize: '14px', marginTop: '10px' }}>
            @{profile.codeforcesUsername}
          </div>
        </div>
      ) : (
        <NotSetCard icon="🏆" name="Codeforces" field="codeforcesUsername" />
      )}

      {profile?.hackerrankUsername ? (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-title">🎯 HACKERRANK</div>
          <div style={{ color: 'var(--text2)', fontSize: '14px', marginTop: '10px' }}>
            @{profile.hackerrankUsername}
          </div>
        </div>
      ) : (
        <NotSetCard icon="🎯" name="HackerRank" field="hackerrankUsername" />
      )}

      <div className="card">
        <div className="card-title">📊 ACTIVITY FEED</div>
        <div style={{ marginTop: '10px' }}>
          {activityItems.map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px', borderRadius: '8px', marginBottom: '8px',
              background: 'var(--bg2)', border: '1px solid var(--border)'
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(0,229,160,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', flexShrink: 0
              }}>
                {a.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{a.text}</div>
                <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Activity;
