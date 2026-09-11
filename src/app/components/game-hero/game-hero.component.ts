import { Component, inject, input } from '@angular/core';

import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';
import { Game } from '../../models/game';
import { GameDetailService } from '../../services/game-detail.service';
import { I18nService } from '../../services/i18n.service';
import { getPlatformIconKind } from '../../shared/platform-icon';
import { pluralizeEn, pluralizeRu } from '../../shared/pluralize';
import { platformMatchesFilter } from '../../shared/platform-filter';

@Component({
  selector: 'app-game-hero',
  imports: [FavoriteButtonComponent, DaysUntilPipe, LocalizedDatePipe, PlatformIconComponent],
  templateUrl: './game-hero.component.html',
  styleUrl: './game-hero.component.scss'
})
export class GameHeroComponent {
  private readonly detailService = inject(GameDetailService);
  private readonly i18n = inject(I18nService);

  game = input.required<Game>();
  activeFilter = input<string>('all');

  daysWord(): string {
    const days = this.game().daysUntilRelease;
    return this.i18n.locale() === 'ru'
      ? pluralizeRu(days, [this.i18n.t('day.one'), this.i18n.t('day.few'), this.i18n.t('day.many')])
      : pluralizeEn(days, [this.i18n.t('day.one'), this.i18n.t('day.other')]);
  }

  matchesFilter(platform: string): boolean {
    return platformMatchesFilter(platform, this.activeFilter());
  }

  iconKind(platform: string): string {
    return getPlatformIconKind(platform);
  }

  openDetail(): void {
    this.detailService.open(this.game());
  }
}
