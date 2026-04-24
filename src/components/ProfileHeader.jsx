import React, { useState, useEffect } from 'react';

const ProfileHeader = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--gold))',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          {(profile?.name || user?.name || 'US').substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>
            {profile?.name || user?.name || 'Developer'}
          </h1>
          <p style={{ color: 'var(--text2)', margin: '5px 0', fontSize: '14px' }}>
            {profile?.email || user?.email}
          </p>
          <p style={{ color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>
            Rank: #{profile?.rank || 9999} globally
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
          Score: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
            {profile?.score || 0}
          </span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
          Problems: <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>
            {profile?.problems || 0}
          </span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
          Streak: <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
            {profile?.streak || 0}d 🔥
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;