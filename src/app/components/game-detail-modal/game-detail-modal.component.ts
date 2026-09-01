import { Component, HostListener, effect, inject } from '@angular/core';
import { LucideHeart, LucideX } from '@lucide/angular';

import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { FavoritesService } from '../../services/favorites.service';
import { GameDetailService } from '../../services/game-detail.service';
import { I18nService } from '../../services/i18n.service';
import { getPlatformIconKind } from '../../shared/platform-icon';

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

  constructor() {
    // Не даём странице скроллиться под открытой модалкой.
    effect(() => {
      document.body.style.overflow = this.game() ? 'hidden' : '';
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

  close(): void {
    this.detailService.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
