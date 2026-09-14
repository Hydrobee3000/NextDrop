import { getPlatformIconKind } from './platform-icon';

/**
 * ID родительских платформ RAWG (parent_platforms) для чипсов фильтра.
 * Строка, а не число — для Apple нужно сразу два ID (iOS + macOS) через запятую.
 */
export const FILTER_PARENT_PLATFORM_ID: Record<string, string> = {
  pc: '1',
  playstation: '2',
  xbox: '3',
  switch: '7',
  web: '14',
  apple: '4,5',
  android: '8',
};

/**
 * Категория иконки (см. platform-icon.ts), которой соответствует чипс фильтра.
 */
const FILTER_ICON_KIND: Record<string, string> = {
  pc: 'pc',
  playstation: 'playstation',
  xbox: 'xbox',
  switch: 'nintendo',
  web: 'web',
  apple: 'apple',
  android: 'android',
};

/**
 * Совпадает ли платформа игры с активным фильтром ('all' совпадает всегда).
 */
export function platformMatchesFilter(platform: string, filter: string): boolean {
  if (filter === 'all') {
    return true;
  }
  return getPlatformIconKind(platform) === FILTER_ICON_KIND[filter];
}

/**
 * Все ключи фильтров-платформ, доступные для исключения в выпадающем списке кнопки "All".
 */
export const FILTER_PLATFORM_KEYS = Object.keys(FILTER_PARENT_PLATFORM_ID);

/**
 * Попадает ли платформа игры под один из исключённых фильтров.
 */
export function isPlatformExcluded(platform: string, excludedPlatforms: readonly string[]): boolean {
  return excludedPlatforms.some((filter) => platformMatchesFilter(platform, filter));
}

/**
 * parent_platforms для запроса к RAWG: конкретный фильтр как раньше, либо (в режиме "all"
 * с исключениями) список ID всех платформ, кроме исключённых. undefined — фильтр не нужен.
 */
export function buildParentPlatformsParam(
  activeFilter: string,
  excludedPlatforms: readonly string[]
): string | undefined {
  if (activeFilter !== 'all') {
    return FILTER_PARENT_PLATFORM_ID[activeFilter];
  }
  if (excludedPlatforms.length === 0) {
    return undefined;
  }

  return FILTER_PLATFORM_KEYS.filter((key) => !excludedPlatforms.includes(key))
    .map((key) => FILTER_PARENT_PLATFORM_ID[key])
    .join(',');
}

/**
 * Подсвечивать ли конкретную платформу карточки как "активную" — в обычном режиме
 * (single filter) ведёт себя как platformMatchesFilter, а в режиме "all" с исключениями
 * подсвечивает всё, кроме исключённых платформ (то же, что при выборе их по отдельности).
 */
export function platformIsActive(
  platform: string,
  activeFilter: string,
  excludedPlatforms: readonly string[]
): boolean {
  if (activeFilter !== 'all') {
    return platformMatchesFilter(platform, activeFilter);
  }
  return !isPlatformExcluded(platform, excludedPlatforms);
}

/**
 * Матчит ли игра активный фильтр — учитывает и обычный режим (single filter),
 * и режим "all" с исключёнными платформами. Используется для клиентской фильтрации
 * (избранное), где нет отдельного запроса к RAWG.
 */
export function gameMatchesPlatformFilter(
  platforms: string[],
  activeFilter: string,
  excludedPlatforms: readonly string[]
): boolean {
  if (activeFilter !== 'all') {
    return platforms.some((platform) => platformMatchesFilter(platform, activeFilter));
  }
  if (excludedPlatforms.length === 0) {
    return true;
  }

  return platforms.some((platform) => !isPlatformExcluded(platform, excludedPlatforms));
}
