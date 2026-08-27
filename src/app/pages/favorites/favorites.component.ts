import { Component, inject } from '@angular/core';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { GameFiltersComponent } from '../../components/game-filters/game-filters.component';
import { Game } from '../../models/game';
import { FavoritesService } from '../../services/favorites.service';
import { platformMatchesFilter } from '../../shared/platform-filter';

@Component({
  selector: 'app-favorites',
  imports: [GameCardComponent, GameFiltersComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {
  private readonly favoritesService = inject(FavoritesService);

  activeFilter = 'Все';

  get games(): Game[] {
    return this.favoritesService
      .games()
      .filter((game) => game.platforms.some((platform) => platformMatchesFilter(platform, this.activeFilter)));
  }

  selectFilter(filter: string): void {
    this.activeFilter = filter;
  }
}
