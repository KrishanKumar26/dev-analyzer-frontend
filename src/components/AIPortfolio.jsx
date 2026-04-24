import React, { useState } from 'react';

const AIPortfolio = ({ user }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const generateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPortfolio(true);
    }, 2000); // 2 second ka fake AI processing feel dene ke liye
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
            <span className="tag tag-strength">AI GENERATED SUMMARY</span>
            <p className="insight-body" style={{ fontSize: '16px', lineHeight: '1.8', color: 'white' }}>
              "<strong>{user?.name || "Arjun Sharma"}</strong> is a high-performing developer with a global rank of <strong>#1,201</strong>. 
              With <strong>1,847 problems solved</strong> and a <strong>47-day streak</strong>, they demonstrate elite consistency. 
              Top skills include <strong>Data Structures</strong> and <strong>System Design</strong>, evidenced by a GitHub contribution 
              score of <strong>2,840</strong>. Highly recommended for Full-Stack roles."
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button className="refresh-btn">📥 Download PDF</button>
              <button className="refresh-btn" style={{ borderColor: 'var(--accent2)', color: 'var(--accent2)' }}>🔗 Copy Shareable Link</button>
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