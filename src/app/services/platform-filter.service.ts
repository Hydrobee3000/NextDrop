import { Injectable, effect, signal } from '@angular/core';

const STORAGE_KEY = 'nextdrop:platform-filter';

interface StoredPlatformFilter {
  activeFilter: string;
  excludedPlatforms: string[];
}

function loadPlatformFilter(): StoredPlatformFilter {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { activeFilter: 'all', excludedPlatforms: [] };
    }
    const parsed = JSON.parse(stored) as Partial<StoredPlatformFilter>;
    return {
      activeFilter: typeof parsed.activeFilter === 'string' ? parsed.activeFilter : 'all',
      excludedPlatforms: Array.isArray(parsed.excludedPlatforms) ? parsed.excludedPlatforms : [],
    };
  } catch {
    return { activeFilter: 'all', excludedPlatforms: [] };
  }
}

/**
 * Общее состояние фильтра платформ (активный фильтр + исключения) — используется
 * на Home/Search/Favorites через GameFiltersComponent, сохраняется между страницами
 * и переживает перезагрузку (localStorage), как ThemeService/I18nService.
 */
@Injectable({ providedIn: 'root' })
export class PlatformFilterService {
  private readonly initial = loadPlatformFilter();

  readonly activeFilter = signal<string>(this.initial.activeFilter);
  readonly excludedPlatforms = signal<string[]>(this.initial.excludedPlatforms);

  constructor() {
    effect(() => {
      const value: StoredPlatformFilter = {
        activeFilter: this.activeFilter(),
        excludedPlatforms: this.excludedPlatforms(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
  }

  setActiveFilter(filter: string): void {
    this.activeFilter.set(filter);
  }

  setExcludedPlatforms(excluded: string[]): void {
    this.excludedPlatforms.set(excluded);
  }
}
