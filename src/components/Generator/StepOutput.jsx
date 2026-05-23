import { useState } from 'react';
import styles from './StepPanel.module.css';

export default function StepOutput({ status, outputText, rationaleText, matchScore, errorMsg, loadingStep, LOADING_STEPS, onRegenerate, onRefine, onBack }) {
  const [copied, setCopied]     = useState(false);
  const [refineInput, setRefineInput] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { alert('Copy failed. Please select the text manually.'); }
  };

  const handleDownload = async () => {
    try {
      const { Document, Packer, Paragraph, TextRun } = await import('docx');
      const { saveAs } = await import('file-saver');

      const paragraphs = outputText.split('\n').map(text => {
        return new Paragraph({
          children: [new TextRun({ text, font: "Calibri", size: 24 })],
          spacing: { after: 200 }
        });
      });

      const doc = new Document({
        sections: [{ properties: {}, children: paragraphs }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'cover_letter.docx');
    } catch (err) {
      alert('Failed to generate DOCX. Please copy the text manually.');
      console.error(err);
    }
  };
  
  const submitRefine = () => {
    if (!refineInput.trim()) return;
    onRefine(refineInput);
    setRefineInput('');
  };

  const renderHighlightedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Split by common numeric patterns: digits, percentages, $ amounts, 10+, 50K
      const parts = line.split(/(\$?\d+(?:\.\d+)?%?(?:k|m|b)?|\d+\+?)/i);
      return (
        <div key={i} style={{ minHeight: '1.5em' }}>
          {parts.map((part, j) => {
            if (/^(\$?\d+(?:\.\d+)?%?(?:k|m|b)?|\d+\+?)$/i.test(part)) {
              return <mark key={j} className={styles.highlightNumber} title="AI-PM Trust & Verify: Please verify this metric is accurate to your resume">{part}</mark>;
            }
            return part;
          })}
        </div>
      );
    });
  };

  return (
    <div className={styles.outputWrapper}>
      {/* LOADING */}
      {status === 'loading' && (
        <div className={styles.loadingState}>
          <div className={styles.loadingAnim}>
            <div className={styles.loadingOrb}></div>
            <div className={styles.loadingRings}>
              <div className={styles.loadingRing}></div>
              <div className={styles.loadingRing}></div>
              <div className={styles.loadingRing}></div>
            </div>
          </div>
          <h3 className={styles.loadingTitle}>Crafting your cover letter…</h3>
          <div className={styles.loadingStepsList}>
            {LOADING_STEPS.map((label, i) => (
              <div
                key={label}
                className={`${styles.loadingStep} ${i === loadingStep ? styles.loadingStepActive : ''} ${i < loadingStep ? styles.loadingStepDone : ''}`}
              >
                {i < loadingStep ? `✓ ${label.replace(/^\\S+\\s/, '')}` : label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OUTPUT */}
      {(status === 'done') && (
        <div className={styles.outputState}>
          <div className={styles.outputHeader}>
            <div className={styles.outputTitleGroup}>
              <span className={styles.outputBadge}>✦ AI Generated</span>
              <h3 className={styles.outputTitle}>Your Cover Letter</h3>
            </div>
            <div className={styles.outputActions}>
              <button className={`${styles.outputBtn} ${copied ? styles.outputBtnCopied : ''}`} onClick={handleCopy}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {copied ? <polyline points="20 6 9 17 4 12"/> : <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>}
                </svg>
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button className={styles.outputBtn} onClick={handleDownload}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                Download
              </button>
              <button className={`${styles.outputBtn} ${styles.outputBtnRegen}`} onClick={onRegenerate}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/></svg>
                Regenerate
              </button>
            </div>
          </div>

          <div className={styles.outputBodyLayout}>
            <div className={styles.outputTextWrapper}>
              <div className={styles.outputText}>
                {renderHighlightedText(outputText)}
                {status === 'loading' && <span className={styles.cursor}></span>}
              </div>
              
              {/* HUMAN IN THE LOOP: Refinement Input */}
              <div className={styles.refineBox}>
                <label className={styles.refineLabel}>Iterate & Refine</label>
                <div className={styles.refineInputGroup}>
                  <input 
                    type="text" 
                    className={styles.refineInput} 
                    placeholder="E.g. Make it shorter, don't mention my gap year..." 
                    value={refineInput}
                    onChange={(e) => setRefineInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitRefine()}
                  />
                  <button className="btn-primary" onClick={submitRefine}>Refine</button>
                </div>
              </div>
            </div>

            {/* EXPLAINABILITY: Strategy Rationale */}
            <div className={styles.sidebar}>
              {/* EVALUATION: AI Match Score */}
              {matchScore && (
                <div className={styles.rationaleCard} style={{ marginBottom: '16px' }}>
                  <div className={styles.rationaleHeader}>AI Evaluation Match Score</div>
                  <div className={styles.rationaleBody}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {matchScore.matchPercentage}% Match
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <strong>Integrated Keywords:</strong> {matchScore.matchedKeywords?.join(', ')}
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.rationaleCard}>
                <div className={styles.rationaleHeader}>AI Strategy Rationale</div>
                <div className={styles.rationaleBody}>
                  {rationaleText || 'Analyzing strategy...'}
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.feedbackRow}>
            <button className="btn-ghost-sm" onClick={onBack}>Start Over</button>
          </div>
        </div>
      )}

      {/* ERROR */}
      {status === 'error' && (
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Something went wrong</h3>
          <p className={styles.errorMsg}>{errorMsg}</p>
          <button className="btn-primary" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Settings
          </button>
        </div>
      )}
    </div>
  );
}
