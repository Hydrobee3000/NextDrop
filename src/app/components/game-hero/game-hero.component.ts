import { Component, computed, inject, input } from '@angular/core';
import { LucideHeart } from '@lucide/angular';

import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';
import { Game } from '../../models/game';
import { FavoritesService } from '../../services/favorites.service';
import { getPlatformIconKind } from '../../shared/platform-icon';
import { pluralizeRu } from '../../shared/pluralize';
import { platformMatchesFilter } from '../../shared/platform-filter';

@Component({
  selector: 'app-game-hero',
  imports: [LucideHeart, DaysUntilPipe, PlatformIconComponent],
  templateUrl: './game-hero.component.html',
  styleUrl: './game-hero.component.scss'
})
export class GameHeroComponent {
  private readonly favoritesService = inject(FavoritesService);

  game = input.required<Game>();
  activeFilter = input<string>('Все');

  isFavorite = computed(() => this.favoritesService.isFavorite(this.game().id));

  daysWord(): string {
    return pluralizeRu(this.game().daysUntilRelease, ['день', 'дня', 'дней']);
  }

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
