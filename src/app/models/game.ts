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
  /** Дней до релиза, или null если дата вообще неизвестна. */
  daysUntilRelease: number | null;
  /** Дата релиза (YYYY-MM-DD), или null если не объявлена — форматируется под текущий язык через LocalizedDatePipe. */
  releaseDate: string | null;
  /** RAWG считает дату релиза неподтверждённой (может быть true даже при заданном releaseDate). */
  isTba: boolean;
}

/**
 * Страница списка игр — сами игры плюс общее число найденных RAWG (по всем страницам,
 * не только текущей).
 */
export interface GamesPage {
  games: Game[];
  count: number;
}

/**
 * Дополнительные детали игры, подгружаемые отдельным запросом (GET /games/{id}).
 */
export interface GameDetails {
  /** Описание игры (обычно только на английском — RAWG не локализует его). */
  description: string;
  /** Жанры. */
  genres: string[];
  /** Разработчики. */
  developers: string[];
  /** Издатели. */
  publishers: string[];
  /** Оценка Metacritic, или null если её нет. */
  metacritic: number | null;
  /** URL скриншотов игры. */
  screenshots: string[];
}
