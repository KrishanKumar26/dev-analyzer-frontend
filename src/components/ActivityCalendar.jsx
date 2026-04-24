import React from 'react';

const ActivityCalendar = () => {
  // Fake data generate karne ke liye (0 to 4 intensity)
  const activityData = Array.from({ length: 84 }, () => Math.floor(Math.random() * 5));

  const getColor = (level) => {
    switch (level) {
      case 0: return 'var(--bg3)'; // No activity
      case 1: return 'rgba(0, 229, 160, 0.2)'; // Low
      case 2: return 'rgba(0, 229, 160, 0.4)'; // Medium
      case 3: return 'rgba(0, 229, 160, 0.7)'; // High
      case 4: return 'var(--primary)'; // Extreme (Max Glow)
      default: return 'var(--bg3)';
    }
  };

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>CONFORMITY HEATMAP</span>
        <span className="badge-sm" style={{ color: 'var(--primary)' }}>342 COMMITS THIS YEAR</span>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(12, 1fr)', 
        gridTemplateRows: 'repeat(7, 1fr)', 
        gridAutoFlow: 'column',
        gap: '4px',
        marginTop: '15px'
      }}>
        {activityData.map((level, i) => (
          <div
            key={i}
            className="heatmap-cell"
            style={{
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: '2px',
              backgroundColor: getColor(level),
              boxShadow: level === 4 ? '0 0 10px var(--primary)' : 'none',
              cursor: 'pointer'
            }}
            title={`Level ${level} activity`}
          />
        ))}
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '15px', 
        fontSize: '10px', 
        color: 'var(--text3)' 
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span>Jan</span><span>Feb</span><span>Mar</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>Less</span>
          <div style={{ width: '8px', height: '8px', background: 'var(--bg3)' }}></div>
          <div style={{ width: '8px', height: '8px', background: 'rgba(0, 229, 160, 0.4)' }}></div>
          <div style={{ width: '8px', height: '8px', background: 'var(--primary)' }}></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;