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
