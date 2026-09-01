import { Component, computed, inject, input } from '@angular/core';
import { LucideHeart } from '@lucide/angular';

import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Game } from '../../models/game';
import { FavoritesService } from '../../services/favorites.service';
import { GameDetailService } from '../../services/game-detail.service';
import { I18nService } from '../../services/i18n.service';
import { getPlatformIconKind } from '../../shared/platform-icon';
import { pluralizeEn, pluralizeRu } from '../../shared/pluralize';
import { platformMatchesFilter } from '../../shared/platform-filter';

@Component({
  selector: 'app-game-hero',
  imports: [LucideHeart, DaysUntilPipe, LocalizedDatePipe, PlatformIconComponent, TranslatePipe],
  templateUrl: './game-hero.component.html',
  styleUrl: './game-hero.component.scss'
})
export class GameHeroComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly detailService = inject(GameDetailService);
  private readonly i18n = inject(I18nService);

  game = input.required<Game>();
  activeFilter = input<string>('all');

  isFavorite = computed(() => this.favoritesService.isFavorite(this.game().id));

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

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoritesService.toggle(this.game());
  }

  favoriteLabel(): string {
    return this.i18n.t(this.isFavorite() ? 'favorite.remove' : 'favorite.add');
  }

  openDetail(): void {
    this.detailService.open(this.game());
  }
}
