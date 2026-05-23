import { useState, useEffect } from 'react';
import styles from './StepPanel.module.css';

function AccordionItem({ item, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: '10px',
      overflow: 'hidden',
      transition: 'border-color 0.2s ease',
      borderColor: open ? 'rgba(255,255,255,0.15)' : 'var(--border)',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: '16px', padding: '18px 20px', background: open ? 'var(--bg-card-hover)' : 'var(--bg-card)',
          border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <span style={{
            minWidth: '26px', height: '26px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', flexShrink: 0,
          }}>
            {index + 1}
          </span>
          <span style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-primary)', lineHeight: '1.5' }}>
            {item.question}
          </span>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ flexShrink: 0, marginTop: '4px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease', color: 'var(--text-muted)' }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div style={{ padding: '0 20px 20px 60px', animation: 'accordion-open 0.25s ease' }}>
          <div style={{
            fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px',
            color: 'var(--text-muted)', marginBottom: '6px',
          }}>
            Why they ask this
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.6' }}>
            {item.why}
          </p>
          <div style={{
            background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: '8px', padding: '14px 16px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#60a5fa', marginBottom: '6px' }}>
              💡 How to Answer
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {item.hint}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepInterviewPrep({ interviewQuestions, interviewLoading, onBack, onDone }) {
  return (
    <div className={styles.panelInner}>
      <div className={styles.main} style={{ width: '100%', maxWidth: '760px', margin: '0 auto' }}>

        <div className={styles.stepHeader}>
          <div className={styles.iconCircle} style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>06</div>
          <div>
            <h3 className={styles.stepTitle}>Interview Prep</h3>
            <p className={styles.stepDesc}>5 high-probability questions the recruiter will ask - with tactical hints on how to answer them.</p>
          </div>
        </div>

        {interviewLoading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            <div style={{
              width: '48px', height: '48px', margin: '0 auto 20px',
              borderRadius: '50%', border: '2px solid rgba(59,130,246,0.15)',
              borderTopColor: '#60a5fa', animation: 'spin-ring 0.9s linear infinite',
            }} />
            <p>Generating interview questions based on your gaps...</p>
          </div>
        )}

        {!interviewLoading && interviewQuestions && interviewQuestions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', animation: 'slide-in 0.4s ease' }}>
            {interviewQuestions.map((q, i) => (
              <AccordionItem key={i} item={q} index={i} />
            ))}
          </div>
        )}

        {!interviewLoading && interviewQuestions && interviewQuestions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Could not generate questions. Please try regenerating.
          </div>
        )}

        <div className={styles.actions} style={{ marginTop: '36px' }}>
          <button className="btn-ghost" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Letter
          </button>
          <button className="btn-primary" onClick={onDone}>
            Done - Start a New Application
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
