export type PlatformIconKind = 'playstation' | 'xbox' | 'nintendo' | 'apple' | 'android' | 'linux' | 'steam' | 'pc';

/**
 * Конкретный бренд/тип устройства по названию платформы из RAWG.
 */
export function getPlatformIconKind(platform: string): PlatformIconKind {
  const lower = platform.toLowerCase();

  if (lower.includes('playstation')) return 'playstation';
  if (lower.includes('xbox')) return 'xbox';
  if (lower.includes('nintendo') || lower.includes('switch')) return 'nintendo';
  if (lower.includes('ios') || lower.includes('macos') || lower.includes('mac')) return 'apple';
  if (lower.includes('android')) return 'android';
  if (lower.includes('linux')) return 'linux';
  if (lower.includes('steamos') || lower.includes('steam deck')) return 'steam';
  return 'pc';
}
