import { Component, inject, input } from '@angular/core';

import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';
import { Game } from '../../models/game';
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

  game = input.required<Game>();
  activeFilter = input<string>('all');
  excludedPlatforms = input<string[]>([]);

  matchesFilter(platform: string): boolean {
    return platformIsActive(platform, this.activeFilter(), this.excludedPlatforms());
  }

  iconKind(platform: string): string {
    return getPlatformIconKind(platform);
  }

  urgencyTier(): number {
    return getReleaseUrgencyTier(this.game().daysUntilRelease);
  }

  openDetail(): void {
    this.detailService.open(this.game());
  }
}
