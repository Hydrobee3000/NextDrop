import { Component, effect, inject, input } from '@angular/core';

import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';
import { Game } from '../../models/game';
import { FavoritesService } from '../../services/favorites.service';
import { GameDetailService } from '../../services/game-detail.service';
import { getPlatformIconKind } from '../../shared/platform-icon';
import { platformIsActive } from '../../shared/platform-filter';
import { getReleaseUrgencyTier } from '../../shared/release-urgency';

@Component({
  selector: 'app-game-row',
  imports: [FavoriteButtonComponent, DaysUntilPipe, PlatformIconComponent],
  templateUrl: './game-row.component.html',
  styleUrl: './game-row.component.scss'
})
export class GameRowComponent {
  private readonly detailService = inject(GameDetailService);
  private readonly favoritesService = inject(FavoritesService);

  game = input.required<Game>();
  activeFilter = input<string>('all');
  excludedPlatforms = input<string[]>([]);

  // Держит сохранённую запись избранного в актуальном состоянии.
  constructor() {
    effect(() => this.favoritesService.sync(this.game()));
  }

  matchesFilter(platform: string): boolean {
    return platformIsActive(platform, this.activeFilter(), this.excludedPlatforms());
  }

  iconKind(platform: string): string {
    return getPlatformIconKind(platform);
  }

  urgencyTier(): number | 'tba' {
    const days = this.game().daysUntilRelease;
    return days === null ? 'tba' : getReleaseUrgencyTier(days);
  }

  openDetail(): void {
    this.detailService.open(this.game());
  }
}
