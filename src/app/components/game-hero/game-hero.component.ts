import { Component, effect, inject, input } from '@angular/core';

import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';
import { Game } from '../../models/game';
import { FavoritesService } from '../../services/favorites.service';
import { GameDetailService } from '../../services/game-detail.service';
import { I18nService } from '../../services/i18n.service';
import { getPlatformIconKind } from '../../shared/platform-icon';
import { pluralizeEn, pluralizeRu } from '../../shared/pluralize';
import { platformIsActive } from '../../shared/platform-filter';

@Component({
  selector: 'app-game-hero',
  imports: [FavoriteButtonComponent, DaysUntilPipe, PlatformIconComponent],
  templateUrl: './game-hero.component.html',
  styleUrl: './game-hero.component.scss'
})
export class GameHeroComponent {
  private readonly detailService = inject(GameDetailService);
  private readonly i18n = inject(I18nService);
  private readonly favoritesService = inject(FavoritesService);

  game = input.required<Game>();
  activeFilter = input<string>('all');
  excludedPlatforms = input<string[]>([]);

  // Держит сохранённую запись избранного (если она есть) в актуальном состоянии —
  // иначе снимок Game "замораживается" на момент добавления и расходится с RAWG.
  constructor() {
    effect(() => this.favoritesService.sync(this.game()));
  }

  // Вызывается из шаблона только когда daysUntilRelease уже не null (см. @if в шаблоне).
  daysWord(): string {
    const days = this.game().daysUntilRelease ?? 0;
    return this.i18n.locale() === 'ru'
      ? pluralizeRu(days, [this.i18n.t('day.one'), this.i18n.t('day.few'), this.i18n.t('day.many')])
      : pluralizeEn(days, [this.i18n.t('day.one'), this.i18n.t('day.other')]);
  }

  matchesFilter(platform: string): boolean {
    return platformIsActive(platform, this.activeFilter(), this.excludedPlatforms());
  }

  iconKind(platform: string): string {
    return getPlatformIconKind(platform);
  }

  openDetail(): void {
    this.detailService.open(this.game());
  }
}
