import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Real-world crisp SVG logos
const LeetCodeLogo = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="#FFA116">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.246 2.17 5.86 2.13 8.068-.088l5.44-5.441a1.365 1.365 0 1 0-1.93-1.93l-5.44 5.441a3.02 3.02 0 0 1-4.27-.047l-4.24-4.156a3.21 3.21 0 0 1-.726-1.026 3.167 3.167 0 0 1-.18-.545 3.09 3.09 0 0 1-.035-1.326 3.05 3.05 0 0 1 .684-1.18l3.844-4.116 5.38-5.764a1.373 1.373 0 0 0-.97-2.352zm2.083 8.01a1.366 1.366 0 0 0-.965.4l-5.44 5.44a1.365 1.365 0 1 0 1.93 1.93l5.44-5.44a1.366 1.366 0 0 0-.965-2.33z"/>
  </svg>
);

const GitHubLogo = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const ReactLogo = () => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" width={18} height={18}>
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2"/>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
    </g>
  </svg>
);

const CodeforcesLogo = () => (
  <svg viewBox="0 0 24 24" width={18} height={18}>
    <rect x="1.5" y="9" width="5" height="12" rx="1.5" fill="#FFD43B"/>
    <rect x="9.5" y="3" width="5" height="18" rx="1.5" fill="#3B82F6"/>
    <rect x="17.5" y="6.5" width="5" height="14.5" rx="1.5" fill="#EF4444"/>
  </svg>
);

const CloudLogo = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#7599BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
  </svg>
);

const BrainAILogo = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#C47C85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 .64.13 1.25.37 1.8A5 5 0 0 0 4 13a5 5 0 0 0 3.5 4.8A4.5 4.5 0 0 0 12 22a4.5 4.5 0 0 0 4.5-4.2A5 5 0 0 0 20 13a5 5 0 0 0-3.87-4.7A4.5 4.5 0 0 0 12 2Z"/>
    <path d="M12 6v12"/>
    <path d="M8 10h8"/>
    <path d="M7 14h10"/>
  </svg>
);

const UsersIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const PlusIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const KeyIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1.5-1.5L8 9l-1.5-1.5L5 9"/>
    <circle cx="15.5" cy="8.5" r="5.5"/>
  </svg>
);

const LockIcon = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

// Crisp, Punchy Curated Communities (Clean 1-sentence descriptions)
const DISCOVERY_COMMUNITIES = [
  {
    id: 'dsa-guild',
    name: 'DSA Problem Solving Guild',
    category: 'Algorithms',
    desc: 'Daily LeetCode medium & hard problem breakdowns.',
    members: '2,840',
    activity: '94%',
    logo: <LeetCodeLogo />,
    platform: 'LeetCode',
    accentColor: '#FFA116',
    code: 'DSA-75-ELITE'
  },
  {
    id: 'fullstack-syndicate',
    name: 'Full-Stack Architecture Club',
    category: 'Full Stack',
    desc: 'Production Next.js, Node microservices & UI systems.',
    members: '1,920',
    activity: '88%',
    logo: <ReactLogo />,
    platform: 'React & Node',
    accentColor: '#61DAFB',
    code: 'STACK-PRO-99'
  },
  {
    id: 'opensource-maintainers',
    name: 'Open-Source Core Maintainers',
    category: 'Open Source',
    desc: 'High-throughput kernels, developer tooling & SDKs.',
    members: '1,450',
    activity: '82%',
    logo: <GitHubLogo />,
    platform: 'GitHub',
    accentColor: '#FFFFFF',
    code: 'OPEN-SRC-DEV'
  },
  {
    id: 'competitive-arena',
    name: 'Competitive Programming Arena',
    category: 'Contests',
    desc: 'Div 1/2 contest practice, math puzzles & rating climb.',
    members: '3,210',
    activity: '96%',
    logo: <CodeforcesLogo />,
    platform: 'Codeforces',
    accentColor: '#3B82F6',
    code: 'CF-DIV1-CLIMB'
  },
  {
    id: 'system-design',
    name: 'Distributed Systems Guild',
    category: 'Architecture',
    desc: 'Raft consensus, database sharding & cloud scale.',
    members: '1,120',
    activity: '85%',
    logo: <CloudLogo />,
    platform: 'Cloud Arch',
    accentColor: '#7599BF',
    code: 'DIST-SYS-CORE'
  },
  {
    id: 'ai-agents',
    name: 'Applied AI & LLM Systems',
    category: 'AI Systems',
    desc: 'Autonomous agent loops, embeddings & model workflows.',
    members: '2,390',
    activity: '98%',
    logo: <BrainAILogo />,
    platform: 'AI Systems',
    accentColor: '#C47C85',
    code: 'AI-AGENT-LAB'
  }
];

