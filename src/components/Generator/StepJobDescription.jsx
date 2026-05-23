import { useState } from 'react';
import QualityMeter from './QualityMeter';
import styles from './StepPanel.module.css';

const TIPS = [
  { title: 'Copy the full posting', desc: 'Don\'t summarize - paste everything including "About us" sections for tone matching.' },
  { title: 'Include the company name', desc: 'The AI personalizes references to the company culture and mission.' },
  { title: 'Note the seniority level', desc: 'Entry-level vs. Director roles require very different tones and emphasis.' },
  { title: 'Include "nice-to-haves"', desc: 'These are opportunities to stand out if you have matching experience.' },
];

export default function StepJobDescription({ jobDesc, onChange, onNext, onBack }) {
  return (
    <div className={styles.panelInner}>
      <div className={styles.main}>
        <div className={styles.stepHeader}>
          <div className={styles.iconCircle}>02</div>
          <div>
            <h3 className={styles.stepTitle}>Job Description</h3>
            <p className={styles.stepDesc}>Paste the full job posting. The AI will extract key requirements and match them to your profile.</p>
          </div>
        </div>

        <div className={styles.textareaWrapper}>
          <textarea
            className={styles.textarea}
            value={jobDesc}
            onChange={e => onChange(e.target.value)}
            placeholder={`Paste the full job description here…\n\nInclude:\n• Job title and company name\n• Key responsibilities\n• Required qualifications\n• Nice-to-have skills\n• Company culture info (if available)`}
            rows={14}
          />
          <div className={styles.charCount}>{jobDesc.length.toLocaleString()} characters</div>
        </div>

        <div className={styles.actions}>
          <button className="btn-ghost" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
          <button 
            className="btn-primary" 
            onClick={onNext}
            disabled={!jobDesc || jobDesc.length < 50}
          >
            Continue to Customize
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.tipsCard}>
          <div className={styles.tipsHeader}>Tips for Best Results</div>
          <ul className={styles.tipsList}>
            {TIPS.map(tip => (
              <li key={tip.title} className={styles.tipItem}>
                <span className={styles.tipCheck}>✓</span>
                <div>
                  <strong>{tip.title}</strong>
                  <p>{tip.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <QualityMeter text={jobDesc} type="jd" />
      </div>
    </div>
  );
}
