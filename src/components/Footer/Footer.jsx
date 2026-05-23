import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>CoverLet<span className={styles.logoAi}>AI</span></span>
        </div>
        <p className={styles.tagline}>Helping ambitious people land their dream jobs.</p>
        <p className={styles.note}>Your data never leaves your browser. Powered by Llama 3 via Groq.</p>
      </div>
    </footer>
  );
}
