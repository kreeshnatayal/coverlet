import { scoreInput, getQualityLabel, getQualityBarColor } from '../../utils/qualityScore';
import styles from './QualityMeter.module.css';

export default function QualityMeter({ text, type }) {
  const score = scoreInput(text, type);
  const { label, color } = getQualityLabel(score);
  const barColor = getQualityBarColor(score);

  return (
    <div className={styles.meter}>
      <div className={styles.header}>Input Quality</div>
      <div className={styles.barBg}>
        <div
          className={styles.barFill}
          style={{ width: `${score}%`, background: barColor }}
        />
      </div>
      <div className={styles.label} style={{ color }}>{label}</div>
    </div>
  );
}
