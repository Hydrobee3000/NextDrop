import { Component, computed, inject, input } from '@angular/core';
import { LucideHeart } from '@lucide/angular';

import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';
import { Game } from '../../models/game';
import { FavoritesService } from '../../services/favorites.service';
import { getPlatformIconKind } from '../../shared/platform-icon';
import { platformMatchesFilter } from '../../shared/platform-filter';

@Component({
  selector: 'app-game-row',
  imports: [LucideHeart, DaysUntilPipe, PlatformIconComponent],
  templateUrl: './game-row.component.html',
  styleUrl: './game-row.component.scss'
})
export class GameRowComponent {
  private readonly favoritesService = inject(FavoritesService);

  game = input.required<Game>();
  activeFilter = input<string>('Все');

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
}
