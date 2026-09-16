/**
 * Уровень "срочности" релиза для цвета бейджа:
 * - 0 — уже вышла
 * - 1 — сегодня/завтра
 * - 2 — на этой неделе
 * - 3 — в этом месяце
 * - 4 — в ближайшие 3 месяца
 * - 5 — в ближайшие полгода
 * - 6 — в ближайший год
 * - 7 — дальше года
 */
export type ReleaseUrgencyTier = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Определяет {@link ReleaseUrgencyTier} по количеству дней до релиза. */
export function getReleaseUrgencyTier(daysUntilRelease: number): ReleaseUrgencyTier {
  if (daysUntilRelease < 0) return 0; // уже вышла
  if (daysUntilRelease < 2) return 1; // сегодня/завтра
  if (daysUntilRelease < 7) return 2; // на этой неделе
  if (daysUntilRelease < 30) return 3; // в этом месяце
  if (daysUntilRelease < 90) return 4; // в ближайшие 3 месяца
  if (daysUntilRelease < 180) return 5; // в ближайшие полгода
  if (daysUntilRelease < 365) return 6; // в ближайший год
  return 7; // дальше года
}
