import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const StatBadge = ({ label, value, color }) => (
  <div style={{
    background: 'var(--bg3)', padding: '8px 14px',
    borderRadius: '8px', textAlign: 'center',
    border: '1px solid ' + color + '44', minWidth: '80px'
  }}>
    <div style={{ fontSize: '18px', fontWeight: 'bold', color }}>{value}</div>
    <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{label}</div>
  </div>
);

const SearchUser = ({ user }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const token = localStorage.getItem('token');

  const searchUsers = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setSelectedUser(null);
    setGithubData(null);
    setLeetcodeData(null);
    try {
      const res = await fetch(API_URL + '/api/user/search?query=' + query, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewProfile = async (u) => {
    setSelectedUser(u);
    setGithubData(null);
    setLeetcodeData(null);
    setProfileLoading(true);
    if (u.githubUsername) {
      try {
        const res = await fetch(API_URL + '/api/user/github/' + u.githubUsername, {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        if (!data.error) setGithubData(data);
      } catch (err) {
        console.error('GitHub error:', err);
      }
    }
    if (u.leetcodeUsername) {
      try {
        const res = await fetch('https://leetcode-stats-api.herokuapp.com/' + u.leetcodeUsername);
        if (res.ok) {
          const data = await res.json();
          if (data.status !== 'error') setLeetcodeData(data);
        }
      } catch (err) {
        console.error('LeetCode error:', err);
      }
    }
    setProfileLoading(false);
  };

  return (
    <div className="page active rel">
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-title">SEARCH DEVELOPER</div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <input
            type="text"
            placeholder="Name ya GitHub username likho..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
            style={{
              flex: 1, padding: '12px 16px',
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--text1)', fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={searchUsers}
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
        <div style={{ textAlign: 'center', color: 'var(--primary)', padding: '20px' }}>
          Searching...
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ fontSize: '40px' }}>No user found</div>
        </div>
      )}

      {!loading && results.length > 0 && !selectedUser && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-title">Results ({results.length})</div>
          {results.map((u, i) => (
            <div
              key={i}
              onClick={() => viewProfile(u)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px', borderRadius: '8px', marginTop: '8px',
                background: 'var(--bg2)', border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '45px', height: '45px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--gold))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '16px', flexShrink: 0
              }}>
                {u.name.substring(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '15px' }}>{u.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
                  {u.githubUsername && '🐙 @' + u.githubUsername}
                  {u.leetcodeUsername && ' ⚡ @' + u.leetcodeUsername}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{'#' + (u.rank || 9999)}</div>
                <div style={{ fontSize: '12px', color: 'var(--text2)' }}>Score: {u.score}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <div>
          <button
            onClick={() => { setSelectedUser(null); setGithubData(null); setLeetcodeData(null); }}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--text2)', padding: '8px 16px', borderRadius: '6px',
              cursor: 'pointer', marginBottom: '15px', fontSize: '13px'
            }}
          >
            Back
          </button>

          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {githubData && githubData.avatar_url ? (
                <img
                  src={githubData.avatar_url}
                  alt="avatar"
                  style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid var(--primary)' }}
                />
              ) : (
                <div style={{
                  width: '70px', height: '70px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--gold))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '24px'
                }}>
                  {selectedUser.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{selectedUser.name}</div>
                {githubData && (
                  <div style={{ color: 'var(--text2)', fontSize: '13px' }}>{'@' + githubData.login}</div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
              <StatBadge label="Score" value={selectedUser.score} color="var(--primary)" />
              <StatBadge label="Rank" value={'#' + (selectedUser.rank || 9999)} color="var(--gold)" />
              <StatBadge label="Problems" value={selectedUser.problems || 0} color="var(--purple)" />
            </div>
          </div>

          {profileLoading && (
            <div style={{ textAlign: 'center', color: 'var(--primary)', padding: '20px' }}>
              Loading...
            </div>
          )}

          {githubData && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <div className="card-title">GITHUB</div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
                <StatBadge label="Repos" value={githubData.public_repos} color="var(--primary)" />
                <StatBadge label="Followers" value={githubData.followers} color="var(--gold)" />
                <StatBadge label="Following" value={githubData.following} color="var(--text2)" />
              </div>
              
                href={githubData.html_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-block', marginTop: '12px',
                  color: 'var(--primary)', fontSize: '12px',
                  textDecoration: 'none', border: '1px solid var(--primary)',
                  padding: '4px 12px', borderRadius: '4px'
                }}
              >
                View GitHub Profile
              </a>
            </div>
          )}

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

          {!profileLoading && !githubData && !leetcodeData && (
            <div className="card" style={{ textAlign: 'center', padding: '25px' }}>
              <div style={{ color: 'var(--text2)', fontSize: '14px' }}>
                Platforms connect nahi kiye
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
