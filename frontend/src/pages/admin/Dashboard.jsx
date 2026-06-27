import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import api from '../../utils/api';

const PIE_COLORS = ['#3b82f6','#f59e0b','#10b981','#8b5cf6','#ef4444'];

const STATUS_STYLE = {
  'Applied':      '#3b82f6',
  'Under Review': '#f59e0b',
  'Interview':    '#06b6d4',
  'Selected':     '#10b981',
  'Rejected':     '#ef4444',
};

export default function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stats').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-top"><h2>Dashboard</h2></div>

      <div className="stat-grid">
        <StatCard icon="💼" label="Total Jobs"       value={stats.totalJobs}  accent="#3b82f6" />
        <StatCard icon="👤" label="Registered Users" value={stats.totalUsers} accent="#10b981" />
        <StatCard icon="📋" label="Applications"     value={stats.totalApps}  accent="#f59e0b" />
        <StatCard icon="🏆" label="Selected"         value={stats.selected}   accent="#8b5cf6" />
      </div>

      <div className="chart-row">
        <div className="chart-box">
          <h3>Applications by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={stats.byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={95} label={({ status, count }) => `${status} (${count})`} labelLine={false}>
                {stats.byStatus.map((entry, i) => <Cell key={i} fill={STATUS_STYLE[entry.status] || PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Top Jobs by Applications</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.topJobs} margin={{ left: -10 }}>
              <XAxis dataKey="title" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="applications" fill="#3b82f6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-box">
        <h3>Recent Applications</h3>
        <table className="tbl">
          <thead><tr><th>Applicant</th><th>Job</th><th>Company</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {stats.recentApps.map((r, i) => (
              <tr key={i}>
                <td>{r.user_name}</td>
                <td>{r.title}</td>
                <td>{r.company}</td>
                <td><span className="status-pill" style={{ background: (STATUS_STYLE[r.status] || '#888') + '22', color: STATUS_STYLE[r.status] || '#888' }}>{r.status}</span></td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${accent}` }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-num" style={{ color: accent }}>{value}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}
