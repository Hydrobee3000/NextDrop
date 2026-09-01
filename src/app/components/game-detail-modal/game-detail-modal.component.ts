import { Component, HostListener, effect, inject, signal } from '@angular/core';
import { LucideHeart, LucideX } from '@lucide/angular';

import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { GameDetails } from '../../models/game';
import { FavoritesService } from '../../services/favorites.service';
import { GameDetailService } from '../../services/game-detail.service';
import { I18nService } from '../../services/i18n.service';
import { getPlatformIconKind } from '../../shared/platform-icon';

// Порог, начиная с которого показываем кнопку "показать полностью" — точная
// проверка переполнения потребовала бы измерения DOM, а так вполне достаточно.
const DESCRIPTION_TOGGLE_THRESHOLD = 240;

@Component({
  selector: 'app-game-detail-modal',
  imports: [LucideHeart, LucideX, DaysUntilPipe, LocalizedDatePipe, PlatformIconComponent, TranslatePipe],
  templateUrl: './game-detail-modal.component.html',
  styleUrl: './game-detail-modal.component.scss'
})
export class GameDetailModalComponent {
  private readonly detailService = inject(GameDetailService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly i18n = inject(I18nService);

  game = this.detailService.game;
  details = this.detailService.details;
  loading = this.detailService.loading;

  descriptionExpanded = signal(false);

  constructor() {
    effect(() => {
      // Не даём странице скроллиться под открытой модалкой.
      document.body.style.overflow = this.game() ? 'hidden' : '';
      // При открытии другой игры сворачиваем обратно предыдущее описание.
      this.game();
      this.descriptionExpanded.set(false);
    });
  }

  isFavorite(id: string): boolean {
    return this.favoritesService.isFavorite(id);
  }

  favoriteLabel(id: string): string {
    return this.i18n.t(this.isFavorite(id) ? 'favorite.remove' : 'favorite.add');
  }

  toggleFavorite(): void {
    const game = this.game();
    if (game) {
      this.favoritesService.toggle(game);
    }
  }

  iconKind(platform: string): string {
    return getPlatformIconKind(platform);
  }

  byline(details: GameDetails): string {
    return [details.developers.join(', '), details.publishers.join(', ')].filter(Boolean).join(' · ');
  }

  showDescriptionToggle(description: string): boolean {
    return description.length > DESCRIPTION_TOGGLE_THRESHOLD;
  }

  toggleDescription(): void {
    this.descriptionExpanded.update((expanded) => !expanded);
  }

  close(): void {
    this.detailService.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
