import { Component, inject, input } from '@angular/core';

import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';
import { Game } from '../../models/game';
import { GameDetailService } from '../../services/game-detail.service';
import { getDaysUntilRelease } from '../../shared/days-until-release';
import { getPlatformIconKind } from '../../shared/platform-icon';
import { platformIsActive } from '../../shared/platform-filter';
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
  excludedPlatforms = input<string[]>([]);

  matchesFilter(platform: string): boolean {
    return platformIsActive(platform, this.activeFilter(), this.excludedPlatforms());
  }

  iconKind(platform: string): string {
    return getPlatformIconKind(platform);
  }

  // Пересчитываем от releaseDate, а не берём сохранённое значение поля —
  // у избранных игр оно "замораживается" на момент сохранения и может
  // устареть, если пользователь заглянул в список спустя время.
  daysUntilRelease(): number {
    return getDaysUntilRelease(this.game().releaseDate);
  }

  urgencyTier(): number {
    return getReleaseUrgencyTier(this.daysUntilRelease());
  }

  openDetail(): void {
    this.detailService.open(this.game());
  }
}
