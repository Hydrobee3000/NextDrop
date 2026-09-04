import { DecimalPipe } from '@angular/common';
import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideHeart, LucideX } from '@lucide/angular';
import { interval, map, startWith } from 'rxjs';

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

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
}

@Component({
  selector: 'app-game-detail-modal',
  imports: [
    LucideHeart,
    LucideX,
    DaysUntilPipe,
    LocalizedDatePipe,
    DecimalPipe,
    PlatformIconComponent,
    TranslatePipe,
  ],
  templateUrl: './game-detail-modal.component.html',
  styleUrl: './game-detail-modal.component.scss'
})
export class GameDetailModalComponent {
  private readonly detailService = inject(GameDetailService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly i18n = inject(I18nService);

  // Тикает раз в секунду — источник "текущего времени" для обратного отсчёта.
  // RxJS interval + toSignal вместо ручного setInterval: подписка/отписка сами
  // управляются жизненным циклом компонента.
  private readonly now = toSignal(interval(1000).pipe(startWith(0), map(() => Date.now())), {
    initialValue: Date.now(),
  });

  game = this.detailService.game;
  details = this.detailService.details;
  loading = this.detailService.loading;

  descriptionExpanded = signal(false);

  isDraggingScreenshots = signal(false);
  private dragStartX = 0;
  private dragStartScrollLeft = 0;

  // Живой отсчёт до релиза (дни/часы/минуты) — только пока дата ещё не наступила.
  countdown = computed<Countdown | null>(() => {
    const releaseDate = this.game()?.releaseDate;
    if (!releaseDate) {
      return null;
    }

    const target = new Date(`${releaseDate}T00:00:00`).getTime();
    const diff = target - this.now();
    if (diff <= 0) {
      return null;
    }

    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
    };
  });

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

  // Перетаскивание мышью для ленты скриншотов, как нативный тач-свайп на телефоне
  // (сам тач не трогаем — у него уже есть родной скролл).
  onScreenshotsPointerDown(event: PointerEvent, row: HTMLElement): void {
    if (event.pointerType !== 'mouse') {
      return;
    }

    this.isDraggingScreenshots.set(true);
    this.dragStartX = event.clientX;
    this.dragStartScrollLeft = row.scrollLeft;
    row.setPointerCapture(event.pointerId);
  }

  onScreenshotsPointerMove(event: PointerEvent, row: HTMLElement): void {
    if (!this.isDraggingScreenshots()) {
      return;
    }

    row.scrollLeft = this.dragStartScrollLeft - (event.clientX - this.dragStartX);
  }

  onScreenshotsPointerUp(event: PointerEvent, row: HTMLElement): void {
    if (!this.isDraggingScreenshots()) {
      return;
    }

    this.isDraggingScreenshots.set(false);
    row.releasePointerCapture(event.pointerId);
  }

  close(): void {
    this.detailService.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
