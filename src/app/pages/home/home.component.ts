import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { GameCardSkeletonComponent } from '../../components/game-card-skeleton/game-card-skeleton.component';
import { GameHeroComponent } from '../../components/game-hero/game-hero.component';
import { GameHeroSkeletonComponent } from '../../components/game-hero-skeleton/game-hero-skeleton.component';
import { GameRowComponent } from '../../components/game-row/game-row.component';
import { GameRowSkeletonComponent } from '../../components/game-row-skeleton/game-row-skeleton.component';
import { PlatformIconComponent } from '../../components/platform-icon/platform-icon.component';
import { Game } from '../../models/game';
import { GamesApiService } from '../../services/games-api.service';

@Component({
  selector: 'app-home',
  imports: [
    GameCardComponent,
    GameCardSkeletonComponent,
    GameHeroComponent,
    GameHeroSkeletonComponent,
    GameRowComponent,
    GameRowSkeletonComponent,
    PlatformIconComponent,
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

  readonly filters = ['Все', 'PC', 'PlayStation', 'Xbox', 'Switch'];
  readonly skeletonRows = [1, 2, 3];
  readonly skeletonCards = [1, 2, 3, 4];

  games: Game[] = [];
  loading = false;

  /**
   * Дожидается рендера шаблона.
   */
  ngAfterViewInit(): void {
    this.loadMore();

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.loadMore();
      }
    });

    if (this.scrollSentinel) {
      this.observer.observe(this.scrollSentinel.nativeElement);
    }
  }

  // Отключение observer, чтобы не было утечек при уходе со страницы.
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  // Подгрузка следующей страницы и добавление её к уже загруженным играм.
  private loadMore(): void {
    if (this.loading || !this.hasMore) {
      return;
    }

    this.loading = true;
    this.gamesApi.getUpcomingGames(this.page).subscribe((newGames) => {
      this.games = [...this.games, ...newGames];
      this.hasMore = newGames.length > 0;
      this.page++;
      this.loading = false;
    });
  }
}
