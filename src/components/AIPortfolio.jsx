import React, { useState } from 'react';
import { exportTextPDF } from '../utils/export';
import { useApp } from '../context/AppContext';

const AIPortfolio = ({ user }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const { addToast } = useApp();

  const score = user?.score ?? 0;
  const rank = user?.rank ?? 9999;
  const streak = user?.streak ?? 0;
  const name = user?.name || 'Developer';

  const summaryText = `${name} is a developer with a global rank of #${rank}. With a Dev Score of ${score} and a ${streak}-day activity streak, they demonstrate consistent engagement across GitHub, LeetCode, and other tracked platforms. Keep building your streak and solving problems to climb the leaderboard.`;

  const generateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPortfolio(true);
    }, 1200);
  };

  const handleDownloadPDF = () => {
    exportTextPDF({
      title: `${name} - Developer Portfolio`,
      paragraphs: [
        summaryText,
        `Global Rank: #${rank}`,
        `Dev Score: ${score}`,
        `Current Streak: ${streak} days`,
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
          We analyze your GitHub commits, LeetCode ratings, and streaks to build a professional pitch.
        </p>
        
        {!showPortfolio ? (
          <button 
            className="btn-primary" 
            style={{ width: 'auto', padding: '12px 30px' }}
            onClick={generateAI}
            disabled={isGenerating}
          >
            {isGenerating ? "AI is Analyzing Data..." : "✨ Generate AI Portfolio"}
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

      {/* Ek mini preview section */}
      <div className="three-col" style={{ marginTop: '20px' }}>
         <div className="insight-card">
            <span className="tag tag-tip">Hiring Tip</span>
            <div className="insight-title">Optimize GitHub</div>
            <div className="insight-body">Your commit frequency is highest on Tuesdays. Aim for weekend consistency to impress recruiters.</div>
         </div>
         <div className="insight-card">
            <span className="tag tag-opportunity">Skill Gap</span>
            <div className="insight-title">System Design</div>
            <div className="insight-body">Based on your LeetCode history, try more 'Hard' tagged Dynamic Programming problems.</div>
         </div>
         <div className="insight-card">
            <span className="tag tag-strength">Key USP</span>
            <div className="insight-title">Consistency</div>
            <div className="insight-body">Your 47-day streak puts you in the top 1% of developers globally.</div>
         </div>
      </div>
    </div>
  );
};

export default AIPortfolio;