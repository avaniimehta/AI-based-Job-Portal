import { useState } from 'react';
import api from '../utils/api';

export default function OnboardingModal({ user, onClose }) {
  const [step, setStep]     = useState(1); // 1 = skills/exp, 2 = done
  const [form, setForm]     = useState({ skills: '', experience: '', education: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.skills.trim()) { setError('Please enter at least your skills.'); return; }
    setSaving(true);
    try {
      // Save to profile via existing PUT endpoint
      await api.put('/users/profile', {
        name: user.name,
        phone: user.phone || '',
        ...form,
        resume_link: '',
        photo_link: '',
      });
      setStep(2);
    } catch {
      setError('Could not save. Please try again.');
    }
    setSaving(false);
  };

  return (
    <div className="overlay" style={{ zIndex: 300 }}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>

        {step === 1 && (
          <>
            <div className="modal-head" style={{ paddingBottom: '1.2rem', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h2>👋 Welcome, {user.name.split(' ')[0]}!</h2>
                <p style={{ marginTop: 6, color: 'var(--text2)', fontSize: '0.92rem' }}>
                  Tell us a bit about yourself so admins and our AI can match you to the right jobs.
                </p>
              </div>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {error && <p style={{ color: 'var(--red)', fontSize: '0.88rem', background: 'var(--red-bg)', padding: '10px 14px', borderRadius: 8 }}>{error}</p>}

              <div className="field-wrap full">
                <label>Your Skills *</label>
                <input
                  value={form.skills}
                  onChange={f('skills')}
                  placeholder="e.g. React, Node.js, Python, SQL…"
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 4 }}>Separate with commas</span>
              </div>

              <div className="field-wrap full">
                <label>Experience</label>
                <input
                  value={form.experience}
                  onChange={f('experience')}
                  placeholder="e.g. 2 years, Fresher, 6 months internship…"
                />
              </div>

              <div className="field-wrap full">
                <label>Education</label>
                <input
                  value={form.education}
                  onChange={f('education')}
                  placeholder="e.g. B.Tech CSE, Delhi University"
                />
              </div>

              <div className="field-wrap full">
                <label>Short Bio <span style={{ color: 'var(--text3)', fontWeight: 400, textTransform: 'none', fontSize: '0.78rem' }}>(optional)</span></label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={f('bio')}
                  placeholder="Tell recruiters what makes you stand out…"
                />
              </div>
            </div>

            <div className="modal-foot" style={{ justifyContent: 'space-between' }}>
              <button className="btn-outline" onClick={onClose} style={{ fontSize: '0.85rem' }}>
                Skip for now
              </button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save & Continue →'}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="modal-body" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.6rem' }}>Profile saved!</h2>
              <p style={{ color: 'var(--text2)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                Your skills and experience have been saved and shared with admins. You're all set to explore jobs!
              </p>
              <button className="btn-primary" onClick={onClose} style={{ width: '100%' }}>
                Browse Jobs →
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
