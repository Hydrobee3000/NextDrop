import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild, afterRender, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideX } from '@lucide/angular';
import { Subscription } from 'rxjs';
import { debounceTime, startWith, tap } from 'rxjs/operators';

import { GameFiltersComponent } from '../../components/game-filters/game-filters.component';
import { GameRowComponent } from '../../components/game-row/game-row.component';
import { GameRowSkeletonComponent } from '../../components/game-row-skeleton/game-row-skeleton.component';
import { SearchIdleComponent } from '../../components/search-idle/search-idle.component';
import { Game } from '../../models/game';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { buildParentPlatformsParam } from '../../shared/platform-filter';
import { GamesApiService } from '../../services/games-api.service';
import { PlatformFilterService } from '../../services/platform-filter.service';

@Component({
  selector: 'app-search',
  imports: [
    ReactiveFormsModule,
    LucideX,
    GameFiltersComponent,
    GameRowComponent,
    GameRowSkeletonComponent,
    SearchIdleComponent,
    TranslatePipe,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements AfterViewInit, OnDestroy {
  private readonly gamesApi = inject(GamesApiService);
  private readonly platformFilter = inject(PlatformFilterService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;
  private querySub?: Subscription;
  private requestSub?: Subscription;
  private currentQuery = '';
  private page = 1;
  private hasMore = true;

  // Пустой div внизу страницы, за которым следит IntersectionObserver.
  @ViewChild('scrollSentinel') private scrollSentinel?: ElementRef<HTMLElement>;

  // Картинка живёт в одном месте, а переезжает между двумя «якорями»: свободной областью (запрос пустой) и слотом справа от инпута.
  @ViewChild(SearchIdleComponent, { read: ElementRef }) private mascot?: ElementRef<HTMLElement>;
  @ViewChild('mascotSlot') private mascotSlot?: ElementRef<HTMLElement>;
  @ViewChild('idleArea') private idleArea?: ElementRef<HTMLElement>;
  private mascotAnimated = false;

  readonly queryControl = new FormControl('', { nonNullable: true });
  readonly skeletonRows = [1, 2, 3];

  results: Game[] = [];
  totalCount = 0;
  loading = false;
  // Текст введён, но debounce ещё не отпустил запрос — показываем скелетоны, а не «Ничего не нашлось».
  pending = false;

  constructor() {
    // После каждой отрисовки idleArea могла появиться или исчезнуть — переставляем картинку.
    afterRender(() => this.placeMascot());
  }

  get activeFilter(): string {
    return this.platformFilter.activeFilter();
  }

  get excludedPlatforms(): string[] {
    return this.platformFilter.excludedPlatforms();
  }

  ngAfterViewInit(): void {
    this.querySub = this.queryControl.valueChanges
      .pipe(
        startWith(''),
        tap((query) => {
          this.cancelRequest();
          this.pending = query.trim() !== '';
        }),
        debounceTime(300)
      )
      .subscribe((query) => this.startSearch(query.trim()));

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.loadMore();
        }
      },
      { rootMargin: '800px' }
    );

    if (this.scrollSentinel) {
      this.observer.observe(this.scrollSentinel.nativeElement);
    }
  }

  // Форсирует повторную проверку видимости sentinel.
  private recheckSentinel(): void {
    if (!this.hasMore || !this.scrollSentinel || !this.observer) {
      return;
    }

    const element = this.scrollSentinel.nativeElement;
    this.observer.unobserve(element);
    this.observer.observe(element);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.placeMascot();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.querySub?.unsubscribe();
    this.requestSub?.unsubscribe();
  }

  clearQuery(): void {
    this.queryControl.setValue('');
  }

  selectFilter(filter: string): void {
    this.platformFilter.setActiveFilter(filter);
    this.startSearch(this.currentQuery);
  }

  onExcludedPlatformsChange(excluded: string[]): void {
    this.platformFilter.setExcludedPlatforms(excluded);
    this.startSearch(this.currentQuery);
  }

  // Новый запрос/фильтр — сбрасываем накопленные результаты и грузим первую страницу.
  private startSearch(query: string): void {
    this.cancelRequest();
    this.pending = false;
    this.currentQuery = query;
    this.page = 1;
    this.hasMore = true;
    this.results = [];
    this.totalCount = 0;

    if (query) {
      this.loadMore();
    }
  }

  private placeMascot(): void {
    const mascot = this.mascot?.nativeElement;
    const anchor = (this.idleArea ?? this.mascotSlot)?.nativeElement;
    if (!mascot || !anchor) {
      return;
    }

    const hostRect = this.host.nativeElement.getBoundingClientRect();
    const box = anchor.getBoundingClientRect();
    const width = mascot.offsetWidth;
    const height = mascot.offsetHeight;
    const scale = Math.min(1, box.width / width, box.height / height);
    const x = box.left - hostRect.left + (box.width - width * scale) / 2;
    const y = box.top - hostRect.top + (box.height - height * scale) / 2;
    mascot.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

    // Первую расстановку делаем без анимации, иначе картинка выезжала бы из левого верхнего угла.
    if (!this.mascotAnimated) {
      this.mascotAnimated = true;
      requestAnimationFrame(() => mascot.classList.add('search-mascot--animated'));
    }
  }

  // Отписка от HttpClient-запроса прерывает сам HTTP-запрос, и его ответ уже не попадёт в results.
  private cancelRequest(): void {
    this.requestSub?.unsubscribe();
    this.requestSub = undefined;
    this.loading = false;
  }

  private loadMore(): void {
    if (this.loading || !this.hasMore || !this.currentQuery) {
      return;
    }

    this.loading = true;
    const parentPlatformId = buildParentPlatformsParam(this.activeFilter, this.excludedPlatforms);

    this.requestSub = this.gamesApi.searchGames(this.currentQuery, this.page, parentPlatformId).subscribe({
      next: ({ games: newResults, count }) => {
        this.results = [...this.results, ...newResults];
        this.totalCount = count;
        this.hasMore = newResults.length > 0;
        this.page++;
        this.loading = false;
        this.recheckSentinel();
      },
      // RAWG отдаёт 400 "Invalid page.", когда страниц больше нет — просто останавливаемся.
      error: () => {
        this.hasMore = false;
        this.loading = false;
      },
    });
  }
}
