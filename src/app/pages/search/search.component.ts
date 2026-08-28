import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideSearch } from '@lucide/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

import { GameFiltersComponent } from '../../components/game-filters/game-filters.component';
import { GameRowComponent } from '../../components/game-row/game-row.component';
import { GameRowSkeletonComponent } from '../../components/game-row-skeleton/game-row-skeleton.component';
import { Game } from '../../models/game';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { FILTER_PARENT_PLATFORM_ID } from '../../shared/platform-filter';
import { GamesApiService } from '../../services/games-api.service';

@Component({
  selector: 'app-search',
  imports: [
    ReactiveFormsModule,
    LucideSearch,
    GameFiltersComponent,
    GameRowComponent,
    GameRowSkeletonComponent,
    TranslatePipe,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements AfterViewInit, OnDestroy {
  private readonly gamesApi = inject(GamesApiService);
  private observer?: IntersectionObserver;
  private querySub?: Subscription;
  private currentQuery = '';
  private page = 1;
  private hasMore = true;

  // Пустой div внизу страницы, за которым следит IntersectionObserver.
  @ViewChild('scrollSentinel') private scrollSentinel?: ElementRef<HTMLElement>;

  readonly queryControl = new FormControl('', { nonNullable: true });
  readonly skeletonRows = [1, 2, 3];

  activeFilter = 'all';
  results: Game[] = [];
  loading = false;

  ngAfterViewInit(): void {
    this.querySub = this.queryControl.valueChanges
      .pipe(startWith(''), debounceTime(300), distinctUntilChanged())
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

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.querySub?.unsubscribe();
  }

  selectFilter(filter: string): void {
    this.activeFilter = filter;
    this.startSearch(this.currentQuery);
  }

  // Новый запрос/фильтр — сбрасываем накопленные результаты и грузим первую страницу.
  private startSearch(query: string): void {
    this.currentQuery = query;
    this.page = 1;
    this.hasMore = true;
    this.results = [];

    if (query) {
      this.loadMore();
    }
  }

  private loadMore(): void {
    if (this.loading || !this.hasMore || !this.currentQuery) {
      return;
    }

    this.loading = true;
    const parentPlatformId = FILTER_PARENT_PLATFORM_ID[this.activeFilter];

    this.gamesApi.searchGames(this.currentQuery, this.page, parentPlatformId).subscribe({
      next: (newResults) => {
        this.results = [...this.results, ...newResults];
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
