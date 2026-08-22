import { getPlatformIconKind } from './platform-icon';

/**
 * ID родительских платформ RAWG (parent_platforms) для чипсов фильтра.
 */
export const FILTER_PARENT_PLATFORM_ID: Record<string, number> = {
  PC: 1,
  PlayStation: 2,
  Xbox: 3,
  Switch: 7,
};

/**
 * Категория иконки (см. platform-icon.ts), которой соответствует чипс фильтра.
 */
const FILTER_ICON_KIND: Record<string, string> = {
  PC: 'pc',
  PlayStation: 'playstation',
  Xbox: 'xbox',
  Switch: 'nintendo',
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
