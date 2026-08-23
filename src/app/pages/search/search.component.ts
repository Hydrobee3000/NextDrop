import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { GameRowComponent } from '../../components/game-row/game-row.component';
import { Game } from '../../models/game';
import { GamesApiService } from '../../services/games-api.service';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, AsyncPipe, GameRowComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  private readonly gamesApi = inject(GamesApiService);

  readonly queryControl = new FormControl('', { nonNullable: true });

  readonly results$: Observable<Game[]> = this.queryControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((query) => (query.trim() ? this.gamesApi.searchGames(query.trim()) : of([])))
  );
}
