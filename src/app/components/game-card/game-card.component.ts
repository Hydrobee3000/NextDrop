import { Component, inject, input } from '@angular/core';

import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';
import { Game } from '../../models/game';
import { GameDetailService } from '../../services/game-detail.service';
import { getPlatformIconKind } from '../../shared/platform-icon';
import { platformMatchesFilter } from '../../shared/platform-filter';
import { getReleaseUrgencyTier } from '../../shared/release-urgency';

@Component({
  selector: 'app-game-card',
  imports: [FavoriteButtonComponent, DaysUntilPipe, PlatformIconComponent],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss'
})
export class GameCardComponent {
  private readonly detailService = inject(GameDetailService);

  game = input.required<Game>();
  activeFilter = input<string>('all');

  matchesFilter(platform: string): boolean {
    return platformMatchesFilter(platform, this.activeFilter());
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
