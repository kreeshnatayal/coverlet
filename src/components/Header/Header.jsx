import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>
            CoverCraft <span className={styles.logoAi}>AI</span>
          </span>
        </div>
        <nav className={styles.nav}>
          <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.navLink}>GitHub</a>
        </nav>
      </div>
    </header>
  );
}
