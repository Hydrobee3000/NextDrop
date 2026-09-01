/**
 * Ответ RAWG API по одной игре.
 */
export interface RawgGame {
  /** Идентификатор игры. */
  id: number;
  /** Название игры. */
  name: string;
  /** URL обложки. */
  background_image: string | null;
  /** Дата релиза (YYYY-MM-DD). */
  released: string | null;
  /** Анонсировано без даты релиза. */
  tba: boolean;
  /** Платформы. */
  platforms: { platform: { id: number; name: string; slug: string } }[] | null;
}

/**
 * Ответ эндпоинта списка игр.
 */
export interface RawgGameListResponse {
  /** Общее количество результатов. */
  count: number;
  /** Игры на текущей странице. */
  results: RawgGame[];
}

/**
 * Ответ RAWG API по деталям одной игры (GET /games/{id}).
 */
export interface RawgGameDetail {
  /** Описание игры без HTML-разметки. */
  description_raw: string;
  /** Жанры. */
  genres: { id: number; name: string; slug: string }[];
  /** Разработчики. */
  developers: { id: number; name: string; slug: string }[];
  /** Издатели. */
  publishers: { id: number; name: string; slug: string }[];
  /** Оценка Metacritic, или null если её нет. */
  metacritic: number | null;
}
