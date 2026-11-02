import React, { useState, useEffect } from 'react';
import { SkeletonStatsGrid } from './Skeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Activity = () => {
  const [profile, setProfile] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [hackerrankData, setHackerrankData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);
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
      fetchContests();
      
      // Mock recent activity
      setRecentActivity([
        {
          type: 'commit',
          platform: 'GitHub',
          title: 'Pushed 3 commits to KrishanKumar26/dev-analyzer-frontend',
          time: '2 hours ago',
          sha: 'a1b2c3d',
          icon: '👤'
        },
        {
          type: 'pr',
          platform: 'GitHub',
          title: 'Opened a Pull Request in citypulse-os',
          time: '4 hours ago',
          number: '#42',
          icon: '🔀'
        },
        {
          type: 'star',
          platform: 'GitHub',
          title: 'Starred awesome-project',
          time: '1 day ago',
          icon: '⭐'
        }
      ]);

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
      const res = await authGet(`/api/user/leetcode/${username}`);
      const data = await res.json();
      if (res.ok) {
        const stats = data?.data?.matchedUser?.submitStats?.acSubmissionNum || [];
        setLeetcodeData({
          totalSolved: stats.find(s => s.difficulty === 'All')?.count || 0,
          easySolved: stats.find(s => s.difficulty === 'Easy')?.count || 0,
          mediumSolved: stats.find(s => s.difficulty === 'Medium')?.count || 0,
          hardSolved: stats.find(s => s.difficulty === 'Hard')?.count || 0,
        });
      }
    } catch (err) {
      console.error('LeetCode error:', err);
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

  const fetchHackerrank = async (username) => {
    try {
      const res = await authGet(`/api/user/hackerrank/${username}`);
      const data = await res.json();
      if (res.ok && !data.error) setHackerrankData(data);
    } catch (err) {
      console.error('HackerRank error:', err);
    }
  };

  const fetchContests = async () => {
    try {
      const res = await authGet('/api/user/contests');
      const data = await res.json();
      if (Array.isArray(data)) {
        setUpcomingContests(data.slice(0, 3));
      } else {
        // Mock data if API fails
        setUpcomingContests([
          { platform: 'Codeforces', name: 'Round #968', date: 'Nov 6, 2026', daysLeft: 4, color: '#2196f3' },
          { platform: 'LeetCode', name: 'Weekly Contest 451', date: 'Nov 8, 2026', daysLeft: 6, color: '#ffa116' },
          { platform: 'HackerRank', name: 'Weekly Challenge', date: 'Nov 9, 2026', daysLeft: 7, color: '#00c875' }
        ]);
      }
    } catch (e) {
      setUpcomingContests([
        { platform: 'Codeforces', name: 'Round #968', date: 'Nov 6, 2026', daysLeft: 4, color: '#2196f3' },
        { platform: 'LeetCode', name: 'Weekly Contest 451', date: 'Nov 8, 2026', daysLeft: 6, color: '#ffa116' },
        { platform: 'HackerRank', name: 'Weekly Challenge', date: 'Nov 9, 2026', daysLeft: 7, color: '#00c875' }
      ]);
    }
  };

  if (loading) {
    return (
      <div className="page active">
        <SkeletonStatsGrid count={4} />
      </div>
    );
  }

  const isGithubConnected = !!githubData;
  const isLeetcodeConnected = !!leetcodeData;
  const isCodeforcesConnected = !!codeforcesData;
  const isHackerrankConnected = !!hackerrankData;

  return (
    <div className="page active" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
      
      {/* Hero Header */}
      <div style={{
        background: 'var(--bg2)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid var(--border2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            boxShadow: '0 8px 24px rgba(0, 229, 160, 0.2)'
          }}>
            ⚡
          </div>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '800',
              marginBottom: '6px',
              color: 'var(--text)',
              letterSpacing: '-0.5px'
            }}>
              Developer <span style={{ 
                color: 'var(--primary)'
              }}>Activity</span>
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text2)', marginBottom: '0' }}>
              Your coding footprint across platforms
            </p>
          </div>
        </div>

        <div style={{
          fontStyle: 'italic',
          fontSize: '18px',
          color: 'var(--text)',
          fontWeight: '500',
          textAlign: 'right'
        }}>
          Code. Contribute. Grow.
        </div>
      </div>

      {/* GitHub Overview */}
      {isGithubConnected && (
        <div style={{
          background: 'var(--bg2)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#24292e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px', color: 'var(--text)' }}>
                GitHub Overview
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '0' }}>
                Track your GitHub contributions and activity
              </p>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
            gap: '12px' 
          }}>
            <div style={{
              background: 'var(--bg3)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--primary)', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                📚 Public Repositories
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text)', marginBottom: '4px' }}>
                {githubData.public_repos || 12}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>
                ▲ +1
              </div>
            </div>

            <div style={{
              background: 'var(--bg3)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--accent2)', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                👥 Followers
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text)', marginBottom: '4px' }}>
                {githubData.followers || 248}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>
                ▲ +12
              </div>
            </div>

            <div style={{
              background: 'var(--bg3)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--gold)', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                💫 Contributions (YTD)
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text)', marginBottom: '4px' }}>
                482
              </div>
              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>
                ▲ +36
              </div>
            </div>

            <div style={{
              background: 'var(--bg3)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--gold)', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⭐ Total Stars
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text)', marginBottom: '4px' }}>
                1.2k
              </div>
              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>
                ▲ +120
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Platform Connection Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* GitHub Card */}
        <div style={{
          background: 'var(--bg2)',
          borderRadius: '14px',
          padding: '1.25rem',
          border: isGithubConnected ? '2px solid var(--primary)' : '1px solid var(--border)',
          position: 'relative'
        }}>
          {isGithubConnected && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              padding: '4px 10px',
              background: 'var(--primary)',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ✓ Connected
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#24292e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text)' }}>GitHub</h3>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px', lineHeight: '1.4' }}>
            Track commits, pull requests and repositories.
          </p>

          {isGithubConnected && (
            <div style={{ 
              display: 'flex', 
              gap: '16px',
              marginBottom: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '2px' }}>📁 12 Repos</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '2px' }}>⭐ 1.2k Stars</div>
              </div>
            </div>
          )}

          <button
            style={{
              width: '100%',
              padding: '10px',
              background: isGithubConnected ? 'var(--primary)' : 'var(--bg3)',
              color: isGithubConnected ? '#000' : 'var(--primary)',
              border: isGithubConnected ? 'none' : '1px solid var(--border2)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {isGithubConnected ? 'View Profile →' : '🔗 Connect Account'}
          </button>
        </div>

        {/* LeetCode Card */}
        <div style={{
          background: 'var(--bg2)',
          borderRadius: '14px',
          padding: '1.25rem',
          border: isLeetcodeConnected ? '2px solid var(--primary)' : '1px solid var(--border)',
          position: 'relative'
        }}>
          {!isLeetcodeConnected && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              padding: '4px 10px',
              background: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#ef4444'
            }}>
              Not Connected
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#000',
              fontWeight: '800'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text)' }}>LeetCode</h3>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px', lineHeight: '1.4' }}>
            Sync your LeetCode profile to track problems solved.
          </p>

          <button
            style={{
              width: '100%',
              padding: '10px',
              background: 'var(--accent2)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🔗 Connect Account
          </button>
        </div>

        {/* Codeforces Card */}
        <div style={{
          background: 'var(--bg2)',
          borderRadius: '14px',
          padding: '1.25rem',
          border: isCodeforcesConnected ? '2px solid var(--primary)' : '1px solid var(--border)',
          position: 'relative'
        }}>
          {!isCodeforcesConnected && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              padding: '4px 10px',
              background: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#ef4444'
            }}>
              Not Connected
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--accent2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#fff',
              fontWeight: '800'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text)' }}>Codeforces</h3>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px', lineHeight: '1.4' }}>
            Connect to view your Codeforces rating and activity.
          </p>

          <button
            style={{
              width: '100%',
              padding: '10px',
              background: 'var(--accent2)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🔗 Connect Account
          </button>
        </div>

        {/* HackerRank Card */}
        <div style={{
          background: 'var(--bg2)',
          borderRadius: '14px',
          padding: '1.25rem',
          border: isHackerrankConnected ? '2px solid var(--primary)' : '1px solid var(--border)',
          position: 'relative'
        }}>
          {!isHackerrankConnected && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              padding: '4px 10px',
              background: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#ef4444'
            }}>
              Not Connected
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#fff',
              fontWeight: '800'
            }}>
              HR
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text)' }}>HackerRank</h3>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px', lineHeight: '1.4' }}>
            Link your HackerRank account to track your performance.
          </p>

          <button
            style={{
              width: '100%',
              padding: '10px',
              background: 'var(--primary)',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🔗 Connect Account
          </button>
        </div>
      </div>

      {/* Recent Activity & Upcoming Contests */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Recent GitHub Activity */}
        <div style={{
          background: 'var(--bg2)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid var(--border)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Recent GitHub Activity
            </h3>
            <a href="#" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
              View All Activity →
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentActivity.map((activity, i) => (
              <div 
                key={i}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '12px',
                  background: 'var(--bg)',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #00e5a0 0%, #7b61ff 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  flexShrink: 0
                }}>
                  {activity.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
                    {activity.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
                    {activity.time}
                  </div>
                </div>
                {activity.sha && (
                  <div style={{
                    padding: '4px 10px',
                    background: 'var(--bg3)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--primary)',
                    fontFamily: 'monospace'
                  }}>
                    {activity.sha}
                  </div>
                )}
                {activity.number && (
                  <div style={{
                    padding: '4px 10px',
                    background: 'var(--bg3)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--accent2)',
                    fontFamily: 'monospace'
                  }}>
                    {activity.number}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Contests */}
        <div style={{
          background: 'var(--bg2)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid var(--border)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              🏆 Upcoming Coding Contests
            </h3>
            <a href="#" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
              View All →
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcomingContests.map((contest, i) => {
              const icons = {
                'Codeforces': '▊',
                'LeetCode': '◉',
                'HackerRank': 'HR'
              };
              
              return (
                <div 
                  key={i}
                  style={{
                    padding: '14px',
                    background: 'var(--bg3)',
                    borderRadius: '10px',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: contest.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '800',
                      color: '#fff',
                      flexShrink: 0
                    }}>
                      {icons[contest.platform]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: contest.color, marginBottom: '4px' }}>
                        {contest.platform}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)', marginBottom: '6px' }}>
                        {contest.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text2)' }}>
                        <span>📅 {contest.date}</span>
                        <span style={{ color: 'var(--primary)', fontWeight: '600' }}>⏰ In {contest.daysLeft} days</span>
                      </div>
                    </div>
                    <button
                      style={{
                        padding: '8px 16px',
                        background: contest.color,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      View Contest →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Activity;
