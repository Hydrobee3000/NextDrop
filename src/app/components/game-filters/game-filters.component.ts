import { Component, ElementRef, HostListener, ViewChild, input, output, signal } from '@angular/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { ReleaseCountPipe } from '../../pipes/release-count.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { FILTER_PLATFORM_KEYS } from '../../shared/platform-filter';

@Component({
  selector: 'app-game-filters',
  imports: [LanguageSwitcherComponent, PlatformIconComponent, ReleaseCountPipe, TranslatePipe],
  templateUrl: './game-filters.component.html',
  styleUrl: './game-filters.component.scss'
})
export class GameFiltersComponent {
  @ViewChild('allWrap') private readonly allWrap!: ElementRef<HTMLElement>;

  titleKey = input.required<string>();
  activeFilter = input.required<string>();
  totalCount = input<number>(0);
  excludedPlatforms = input<string[]>([]);
  activeFilterChange = output<string>();
  excludedPlatformsChange = output<string[]>();

  readonly filters = ['pc', 'playstation', 'xbox', 'switch'];
  readonly excludablePlatforms = FILTER_PLATFORM_KEYS;

  allMenuOpen = signal(false);

  // Выбор конкретного чипса (включая "Все") не трогает список исключённых платформ —
  // он должен переживать переключение фильтра и сбрасываться только через "Выбрать все".
  select(filter: string): void {
    if (filter !== this.activeFilter()) {
      this.activeFilterChange.emit(filter);
    }
    this.allMenuOpen.set(false);
  }

  toggleAllMenu(event: Event): void {
    event.stopPropagation();
    this.allMenuOpen.update((open) => !open);
  }

  selectAllPlatforms(): void {
    this.excludedPlatformsChange.emit([]);
  }

  isPlatformIncluded(key: string): boolean {
    return !this.excludedPlatforms().includes(key);
  }

  isLastIncluded(key: string): boolean {
    return this.isPlatformIncluded(key) && this.excludedPlatforms().length + 1 >= this.excludablePlatforms.length;
  }

  togglePlatform(key: string): void {
    const excluded = this.excludedPlatforms();
    const isExcluding = !excluded.includes(key);

    // Нельзя исключить последнюю оставшуюся платформу — список не должен становиться пустым.
    if (isExcluding && excluded.length + 1 >= this.excludablePlatforms.length) {
      return;
    }

    const next = isExcluding ? [...excluded, key] : excluded.filter((item) => item !== key);
    this.excludedPlatformsChange.emit(next);

    if (this.activeFilter() !== 'all') {
      this.activeFilterChange.emit('all');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.allWrap.nativeElement.contains(event.target as Node)) {
      this.allMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.allMenuOpen.set(false);
  }
}
