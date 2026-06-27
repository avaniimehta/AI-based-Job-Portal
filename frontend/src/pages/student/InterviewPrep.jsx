import { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { ollamaStream } from '../../utils/ollama';

const PREP_MODES = [
  { id: 'questions', icon: '📋', label: 'Interview Questions', desc: 'AI-curated questions for your role' },
  { id: 'recommender', icon: '🤖', label: 'Job Recommender', desc: 'Get personalized job matches' },
  { id: 'mock', icon: '🎭', label: 'Mock Interview', desc: 'Practice with a live AI interviewer' },
];

const EXPERIENCE_LEVELS = ['Fresher (0-1 yr)', 'Junior (1-3 yrs)', 'Mid-level (3-5 yrs)', 'Senior (5+ yrs)'];
const WORK_PREFS = ['Remote', 'On-site', 'Hybrid', 'Open to all'];
const INTERESTS = ['Frontend Dev', 'Backend Dev', 'Full Stack', 'Data Science', 'AI/ML', 'DevOps/Cloud', 'UI/UX Design', 'Product Management', 'Cybersecurity', 'Mobile Dev'];

export default function InterviewPrep() {
  const [jobs, setJobs]           = useState([]);
  const [jobId, setJobId]         = useState('');
  const [loading, setLoading]     = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [output, setOutput]       = useState('');
  const [error, setError]         = useState('');
  const [activeMode, setActiveMode] = useState('questions');

  // Mock interview state
  const [mockHistory, setMockHistory] = useState([]);
  const [userInput, setUserInput]     = useState('');
  const [mockStage, setMockStage]     = useState(0);

  // Recommender state
  const [recSkills, setRecSkills]   = useState('');
  const [recExp, setRecExp]         = useState('');
  const [recPref, setRecPref]       = useState('');
  const [recInterests, setRecInterests] = useState([]);
  const [recOutput, setRecOutput]   = useState('');
  const [parsedRecs, setParsedRecs] = useState([]);

  const outputRef = useRef(null);

  useEffect(() => {
    api.get('/jobs').then(r => setJobs(r.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output, mockHistory, recOutput]);

  const selectedJob = jobs.find(j => String(j.id) === String(jobId));

  // ── Generate Questions ──
  const generateQuestions = () => {
    if (!selectedJob) return;
    setOutput(''); setError(''); setAiLoading(true);
    const prompt = `You are an expert technical interviewer. Generate 8 interview questions for the following job role. Mix technical and behavioural questions. Format each question numbered. After each question add a brief "Tip:" on what a good answer should cover.\n\nJob Title: ${selectedJob.title}\nCompany: ${selectedJob.company}\nDescription: ${selectedJob.description}\nRequirements: ${selectedJob.requirements || 'Not specified'}\n\nGenerate questions now:`;
    ollamaStream(prompt, t => setOutput(t), () => setAiLoading(false), err => { setError(err); setAiLoading(false); });
  };

  // ── Job Recommender ──
  const runRecommender = () => {
    if (!recSkills || !recExp) return;
    setRecOutput(''); setParsedRecs([]); setError(''); setAiLoading(true);

    const prompt = `You are a career advisor AI. Based on the candidate profile below, recommend exactly 5 job roles that best match their profile. For each job, provide:
- **Job Title** (bold)
- **Why it fits** (2-3 sentences explaining the match)
- **Key skills needed** (comma-separated)
- **Salary range in India** (LPA)
- **Growth potential** (1-2 sentences)

Candidate Profile:
- Skills: ${recSkills}
- Experience Level: ${recExp}
- Work Preference: ${recPref || 'Open to all'}
- Interests: ${recInterests.join(', ') || 'General tech'}

Format EXACTLY as:
1. **[Job Title]**
Why it fits: [explanation]
Key skills: [skills]
Salary: [range]
Growth: [potential]

2. **[Next job]**
...and so on for all 5 jobs.`;

    ollamaStream(
      prompt,
      t => setRecOutput(t),
      () => setAiLoading(false),
      err => { setError(err); setAiLoading(false); }
    );
  };

  // ── Mock Interview ──
  const startMock = async () => {
    if (!selectedJob) return;
    setMockHistory([]); setMockStage(0); setError(''); setAiLoading(true);
    const prompt = `You are conducting a mock interview for a ${selectedJob.title} role at ${selectedJob.company}. Ask ONLY ONE interview question to start. Make it a common opening question. Be friendly. Ask ONLY the question, nothing else.`;
    let q = '';
    ollamaStream(prompt, t => { q = t; }, () => { setMockHistory([{ role: 'ai', text: q }]); setAiLoading(false); }, err => { setError(err); setAiLoading(false); });
  };

  const sendMockAnswer = async () => {
    if (!userInput.trim() || aiLoading) return;
    const answer = userInput.trim();
    setUserInput('');
    const newHistory = [...mockHistory, { role: 'user', text: answer }];
    setMockHistory(newHistory);
    setAiLoading(true);
    const nextStage = mockStage + 1;
    setMockStage(nextStage);
    const historyText = newHistory.map(m => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.text}`).join('\n');
    const prompt = nextStage >= 5
      ? `You are a mock interviewer. The interview is ending. Give brief feedback on the candidate's answers and say goodbye professionally. Keep it under 100 words.\n\nInterview so far:\n${historyText}`
      : `You are conducting a mock interview for a ${selectedJob.title} role at ${selectedJob.company}.\n\nInterview so far:\n${historyText}\n\nGive a ONE sentence positive acknowledgment, then ask the NEXT interview question (question ${nextStage + 1} of 5). Ask only ONE question.`;
    let resp = '';
    ollamaStream(prompt, t => { resp = t; }, () => { setMockHistory(prev => [...prev, { role: 'ai', text: resp }]); setAiLoading(false); if (nextStage >= 5) setMockStage(99); }, err => { setError(err); setAiLoading(false); });
  };

  const toggleInterest = (i) => {
    setRecInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  // Parse output into sections for questions display
  const parseQuestionOutput = (text) => {
    if (!text) return [];
    return text.split(/\n(?=\d+\.)/).filter(Boolean);
  };

  if (loading) return <div className="spinner-page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-top">
        <div>
          <h2 className="prep-title">🎤 AI Career Coach</h2>
          <p className="sub">Powered by Mistral · Interview prep, job matching & mock interviews</p>
        </div>
      </div>

      {/* Mode selector */}
      <div className="prep-mode-grid">
        {PREP_MODES.map(m => (
          <button
            key={m.id}
            className={`prep-mode-card ${activeMode === m.id ? 'active' : ''}`}
            onClick={() => { setActiveMode(m.id); setOutput(''); setRecOutput(''); setMockHistory([]); }}
          >
            <span className="prep-mode-icon">{m.icon}</span>
            <span className="prep-mode-label">{m.label}</span>
            <span className="prep-mode-desc">{m.desc}</span>
            {activeMode === m.id && <span className="prep-mode-active-dot" />}
          </button>
        ))}
      </div>

      {error && <div className="flash flash-err" style={{marginBottom:'1rem'}}>{error}</div>}

      {/* ── Questions Mode ── */}
      {activeMode === 'questions' && (
        <div className="prep-panel">
          <div className="prep-panel-header">
            <div className="prep-panel-icon">📋</div>
            <div>
              <h3>Interview Questions Generator</h3>
              <p>Select a job and get 8 tailored interview questions with expert tips</p>
            </div>
          </div>
          <div className="prep-job-select">
            <label className="prep-label">Choose a Job Role</label>
            <select className="prep-select" value={jobId} onChange={e => { setJobId(e.target.value); setOutput(''); }}>
              <option value="">— Select a job —</option>
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title} @ {j.company}</option>)}
            </select>
          </div>

          {selectedJob && (
            <div className="prep-job-badge">
              <span className="pjb-icon">💼</span>
              <div>
                <div className="pjb-title">{selectedJob.title}</div>
                <div className="pjb-sub">{selectedJob.company} · {selectedJob.location}</div>
              </div>
              <button className="btn-primary prep-gen-btn" onClick={generateQuestions} disabled={aiLoading}>
                {aiLoading ? '⏳ Generating…' : '✨ Generate Questions'}
              </button>
            </div>
          )}

          {output ? (
            <div className="prep-questions-output" ref={outputRef}>
              {parseQuestionOutput(output).map((block, i) => (
                <div key={i} className="prep-question-block">
                  <div className="pq-number">Q{i + 1}</div>
                  <div className="pq-content">
                    {block.split('\n').map((line, li) => {
                      if (line.match(/^Tip:/i)) return <div key={li} className="pq-tip">💡 {line.replace(/^Tip:\s*/i, '')}</div>;
                      if (line.trim()) return <div key={li} className="pq-text">{line.replace(/^\d+\.\s*/, '')}</div>;
                      return null;
                    })}
                  </div>
                </div>
              ))}
              {aiLoading && <span className="prep-cursor">▌</span>}
            </div>
          ) : selectedJob ? (
            <div className="prep-empty">
              <div className="prep-empty-icon">✨</div>
              <p>Click "Generate Questions" to get AI-powered interview preparation for {selectedJob.title}</p>
            </div>
          ) : (
            <div className="prep-empty">
              <div className="prep-empty-icon">📋</div>
              <p>Select a job above to generate interview questions</p>
            </div>
          )}
        </div>
      )}

      {/* ── Recommender Mode ── */}
      {activeMode === 'recommender' && (
        <div className="prep-panel">
          <div className="prep-panel-header">
            <div className="prep-panel-icon">🤖</div>
            <div>
              <h3>AI Job Recommender</h3>
              <p>Tell us about yourself and we'll find your perfect career matches</p>
            </div>
          </div>

          <div className="rec-form">
            <div className="rec-field">
              <label className="prep-label">Your Skills <span className="prep-label-hint">(comma-separated)</span></label>
              <input className="prep-input" placeholder="e.g. React, Python, SQL, Figma, AWS…" value={recSkills} onChange={e => setRecSkills(e.target.value)} />
            </div>

            <div className="rec-field">
              <label className="prep-label">Experience Level</label>
              <div className="rec-radio-group">
                {EXPERIENCE_LEVELS.map(lvl => (
                  <label key={lvl} className={`rec-radio ${recExp === lvl ? 'active' : ''}`}>
                    <input type="radio" name="exp" value={lvl} checked={recExp === lvl} onChange={() => setRecExp(lvl)} hidden />
                    <span className="rec-radio-dot" />
                    {lvl}
                  </label>
                ))}
              </div>
            </div>

            <div className="rec-field">
              <label className="prep-label">Work Preference</label>
              <div className="rec-radio-group">
                {WORK_PREFS.map(p => (
                  <label key={p} className={`rec-radio ${recPref === p ? 'active' : ''}`}>
                    <input type="radio" name="pref" value={p} checked={recPref === p} onChange={() => setRecPref(p)} hidden />
                    <span className="rec-radio-dot" />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            <div className="rec-field">
              <label className="prep-label">Interests <span className="prep-label-hint">(select all that apply)</span></label>
              <div className="rec-chips">
                {INTERESTS.map(i => (
                  <button
                    key={i}
                    type="button"
                    className={`rec-chip ${recInterests.includes(i) ? 'active' : ''}`}
                    onClick={() => toggleInterest(i)}
                  >
                    {recInterests.includes(i) ? '✓ ' : ''}{i}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn-primary rec-submit-btn"
              onClick={runRecommender}
              disabled={aiLoading || !recSkills || !recExp}
            >
              {aiLoading ? '🔍 Analyzing your profile…' : '🚀 Find My Perfect Jobs'}
            </button>
          </div>

          {recOutput && (
            <div className="rec-results" ref={outputRef}>
              <div className="rec-results-header">
                <h4>🎯 Your Personalized Job Matches</h4>
                <span className="rec-results-sub">Based on your profile</span>
              </div>
              {recOutput.split(/\n(?=\d+\.)/).filter(Boolean).map((block, idx) => {
                const lines = block.split('\n').filter(Boolean);
                const titleLine = lines.find(l => l.match(/\*\*.+\*\*/));
                const title = titleLine ? titleLine.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '') : `Job ${idx + 1}`;
                const restLines = lines.filter(l => l !== titleLine);

                return (
                  <div key={idx} className="rec-result-card">
                    <div className="rrc-rank">#{idx + 1}</div>
                    <div className="rrc-body">
                      <h4 className="rrc-title">{title}</h4>
                      {restLines.map((line, li) => {
                        if (line.startsWith('Why it fits:')) return <div key={li} className="rrc-row rrc-why"><span className="rrc-row-icon">💡</span><span>{line.replace('Why it fits:', '').trim()}</span></div>;
                        if (line.startsWith('Key skills:')) return <div key={li} className="rrc-row rrc-skills"><span className="rrc-row-icon">🛠️</span><span>{line.replace('Key skills:', '').trim()}</span></div>;
                        if (line.startsWith('Salary:')) return <div key={li} className="rrc-row rrc-salary"><span className="rrc-row-icon">💰</span><span>{line.replace('Salary:', '').trim()}</span></div>;
                        if (line.startsWith('Growth:')) return <div key={li} className="rrc-row rrc-growth"><span className="rrc-row-icon">📈</span><span>{line.replace('Growth:', '').trim()}</span></div>;
                        return null;
                      })}
                    </div>
                  </div>
                );
              })}
              {aiLoading && <span className="prep-cursor">▌</span>}
            </div>
          )}
        </div>
      )}

      {/* ── Mock Interview Mode ── */}
      {activeMode === 'mock' && (
        <div className="prep-panel">
          <div className="prep-panel-header">
            <div className="prep-panel-icon">🎭</div>
            <div>
              <h3>Mock Interview</h3>
              <p>Practice with an AI interviewer in real-time conversation</p>
            </div>
          </div>

          <div className="prep-job-select">
            <label className="prep-label">Choose a Job Role to Interview For</label>
            <select className="prep-select" value={jobId} onChange={e => { setJobId(e.target.value); setMockHistory([]); setMockStage(0); }}>
              <option value="">— Select a job —</option>
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title} @ {j.company}</option>)}
            </select>
          </div>

          {selectedJob && mockHistory.length === 0 && (
            <div className="prep-job-badge">
              <span className="pjb-icon">🎭</span>
              <div>
                <div className="pjb-title">{selectedJob.title}</div>
                <div className="pjb-sub">{selectedJob.company} · Practice 5 interview questions</div>
              </div>
              <button className="btn-primary prep-gen-btn" onClick={startMock} disabled={aiLoading}>
                {aiLoading ? '⏳ Starting…' : '▶ Start Interview'}
              </button>
            </div>
          )}

          {mockHistory.length > 0 && (
            <div className="mock-chat-container">
              <div className="mock-chat-header">
                <div className="mock-interviewer-badge">
                  <span className="mib-avatar">🤖</span>
                  <div>
                    <div className="mib-name">AI Interviewer</div>
                    <div className="mib-role">{selectedJob?.title} Interview</div>
                  </div>
                </div>
                <div className="mock-progress-bar">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className={`mock-progress-dot ${mockStage >= n ? 'done' : mockStage === n - 1 ? 'active' : ''}`} />
                  ))}
                  <span className="mock-progress-label">Q{Math.min(mockStage+1,5)}/5</span>
                </div>
              </div>

              <div className="mock-chat-body" ref={outputRef}>
                {mockHistory.map((m, i) => (
                  <div key={i} className={`mock-bubble-wrap ${m.role === 'ai' ? 'ai' : 'user'}`}>
                    {m.role === 'ai' && <span className="mock-bubble-avatar">🤖</span>}
                    <div className={`mock-bubble ${m.role === 'ai' ? 'mock-bubble-ai' : 'mock-bubble-user'}`}>
                      {m.role === 'ai' && <div className="mock-bubble-label">Interviewer</div>}
                      {m.text}
                    </div>
                    {m.role === 'user' && <span className="mock-bubble-avatar user">👤</span>}
                  </div>
                ))}
                {aiLoading && (
                  <div className="mock-bubble-wrap ai">
                    <span className="mock-bubble-avatar">🤖</span>
                    <div className="mock-bubble mock-bubble-ai mock-typing">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
              </div>

              {mockStage < 99 && (
                <div className="mock-chat-input">
                  <input
                    className="mock-input"
                    placeholder="Type your answer… (Enter to send)"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMockAnswer()}
                    disabled={aiLoading}
                  />
                  <button className="btn-primary mock-send-btn" onClick={sendMockAnswer} disabled={aiLoading || !userInput.trim()}>
                    Send ↑
                  </button>
                </div>
              )}
              {mockStage >= 99 && (
                <div className="mock-done-bar">
                  <span>🎉 Interview complete!</span>
                  <button className="btn-outline" onClick={startMock}>🔄 Try Again</button>
                </div>
              )}
            </div>
          )}

          {!selectedJob && (
            <div className="prep-empty">
              <div className="prep-empty-icon">🎭</div>
              <p>Select a job to start your mock interview session</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
