import styles from './StepTracker.module.css';

const STEP_LABELS = ['Resume', 'Job Desc', 'Intelligence', 'Strategy', 'Output', 'Interview'];

export default function StepTracker({ currentStep, highestUnlocked, onStepClick }) {
  const fillPct = (currentStep / 6) * 100;

  return (
    <div className={styles.tracker}>
      <div className={styles.barBg}>
        <div className={styles.barFill} style={{ width: `${fillPct}%` }} />
      </div>
      <div className={styles.steps}>
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isActive    = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          const isDisabled  = stepNum > highestUnlocked;
          return (
            <button
              key={label}
              className={`${styles.step} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''} ${isDisabled ? styles.disabled : ''}`}
              onClick={() => !isDisabled && onStepClick(stepNum)}
              disabled={isDisabled}
            >
              <span className={styles.num}>{isCompleted ? '✓' : stepNum}</span>
              <span className={styles.label}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
