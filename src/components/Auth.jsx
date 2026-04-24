import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const Auth = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const url = isLogin
        ? `${API_URL}/api/auth/login`
        : `${API_URL}/api/auth/register`;

      const body = isLogin
        ? { email, password }
        : { name, email, password };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data);

      localStorage.setItem('token', data.token);
      setUser({
        name: data.name,
        email: data.email,
        score: data.score,
        rank: data.rank,
        streak: data.streak
      });

    } catch (err) {
      setError(err.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-glass-card">
        <div className="auth-brand">
          <div className="logo-icon-wrapper">
            <div className="pulse"></div>
            <div className="orbit-ring"></div>
          </div>
          <span className="logo-text">VOR<span className="logo-accent">TEX</span></span>
        </div>

        <div className="auth-header">
          <h2>{isLogin ? 'Identity Verification' : 'Create Account'}</h2>
          <p>Access the developer analytics portal</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <label>FULL NAME</label>
              <input
                type="text"
                placeholder="Arjun Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="input-group">
            <label>TERMINAL ACCESS EMAIL</label>
            <input
              type="email"
              placeholder="name@vortex.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? <div className="loader-mini"></div> : isLogin ? 'INITIALIZE SESSION ➔' : 'CREATE ACCOUNT ➔'}
          </button>
        </form>

        <div className="auth-footer" style={{ cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
          <span>{isLogin ? 'New user? Register here' : 'Already registered? Login'}</span>
        </div>
      </div>
      <div className="auth-bg-glow"></div>
    </div>
  );
};

export default Auth;