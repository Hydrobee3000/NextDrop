import { DecimalPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  afterRenderEffect,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
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

interface ScrollProgress {
  scrollable: boolean;
  percent: number;
}

interface DialogScroll {
  visible: boolean;
  thumbHeightPercent: number;
  thumbTopPercent: number;
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
  selectedMediaIndex = signal(0);

  // Обложка + подгруженные скриншоты — единая галерея: первый кадр всегда обложка,
  // если она есть, дальше скриншоты в порядке ответа RAWG.
  media = computed<string[]>(() => {
    const g = this.game();
    const screenshots = this.details()?.screenshots ?? [];
    return [g?.coverImageUrl, ...screenshots].filter((url): url is string => !!url);
  });

  heroImage = computed<string | null>(() => {
    const media = this.media();
    if (!media.length) {
      return null;
    }
    return media[Math.min(this.selectedMediaIndex(), media.length - 1)];
  });

  isDraggingThumbs = signal(false);
  private dragPointerId: number | null = null;
  private dragStartX = 0;
  private dragStartScrollLeft = 0;
  private dragThresholdExceeded = false;
  // Меньше этого сдвига в пикселях — считаем обычным кликом, не перетаскиванием.
  private readonly DRAG_THRESHOLD_PX = 4;

  private readonly thumbsRow = viewChild<ElementRef<HTMLElement>>('thumbsRow');
  // Прогресс прокрутки ленты миниатюр (0% — в начале, 100% — долистали до конца).
  thumbsScroll = signal<ScrollProgress>({ scrollable: false, percent: 0 });

  private readonly dialogEl = viewChild<ElementRef<HTMLElement>>('dialogEl');
  // Свой индикатор вертикального скролла модалки — родной скроллбар скрыт совсем,
  // потому что на части систем/браузеров он рисует стрелки, которые никакой CSS
  // (::-webkit-scrollbar-button) не убирает — вероятно, принудительный классический
  // скроллбар ОС, игнорирующий кастомные стили.
  dialogScroll = signal<DialogScroll>({ visible: false, thumbHeightPercent: 100, thumbTopPercent: 0 });

  isDraggingScrollbar = signal(false);
  private scrollbarDragPointerId: number | null = null;
  private scrollbarDragStartY = 0;
  private scrollbarDragStartScrollTop = 0;

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
      // При открытии другой игры сбрасываем состояние предыдущей.
      this.game();
      this.descriptionExpanded.set(false);
      this.selectedMediaIndex.set(0);
    });

    // Замеряем индикатор прокрутки сразу после того, как лента миниатюр
    // отрисовалась (появилась в DOM или сменился список игры).
    afterRenderEffect(() => {
      const row = this.thumbsRow()?.nativeElement;
      if (row) {
        this.updateThumbsScroll(row);
      }
    });

    // То же самое для индикатора прокрутки всей модалки — пересчитываем и когда
    // контент дозагрузился (details()/loading() меняют высоту содержимого).
    afterRenderEffect(() => {
      this.loading();
      this.details();
      const dialog = this.dialogEl()?.nativeElement;
      if (dialog) {
        this.updateDialogScroll(dialog);
      }
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

  selectMedia(index: number): void {
    this.selectedMediaIndex.set(index);
  }

  // Перетаскивание мышью для ленты миниатюр, как нативный тач-свайп на телефоне
  // (сам тач не трогаем — у него уже есть родной скролл). Указатель захватываем
  // (setPointerCapture) только когда сдвиг превысил порог, то есть это точно драг,
  // а не клик — иначе перехват уводил бы click с кнопки-миниатюры на саму ленту.
  onThumbsPointerDown(event: PointerEvent, row: HTMLElement): void {
    if (event.pointerType !== 'mouse') {
      return;
    }

    this.dragPointerId = event.pointerId;
    this.dragThresholdExceeded = false;
    this.dragStartX = event.clientX;
    this.dragStartScrollLeft = row.scrollLeft;
  }

  onThumbsPointerMove(event: PointerEvent, row: HTMLElement): void {
    if (event.pointerType !== 'mouse' || event.pointerId !== this.dragPointerId) {
      return;
    }

    const delta = event.clientX - this.dragStartX;

    if (!this.dragThresholdExceeded) {
      if (Math.abs(delta) < this.DRAG_THRESHOLD_PX) {
        return;
      }
      this.dragThresholdExceeded = true;
      this.isDraggingThumbs.set(true);
      row.setPointerCapture(event.pointerId);
    }

    row.scrollLeft = this.dragStartScrollLeft - delta;
  }

  onThumbsPointerUp(event: PointerEvent, row: HTMLElement): void {
    if (event.pointerType !== 'mouse' || event.pointerId !== this.dragPointerId) {
      return;
    }

    if (this.dragThresholdExceeded) {
      row.releasePointerCapture(event.pointerId);
    }

    this.dragPointerId = null;
    this.isDraggingThumbs.set(false);
  }

  // Срабатывает и на драг мышью (row.scrollLeft = ... сам генерирует scroll),
  // и на нативный тач-свайп/колесо — единая точка обновления индикатора.
  onThumbsScroll(row: HTMLElement): void {
    this.updateThumbsScroll(row);
  }

  private updateThumbsScroll(row: HTMLElement): void {
    const { scrollLeft, scrollWidth, clientWidth } = row;
    const maxScrollLeft = scrollWidth - clientWidth;

    if (maxScrollLeft <= 0) {
      this.thumbsScroll.set({ scrollable: false, percent: 0 });
      return;
    }

    this.thumbsScroll.set({ scrollable: true, percent: (scrollLeft / maxScrollLeft) * 100 });
  }

  onDialogScroll(dialog: HTMLElement): void {
    this.updateDialogScroll(dialog);
  }

  private updateDialogScroll(dialog: HTMLElement): void {
    const { scrollTop, scrollHeight, clientHeight } = dialog;
    const maxScrollTop = scrollHeight - clientHeight;

    if (maxScrollTop <= 0) {
      this.dialogScroll.set({ visible: false, thumbHeightPercent: 100, thumbTopPercent: 0 });
      return;
    }

    // Не даём бегунку становиться совсем крошечным на длинных страницах.
    const thumbHeightPercent = Math.max((clientHeight / scrollHeight) * 100, 8);
    const thumbTopPercent = (scrollTop / maxScrollTop) * (100 - thumbHeightPercent);
    this.dialogScroll.set({ visible: true, thumbHeightPercent, thumbTopPercent });
  }

  // Перетаскивание своего бегунка мышью/тачем — ведёт себя как настоящий скроллбар,
  // просто без стрелок сверху/снизу.
  onScrollbarThumbPointerDown(event: PointerEvent, thumb: HTMLElement, dialog: HTMLElement): void {
    event.stopPropagation();
    event.preventDefault();

    this.scrollbarDragPointerId = event.pointerId;
    this.isDraggingScrollbar.set(true);
    this.scrollbarDragStartY = event.clientY;
    this.scrollbarDragStartScrollTop = dialog.scrollTop;
    thumb.setPointerCapture(event.pointerId);
  }

  onScrollbarThumbPointerMove(event: PointerEvent, dialog: HTMLElement, track: HTMLElement): void {
    if (event.pointerId !== this.scrollbarDragPointerId) {
      return;
    }

    const trackHeight = track.clientHeight;
    const thumbHeight = (this.dialogScroll().thumbHeightPercent / 100) * trackHeight;
    const travel = Math.max(trackHeight - thumbHeight, 1);
    const maxScrollTop = dialog.scrollHeight - dialog.clientHeight;
    const deltaY = event.clientY - this.scrollbarDragStartY;

    dialog.scrollTop = this.scrollbarDragStartScrollTop + (deltaY / travel) * maxScrollTop;
  }

  onScrollbarThumbPointerUp(event: PointerEvent, thumb: HTMLElement): void {
    if (event.pointerId !== this.scrollbarDragPointerId) {
      return;
    }

    this.scrollbarDragPointerId = null;
    this.isDraggingScrollbar.set(false);
    thumb.releasePointerCapture(event.pointerId);
  }

  // Клик по треку мимо бегунка — прыжок к этой позиции, как у обычного скроллбара.
  onScrollbarTrackClick(event: MouseEvent, dialog: HTMLElement, track: HTMLElement): void {
    const trackRect = track.getBoundingClientRect();
    const trackHeight = track.clientHeight;
    const thumbHeight = (this.dialogScroll().thumbHeightPercent / 100) * trackHeight;
    const travel = Math.max(trackHeight - thumbHeight, 1);
    const maxScrollTop = dialog.scrollHeight - dialog.clientHeight;

    const clickY = event.clientY - trackRect.top;
    const targetThumbTop = Math.min(Math.max(clickY - thumbHeight / 2, 0), travel);

    dialog.scrollTop = (targetThumbTop / travel) * maxScrollTop;
  }

  close(): void {
    this.detailService.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
