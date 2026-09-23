import { Injectable, effect, signal } from '@angular/core';
import { Game } from '../models/game';

const STORAGE_KEY = 'nextdrop:favorites';

function loadFavorites(): Game[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly favorites = signal<Game[]>(loadFavorites());
  readonly games = this.favorites.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.favorites()));
    });
  }

  isFavorite(id: string): boolean {
    return this.favorites().some((game) => game.id === id);
  }

  toggle(game: Game): void {
    this.favorites.update((list) =>
      list.some((favorite) => favorite.id === game.id)
        ? list.filter((favorite) => favorite.id !== game.id)
        : [...list, game]
    );
  }

  // Обновляет сохранённую запись избранного свежими данными, если игра уже в избранном.
  sync(game: Game): void {
    this.favorites.update((list) =>
      list.map((favorite) => (favorite.id === game.id ? this.mergeFresh(favorite, game) : favorite))
    );
  }

  // Детальный эндпоинт RAWG для TBA-игр всегда отдаёт released: null.
  private mergeFresh(existing: Game, fresh: Game): Game {
    if (fresh.releaseDate === null && existing.releaseDate !== null) {
      return { ...fresh, releaseDate: existing.releaseDate, daysUntilRelease: existing.daysUntilRelease, isTba: true };
    }
    return fresh;
  }
}
