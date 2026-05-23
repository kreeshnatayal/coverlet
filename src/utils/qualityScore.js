// Utility: Score resume/JD input quality (0–100)
export function scoreInput(text, type) {
  const len = text.trim().length;
  let score = 0;

  if (type === 'resume') {
    if (len > 100)  score += 20;
    if (len > 500)  score += 20;
    if (len > 1500) score += 15;
    if (/\d+/.test(text)) score += 15;
    if (/experience|work|job|role/i.test(text)) score += 10;
    if (/skill|proficient|expert/i.test(text)) score += 10;
    if (/(•|-)/.test(text)) score += 10;
  } else {
    if (len > 100)  score += 20;
    if (len > 500)  score += 25;
    if (len > 1000) score += 15;
    if (/require|must|qualif/i.test(text)) score += 15;
    if (/responsib|duties|you will/i.test(text)) score += 15;
    if (/company|about us|we are/i.test(text)) score += 10;
  }

  return Math.min(score, 100);
}

export function getQualityLabel(score) {
  if (score === 0)   return { label: 'Start typing to see quality score', color: 'var(--text-muted)' };
  if (score < 30)    return { label: 'Too short - add more detail', color: 'var(--text-muted)' };
  if (score < 60)    return { label: 'Decent - more detail will help', color: 'var(--text-secondary)' };
  if (score < 85)    return { label: 'Good - the AI has enough to work with', color: 'var(--text-primary)' };
  return               { label: 'Excellent - highly personalized output expected!', color: 'var(--text-primary)' };
}

export function getQualityBarColor(score) {
  if (score >= 85) return 'var(--text-primary)';
  if (score >= 60) return 'var(--text-secondary)';
  if (score >= 30) return 'var(--text-muted)';
  return 'var(--border-accent)';
}
