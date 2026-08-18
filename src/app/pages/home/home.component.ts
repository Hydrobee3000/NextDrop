import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { GameHeroComponent } from '../../components/game-hero/game-hero.component';
import { GameHeroSkeletonComponent } from '../../components/game-hero-skeleton/game-hero-skeleton.component';
import { GameRowComponent } from '../../components/game-row/game-row.component';
import { Game } from '../../models/game';
import { GamesApiService } from '../../services/games-api.service';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, GameCardComponent, GameHeroComponent, GameHeroSkeletonComponent, GameRowComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly gamesApi = inject(GamesApiService);

  readonly filters = ['Все', 'PC', 'PlayStation', 'Xbox', 'Switch'];

  readonly games$: Observable<Game[]> = this.gamesApi.getUpcomingGames();
}
