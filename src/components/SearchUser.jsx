import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const StatBadge = ({ label, value, color }) => (
  <div style={{ background: 'var(--bg3)', padding: '8px 14px', borderRadius: '8px', textAlign: 'center', minWidth: '80px' }}>
    <div style={{ fontSize: '18px', fontWeight: 'bold', color: color }}>{value}</div>
    <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{label}</div>
  </div>
);

const SearchUser = ({ user }) => {
  const [query, setQuery] = useState('');
  const [githubData, setGithubData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const searchGithub = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setGithubData(null);
    setLeetcodeData(null);
    try {
      const res = await fetch(API_URL + '/api/user/github/' + query.trim(), {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if (data.error || data.message === 'Not Found') {
        setError('GitHub user not found: ' + query);
      } else {
        setGithubData(data);
        fetchLeetcode(query.trim());
      }
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeetcode = async (username) => {
    try {
      const res = await fetch('https://leetcode-stats-api.herokuapp.com/' + username);
      if (res.ok) {
        const data = await res.json();
        if (data.status !== 'error') setLeetcodeData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page active rel">
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-title">SEARCH DEVELOPER</div>
        <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '8px' }}>
          GitHub username daalo — kisi ka bhi real data dekhne ke liye
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <input
            type="text"
            placeholder="GitHub username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchGithub()}
            style={{
              flex: 1, padding: '12px 16px',
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--text1)', fontSize: '14px', outline: 'none'
            }}
          />
          <button
            onClick={searchGithub}
            style={{
              padding: '12px 24px', background: 'var(--primary)',
              border: 'none', borderRadius: '8px', color: '#000',
              fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
            }}
          >
            Search
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', color: 'var(--primary)', padding: '20px' }}>Loading...</div>
      )}

      {error && (
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>
        </div>
      )}

      {githubData && (
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img
                src={githubData.avatar_url}
                alt="avatar"
                style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--primary)' }}
              />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '22px' }}>{githubData.name || githubData.login}</div>
                <div style={{ color: 'var(--text2)', fontSize: '14px' }}>{'@' + githubData.login}</div>
                {githubData.bio && (
                  <div style={{ color: 'var(--text2)', fontSize: '12px', marginTop: '4px' }}>{githubData.bio}</div>
                )}
                {githubData.location && (
                  <div style={{ color: 'var(--text2)', fontSize: '12px' }}>{'📍 ' + githubData.location}</div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
              <StatBadge label="Repos" value={githubData.public_repos} color="var(--primary)" />
              <StatBadge label="Followers" value={githubData.followers} color="var(--gold)" />
              <StatBadge label="Following" value={githubData.following} color="var(--text2)" />
            </div>
            
              href={githubData.html_url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block', marginTop: '15px',
                color: 'var(--primary)', fontSize: '13px',
                textDecoration: 'none', border: '1px solid var(--primary)',
                padding: '6px 16px', borderRadius: '6px'
              }}
            >
              View GitHub Profile
            </a>
          </div>

          {leetcodeData && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <div className="card-title">LEETCODE</div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
                <StatBadge label="Total" value={leetcodeData.totalSolved || 0} color="var(--primary)" />
                <StatBadge label="Easy" value={leetcodeData.easySolved || 0} color="#00b8a3" />
                <StatBadge label="Medium" value={leetcodeData.mediumSolved || 0} color="#FFA116" />
                <StatBadge label="Hard" value={leetcodeData.hardSolved || 0} color="#FF375F" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUser;