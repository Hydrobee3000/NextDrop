/**
 * Дней до релиза на текущий момент. Может быть отрицательным для уже вышедших игр —
 * это нормально, отличаем "сегодня" (0) от "уже вышла" (< 0) в DaysUntilPipe.
 */
export function getDaysUntilRelease(releaseDate: string | null): number {
  if (!releaseDate) {
    return 0;
  }

  return Math.ceil((new Date(releaseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}
