import { useState, useEffect } from 'react';
import api from '../../utils/api';

const STAGES = ['Applied', 'Under Review', 'Interview', 'Selected'];

const STATUS_STYLE = {
  'Applied':      { bg: 'rgba(96,165,250,0.12)',  color: '#60a5fa' },
  'Under Review': { bg: 'rgba(251,191,36,0.12)',   color: '#fbbf24' },
  'Interview':    { bg: 'rgba(34,211,238,0.12)',   color: '#22d3ee' },
  'Selected':     { bg: 'rgba(34,211,160,0.12)',   color: '#22d3a0' },
  'Rejected':     { bg: 'rgba(248,113,113,0.12)',  color: '#f87171' },
};

function ProgressTracker({ status }) {
  if (status === 'Rejected') {
    return (
      <div className="progress-track">
        {STAGES.map((s, i) => (
          <div key={s} className={`progress-step${i === 0 ? ' done' : ' rejected'}`}>
            <div className="step-dot">{i === 0 ? '✓' : '✕'}</div>
            <div className="step-label">{s}</div>
          </div>
        ))}
      </div>
    );
  }

  const activeIdx = STAGES.indexOf(status);

  return (
    <div className="progress-track">
      {STAGES.map((s, i) => {
        let cls = 'progress-step';
        if (i < activeIdx) cls += ' done';
        if (i === activeIdx) cls += ' active';

        return (
          <div key={s} className={cls}>
            <div className="step-dot">{i < activeIdx ? '✓' : i + 1}</div>
            <div className="step-label">{s}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setLoading(false);
      return;
    }

    api.get(`/applications/${user.id}`)
      .then(res => {
        console.log("MY APPLICATIONS:", res.data);
        setApps(res.data); // ✅ FIXED
      })
      .catch(err => console.error("ERROR:", err))
      .finally(() => setLoading(false)); // ✅ FIXED
  }, []);

  if (loading) {
    return (
      <div className="spinner-page">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-top">
        <div>
          <h2>My Applications</h2>
          <p className="sub">
            {apps.length} application{apps.length !== 1 ? 's' : ''} submitted
          </p>
        </div>
      </div>

      {apps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No applications yet</h3>
          <p>Browse jobs and hit Apply to get started.</p>
        </div>
      ) : (
        <div className="app-list">
          {apps.map(a => {
            const s = STATUS_STYLE[a.status] || STATUS_STYLE['Applied'];

            return (
              <div className="app-card" key={a.id}>
                <div className="app-card-top">
                  <div className="app-info">
                    <h3>{a.title}</h3>
                    <p className="app-company">{a.company}</p>
                    <p className="app-meta">
                      📍 {a.location} · {a.type}
                      {a.salary ? ` · 💰 ${a.salary}` : ''}
                    </p>
                    <p className="app-date">
                      Applied {new Date(a.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className="status-pill"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {a.status}
                  </span>
                </div>

                <ProgressTracker status={a.status} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}