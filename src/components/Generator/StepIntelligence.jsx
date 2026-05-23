import styles from './StepPanel.module.css';

export default function StepIntelligence({ status, intelligenceData, onBack, onNext }) {
  const isLoading = status === 'loading';

  return (
    <div className={styles.panelInner}>
      <div className={styles.main} style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <div className={styles.stepHeader}>
          <div className={styles.iconCircle}>03</div>
          <div>
            <h3 className={styles.stepTitle}>Hiring Intelligence (The Roast)</h3>
            <p className={styles.stepDesc}>Our AI recruiter's brutal, unfiltered analysis of your fit.</p>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            <div className={styles.parsingSpinner} style={{ margin: '0 auto 20px auto' }}></div>
            <p>Analyzing company context and recruiter psychology...</p>
          </div>
        ) : intelligenceData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '20px' }}>
            
            {/* Six Second Impression */}
            <div style={{ background: 'var(--bg-card-hover)', borderLeft: '4px solid var(--border-accent)', padding: '20px', borderRadius: '0 8px 8px 0' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>
                ⏱️ The 6-Second Impression
              </div>
              <div style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text-primary)' }}>
                "{intelligenceData.sixSecondImpression}"
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Archetype & Expectations */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🧠</span>
                  <strong style={{ color: 'var(--text-primary)' }}>Candidate Archetype</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{intelligenceData.archetype}</p>
              </div>

              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🕵️</span>
                  <strong style={{ color: 'var(--text-primary)' }}>Hidden JD Expectations</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{intelligenceData.hiddenExpectations}</p>
              </div>
            </div>

            {/* Brutal Truths */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>✅</span>
                  <strong style={{ color: '#10b981' }}>Strongest Fit</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{intelligenceData.strongFit}</p>
              </div>

              <div style={{ border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🚩</span>
                  <strong style={{ color: '#ef4444' }}>Biggest Rejection Risk</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{intelligenceData.rejectionRisk}</p>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No data available.
          </div>
        )}

        <div className={styles.actions} style={{ marginTop: '40px' }}>
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
