import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Game } from '../models/game';
import { RawgGame, RawgGameListResponse } from '../models/rawg-game';

// набор градиентов.
const COVER_GRADIENTS = [
  'linear-gradient(135deg, var(--color-accent-800), var(--color-neutral-900))',
  'linear-gradient(135deg, var(--color-accent-700), var(--color-neutral-900))',
  'linear-gradient(135deg, var(--color-neutral-700), var(--color-neutral-900))',
];

// Синглтон на всё приложение.
@Injectable({ providedIn: 'root' })
export class GamesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.rawg.io/api/games';

  getUpcomingGames(page: number = 1, parentPlatformId?: number): Observable<Game[]> {
    const today = new Date().toISOString().slice(0, 10);
    const oneYearAhead = new Date();
    oneYearAhead.setFullYear(oneYearAhead.getFullYear() + 1);

    const params: Record<string, string> = {
      key: environment.rawgApiKey,
      dates: `${today},${oneYearAhead.toISOString().slice(0, 10)}`,
      ordering: 'released',
      page_size: '12',
      page: String(page),
    };

    if (parentPlatformId !== undefined) {
      params['parent_platforms'] = String(parentPlatformId);
    }

    return this.http
      .get<RawgGameListResponse>(this.baseUrl, { params })
      // Маппим сырой ответ RAWG в наш формат Game[].
      .pipe(map((response) => response.results.map((game, index) => this.toGame(game, index))));
  }

  searchGames(query: string): Observable<Game[]> {
    const params = {
      key: environment.rawgApiKey,
      search: query,
      page_size: '10',
    };

    return this.http
      .get<RawgGameListResponse>(this.baseUrl, { params })
      .pipe(map((response) => response.results.map((game, index) => this.toGame(game, index))));
  }

  private toGame(rawgGame: RawgGame, index: number): Game {
    const releaseDate = rawgGame.released ? new Date(rawgGame.released) : null;
    // Может быть отрицательным для уже вышедших игр — это нормально,
    // отличаем "сегодня" (0) от "уже вышла" (< 0) в DaysUntilPipe.
    const daysUntilRelease = releaseDate
      ? Math.ceil((releaseDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      id: String(rawgGame.id),
      title: rawgGame.name,
      platforms: (rawgGame.platforms ?? []).map((entry) => entry.platform.name),
      coverImageUrl: rawgGame.background_image,
      coverInitials: rawgGame.name.slice(0, 3).toUpperCase(),
      coverGradient: COVER_GRADIENTS[index % COVER_GRADIENTS.length],
      daysUntilRelease,
      releaseDateLabel: releaseDate
        ? releaseDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Дата уточняется',
    };
  }
}
