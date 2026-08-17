import React, { useState, useEffect } from 'react';
import { exportTextPDF } from '../utils/export';
import { useApp } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const PLATFORM_META = [
  { key: 'githubScore', label: 'GitHub', user: 'githubUsername' },
  { key: 'leetcodeScore', label: 'LeetCode', user: 'leetcodeUsername' },
  { key: 'codeforcesScore', label: 'Codeforces', user: 'codeforcesUsername' },
  { key: 'hackerrankScore', label: 'HackerRank', user: 'hackerrankUsername' },
];

const AIPortfolio = ({ user }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [profile, setProfile] = useState(null);
  const { addToast } = useApp();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API_URL}/api/user/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setProfile)
      .catch(() => {});
  }, []);

  const p = profile || {};
  const name = p.name || user?.name || 'Developer';
  const score = p.score ?? user?.score ?? 0;
  const rank = p.rank ?? user?.rank ?? 9999;
  const streak = p.streak ?? user?.streak ?? 0;
  const problems = p.problems ?? 0;

  // Real per-platform breakdown
  const connected = PLATFORM_META.filter(m => p[m.user]);
  const withScores = PLATFORM_META.map(m => ({ label: m.label, score: p[m.key] || 0 }));
  const strongest = withScores.reduce((a, b) => (b.score > a.score ? b : a), { label: '', score: 0 });
  const notConnected = PLATFORM_META.filter(m => !p[m.user]).map(m => m.label);

  const summaryText =
    `${name} is a developer with a global rank of #${rank} and a Dev Score of ${score.toLocaleString()}. ` +
    `Across ${connected.length} connected platform${connected.length === 1 ? '' : 's'}, they have solved ${problems.toLocaleString()} problems` +
    (strongest.score > 0 ? `, with ${strongest.label} as their strongest area.` : '.') +
    ` Consistent practice and a growing problem-solving portfolio make them a strong, well-rounded engineer.`;

  // Real insight cards
  const insights = [];
  if (strongest.score > 0) {
    insights.push({
      tag: 'Key Strength', tagClass: 'tag-strength', title: `${strongest.label} Powerhouse`,
      body: `${strongest.label} contributes the most to your Dev Score (${strongest.score.toLocaleString()} pts). Keep leading here.`,
    });
  }
  insights.push({
    tag: 'Impact', tagClass: 'tag-tip', title: `${problems.toLocaleString()} Problems Solved`,
    body: problems > 0
      ? `You've solved ${problems.toLocaleString()} problems across your platforms. Rank #${rank} globally.`
      : `Sync your stats to see your total problems solved and climb the leaderboard.`,
  });
  insights.push(
    notConnected.length > 0
      ? {
          tag: 'Opportunity', tagClass: 'tag-opportunity', title: 'Connect More Platforms',
          body: `Add ${notConnected.join(', ')} in your profile to boost your Dev Score and complete your portfolio.`,
        }
      : {
          tag: 'Opportunity', tagClass: 'tag-opportunity', title: 'All Platforms Connected',
          body: `Great — all 4 platforms are connected. Keep solving to push your score past ${(score + 1000).toLocaleString()}.`,
        }
  );

  const generateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPortfolio(true);
    }, 1000);
  };

  const handleDownloadPDF = () => {
    exportTextPDF({
      title: `${name} - Developer Portfolio`,
      paragraphs: [
        summaryText,
        `Global Rank: #${rank}`,
        `Dev Score: ${score.toLocaleString()}`,
        `Problems Solved: ${problems.toLocaleString()}`,
        `Strongest Platform: ${strongest.score > 0 ? strongest.label : 'N/A'}`,
      ],
      filename: `${name.replace(/\s+/g, '-').toLowerCase()}-portfolio`,
    });
    addToast('Portfolio exported as PDF', 'success');
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}?profile=${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(url).then(() => {
      addToast('Shareable link copied to clipboard', 'success');
    }).catch(() => {
      addToast('Could not copy link', 'warning');
    });
  };

  return (
    <div className="page active rel">
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <h2 className="greeting">AI <span>Portfolio</span> Generator</h2>
        <p style={{ color: 'var(--text2)', margin: '15px 0' }}>
          We analyze your real GitHub, LeetCode, Codeforces and HackerRank stats to build a professional pitch.
        </p>

        {!showPortfolio ? (
          <button
            className="btn-primary"
            style={{ width: 'auto', padding: '12px 30px' }}
            onClick={generateAI}
            disabled={isGenerating}
          >
            {isGenerating ? "Analyzing your data..." : "✨ Generate AI Portfolio"}
          </button>
        ) : (
          <div className="insight-card" style={{ textAlign: 'left', marginTop: '20px', border: '1px solid var(--primary)' }}>
            <span className="tag tag-strength">PORTFOLIO SUMMARY</span>
            <p className="insight-body" style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text)' }}>
              "{summaryText}"
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button className="refresh-btn" onClick={handleDownloadPDF}>📥 Download PDF</button>
              <button className="refresh-btn" style={{ borderColor: 'var(--accent2)', color: 'var(--accent2)' }} onClick={handleCopyLink}>🔗 Copy Shareable Link</button>
            </div>
          </div>
        )}
      </div>

      <div className="three-col" style={{ marginTop: '20px' }}>
        {insights.map((ins, i) => (
          <div className="insight-card" key={i}>
            <span className={`tag ${ins.tagClass}`}>{ins.tag}</span>
            <div className="insight-title">{ins.title}</div>
            <div className="insight-body">{ins.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIPortfolio;
