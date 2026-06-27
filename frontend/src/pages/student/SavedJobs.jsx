import { useState, useEffect } from 'react';
import api from '../../utils/api';

const TYPE_COLORS = {
  'Full-time':  { bg: 'rgba(34,211,160,0.12)',  color: '#22d3a0' },
  'Part-time':  { bg: 'rgba(96,165,250,0.12)',   color: '#60a5fa' },
  'Internship': { bg: 'rgba(251,191,36,0.12)',   color: '#fbbf24' },
  'Contract':   { bg: 'rgba(167,139,250,0.12)',  color: '#a78bfa' },
  'Remote':     { bg: 'rgba(34,211,238,0.12)',   color: '#22d3ee' },
};

export default function SavedJobs() {
  const [jobs, setJobs]       = useState([]);
  const [applied, setApplied] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState({ text: '', ok: true });

  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cn_saved') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    Promise.all([api.get('/jobs'), api.get('/applications/mine')])
      .then(([j, a]) => {
        setJobs(j.data);
        setApplied(a.data.map(x => x.job_id));
      })
      .finally(() => setLoading(false));
  }, []);

  const flash = (text, ok = true) => { setMsg({ text, ok }); setTimeout(() => setMsg({ text: '', ok: true }), 3000); };

  const apply = async (job_id) => {
    try {
      await api.post('/applications', { job_id });
      setApplied(p => [...p, job_id]);
      flash('Applied successfully! ✓');
      setSelected(null);
    } catch (err) {
      flash(err.response?.data?.message || 'Error applying', false);
    }
  };

  const unsave = (jobId) => {
    setSaved(prev => {
      const next = prev.filter(id => id !== jobId);
      localStorage.setItem('cn_saved', JSON.stringify(next));
      return next;
    });
  };

  const savedJobs = jobs.filter(j => saved.includes(j.id));

  if (loading) return <div className="spinner-page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-top">
        <div>
          <h2>⭐ Saved Jobs</h2>
          <p className="sub">{savedJobs.length} saved position{savedJobs.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {msg.text && <div className={`flash ${msg.ok ? 'flash-ok' : 'flash-err'}`}>{msg.text}</div>}

      {savedJobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <h3>No saved jobs yet</h3>
          <p>Click the ☆ star on any job card to save it here for later.</p>
        </div>
      ) : (
        <div className="job-grid">
          {savedJobs.map(job => {
            const tc = TYPE_COLORS[job.type] || { bg: 'rgba(108,99,255,0.12)', color: '#6c63ff' };
            return (
              <div className="job-card" key={job.id}>
                <div className="jc-top">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="jc-company">{job.company}</p>
                  </div>
                  <span className="type-chip" style={{ background: tc.bg, color: tc.color }}>{job.type}</span>
                </div>
                <div className="jc-meta">
                  <span>📍 {job.location}</span>
                  {job.salary && <span>💰 {job.salary}</span>}
                </div>
                <p className="jc-desc">{job.description.slice(0, 110)}…</p>
                <div className="jc-actions">
                  <button className="btn-outline" onClick={() => setSelected(job)}>Details</button>
                  {applied.includes(job.id)
                    ? <button className="btn-applied" disabled>✓ Applied</button>
                    : <button className="btn-primary" onClick={() => apply(job.id)}>Apply</button>}
                  <button className="btn-bookmark saved" onClick={() => unsave(job.id)} title="Remove from saved">★</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>{selected.title}</h2>
                <p>{selected.company} · {selected.location}</p>
              </div>
              <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-chips">
                {(() => { const tc = TYPE_COLORS[selected.type] || { bg: 'rgba(108,99,255,0.12)', color: '#6c63ff' }; return <span className="type-chip" style={{ background: tc.bg, color: tc.color }}>{selected.type}</span>; })()}
                {selected.salary && <span className="salary-chip">💰 {selected.salary}</span>}
                <span className="date-chip">Posted {new Date(selected.created_at).toLocaleDateString()}</span>
              </div>
              <h4>Description</h4>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--text2)' }}>{selected.description}</p>
              {selected.requirements && (
                <>
                  <h4>Requirements</h4>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--text2)' }}>{selected.requirements}</p>
                </>
              )}
            </div>
            <div className="modal-foot">
              {applied.includes(selected.id)
                ? <button className="btn-applied" disabled>✓ Already Applied</button>
                : <button className="btn-primary" onClick={() => apply(selected.id)}>Apply Now</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