// Pre-populated active groups for interview display
const INITIAL_MY_GROUPS = [
  {
    code: 'DSA-75-ELITE',
    name: 'LeetCode 75 Hardcore Grind',
    description: 'Daily LeetCode medium & hard algorithms sprint.',
    members: '48',
    weeklyActivity: '92%',
    rank: '#3',
    role: 'Admin',
    progress: 84,
    leaderboard: [
      { name: 'Krishan Kumar', problems: 142, score: 2480, isMe: false },
      { name: 'Alex Chen', problems: 128, score: 2210, isMe: false },
      { name: 'Krishan (You)', problems: 114, score: 1840, isMe: true },
      { name: 'Sarah Jenkins', problems: 98, score: 1720, isMe: false },
      { name: 'Virat Patel', problems: 86, score: 1540, isMe: false }
    ]
  },
  {
    code: 'DIST-SYS-CORE',
    name: 'Distributed Systems & Backend Guild',
    description: 'System design mock interviews & concurrency patterns.',
    members: '124',
    weeklyActivity: '88%',
    rank: '#2',
    role: 'Senior Member',
    progress: 76,
    leaderboard: [
      { name: 'Marcus Vance', problems: 96, score: 2190, isMe: false },
      { name: 'Krishan (You)', problems: 88, score: 1840, isMe: true },
      { name: 'Elena Rostova', problems: 74, score: 1680, isMe: false }
    ]
  }
];

