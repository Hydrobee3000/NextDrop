import { Component, computed, inject, input } from '@angular/core';
import { Game } from '../../models/game';
import { FavoritesService } from '../../services/favorites.service';
import { I18nService } from '../../services/i18n.service';

export type FavoriteButtonSize = 's' | 'm';

@Component({
  selector: 'app-favorite-button',
  imports: [],
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.scss'
})
export class FavoriteButtonComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly i18n = inject(I18nService);

  game = input.required<Game>();
  size = input<FavoriteButtonSize>('s');

  isFavorite = computed(() => this.favoritesService.isFavorite(this.game().id));
  label = computed(() => this.i18n.t(this.isFavorite() ? 'favorite.remove' : 'favorite.add'));

  toggle(event: Event): void {
    event.stopPropagation();
    this.favoritesService.toggle(this.game());
  }
}
