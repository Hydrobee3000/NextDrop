import { getPlatformIconKind } from './platform-icon';

/**
 * ID родительских платформ RAWG (parent_platforms) для чипсов фильтра.
 * Строка, а не число — для Apple нужно сразу два ID (iOS + macOS) через запятую.
 */
export const FILTER_PARENT_PLATFORM_ID: Record<string, string> = {
  PC: '1',
  PlayStation: '2',
  Xbox: '3',
  Switch: '7',
  Web: '14',
  Apple: '4,5',
  Android: '8',
};

/**
 * Категория иконки (см. platform-icon.ts), которой соответствует чипс фильтра.
 */
const FILTER_ICON_KIND: Record<string, string> = {
  PC: 'pc',
  PlayStation: 'playstation',
  Xbox: 'xbox',
  Switch: 'nintendo',
  Web: 'web',
  Apple: 'apple',
  Android: 'android',
};

/**
 * Совпадает ли платформа игры с активным фильтром ('Все' совпадает всегда).
 */
export function platformMatchesFilter(platform: string, filter: string): boolean {
  if (filter === 'Все') {
    return true;
  }
  return getPlatformIconKind(platform) === FILTER_ICON_KIND[filter];
}
