import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.bgGrid}></div>
      <div className={`${styles.orb} ${styles.orb1}`}></div>
      <div className={`${styles.orb} ${styles.orb2}`}></div>
      <div className={`${styles.orb} ${styles.orb3}`}></div>

      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          Powered by Llama 3.3 via Groq
        </div>

        <h1 className={styles.title}>
          Cover Letters That<br />
          <span className={styles.gradientText}>Actually Get You Hired</span>
        </h1>

        <p className={styles.subtitle}>
          Paste your resume and any job description. Our AI crafts a hyper-personalized
          cover letter that speaks the hiring manager's language — in under 10 seconds.
        </p>

        <div className={styles.ctaGroup}>
          <a href="#generate" className="btn-primary">
            Generate My Cover Letter
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="#how-it-works" className="btn-ghost">See how it works</a>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>3x</span>
            <span className={styles.statLabel}>Higher response rate</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>&lt;10s</span>
            <span className={styles.statLabel}>Generation time</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>100%</span>
            <span className={styles.statLabel}>Personalized to you</span>
          </div>
        </div>
      </div>
    </section>
  );
}
