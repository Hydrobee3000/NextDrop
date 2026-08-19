/**
 * Формат данных об игре.
 */
export interface Game {
  /** Идентификатор игры. */
  id: string;
  /** Название игры. */
  title: string;
  /** Платформы. */
  platforms: string[];
  /** URL реальной обложки, или null если её нет. */
  coverImageUrl: string | null;
  /** Инициалы для обложки-заглушки. */
  coverInitials: string;
  /** Градиент для обложки-заглушки. */
  coverGradient: string;
  /** Дней до релиза. */
  daysUntilRelease: number;
  /** Дата релиза в читаемом виде. */
  releaseDateLabel: string;
}
