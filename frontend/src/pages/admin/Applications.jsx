import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ollamaAsk } from '../../utils/ollama';

const STATUSES = ['Applied','Under Review','Interview','Selected','Rejected'];
const STATUS_COLOR = { 'Applied':'#3b82f6','Under Review':'#d97706','Interview':'#06b6d4','Selected':'#16a34a','Rejected':'#dc2626' };

export default function AdminApplications() {
  const [apps, setApps]       = useState([]);
  const [filter, setFilter]   = useState('');
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState('');

  // AI Summarizer
  const [summaries, setSummaries]   = useState({}); // { appId: text }
  const [summarizing, setSummarizing] = useState({}); // { appId: bool }

  const load = () => api.get('/applications').then(r => setApps(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const flash = t => { setMsg(t); setTimeout(() => setMsg(''), 2500); };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}`, { status });
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      flash('Status updated');
    } catch { flash('Error updating status'); }
  };

  const summarize = async (app) => {
    if (summaries[app.id] || summarizing[app.id]) return;
    setSummarizing(p => ({ ...p, [app.id]: true }));

    const prompt = `You are an HR assistant. Summarize this job applicant's profile in 2 short sentences for a recruiter. Be direct and highlight their strongest points and any gaps.

Applicant: ${app.user_name}
Applied for: ${app.title} at ${app.company}
Skills: ${app.skills || 'Not provided'}
Experience: ${app.experience || 'Not provided'}
Current Status: ${app.status}
Applied on: ${new Date(app.created_at).toLocaleDateString()}

Write ONLY the 2-sentence summary, nothing else:`;

    try {
      const result = await ollamaAsk(prompt);
      setSummaries(p => ({ ...p, [app.id]: result.trim() }));
    } catch (err) {
      setSummaries(p => ({ ...p, [app.id]: '⚠️ Could not generate summary. Is Ollama running?' }));
    }
    setSummarizing(p => ({ ...p, [app.id]: false }));
  };

  const summarizeAll = async () => {
    for (const app of filtered) {
      if (!summaries[app.id] && !summarizing[app.id]) {
        await summarize(app);
      }
    }
  };

  const filtered = apps.filter(a => {
    const q = search.toLowerCase();
    return (!filter || a.status === filter) &&
      (!q || a.user_name.toLowerCase().includes(q) || a.title.toLowerCase().includes(q) || a.company.toLowerCase().includes(q));
  });

  if (loading) return <div className="spinner-page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-top">
        <div><h2>All Applications</h2><p className="sub">{filtered.length} shown</p></div>
        <div className="filters">
          <input className="search" placeholder="Search name, job, company…" value={search} onChange={e => setSearch(e.target.value)} />
          <select className="select-filter" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="btn-outline" onClick={summarizeAll} title="AI-summarize all visible applicants">
            ✨ Summarize All
          </button>
        </div>
      </div>
      {msg && <div className="flash flash-ok">{msg}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.length === 0 && (
          <div className="empty-state"><div className="empty-icon">📋</div><h3>No applications found</h3></div>
        )}

        {filtered.map(a => (
          <div key={a.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.2rem 1.5rem', transition: 'border-color 0.2s' }}>
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '1rem', fontFamily: 'var(--font-display)' }}>{a.user_name}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{a.user_email}</span>
                  {a.user_phone && <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{a.user_phone}</span>}
                </div>
                <div style={{ marginTop: 4, fontSize: '0.88rem', color: 'var(--text2)' }}>
                  Applied for <span style={{ color: 'var(--text)', fontWeight: 600 }}>{a.title}</span> @ {a.company}
                  <span style={{ marginLeft: 12, color: 'var(--text3)' }}>{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
                {a.skills && (
                  <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {a.skills.split(',').slice(0, 5).map((s, i) => (
                      <span key={i} style={{ background: 'var(--accent-glow)', color: 'var(--accent)', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{s.trim()}</span>
                    ))}
                    {a.experience && <span style={{ background: 'var(--surface2)', color: 'var(--text2)', fontSize: '0.72rem', padding: '3px 10px', borderRadius: 20 }}>📅 {a.experience}</span>}
                  </div>
                )}
              </div>

              {/* Right controls */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                <select
                  value={a.status}
                  onChange={e => updateStatus(a.id, e.target.value)}
                  style={{ color: STATUS_COLOR[a.status], fontWeight: 700, border: `1.5px solid ${STATUS_COLOR[a.status]}`, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', background: 'var(--bg)', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}
                >
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
                <div style={{ display: 'flex', gap: 8 }}>
                  {a.resume_link && (
                    <a href={a.resume_link} target="_blank" rel="noreferrer" className="btn-sm btn-outline">Resume ↗</a>
                  )}
                  <button
                    className="btn-sm btn-outline"
                    onClick={() => summarize(a)}
                    disabled={summarizing[a.id]}
                    style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                  >
                    {summarizing[a.id] ? '⏳' : '✨ AI Summary'}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            {summaries[a.id] && (
              <div style={{ marginTop: '0.9rem', padding: '0.8rem 1rem', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 10, fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.7 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>✨ AI Summary</span>
                {summaries[a.id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