const Groups = () => {
  const [myGroups, setMyGroups] = useState(INITIAL_MY_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createVisibility, setCreateVisibility] = useState('private');
  const [joinCode, setJoinCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [busy, setBusy] = useState(false);
  const { addToast } = useApp() || {};

  const handleCreateGroup = () => {
    if (!createName.trim()) {
      if (addToast) addToast('Please enter a circle name', 'warning');
      return;
    }

    setBusy(true);
    const newCode = `SYN-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newGroup = {
      code: newCode,
      name: createName.trim(),
      description: createDesc.trim() || 'Active developer study circle.',
      members: '1',
      weeklyActivity: '100%',
      rank: '#1',
      role: 'Founder',
      progress: 100,
      leaderboard: [
        { name: 'Krishan (You)', problems: 24, score: 1840, isMe: true }
      ]
    };

    setMyGroups(prev => [newGroup, ...prev]);
    setCreateName('');
    setCreateDesc('');
    setBusy(false);
    if (addToast) addToast(`Circle "${newGroup.name}" created! Code: ${newCode}`, 'success');
  };

  const handleJoinWithCode = () => {
    if (!joinCode.trim()) {
      if (addToast) addToast('Please enter an invite code', 'warning');
      return;
    }

    setBusy(true);
    const code = joinCode.trim().toUpperCase();

    if (myGroups.some(g => g.code === code)) {
      if (addToast) addToast('You are already in this circle', 'info');
      setBusy(false);
      return;
    }

    const matched = DISCOVERY_COMMUNITIES.find(c => c.code === code) || {
      name: `Private Circle [${code}]`,
      desc: 'Exclusive invite-only developer squad.',
      members: '32',
      code
    };

    const joined = {
      code,
      name: matched.name,
      description: matched.desc,
      members: matched.members,
      weeklyActivity: '89%',
      rank: '#4',
      role: 'Member',
      progress: 68,
      leaderboard: [
        { name: 'Krishan Kumar', problems: 94, score: 2310, isMe: false },
        { name: 'Elena Rostova', problems: 82, score: 1980, isMe: false },
        { name: 'Krishan (You)', problems: 76, score: 1840, isMe: true }
      ]
    };

    setMyGroups(prev => [joined, ...prev]);
    setJoinCode('');
    setBusy(false);
    if (addToast) addToast(`Joined "${joined.name}"!`, 'success');
  };

  const handleJoinCommunityCard = (comm) => {
    if (myGroups.some(g => g.code === comm.code)) {
      if (addToast) addToast(`Already enrolled in ${comm.name}`, 'info');
      return;
    }

    const newMembership = {
      code: comm.code,
      name: comm.name,
      description: comm.desc,
      members: comm.members,
      weeklyActivity: comm.activity,
      rank: '#3',
      role: 'Member',
      progress: 72,
      leaderboard: [
        { name: 'Krishan Kumar', problems: 110, score: 2420, isMe: false },
        { name: 'Alex Chen', problems: 95, score: 2180, isMe: false },
        { name: 'Krishan (You)', problems: 84, score: 1840, isMe: true }
      ]
    };

    setMyGroups(prev => [newMembership, ...prev]);
    if (addToast) addToast(`Joined ${comm.name}!`, 'success');
  };

  const filteredCommunities = selectedCategory === 'All'
    ? DISCOVERY_COMMUNITIES
    : DISCOVERY_COMMUNITIES.filter(c => c.category === selectedCategory);

  const categories = ['All', 'Algorithms', 'Full Stack', 'Open Source', 'Contests', 'Architecture', 'AI Systems'];

  return (
    <div className="page active rel" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 60px' }}>
      
      {/* ATMOSPHERIC COMPACT HERO */}
      <div className="overview-hero" style={{ marginBottom: '20px' }}>
        <div className="overview-hero-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div className="pill-badge mocha">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C89B7B', animation: 'liveRadar 2s infinite' }}></span>
              <span>PEER SYNDICATES</span>
            </div>
            <span className="pill-badge neutral">
              <span>{myGroups.length} Enrolled</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(104, 83, 75, 0.25)',
              border: '1px solid rgba(200, 155, 123, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C89B7B'
            }}>
              <UsersIcon />
            </div>
            <div>
              <h1 className="overview-hero-title" style={{ margin: 0, fontSize: '26px' }}>
                Developer Communities
              </h1>
              <p className="overview-hero-subtitle" style={{ margin: '3px 0 0', fontSize: '13.5px' }}>
                Compete in peer circles, track collective milestones, and climb private rankings.
              </p>
            </div>
          </div>
        </div>

        {/* Compact Right Stats */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'linear-gradient(180deg, #1D1714 0%, #14100E 100%)',
            border: '1px solid rgba(168, 140, 130, 0.22)',
            borderRadius: '12px',
            padding: '10px 16px',
            minWidth: '110px'
          }}>
            <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>
              GLOBAL CIRCLES
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--mono)' }}>
              36+
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(180deg, #1D1714 0%, #14100E 100%)',
            border: '1px solid rgba(200, 155, 123, 0.35)',
            borderRadius: '12px',
            padding: '10px 16px',
            minWidth: '110px'
          }}>
            <div style={{ fontSize: '10px', color: '#C89B7B', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>
              ACTIVITY RATE
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#8EDBB1', fontFamily: 'var(--mono)' }}>
              94%
            </div>
          </div>
        </div>
      </div>

      {/* CREATE & JOIN SQUADS (SIDE-BY-SIDE CRISP CARDS) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Create Circle Card */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'rgba(200, 155, 123, 0.16)',
              border: '1px solid rgba(200, 155, 123, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C89B7B'
            }}>
              <PlusIcon />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                Create Circle
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text3)', margin: 0 }}>
                Host a private syndicate for your team or cohort.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
            <input
              type="text"
              placeholder="Circle Name (e.g. LeetCode Grind)"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(168, 140, 130, 0.22)',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#FFFFFF'
              }}
            />
            <input
              type="text"
              placeholder="Description (Optional)"
              value={createDesc}
              onChange={(e) => setCreateDesc(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(168, 140, 130, 0.22)',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#FFFFFF'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setCreateVisibility('private')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: createVisibility === 'private' ? 'rgba(200, 155, 123, 0.2)' : 'transparent',
                  color: createVisibility === 'private' ? '#C89B7B' : 'var(--text3)',
                  border: createVisibility === 'private' ? '1px solid rgba(200, 155, 123, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <LockIcon /> Private Invite
              </button>
              <button
                type="button"
                onClick={() => setCreateVisibility('public')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: createVisibility === 'public' ? 'rgba(94, 168, 128, 0.2)' : 'transparent',
                  color: createVisibility === 'public' ? '#8EDBB1' : 'var(--text3)',
                  border: createVisibility === 'public' ? '1px solid rgba(94, 168, 128, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                Public Circle
              </button>
            </div>
          </div>

          <button
            onClick={handleCreateGroup}
            disabled={busy}
            className="btn-chaicode-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px' }}
          >
            <span>Create Circle →</span>
          </button>
        </div>

        {/* Join with Code Card */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                background: 'rgba(117, 153, 191, 0.16)',
                border: '1px solid rgba(117, 153, 191, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7599BF'
              }}>
                <KeyIcon />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                  Join with Code
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text3)', margin: 0 }}>
                  Enter an invite code shared by your peers.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  fontFamily: 'var(--mono)',
                  color: '#C89B7B',
                  fontWeight: '700',
                  fontSize: '13px'
                }}>
                  #
                </span>
                <input
                  type="text"
                  placeholder="INVITE CODE (e.g. DSA-75-ELITE)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 28px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(168, 140, 130, 0.22)',
                    borderRadius: '8px',
                    fontFamily: 'var(--mono)',
                    letterSpacing: '1px',
                    fontSize: '13px',
                    color: '#FFFFFF',
                    textTransform: 'uppercase'
                  }}
                />
              </div>
            </div>

            <div style={{
              fontSize: '11.5px',
              color: 'var(--text3)',
              marginBottom: '14px'
            }}>
              ✦ Auto-syncs your stats to the circle leaderboard.
            </div>
          </div>

          <button
            onClick={handleJoinWithCode}
            disabled={busy}
            className="btn-chaicode-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px' }}
          >
            <span>Join Circle →</span>
          </button>
        </div>
      </div>

      {/* YOUR JOINED CIRCLES SECTION */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
              Your Circles
            </h2>
            <span className="pill-badge mocha" style={{ fontSize: '10.5px', padding: '2px 8px' }}>
              {myGroups.length} Enrolled
            </span>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text3)' }}>
            Real-Time Peer Rankings
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '16px'
        }}>
          {myGroups.map((g) => (
            <div
              key={g.code}
              className="card"
              onClick={() => setSelectedGroup(g)}
              style={{
                padding: '18px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: selectedGroup?.code === g.code ? '1px solid #D4A373' : '1px solid rgba(168, 140, 130, 0.22)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(104, 83, 75, 0.25)',
                    border: '1px solid rgba(200, 155, 123, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {g.name.includes('LeetCode') ? <LeetCodeLogo /> : g.name.includes('System') ? <CloudLogo /> : <UsersIcon />}
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span className="pill-badge mocha" style={{ fontSize: '10px', padding: '2px 6px' }}>
                      {g.role || 'Member'}
                    </span>
                    <span className="pill-badge neutral" style={{ fontSize: '10px', padding: '2px 6px', fontFamily: 'var(--mono)' }}>
                      #{g.code}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '15.5px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 4px' }}>
                  {g.name}
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text2)', margin: '0 0 12px', lineHeight: '1.4' }}>
                  {g.description}
                </p>
              </div>

              <div>
                {/* Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '6px',
                  padding: '8px 10px',
                  background: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(168, 140, 130, 0.15)',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>MEMBERS</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF' }}>{g.members}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>ACTIVITY</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#8EDBB1' }}>{g.weeklyActivity}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>RANK</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#D4A373' }}>{g.rank}</div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-chaicode-secondary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '12px', padding: '7px' }}
                >
                  <span>Leaderboard ↗</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DISCOVER COMMUNITIES */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
              Discover Communities
            </h2>
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '4px 10px',
                  background: selectedCategory === cat ? 'rgba(212, 163, 115, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedCategory === cat ? '#D4A373' : 'var(--text2)',
                  border: selectedCategory === cat ? '1px solid #D4A373' : '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: selectedCategory === cat ? '700' : '500',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Community Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '14px'
        }}>
          {filteredCommunities.map((comm) => {
            const isAlreadyJoined = myGroups.some(g => g.code === comm.code);

            return (
              <div
                key={comm.id}
                className="card"
                style={{
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(168, 140, 130, 0.24)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {comm.logo}
                    </div>

                    <div style={{ display: 'flex', gap: '5px' }}>
                      <span className="pill-badge mocha" style={{ fontSize: '9.5px', padding: '2px 6px' }}>
                        {comm.platform}
                      </span>
                      <span className="pill-badge neutral" style={{ fontSize: '9.5px', padding: '2px 6px' }}>
                        {comm.category}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 4px' }}>
                    {comm.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text2)', margin: '0 0 12px', lineHeight: '1.4' }}>
                    {comm.desc}
                  </p>
                </div>

                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11.5px',
                    color: 'var(--text3)',
                    marginBottom: '10px'
                  }}>
                    <span>{comm.members} Members</span>
                    <span style={{ color: '#8EDBB1', fontWeight: '600' }}>{comm.activity} Pace</span>
                  </div>

                  <button
                    onClick={() => handleJoinCommunityCard(comm)}
                    disabled={isAlreadyJoined}
                    className={isAlreadyJoined ? 'btn-chaicode-secondary' : 'btn-chaicode-primary'}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '8px',
                      fontSize: '12px',
                      opacity: isAlreadyJoined ? 0.7 : 1
                    }}
                  >
                    <span>{isAlreadyJoined ? 'Joined ✓' : 'Join Circle →'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LEADERBOARD MODAL */}
      {selectedGroup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setSelectedGroup(null)}>
          <div
            className="card"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '24px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="pill-badge mocha" style={{ marginBottom: '6px' }}>#{selectedGroup.code}</span>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                  {selectedGroup.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text2)',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(selectedGroup.leaderboard || []).map((user, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: user.isMe ? 'rgba(104, 83, 75, 0.25)' : 'rgba(255, 255, 255, 0.02)',
                    border: user.isMe ? '1px solid #D4A373' : '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: '800', fontSize: '12px', color: idx === 0 ? '#E6B86A' : '#D4A373' }}>
                      #{idx + 1}
                    </span>
                    <span style={{ fontWeight: '600', fontSize: '13.5px', color: '#FFFFFF' }}>
                      {user.name}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#D4A373', fontFamily: 'var(--mono)' }}>
                    {user.score} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Groups;