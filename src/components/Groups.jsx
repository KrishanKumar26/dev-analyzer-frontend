import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Groups = () => {
  const [myGroups, setMyGroups] = useState([]);
  const [selected, setSelected] = useState(null); // { name, code, leaderboard }
  const [createName, setCreateName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const token = localStorage.getItem('token');

  const authFetch = (path, opts = {}) =>
    fetch(`${API_URL}${path}`, {
      ...opts,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
    });

  const loadMine = async () => {
    try {
      const res = await authFetch('/api/groups/mine');
      const data = await res.json();
      if (Array.isArray(data)) setMyGroups(data);
    } catch (e) { /* ignore */ }
  };

  useEffect(() => { loadMine(); }, []);

  const openGroup = async (code) => {
    setBusy(true);
    try {
      const res = await authFetch(`/api/groups/${code}/leaderboard`);
      const data = await res.json();
      if (res.ok) setSelected(data);
    } catch (e) { /* ignore */ } finally { setBusy(false); }
  };

  const createGroup = async () => {
    if (!createName.trim()) return;
    setBusy(true); setMsg('');
    try {
      const res = await authFetch('/api/groups/create', { method: 'POST', body: JSON.stringify({ name: createName }) });
      const data = await res.json();
      if (res.ok) {
        setMsg(`✅ "${data.name}" created! Code: ${data.code} — share with friends`);
        setCreateName('');
        await loadMine();
      } else setMsg('❌ ' + (data.error || 'Failed'));
    } catch (e) { setMsg('❌ Failed'); } finally { setBusy(false); }
  };

  const joinGroup = async () => {
    if (!joinCode.trim()) return;
    setBusy(true); setMsg('');
    try {
      const res = await authFetch('/api/groups/join', { method: 'POST', body: JSON.stringify({ code: joinCode }) });
      const data = await res.json();
      if (res.ok) {
        setMsg(`✅ Joined "${data.name}"`);
        setJoinCode('');
        await loadMine();
        openGroup(data.code);
      } else setMsg('❌ ' + (data.error || 'Group not found'));
    } catch (e) { setMsg('❌ Failed'); } finally { setBusy(false); }
  };

  const leaveGroup = async (code) => {
    if (!window.confirm('Leave this group?')) return;
    await authFetch(`/api/groups/${code}/leave`, { method: 'DELETE' });
    if (selected?.code === code) setSelected(null);
    loadMine();
  };

  const medal = (i) => (i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`);

  return (
    <div className="page active" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
      
      {/* Hero Header */}
      <div style={{
        background: 'var(--bg2)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          fontSize: '56px',
          filter: 'drop-shadow(0 4px 12px rgba(0, 229, 160, 0.3))'
        }}>👥</div>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            marginBottom: '6px',
            color: 'var(--text)',
            letterSpacing: '-0.5px'
          }}>
            Developer <span style={{ 
              color: 'var(--accent)'
            }}>Communities</span>
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text2)', marginBottom: '0' }}>
            Build your circle. Compete together. Grow faster.
          </p>
        </div>
      </div>

      {/* Create + Join Groups */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        {/* Create Group */}
        <div style={{
          background: 'var(--bg2)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>➕</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '2px', color: 'var(--text)' }}>
                Create a group
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '0' }}>
                Start your own developer community and invite others.
              </p>
            </div>
          </div>
          
          <input 
            value={createName} 
            onChange={(e) => setCreateName(e.target.value)} 
            placeholder="Group Name"
            style={{ 
              width: '100%',
              padding: '12px 14px', 
              background: 'var(--bg)', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              color: 'var(--text)',
              fontSize: '14px',
              marginBottom: '8px'
            }} 
          />
          
          <input 
            placeholder="Optional Description..."
            style={{ 
              width: '100%',
              padding: '12px 14px', 
              background: 'var(--bg)', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              color: 'var(--text)',
              fontSize: '14px',
              marginBottom: '12px'
            }} 
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: '600' }}>👁️ Visibility:</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="radio" name="visibility" value="private" defaultChecked />
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>Private</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="radio" name="visibility" value="public" />
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>Public</span>
            </label>
          </div>

          <button 
            onClick={createGroup} 
            disabled={busy}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: busy ? 'not-allowed' : 'pointer',
              opacity: busy ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            🎯 Create Group →
          </button>
        </div>

        {/* Join Group */}
        <div style={{
          background: 'var(--bg2)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--accent2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>🔗</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '2px', color: 'var(--text)' }}>
                Join a group
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '0' }}>
                Enter a group invite code to join.
              </p>
            </div>
          </div>
          
          <input 
            value={joinCode} 
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())} 
            placeholder="# Group Invite Code"
            style={{ 
              width: '100%',
              padding: '12px 14px', 
              background: 'var(--bg)', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              color: 'var(--text)',
              fontSize: '14px',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }} 
          />

          <button 
            onClick={joinGroup} 
            disabled={busy}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--accent2)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: busy ? 'not-allowed' : 'pointer',
              opacity: busy ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            🚪 Join Group
          </button>
        </div>
      </div>

      {msg && (
        <div style={{ 
          marginBottom: '1.5rem', 
          padding: '14px 18px', 
          background: msg.includes('✅') ? 'rgba(0, 229, 160, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: msg.includes('✅') ? '1px solid rgba(0, 229, 160, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '10px',
          color: msg.includes('✅') ? '#00e5a0' : '#ef4444',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {msg}
        </div>
      )}

      {/* Your Groups */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            👥 Your Groups
          </h2>
          <a href="#" style={{ 
            fontSize: '13px', 
            color: 'var(--accent)', 
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            View All Groups →
          </a>
        </div>

        {myGroups.length === 0 ? (
          <div style={{
            background: 'var(--bg2)',
            borderRadius: '12px',
            padding: '3rem 2rem',
            textAlign: 'center',
            border: '1px dashed var(--border)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
            <p style={{ fontSize: '15px', color: 'var(--text2)', marginBottom: '8px' }}>
              You haven't joined any groups yet
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text3)' }}>
              Create or join a group above to start competing
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1rem'
          }}>
            {myGroups.map((g) => {
              const isAdmin = true; // You can track admin status from backend
              const isSelected = selected?.code === g.code;
              
              return (
                <div 
                  key={g.code}
                  onClick={() => openGroup(g.code)}
                  style={{
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(0, 229, 160, 0.1) 0%, rgba(123, 97, 255, 0.1) 100%)'
                      : 'var(--bg2)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    border: isSelected ? '2px solid #00e5a0' : '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {isAdmin && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '4px 10px',
                      background: 'linear-gradient(135deg, #ffd700 0%, #ffa500 100%)',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#000'
                    }}>
                      👑 Admin
                    </div>
                  )}

                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    marginBottom: '12px'
                  }}>
                    🏛️
                  </div>

                  <h3 style={{ 
                    fontSize: '17px', 
                    fontWeight: '700', 
                    marginBottom: '8px',
                    color: 'var(--text)'
                  }}>
                    {g.name}
                  </h3>
                  
                  <p style={{ 
                    fontSize: '13px', 
                    color: 'var(--text2)', 
                    marginBottom: '12px',
                    lineHeight: '1.4'
                  }}>
                    {g.description || 'Coding. Learning. Competing.'}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    marginBottom: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border)'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '2px' }}>Members</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)' }}>
                        👥 {g.members || '1.2K'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '2px' }}>Weekly Activity</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#00e5a0' }}>
                        ⚡ 24%
                      </div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '2px' }}>Rank</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffd700' }}>
                        🏆 #1
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}>
                    <div style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'rgba(0, 229, 160, 0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#00e5a0',
                      textAlign: 'center'
                    }}>
                      Progress: 78%
                    </div>
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        openGroup(g.code); 
                      }}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #00e5a0 0%, #7b61ff 100%)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Open Group →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Discover Communities */}
      <div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            🌟 Discover Communities
          </h2>
        </div>

        {/* Category Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          {['All', 'Data Structures', 'Full Stack', 'Open Source', 'Competitive Programming', 'Others'].map((cat, i) => (
            <button
              key={cat}
              style={{
                padding: '8px 16px',
                background: i === 0 ? 'var(--accent)' : 'var(--bg2)',
                color: i === 0 ? '#fff' : 'var(--text)',
                border: i === 0 ? 'none' : '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: i === 0 ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '1rem'
        }}>
          {[
            { name: 'Data Structures', desc: 'Sharpen your problem-solving skills together.', members: '2.8K', activity: '32%', icon: '{ }', color: 'var(--accent)' },
            { name: 'Full Stack', desc: 'Build modern web apps together.', members: '1.9K', activity: '28%', icon: '⚡', color: 'var(--accent2)' },
            { name: 'Open Source', desc: 'Contribute. Collaborate. Grow.', members: '1.1K', activity: '20%', icon: '</>', color: 'var(--primary)' }
          ].map((comm) => (
            <div 
              key={comm.name}
              style={{
                background: 'var(--bg2)',
                borderRadius: '14px',
                padding: '1.25rem',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = comm.color1;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: comm.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '12px',
                color: '#fff'
              }}>
                {comm.icon}
              </div>

              <h3 style={{ 
                fontSize: '17px', 
                fontWeight: '700', 
                marginBottom: '6px',
                color: 'var(--text)'
              }}>
                {comm.name}
              </h3>
              
              <p style={{ 
                fontSize: '13px', 
                color: 'var(--text2)', 
                marginBottom: '12px',
                lineHeight: '1.4'
              }}>
                {comm.desc}
              </p>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                  👥 {comm.members} Members
                </div>
                <div style={{ fontSize: '13px', color: '#00e5a0', fontWeight: '600' }}>
                  ⚡ {comm.activity} Activity
                </div>
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '10px',
                  background: comm.color,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Join Group →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Selected group leaderboard */}
      {selected && (
        <div style={{ marginTop: '2rem' }}>
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
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>
                🏅 {selected.name}
              </h3>
              <div style={{ 
                padding: '8px 16px',
                background: 'rgba(0, 229, 160, 0.1)',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#00e5a0',
                fontFamily: 'monospace',
                letterSpacing: '2px'
              }}>
                CODE: {selected.code}
              </div>
            </div>

            {(selected.leaderboard || []).length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem 2rem',
                color: 'var(--text2)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
                <p style={{ fontSize: '15px' }}>No members yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selected.leaderboard.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '14px 16px', 
                    borderRadius: '10px',
                    background: item.isMe 
                      ? 'linear-gradient(90deg, rgba(0, 229, 160, 0.15) 0%, rgba(0, 229, 160, 0.05) 100%)'
                      : 'var(--bg)',
                    border: item.isMe ? '2px solid #00e5a0' : '1px solid var(--border)',
                    gap: '14px'
                  }}>
                    <div style={{ 
                      fontSize: i < 3 ? '24px' : '16px',
                      fontWeight: '800',
                      minWidth: '40px',
                      color: item.isMe ? '#00e5a0' : 'var(--text)'
                    }}>
                      {medal(i)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '15px', 
                        fontWeight: '700',
                        color: 'var(--text)',
                        marginBottom: '2px'
                      }}>
                        {item.name} {item.isMe && <span style={{ color: '#00e5a0' }}>(You)</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
                        {item.problems} problems solved
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: '800',
                      color: item.isMe ? '#00e5a0' : '#7b61ff'
                    }}>
                      {(item.score || 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
