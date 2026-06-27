import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = path => pathname === path;
  const handleLogout = () => { logout(); navigate('/login'); };

  const studentLinks = [
    { to: '/jobs',            label: 'Browse Jobs', icon: '💼' },
    { to: '/my-applications', label: 'Applications', icon: '📋' },
    { to: '/saved',           label: 'Saved', icon: '⭐' },
    { to: '/interview-prep',  label: 'AI Coach', icon: '🤖' },
    { to: '/profile',         label: 'Profile', icon: '👤' },
  ];
  const adminLinks = [
    { to: '/admin/dashboard',    label: 'Dashboard', icon: '📊' },
    { to: '/admin/jobs',         label: 'Jobs', icon: '💼' },
    { to: '/admin/applications', label: 'Applications', icon: '📋' },
    { to: '/admin/users',        label: 'Users', icon: '👥' },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <nav className="navbar-v2">
      <Link to="/" className="brand-v2">
        <div className="brand-logo-v2">🪺</div>
        <span className="brand-name-v2">Career<span>Nest</span></span>
      </Link>

      {user && (
        <div className="nav-links-v2">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link-v2 ${isActive(l.to) ? 'active' : ''}`}
            >
              <span className="nl-icon">{l.icon}</span>
              <span className="nl-label">{l.label}</span>
              {isActive(l.to) && <span className="nl-active-bar" />}
            </Link>
          ))}
        </div>
      )}

      <div className="nav-actions-v2">
        {!user ? (
          <>
            <Link to="/login" className="nav-link-v2">Login</Link>
            <Link to="/register" className="nav-cta-btn">Get Started →</Link>
          </>
        ) : (
          <div className="nav-user-section">
            <div className="nav-user-chip">
              <div className="nav-avatar">
                {user?.name ? user.name[0].toUpperCase() : '?'}
              </div>
              <span className="nav-user-name">{user?.name?.split(' ')[0]}</span>
              {role === 'admin' && <span className="nav-role-badge">Admin</span>}
            </div>
            <button className="nav-logout-btn" onClick={handleLogout} title="Logout">
              <span>↪</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
