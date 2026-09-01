import { Injectable, inject, signal } from '@angular/core';
import { Game, GameDetails } from '../models/game';
import { GamesApiService } from './games-api.service';

@Injectable({ providedIn: 'root' })
export class GameDetailService {
  private readonly api = inject(GamesApiService);

  private readonly selected = signal<Game | null>(null);
  private readonly detailsState = signal<GameDetails | null>(null);
  private readonly loadingState = signal(false);
  // Порядковый номер последнего запроса — чтобы игнорировать устаревший ответ,
  // если пользователь успел открыть другую игру до того, как пришли первые детали.
  private requestId = 0;

  readonly game = this.selected.asReadonly();
  readonly details = this.detailsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();

  open(game: Game): void {
    this.selected.set(game);
    this.detailsState.set(null);
    this.loadingState.set(true);

    const requestId = ++this.requestId;
    this.api.getGameDetails(game.id).subscribe({
      next: (details) => {
        if (requestId === this.requestId) {
          this.detailsState.set(details);
          this.loadingState.set(false);
        }
      },
      error: () => {
        if (requestId === this.requestId) {
          this.loadingState.set(false);
        }
      },
    });
  }

  close(): void {
    this.selected.set(null);
    this.detailsState.set(null);
    this.requestId++;
  }
}
