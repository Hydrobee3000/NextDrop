import { Component, computed, inject, input } from '@angular/core';
import { LucideHeart } from '@lucide/angular';

import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';
import { Game } from '../../models/game';
import { FavoritesService } from '../../services/favorites.service';
import { I18nService } from '../../services/i18n.service';
import { getPlatformIconKind } from '../../shared/platform-icon';
import { platformMatchesFilter } from '../../shared/platform-filter';

@Component({
  selector: 'app-game-card',
  imports: [LucideHeart, DaysUntilPipe, PlatformIconComponent],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss'
})
export class GameCardComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly i18n = inject(I18nService);

  game = input.required<Game>();
  activeFilter = input<string>('all');

  isFavorite = computed(() => this.favoritesService.isFavorite(this.game().id));

  matchesFilter(platform: string): boolean {
    return platformMatchesFilter(platform, this.activeFilter());
  }

  iconKind(platform: string): string {
    return getPlatformIconKind(platform);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoritesService.toggle(this.game());
  }

  favoriteLabel(): string {
    return this.i18n.t(this.isFavorite() ? 'favorite.remove' : 'favorite.add');
  }
}
