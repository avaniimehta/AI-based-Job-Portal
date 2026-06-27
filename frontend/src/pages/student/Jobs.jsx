import { useState, useEffect } from 'react';
import api from '../../utils/api';

const TYPE_COLORS = {
  'Full-time':  { bg: 'rgba(34,211,160,0.12)',  color: '#22d3a0', dot: '#22d3a0' },
  'Part-time':  { bg: 'rgba(96,165,250,0.12)',   color: '#60a5fa', dot: '#60a5fa' },
  'Internship': { bg: 'rgba(251,191,36,0.12)',   color: '#fbbf24', dot: '#fbbf24' },
  'Contract':   { bg: 'rgba(167,139,250,0.12)',  color: '#a78bfa', dot: '#a78bfa' },
  'Remote':     { bg: 'rgba(34,211,238,0.12)',   color: '#22d3ee', dot: '#22d3ee' },
};

const COMPANY_ICONS = {
  'TechCorp': '💻', 'DataSoft': '🖥️', 'PixelLabs': '🎨', 'FinEdge': '📊',
  'CloudBase': '☁️', 'StartupX': '🚀', 'AIVentures': '🤖', 'GrowthHQ': '📈',
  'AppFusion': '📱', 'SecureNet': '🔐', 'WebForge': '⚙️', 'AnalyticsHub': '🔬',
  'NimbusTech': '🌩️', 'CreativeCo': '✏️', 'Qualiteam': '✅', 'CryptoLabs': '🔗',
  'DocuFlow': '📝', 'StratEdge': '📋', 'MobiStack': '📲',
};

