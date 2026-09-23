/**
 * Дней до релиза на текущий момент, или null если дата вообще неизвестна.
 */
export function getDaysUntilRelease(releaseDate: string | null): number | null {
  if (!releaseDate) {
    return null;
  }

  return Math.ceil((new Date(releaseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}
