import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OnboardingModal from './components/OnboardingModal';

import Login          from './pages/Login';
import Register       from './pages/Register';
import Jobs           from './pages/student/Jobs';
import MyApplications from './pages/student/MyApplications';
import SavedJobs      from './pages/student/SavedJobs';
import Profile        from './pages/student/Profile';
import InterviewPrep  from './pages/student/InterviewPrep';
import Dashboard      from './pages/admin/Dashboard';
import AdminJobs      from './pages/admin/Jobs';
import AdminApps      from './pages/admin/Applications';
import AdminUsers     from './pages/admin/Users';

function Guard({ children, role }) {
  const { user, role: r, ready } = useAuth();
  if (!ready) return <div className="spinner-page"><div className="spinner" /></div>;
  if (!user)  return <Navigate to="/login" replace />;
  if (role && r !== role) return <Navigate to="/login" replace />;
  return children;
}

function AppInner() {
  const { user, role } = useAuth();
  const home = !user ? '/login' : role === 'admin' ? '/admin/dashboard' : '/jobs';

  // Onboarding modal: show once per user session if they haven't filled profile
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user && role === 'user') {
      const key = `cn_onboarded_${user.id}`;
      if (!localStorage.getItem(key)) {
        // Small delay so the page loads first
        setTimeout(() => setShowOnboarding(true), 800);
      }
    }
  }, [user, role]);

  const closeOnboarding = () => {
    if (user) localStorage.setItem(`cn_onboarded_${user.id}`, '1');
    setShowOnboarding(false);
  };

  return (
    <>
      <Navbar />

      {/* Post-login onboarding popup for new students */}
      {showOnboarding && user && role === 'user' && (
        <OnboardingModal user={user} onClose={closeOnboarding} />
      )}

      <Routes>
        <Route path="/"  element={<Navigate to={home} replace />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/jobs"            element={<Guard role="user"><Jobs /></Guard>} />
        <Route path="/my-applications" element={<Guard role="user"><MyApplications /></Guard>} />
        <Route path="/saved"           element={<Guard role="user"><SavedJobs /></Guard>} />
        <Route path="/profile"         element={<Guard role="user"><Profile /></Guard>} />
        <Route path="/interview-prep"  element={<Guard role="user"><InterviewPrep /></Guard>} />

        <Route path="/admin/dashboard"    element={<Guard role="admin"><Dashboard /></Guard>} />
        <Route path="/admin/jobs"         element={<Guard role="admin"><AdminJobs /></Guard>} />
        <Route path="/admin/applications" element={<Guard role="admin"><AdminApps /></Guard>} />
        <Route path="/admin/users"        element={<Guard role="admin"><AdminUsers /></Guard>} />

        <Route path="*" element={<Navigate to={home} replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AuthProvider>
  );
}
