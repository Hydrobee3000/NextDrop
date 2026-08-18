import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { GameCardSkeletonComponent } from '../../components/game-card-skeleton/game-card-skeleton.component';
import { GameHeroComponent } from '../../components/game-hero/game-hero.component';
import { GameHeroSkeletonComponent } from '../../components/game-hero-skeleton/game-hero-skeleton.component';
import { GameRowComponent } from '../../components/game-row/game-row.component';
import { GameRowSkeletonComponent } from '../../components/game-row-skeleton/game-row-skeleton.component';
import { Game } from '../../models/game';
import { GamesApiService } from '../../services/games-api.service';

@Component({
  selector: 'app-home',
  imports: [
    AsyncPipe,
    GameCardComponent,
    GameCardSkeletonComponent,
    GameHeroComponent,
    GameHeroSkeletonComponent,
    GameRowComponent,
    GameRowSkeletonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly gamesApi = inject(GamesApiService);

  readonly filters = ['Все', 'PC', 'PlayStation', 'Xbox', 'Switch'];
  readonly skeletonRows = [1, 2, 3];
  readonly skeletonCards = [1, 2, 3, 4];

  readonly games$: Observable<Game[]> = this.gamesApi.getUpcomingGames();
}
