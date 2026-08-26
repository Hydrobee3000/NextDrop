import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { GameCardSkeletonComponent } from '../../components/game-card-skeleton/game-card-skeleton.component';
import { GameFiltersComponent } from '../../components/game-filters/game-filters.component';
import { GameHeroComponent } from '../../components/game-hero/game-hero.component';
import { GameHeroSkeletonComponent } from '../../components/game-hero-skeleton/game-hero-skeleton.component';
import { GameRowComponent } from '../../components/game-row/game-row.component';
import { GameRowSkeletonComponent } from '../../components/game-row-skeleton/game-row-skeleton.component';
import { Game } from '../../models/game';
import { FILTER_PARENT_PLATFORM_ID } from '../../shared/platform-filter';
import { GamesApiService } from '../../services/games-api.service';

@Component({
  selector: 'app-home',
  imports: [
    GameCardComponent,
    GameCardSkeletonComponent,
    GameFiltersComponent,
    GameHeroComponent,
    GameHeroSkeletonComponent,
    GameRowComponent,
    GameRowSkeletonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private readonly gamesApi = inject(GamesApiService);
  private observer?: IntersectionObserver;
  private page = 1;
  private hasMore = true;

  // Пустой div внизу страницы, за которым следит IntersectionObserver.
  @ViewChild('scrollSentinel') private scrollSentinel?: ElementRef<HTMLElement>;

  readonly skeletonRows = [1, 2, 3];
  readonly skeletonCards = [1, 2, 3, 4];

  activeFilter = 'Все';
  games: Game[] = [];
  loading = false;

  /**
   * Дожидается рендера шаблона.
   */
  ngAfterViewInit(): void {
    this.loadMore();

    // rootMargin расширяет зону срабатывания вниз на 800px — подгрузка
    // стартует заранее, до того как sentinel реально попадёт в экран.
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

  // Отключение observer, чтобы не было утечек при уходе со страницы.
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  selectFilter(filter: string): void {
    if (filter === this.activeFilter) {
      return;
    }

    this.activeFilter = filter;
    this.page = 1;
    this.hasMore = true;
    this.games = [];
    this.loadMore();
  }

  // Подгрузка следующей страницы и добавление её к уже загруженным играм.
  private loadMore(): void {
    if (this.loading || !this.hasMore) {
      return;
    }

    this.loading = true;
    const parentPlatformId = FILTER_PARENT_PLATFORM_ID[this.activeFilter];

    this.gamesApi.getUpcomingGames(this.page, parentPlatformId).subscribe((newGames) => {
      this.games = [...this.games, ...newGames];
      this.hasMore = newGames.length > 0;
      this.page++;
      this.loading = false;
      this.recheckSentinel();
    });
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
}
