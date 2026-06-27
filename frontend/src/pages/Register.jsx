import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess('Account created! Redirecting…');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const fields = [
    { key: 'name',     type: 'text',     icon: '👤', label: 'Full Name',  placeholder: 'John Doe', required: true },
    { key: 'email',    type: 'email',    icon: '✉️', label: 'Email',      placeholder: 'you@example.com', required: true },
    { key: 'password', type: showPass ? 'text' : 'password', icon: '🔒', label: 'Password', placeholder: 'Min 6 characters', required: true, minLength: 6, isPass: true },
    { key: 'phone',    type: 'tel',      icon: '📱', label: 'Phone',      placeholder: '+91 98765 43210', required: false },
  ];

  return (
    <div className="login-galaxy">
      <div className="galaxy-orb orb-1" />
      <div className="galaxy-orb orb-2" />
      <div className="galaxy-orb orb-3" />
      <div className="grid-overlay" aria-hidden="true" />

      <div className="login-center" style={{maxWidth:'500px'}}>
        <div className="login-logo-row">
          <div className="login-logo-mark">🪺</div>
          <span className="login-logo-text">Career<span>Nest</span></span>
        </div>

        <div className="login-hero-text">
          <h1>Start your<br />career journey.</h1>
          <p>Free account. No credit card. Apply instantly.</p>
        </div>

        <div className="login-card">
          <div className="login-card-glow" />

          {error   && <div className="login-error"><span>⚠️</span> {error}</div>}
          {success && <div style={{background:'rgba(34,211,160,0.1)',border:'1px solid rgba(34,211,160,0.4)',color:'#22d3a0',borderRadius:'10px',padding:'10px 14px',fontSize:'0.88rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'8px'}}>✅ {success}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {fields.map(f => (
              <div key={f.key} className={`lf-group ${focused === f.key ? 'lf-focused' : ''}`}>
                <label className="lf-label">
                  {f.label} {!f.required && <span style={{textTransform:'none',letterSpacing:'0',fontWeight:'400',color:'var(--text3)'}}>(optional)</span>}
                </label>
                <div className="lf-input-wrap">
                  <span className="lf-icon">{f.icon}</span>
                  <input
                    type={f.type}
                    className="lf-input"
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={set(f.key)}
                    onFocus={() => setFocused(f.key)}
                    onBlur={() => setFocused('')}
                    required={f.required}
                    minLength={f.minLength}
                  />
                  {f.isPass && (
                    <button type="button" className="lf-toggle-pass" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" className="login-btn" disabled={loading} style={{marginTop:'0.8rem'}}>
              {loading
                ? <span className="login-btn-loading"><span className="login-spinner" /> Creating account…</span>
                : <span>Create Free Account →</span>}
            </button>
          </form>

          <p className="login-footer-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>

        <div className="login-stats">
          {[['Free','Forever'],['Instant','Apply'],['AI','Powered'],['Real','Jobs']].map(([n,l]) => (
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
