import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers]       = useState([]);
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  if (loading) return <div className="spinner-page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-top">
        <div><h2>Registered Users</h2><p className="sub">{users.length} total</p></div>
        <input className="search" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Skills</th><th>Experience</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="tbl-empty">No users found.</td></tr>}
            {filtered.map(u => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>{u.phone || '—'}</td>
                <td style={{ fontSize:'0.85rem', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.skills || '—'}</td>
                <td style={{ fontSize:'0.85rem' }}>{u.experience || '—'}</td>
                <td style={{ fontSize:'0.85rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                <td><button className="btn-sm btn-outline" onClick={() => setSelected(u)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>{selected.name}</h2>
                <p style={{ color: 'var(--text2)', fontSize: '0.88rem', marginTop: 4 }}>{selected.email}</p>
              </div>
              <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="info-grid">
                <InfoRow label="Phone"      v={selected.phone} />
                <InfoRow label="Experience" v={selected.experience} />
                <InfoRow label="Education"  v={selected.education} />
                <InfoRow label="Skills"     v={selected.skills} full />
                {selected.resume_link && (
                  <div className="info-cell full">
                    <span className="info-label">Resume</span>
                    <a href={selected.resume_link} target="_blank" rel="noreferrer" className="btn-outline small">View Resume ↗</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, v, full }) {
  return (
    <div className={`info-cell${full ? ' full' : ''}`}>
      <span className="info-label">{label}</span>
      <span className="info-val">{v || '—'}</span>
    </div>
  );
}
