import React, { useState, useEffect } from 'react';
import { SkeletonStatsGrid } from './Skeleton';
import { fetchLeetCode } from '../utils/leetcode';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [hackerrankData, setHackerrankData] = useState(null);
  const [skillRadar, setSkillRadar] = useState([]);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAll();
  }, []);

  const authGet = (path) =>
    fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } });

  const fetchAll = async () => {
    try {
      const res = await authGet('/api/user/profile');
      const data = await res.json();
      setProfile(data);

      if (data.githubUsername) fetchGithub(data.githubUsername);
      if (data.leetcodeUsername) fetchLeetcode(data.leetcodeUsername);
      if (data.codeforcesUsername) fetchCodeforces(data.codeforcesUsername);
      if (data.hackerrankUsername) fetchHackerrank(data.hackerrankUsername);
      if (data.codeforcesUsername) fetchSkillRadar(data.codeforcesUsername);
      fetchContests();

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGithub = async (username) => {
    try {
      const res = await authGet(`/api/user/github/${username}`);
      const data = await res.json();
      if (res.ok && !data.error) setGithubData(data);
    } catch (err) {
      console.error('GitHub error:', err);
    }
  };

  const fetchLeetcode = async (username) => {
    try {
      const data = await fetchLeetCode(API_URL, username, token);
      if (data) setLeetcodeData(data);
    } catch (err) {
      console.error('LeetCode API failed:', err);
    }
  };

  const fetchCodeforces = async (username) => {
    try {
      const res = await authGet(`/api/user/codeforces/${username}`);
      const data = await res.json();
      if (res.ok && !data.error) setCodeforcesData(data);
    } catch (err) {
      console.error('Codeforces error:', err);
    }
  };

  const fetchContests = async () => {
    try {
      const res = await authGet('/api/user/contests');
      const data = await res.json();
      if (Array.isArray(data)) setContests(data);
    } catch (e) { /* ignore */ }
  };

  const fetchSkillRadar = async (handle) => {
    try {
      const res = await authGet(`/api/user/skill-radar/${handle}`);
      const data = await res.json();
      if (Array.isArray(data)) setSkillRadar(data);
    } catch (e) { /* ignore */ }
  };

  const fetchHackerrank = async (username) => {
    try {
      const res = await authGet(`/api/user/hackerrank/${username}`);
      const data = await res.json();
      if (res.ok && !data.error) setHackerrankData(data);
    } catch (err) {
      console.error('HackerRank error:', err);
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

      {codeforcesData ? (
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-title">🏆 CODEFORCES</div>
          <div style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '4px', textTransform: 'capitalize' }}>
            {codeforcesData.rank || 'unrated'} · @{codeforcesData.handle}
          </div>
          <div className="stats-grid" style={{ marginTop: '12px' }}>
            <div className="stat-card green">
              <div className="stat-label">RATING</div>
              <div className="stat-value">{codeforcesData.rating}</div>
            </div>
            <div className="stat-card gold">
              <div className="stat-label">MAX RATING</div>
              <div className="stat-value">{codeforcesData.maxRating}</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">SOLVED</div>
              <div className="stat-value">{codeforcesData.solved}</div>
            </div>
          </div>
        </div>
      ) : <NotSetCard icon="🏆" name="Codeforces" field="codeforcesUsername" />}

      {hackerrankData ? (
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-title">🎯 HACKERRANK</div>
          <div className="stats-grid" style={{ marginTop: '12px' }}>
            <div className="stat-card gold">
              <div className="stat-label">TOTAL STARS</div>
              <div className="stat-value">⭐ {hackerrankData.totalStars}</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">PROBLEMS SOLVED</div>
              <div className="stat-value">{hackerrankData.totalSolved}</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">BADGES</div>
              <div className="stat-value">{hackerrankData.badges?.length ?? 0}</div>
            </div>
          </div>
          {hackerrankData.badges?.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
              {hackerrankData.badges.slice(0, 6).map((b) => (
                <StatBadge key={b.name} label={b.name} value={'⭐'.repeat(b.stars)} color="var(--gold)" />
              ))}
            </div>
          )}
        </div>
      ) : <NotSetCard icon="🎯" name="HackerRank" field="hackerrankUsername" />}

      {skillRadar.length > 0 && (
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-title">🧭 SKILL RADAR (Codeforces topics)</div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={skillRadar}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="tag" tick={{ fill: 'var(--text2)', fontSize: 10 }} />
              <Radar dataKey="count" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-title">📅 UPCOMING CONTESTS (Codeforces)</div>
        {contests.length === 0 ? (
          <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '10px' }}>Koi upcoming contest nahi mila (ya load ho raha).</p>
        ) : (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {contests.map((c, i) => (
              <a key={i} href={c.url} target="_blank" rel="noreferrer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none', color: 'inherit', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>{c.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--primary)' }}>{new Date(c.startTimeSeconds * 1000).toLocaleString()}</span>
              </a>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Activity;
