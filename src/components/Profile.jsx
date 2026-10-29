import React, { useState } from 'react';
import { exportToPDF } from '../utils/export';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Profile = ({ user, profile, setUser, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  const token = localStorage.getItem('token');

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMsg('');
    try {
      const res = await fetch(`${API_URL}/api/user/sync`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Sync failed');
      
      setSyncMsg('✅ Synced successfully! Score: ' + data.score);
      if (data.breakdown) localStorage.setItem('scoreBreakdown', JSON.stringify(data.breakdown));
      
      if (onUpdate) onUpdate();
      
      // Update user context
      setUser(prev => ({ ...prev, score: data.score, rank: data.rank, streak: data.streak }));
    } catch (err) {
      setSyncMsg('❌ ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/user/leetcode-username`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ leetcodeUsername: newUsername })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      
      alert('✅ Username updated! Now sync your data.');
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  const handleExportPDF = () => {
    exportToPDF(profile || user);
  };

  const displayProfile = profile || user;
  const shareLink = `${window.location.origin}/u/${displayProfile?.id || 'unknown'}`;

  return (
    <div className="card">
      <div className="card-title">USER PROFILE</div>
      
      <div style={{ marginTop: '20px' }}>
        <div className="profile-field">
          <strong>Name:</strong> {displayProfile?.name || 'N/A'}
        </div>
        <div className="profile-field">
          <strong>Email:</strong> {displayProfile?.email || 'N/A'}
        </div>
        <div className="profile-field">
          <strong>LeetCode Username:</strong> {displayProfile?.leetcodeUsername || 'Not Set'}
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-secondary" style={{ marginLeft: '10px', fontSize: '12px', padding: '4px 8px' }}>
              Edit
            </button>
          )}
        </div>

        {isEditing && (
          <div style={{ marginTop: '10px' }}>
            <input
              type="text"
              placeholder="New LeetCode username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              style={{ padding: '8px', marginRight: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
            />
            <button onClick={handleUpdateUsername} className="btn-primary" style={{ marginRight: '8px' }}>Save</button>
            <button onClick={() => { setIsEditing(false); setNewUsername(''); }} className="btn-secondary">Cancel</button>
          </div>
        )}

        <div className="profile-field">
          <strong>Dev Score:</strong> {displayProfile?.score || 0}
        </div>
        <div className="profile-field">
          <strong>Rank:</strong> #{displayProfile?.rank || 'N/A'}
        </div>
        <div className="profile-field">
          <strong>Streak:</strong> {displayProfile?.streak || 0} days
        </div>
        <div className="profile-field">
          <strong>Problems Solved:</strong> {displayProfile?.problems || 0}
        </div>
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleSync} 
          className="btn-primary"
          disabled={isSyncing}
        >
          {isSyncing ? 'Syncing...' : '🔄 Sync LeetCode Data'}
        </button>
        
        <button onClick={handleExportPDF} className="btn-secondary">
          📄 Export PDF
        </button>
        
        <button 
          onClick={() => { navigator.clipboard.writeText(shareLink); alert('Share link copied!'); }}
          className="btn-secondary"
        >
          🔗 Copy Share Link
        </button>
      </div>

      {syncMsg && (
        <div style={{ marginTop: '15px', padding: '10px', background: 'var(--card)', borderRadius: '8px', fontSize: '14px' }}>
          {syncMsg}
        </div>
      )}
    </div>
  );
};

export default Profile;
