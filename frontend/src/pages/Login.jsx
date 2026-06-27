import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const FLOATING_WORDS = ['React', 'Node.js', 'AWS', 'Python', 'AI/ML', 'DevOps', 'Figma', 'SQL', 'TypeScript', 'Docker', 'Kubernetes', 'GraphQL'];

export default function Login() {
  const [tab, setTab]     = useState('user');
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      const userData = res.data.user || res.data.admin;
      login("dummy-token", userData, res.data.type);
      if (res.data.type === 'admin') navigate('/admin/dashboard');
      else navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-galaxy">
      <div className="galaxy-orb orb-1" />
      <div className="galaxy-orb orb-2" />
      <div className="galaxy-orb orb-3" />
      <div className="float-tags" aria-hidden="true">
        {FLOATING_WORDS.map((w, i) => (
          <span key={w} className="float-tag" style={{'--i': i, '--total': FLOATING_WORDS.length}}>{w}</span>
        ))}
      </div>
      <div className="grid-overlay" aria-hidden="true" />

      <div className="login-center">
        <div className="login-logo-row">
          <div className="login-logo-mark">🪺</div>
          <span className="login-logo-text">Career<span>Nest</span></span>
        </div>

        <div className="login-hero-text">
          <h1>Your dream job<br />is one login away.</h1>
          <p>Join thousands of professionals already thriving.</p>
        </div>

        <div className={`login-card ${loading ? 'card-loading' : ''}`}>
          <div className="login-card-glow" />

          <div className="login-tabs">
            <button className={`login-tab ${tab === 'user' ? 'active' : ''}`} onClick={() => setTab('user')}>
              <span className="tab-icon">👤</span> Job Seeker
            </button>
            <button className={`login-tab ${tab === 'admin' ? 'active' : ''}`} onClick={() => setTab('admin')}>
              <span className="tab-icon">🛡️</span> Admin
            </button>
            <div className={`tab-slider ${tab === 'admin' ? 'right' : ''}`} />
          </div>

          {error && <div className="login-error"><span>⚠️</span> {error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className={`lf-group ${focused === 'email' ? 'lf-focused' : ''}`}>
              <label className="lf-label">Email address</label>
              <div className="lf-input-wrap">
                <span className="lf-icon">✉️</span>
                <input type="email" className="lf-input" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} required />
              </div>
            </div>

            <div className={`lf-group ${focused === 'pass' ? 'lf-focused' : ''}`}>
              <label className="lf-label">Password</label>
              <div className="lf-input-wrap">
                <span className="lf-icon">🔒</span>
                <input type={showPass ? 'text' : 'password'} className="lf-input" placeholder="••••••••••" value={pass}
                  onChange={e => setPass(e.target.value)} onFocus={() => setFocused('pass')} onBlur={() => setFocused('')} required />
                <button type="button" className="lf-toggle-pass" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <span className="login-btn-loading"><span className="login-spinner" /> Signing in…</span> : <span>Sign In →</span>}
            </button>
          </form>

          {tab === 'user' && <p className="login-footer-link">New to CareerNest? <Link to="/register">Create a free account</Link></p>}
        </div>

        <div className="login-stats">
          {[['500+','Live Jobs'],['10k+','Students'],['200+','Companies'],['94%','Success Rate']].map(([n,l]) => (
            <div className="login-stat" key={l}>
              <span className="login-stat-num">{n}</span>
              <span className="login-stat-lbl">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
