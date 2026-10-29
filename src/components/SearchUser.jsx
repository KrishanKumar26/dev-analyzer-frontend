import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const SearchUser = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setSearchResults([]);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/user/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Search failed');
      
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active">
      <div className="card">
        <div className="card-title">🔍 SEARCH USERS</div>

        <form onSubmit={handleSearch} style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)'
              }}
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,0,0,0.1)', borderRadius: '8px', color: 'red' }}>
            {error}
          </div>
        )}

        {searchResults.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Results ({searchResults.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {searchResults.map((result) => (
                <div 
                  key={result.id || result.name} 
                  className="lb-row"
                >
                  <div className="lb-info" style={{ flex: 1 }}>
                    <div className="lb-name">{result.name}</div>
                    <div className="lb-platform">{result.githubUsername || result.leetcodeUsername || 'User'}</div>
                  </div>
                  <div className="lb-score">Score: {result.score || 0}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && searchResults.length === 0 && searchQuery && !error && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
            No users found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUser;
