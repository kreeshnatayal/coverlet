import { buildPromptPreview } from '../../utils/promptBuilder';
import styles from './StepPanel.module.css';

const TONES = [
  { id: 'yc_startup',     name: 'YC Startup',     desc: 'Action-biased, low fluff, velocity' },
  { id: 'big_tech_pm',    name: 'Big Tech PM',    desc: 'Frameworks, scalable, analytical' },
  { id: 'founder_office', name: 'Founder Office', desc: 'Ambiguity tolerance, ownership' },
  { id: 'consulting',     name: 'Consulting',     desc: 'Structured, MECE, client-facing' },
  { id: 'design_first',   name: 'Design-First',   desc: 'User-centric, empathy, polished' },
  { id: 'enterprise',     name: 'Enterprise',     desc: 'Risk-averse, team-oriented, formal' },
];

const LENGTHS = [
  { id: 'concise',  label: 'Concise',  hint: '~200 words - punchy & direct' },
  { id: 'standard', label: 'Standard', hint: '~350 words - balanced & thorough' },
  { id: 'detailed', label: 'Detailed', hint: '~500 words - comprehensive & deep' },
];

const FOCUS_OPTIONS = [
  'Leadership', 'Technical Skills', 'Business Impact', 'Innovation',
  'Collaboration', 'Growth Mindset', 'Customer Focus', 'Data-Driven',
];

export default function StepCustomize({ settings, onChange, onBack, onGenerate }) {
  const { tone, length, focus, pivotContext, metricContext, companyContext } = settings;

  const toggleFocus = (f) => {
    const next = focus.includes(f) ? focus.filter(x => x !== f) : [...focus, f];
    onChange({ ...settings, focus: next });
  };

  const promptPreview = buildPromptPreview({ tone, length, focus, pivotContext, metricContext, companyContext });

  return (
    <div className={styles.panelInner}>
      <div className={styles.main}>
        <div className={styles.stepHeader}>
          <div className={styles.iconCircle}>03</div>
          <div>
            <h3 className={styles.stepTitle}>Customize Your Letter</h3>
            <p className={styles.stepDesc}>Fine-tune the AI output to match your personality and the role.</p>
          </div>
        </div>

        {/* MODEL */}
        <div className={styles.customSection}>
          <label className={styles.customLabel}>
            Model Strategy
            <span className={styles.labelHint}>Balance between logic depth and generation speed</span>
          </label>
          <div className={styles.toneGrid}>
            <button
              className={`${styles.toneBtn} ${settings.model === 'llama-3.3-70b-versatile' ? styles.toneBtnActive : ''}`}
              onClick={() => onChange({ ...settings, model: 'llama-3.3-70b-versatile' })}
            >
              <span className={styles.toneName}>Deep Strategy</span>
              <span className={styles.toneDesc}>Highest quality, standard speed</span>
            </button>
            <button
              className={`${styles.toneBtn} ${settings.model === 'llama-3.1-8b-instant' ? styles.toneBtnActive : ''}`}
              onClick={() => onChange({ ...settings, model: 'llama-3.1-8b-instant' })}
            >
              <span className={styles.toneName}>Fast Draft</span>
              <span className={styles.toneDesc}>Ultra-fast speed, good quality</span>
            </button>
          </div>
        </div>

        {/* TONE */}
        <div className={styles.customSection}>
          <label className={styles.customLabel}>
            Tone & Style
            <span className={styles.labelHint}>How should your letter sound?</span>
          </label>
          <div className={styles.toneGrid}>
            {TONES.map(t => (
              <button
                key={t.id}
                className={`${styles.toneBtn} ${tone === t.id ? styles.toneBtnActive : ''}`}
                onClick={() => onChange({ ...settings, tone: t.id })}
              >
                <span className={styles.toneName}>{t.name}</span>
                <span className={styles.toneDesc}>{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* LENGTH */}
        <div className={styles.customSection}>
          <label className={styles.customLabel}>Letter Length</label>
          <div className={styles.lengthOptions}>
            {LENGTHS.map(l => (
              <label key={l.id} className={`${styles.radioOption} ${length === l.id ? styles.radioActive : ''}`}>
                <input type="radio" name="length" value={l.id} checked={length === l.id} onChange={() => onChange({ ...settings, length: l.id })} />
                <span className={styles.radioCustom}></span>
                <div className={styles.radioContent}>
                  <span className={styles.radioTitle}>{l.label}</span>
                  <span className={styles.radioHint}>{l.hint}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* FOCUS */}
        <div className={styles.customSection}>
          <label className={styles.customLabel}>
            Focus Emphasis
            <span className={styles.labelHint}>Select what to highlight most (optional)</span>
          </label>
          <div className={styles.focusTags}>
            {FOCUS_OPTIONS.map(f => (
              <button
                key={f}
                className={`${styles.focusTag} ${focus.includes(f) ? styles.focusTagSelected : ''}`}
                onClick={() => toggleFocus(f)}
              >{f}</button>
            ))}
          </div>
        </div>

        {/* EXTRA CONTEXT (Structured) */}
        <div className={styles.customSection}>
          <label className={styles.customLabel}>
            Additional Context (Optional)
            <span className={styles.labelHint}>Provide specific details to guide the AI</span>
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)' }}>Are you pivoting careers?</div>
              <input
                type="text"
                className={styles.refineInput} // reusing style
                style={{ width: '100%' }}
                value={pivotContext}
                onChange={e => onChange({ ...settings, pivotContext: e.target.value })}
                placeholder="E.g. Transitioning from Finance to Tech PM"
              />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)' }}>What's your #1 metric to highlight?</div>
              <input
                type="text"
                className={styles.refineInput}
                style={{ width: '100%' }}
                value={metricContext}
                onChange={e => onChange({ ...settings, metricContext: e.target.value })}
                placeholder="E.g. Grew user base by 40% in 6 months"
              />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)' }}>Why this company specifically?</div>
              <input
                type="text"
                className={styles.refineInput}
                style={{ width: '100%' }}
                value={companyContext}
                onChange={e => onChange({ ...settings, companyContext: e.target.value })}
                placeholder="E.g. I am a huge fan of your recent open-source launch"
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className="btn-ghost" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
          <button className="btn-generate" onClick={onGenerate}>
            <span className={styles.generateIcon}>✦</span>
            Generate Cover Letter
          </button>
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.tipsCard}>
          <div className={styles.tipsHeader}>Customization Tips</div>
          <ul className={styles.tipsList}>
            <li className={styles.tipItem}>
              <span className={styles.tipCheck}>✓</span>
              <div><strong>Match the company culture</strong><p>Startups love bold & conversational. Enterprise firms prefer professional tones.</p></div>
            </li>
            <li className={styles.tipItem}>
              <span className={styles.tipCheck}>✓</span>
              <div><strong>Use context for career pivots</strong><p>If you're changing industries, add context explaining your transferable skills.</p></div>
            </li>
            <li className={styles.tipItem}>
              <span className={styles.tipCheck}>✓</span>
              <div><strong>Focus on the right things</strong><p>Early-career? Highlight growth. Senior roles? Lead with impact and leadership.</p></div>
            </li>
          </ul>
        </div>

        <div className={styles.promptPreviewCard}>
          <div className={styles.promptPreviewHeader}>Prompt Preview</div>
          <div className={styles.promptPreviewBody}>{promptPreview}</div>
        </div>
      </div>
    </div>
  );
}
