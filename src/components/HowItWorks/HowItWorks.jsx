import { useEffect, useRef } from 'react';
import styles from './HowItWorks.module.css';

const STEPS = [
  { num: '01', icon: '📄', title: 'Paste Your Resume', desc: 'Share your experience, skills, and achievements. The more detail you give, the more personalized your letter.' },
  { num: '02', icon: '🎯', title: 'Add the Job Description', desc: 'Paste the full job posting. Our AI identifies key requirements and maps them to your strongest experiences.' },
  { num: '03', icon: '✨', title: 'Customize & Generate', desc: 'Set your tone, focus areas, and any special context. Get a tailored cover letter that stands out instantly.' },
];

export default function HowItWorks() {
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 120);
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.15 }
    );
    cardsRef.current.forEach(card => card && observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.inner}>
        <div className="section-badge" style={{ marginBottom: '20px' }}>How It Works</div>
        <h2 className={styles.title}>From blank page to hired in 4 steps</h2>
        <div className={styles.grid}>
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              ref={el => cardsRef.current[i] = el}
              className={styles.card}
              style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
            >
              <div className={styles.stepNum}>{step.num}</div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