export default function Jobs() {
  const [jobs, setJobs]         = useState([]);
  const [applied, setApplied]   = useState([]);
  const [search, setSearch]     = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter]         = useState('');
  const [selected, setSelected] = useState(null);
  const [msg, setMsg]   = useState({ text: '', ok: true });
  const [loading, setLoading]   = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cn_saved') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    api.get('/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.error('ERROR:', err))
      .finally(() => setLoading(false));
  }, []);

  const flash = (text, ok = true) => { setMsg({ text, ok }); setTimeout(() => setMsg({ text: '', ok: true }), 3000); };

  const apply = async (job_id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) { flash('Please login first', false); return; }
      await api.post('/applications', { job_id, user_id: user.id });
      setApplied(p => [...p, job_id]);
      flash('Applied successfully! ✓');
      setSelected(null);
    } catch (err) {
      flash(err.response?.data?.message || 'Error applying', false);
    }
  };

  const toggleSave = (jobId) => {
    setSaved(prev => {
      const next = prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId];
      localStorage.setItem('cn_saved', JSON.stringify(next));
      return next;
    });
  };

  const locations = [...new Set(jobs.map(j => j.location.split(',')[0].trim()))].sort();
  const types     = [...new Set(jobs.map(j => j.type))];

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch   = j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
    const matchType     = !typeFilter     || j.type === typeFilter;
    const matchLocation = !locationFilter || j.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchSearch && matchType && matchLocation;
  });

  if (loading) return <div className="spinner-page"><div className="spinner" /></div>;

  return (
    <div className="page">
      {/* Header */}
      <div className="jobs-page-header">
        <div className="jobs-header-left">
          <h2 className="jobs-title">Browse <span>Jobs</span></h2>
          <p className="sub">{filtered.length} of {jobs.length} positions · Updated today</p>
        </div>
        <div className="jobs-header-right">
          <div className="jobs-view-toggle">
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} title="Grid view">⊞</button>
            <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} title="List view">☰</button>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="jobs-filters-bar">
        <div className="jobs-search-wrap">
          <span className="jobs-search-icon">🔍</span>
          <input
            className="jobs-search"
            placeholder="Search by title, company, location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="jobs-search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <select className="jobs-filter-select" value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
          <option value="">📍 All Locations</option>
          {locations.map(l => <option key={l}>{l}</option>)}
        </select>
        <select className="jobs-filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">🏷️ All Types</option>
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
        {(search || locationFilter || typeFilter) && (
          <button className="jobs-filter-clear" onClick={() => { setSearch(''); setLocationFilter(''); setTypeFilter(''); }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {(typeFilter || locationFilter) && (
        <div className="jobs-active-filters">
          {typeFilter && <span className="jobs-filter-chip">{typeFilter} <button onClick={() => setTypeFilter('')}>✕</button></span>}
          {locationFilter && <span className="jobs-filter-chip">{locationFilter} <button onClick={() => setLocationFilter('')}>✕</button></span>}
        </div>
      )}

      {msg.text && <div className={`flash ${msg.ok ? 'flash-ok' : 'flash-err'}`}>{msg.text}</div>}

      {/* Job grid */}
      <div className={viewMode === 'grid' ? 'jobs-grid' : 'jobs-list'}>
        {filtered.map((job, idx) => {
          const tc      = TYPE_COLORS[job.type] || { bg: 'rgba(108,99,255,0.12)', color: '#6c63ff' };
          const isSaved = saved.includes(job.id);
          const icon    = COMPANY_ICONS[job.company] || '🏢';
          const isApplied = applied.includes(job.id);

          if (viewMode === 'list') {
            return (
              <div className="job-list-row" key={job.id} style={{'--idx': idx}}>
                <div className="jlr-left">
                  <div className="jlr-icon">{icon}</div>
                  <div className="jlr-info">
                    <h3 className="jlr-title">{job.title}</h3>
                    <div className="jlr-meta">
                      <span className="jlr-company">{job.company}</span>
                      <span className="jlr-sep">·</span>
                      <span>📍 {job.location}</span>
                      {job.salary && <><span className="jlr-sep">·</span><span>💰 {job.salary}</span></>}
                    </div>
                  </div>
                </div>
                <div className="jlr-right">
                  <span className="type-chip" style={{ background: tc.bg, color: tc.color }}>{job.type}</span>
                  <button className="btn-outline jlr-btn" onClick={() => setSelected(job)}>Details</button>
                  {isApplied
                    ? <button className="btn-applied" disabled>✓</button>
                    : <button className="btn-primary jlr-btn" onClick={() => apply(job.id)}>Apply</button>}
                  <button className={`btn-bookmark${isSaved ? ' saved' : ''}`} onClick={() => toggleSave(job.id)}>{isSaved ? '★' : '☆'}</button>
                </div>
              </div>
            );
          }

          return (
            <div className="job-card-v2" key={job.id} style={{'--idx': idx}}>
              <div className="jcv2-header">
                <div className="jcv2-icon">{icon}</div>
                <span className="type-chip" style={{ background: tc.bg, color: tc.color }}>{job.type}</span>
              </div>
              <div className="jcv2-body">
                <h3 className="jcv2-title">{job.title}</h3>
                <p className="jcv2-company">{job.company}</p>
                <div className="jcv2-meta">
                  <span>📍 {job.location}</span>
                  {job.salary && <span>💰 {job.salary}</span>}
                </div>
                <p className="jcv2-desc">{job.description.slice(0, 120)}…</p>
              </div>
              <div className="jcv2-footer">
                <button className="btn-outline jcv2-btn" onClick={() => setSelected(job)}>View Details</button>
                <div className="jcv2-actions">
                  {isApplied
                    ? <button className="btn-applied" disabled>✓ Applied</button>
                    : <button className="btn-primary" onClick={() => apply(job.id)}>Quick Apply</button>}
                  <button
                    className={`btn-bookmark${isSaved ? ' saved' : ''}`}
                    onClick={() => toggleSave(job.id)}
                    title={isSaved ? 'Remove bookmark' : 'Save job'}
                  >
                    {isSaved ? '★' : '☆'}
                  </button>
                </div>
              </div>
              {isApplied && <div className="jcv2-applied-ribbon">Applied ✓</div>}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="jobs-empty">
            <div className="jobs-empty-icon">🔍</div>
            <h3>No jobs found</h3>
            <p>Try different search terms or clear your filters</p>
            <button className="btn-outline" style={{marginTop:'1rem'}} onClick={() => { setSearch(''); setLocationFilter(''); setTypeFilter(''); }}>
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal modal-v2" onClick={e => e.stopPropagation()}>
            <div className="mv2-hero">
              <div className="mv2-icon">{COMPANY_ICONS[selected.company] || '🏢'}</div>
              <div className="mv2-hero-info">
                <h2>{selected.title}</h2>
                <p>{selected.company} · {selected.location}</p>
              </div>
              <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="mv2-chips">
              {(() => { const tc = TYPE_COLORS[selected.type] || { bg: 'rgba(108,99,255,0.12)', color: '#6c63ff' }; return <span className="type-chip" style={{ background: tc.bg, color: tc.color }}>{selected.type}</span>; })()}
              {selected.salary && <span className="salary-chip">💰 {selected.salary}</span>}
              <span className="date-chip">📅 {new Date(selected.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
            </div>
            <div className="mv2-section">
              <h4 className="mv2-section-title">About the Role</h4>
              <p className="mv2-text">{selected.description}</p>
            </div>
            {selected.requirements && (
              <div className="mv2-section">
                <h4 className="mv2-section-title">Requirements</h4>
                <div className="mv2-reqs">
                  {selected.requirements.split(',').map((r, i) => (
                    <span key={i} className="mv2-req-chip">✓ {r.trim()}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="mv2-footer">
              {applied.includes(selected.id)
                ? <button className="btn-applied" disabled style={{flex:1}}>✓ Already Applied</button>
                : <button className="btn-primary" style={{flex:1}} onClick={() => apply(selected.id)}>Apply Now →</button>}
              <button
                className={`btn-outline${saved.includes(selected.id) ? ' saved' : ''}`}
                onClick={() => toggleSave(selected.id)}
              >
                {saved.includes(selected.id) ? '★ Saved' : '☆ Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
