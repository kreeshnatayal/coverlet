import { useState, useEffect } from 'react';
import styles from './StepPanel.module.css';

const LOADING_STAGES = [
  'Scanning job description keywords...',
  'Profiling candidate background...',
  'Running recruiter simulation...',
  'Calculating interview probability...',
];

function ProbabilityRing({ value }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (value / 100) * circumference;
  const color = value >= 70 ? '#10b981' : value >= 40 ? '#f59e0b' : '#ef4444';
  const label = value >= 70 ? 'Strong Fit' : value >= 40 ? 'Moderate Fit' : 'Weak Fit';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease' }}
        />
        <text
          x="70" y="75" textAnchor="middle"
          style={{ fill: 'var(--text-primary)', fontSize: '26px', fontWeight: '700', fontFamily: 'var(--font-display)', transform: 'rotate(90deg)', transformOrigin: '70px 70px' }}
        >
          {value}%
        </text>
      </svg>
      <span style={{ fontSize: '13px', fontWeight: '600', color, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

function TypewriterText({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return <span>{displayed}<span style={{ opacity: displayed.length < text?.length ? 1 : 0, animation: 'blink 1s step-end infinite' }}>|</span></span>;
}

export default function StepIntelligence({ status, errorMsg, intelligenceData, onBack, onNext }) {
  const isLoading = status === 'loading';
  const isError   = status === 'error' && !intelligenceData;
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    if (!isLoading) { setStageIdx(0); return; }
    const t = setInterval(() => setStageIdx(i => Math.min(i + 1, LOADING_STAGES.length - 1)), 900);
    return () => clearInterval(t);
  }, [isLoading]);

  return (
    <div className={styles.panelInner}>
      <div className={styles.main} style={{ width: '100%', maxWidth: '820px', margin: '0 auto' }}>

        <div className={styles.stepHeader}>
          <div className={styles.iconCircle} style={{ fontFamily: 'var(--font-display)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>03</div>
          <div>
            <h3 className={styles.stepTitle}>Hiring Intelligence</h3>
            <p className={styles.stepDesc}>Your AI recruiter's brutal, unfiltered analysis of your candidacy.</p>
          </div>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div style={{ padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
            <div style={{ position: 'relative', width: '64px', height: '64px' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(239,68,68,0.1)', borderTopColor: '#ef4444', animation: 'spin-ring 0.9s linear infinite' }} />
              <div style={{ position: 'absolute', inset: '10px', borderRadius: '50%', border: '2px solid rgba(239,68,68,0.05)', borderTopColor: 'rgba(239,68,68,0.5)', animation: 'spin-ring 1.4s linear infinite reverse' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '340px' }}>
              {LOADING_STAGES.map((stage, i) => (
                <div key={stage} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  color: i < stageIdx ? '#10b981' : i === stageIdx ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '14px', transition: 'color 0.3s ease',
                }}>
                  <span style={{ fontSize: '12px', minWidth: '16px' }}>
                    {i < stageIdx ? '✓' : i === stageIdx ? '›' : '○'}
                  </span>
                  {stage}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', background: 'rgba(239,68,68,0.05)', marginTop: '20px' }}>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Analysis Failed</p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{errorMsg}</p>
            <button className="btn-ghost" style={{ marginTop: '16px' }} onClick={onBack}>Try Again</button>
          </div>
        )}

        {/* DATA */}
        {!isLoading && intelligenceData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '20px', animation: 'slide-in 0.4s ease' }}>

            {/* Hero row: Probability + 6-Second Impression */}
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '28px', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px' }}>
              {typeof intelligenceData.interviewProbability === 'number' && (
                <ProbabilityRing value={intelligenceData.interviewProbability} />
              )}
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Recruiter's 6-Second Verdict
                </div>
                <div style={{ fontSize: '19px', fontWeight: '500', color: 'var(--text-primary)', lineHeight: '1.5', fontStyle: 'italic' }}>
                  "<TypewriterText text={intelligenceData.sixSecondImpression} />"
                </div>
                {intelligenceData.probabilityReason && (
                  <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    {intelligenceData.probabilityReason}
                  </div>
                )}
              </div>
            </div>

            {/* Archetype + Hidden Expectations */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  🧠 Candidate Archetype
                </div>
                <div style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', marginBottom: '10px' }}>
                  {intelligenceData.archetype}
                </div>
              </div>
              <div style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  🕵️ What the JD Actually Means
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>{intelligenceData.hiddenExpectations}</p>
              </div>
            </div>

            {/* Strong Fit + Rejection Risk */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ border: '1px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.04)', borderRadius: '10px', padding: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#10b981', marginBottom: '10px' }}>
                  ✅ Strongest Fit Signal
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>{intelligenceData.strongFit}</p>
              </div>
              <div style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)', borderRadius: '10px', padding: '20px', animation: 'pulse-danger 3s ease-in-out infinite' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#ef4444', marginBottom: '10px' }}>
                  🚩 Biggest Rejection Risk
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>{intelligenceData.rejectionRisk}</p>
              </div>
            </div>

          </div>
        )}

        <div className={styles.actions} style={{ marginTop: '36px' }}>
          <button className="btn-ghost" onClick={onBack} disabled={isLoading}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
          <button className="btn-primary" onClick={onNext} disabled={isLoading || !intelligenceData}>
            Continue to Strategy
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
