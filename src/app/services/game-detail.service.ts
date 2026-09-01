import { Injectable, signal } from '@angular/core';
import { Game } from '../models/game';

@Injectable({ providedIn: 'root' })
export class GameDetailService {
  private readonly selected = signal<Game | null>(null);
  readonly game = this.selected.asReadonly();

  open(game: Game): void {
    this.selected.set(game);
  }

  close(): void {
    this.selected.set(null);
  }
}
