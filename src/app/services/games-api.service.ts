import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Game, GameDetails, GamesPage } from '../models/game';
import { RawgGame, RawgGameDetail, RawgGameListResponse, RawgScreenshotsResponse } from '../models/rawg-game';
import { getDaysUntilRelease } from '../shared/days-until-release';

// Набор градиентов — фиксированно тёмные (не завязаны на токены темы),
// имитируют постер игры и не должны светлеть в светлой теме, иначе текст
// инициалов поверх (белый) станет нечитаемым.
const COVER_GRADIENTS = [
  'linear-gradient(135deg, #334155, #020617)',
  'linear-gradient(135deg, #1e293b, #020617)',
  'linear-gradient(135deg, #595d6c, #292b31)',
];

// Синглтон на всё приложение.
@Injectable({ providedIn: 'root' })
export class GamesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.rawg.io/api/games';

  getUpcomingGames(page: number = 1, parentPlatformId?: string): Observable<GamesPage> {
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
      params['parent_platforms'] = parentPlatformId;
    }

    return this.http.get<RawgGameListResponse>(this.baseUrl, { params }).pipe(
      // Маппим сырой ответ RAWG в формат: игры плюс общее число найденных.
      map((response) => ({
        games: response.results.map((game, index) => this.toGame(game, index)),
        count: response.count,
      })),
    );
  }

  searchGames(query: string, page: number = 1, parentPlatformId?: string): Observable<GamesPage> {
    const params: Record<string, string> = {
      key: environment.rawgApiKey,
      search: query,
      page_size: '10',
      page: String(page),
    };

    if (parentPlatformId !== undefined) {
      params['parent_platforms'] = parentPlatformId;
    }

    return this.http.get<RawgGameListResponse>(this.baseUrl, { params }).pipe(
      map((response) => ({
        games: response.results.map((game, index) => this.toGame(game, index)),
        count: response.count,
      })),
    );
  }

  // Свежие базовые данные по одной игре.
  getGame(id: string): Observable<Game> {
    const params = { key: environment.rawgApiKey };
    return this.http
      .get<RawgGameDetail>(`${this.baseUrl}/${id}`, { params })
      .pipe(map((detail) => this.toGame(detail, 0)));
  }

  getGameDetails(id: string): Observable<GameDetails> {
    const params = { key: environment.rawgApiKey };

    const detail$ = this.http.get<RawgGameDetail>(`${this.baseUrl}/${id}`, { params });
    const screenshots$ = this.http.get<RawgScreenshotsResponse>(`${this.baseUrl}/${id}/screenshots`, { params });

    return forkJoin([detail$, screenshots$]).pipe(
      map(([detail, screenshots]) => ({
        description: detail.description_raw,
        genres: detail.genres.map((genre) => genre.name),
        developers: detail.developers.map((developer) => developer.name),
        publishers: detail.publishers.map((publisher) => publisher.name),
        metacritic: detail.metacritic,
        screenshots: screenshots.results.map((screenshot) => screenshot.image),
      })),
    );
  }

  private toGame(rawgGame: RawgGame, index: number): Game {
    return {
      id: String(rawgGame.id),
      title: rawgGame.name,
      platforms: (rawgGame.platforms ?? []).map((entry) => entry.platform.name),
      coverImageUrl: rawgGame.background_image,
      coverInitials: rawgGame.name.slice(0, 3).toUpperCase(),
      coverGradient: COVER_GRADIENTS[index % COVER_GRADIENTS.length],
      daysUntilRelease: getDaysUntilRelease(rawgGame.released),
      releaseDate: rawgGame.released,
      isTba: rawgGame.tba,
    };
  }
}
