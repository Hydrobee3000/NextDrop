export type ReleaseUrgencyTier = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Уровень "срочности" релиза по количеству дней — 1 самый скорый (ярче), 7 самый дальний (тусклее).
 */
export function getReleaseUrgencyTier(daysUntilRelease: number): ReleaseUrgencyTier {
  if (daysUntilRelease < 2) return 1;
  if (daysUntilRelease < 7) return 2;
  if (daysUntilRelease < 30) return 3;
  if (daysUntilRelease < 90) return 4;
  if (daysUntilRelease < 180) return 5;
  if (daysUntilRelease < 365) return 6;
  return 7;
}
