import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';

import { GameFiltersComponent } from '../../components/game-filters/game-filters.component';
import { GameRowComponent } from '../../components/game-row/game-row.component';
import { Game } from '../../models/game';
import { FILTER_PARENT_PLATFORM_ID } from '../../shared/platform-filter';
import { GamesApiService } from '../../services/games-api.service';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, AsyncPipe, GameFiltersComponent, GameRowComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  private readonly gamesApi = inject(GamesApiService);
  private readonly activeFilter$ = new BehaviorSubject<string>('Все');

  readonly queryControl = new FormControl('', { nonNullable: true });
  activeFilter = 'Все';

  readonly results$: Observable<Game[]> = combineLatest([
    this.queryControl.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged()),
    this.activeFilter$,
  ]).pipe(
    switchMap(([query, filter]) => {
      const trimmed = query.trim();
      if (!trimmed) {
        return of([]);
      }
      return this.gamesApi.searchGames(trimmed, FILTER_PARENT_PLATFORM_ID[filter]);
    })
  );

  selectFilter(filter: string): void {
    this.activeFilter = filter;
    this.activeFilter$.next(filter);
  }
}
