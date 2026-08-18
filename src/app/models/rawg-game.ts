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
