import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { GameFiltersComponent } from '../../components/game-filters/game-filters.component';
import { Game } from '../../models/game';
import { SortOrder } from '../../models/sort-order';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { FavoritesService } from '../../services/favorites.service';
import { gameMatchesPlatformFilter } from '../../shared/platform-filter';

@Component({
  selector: 'app-favorites',
  imports: [GameCardComponent, GameFiltersComponent, TranslatePipe],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly sortOptions: SortOrder[] = ['dateAsc', 'dateDesc', 'alpha'];

  activeFilter = 'all';
  excludedPlatforms: string[] = [];
  sortOrder = signal<SortOrder>('dateAsc');
  sortMenuOpen = signal(false);

  get games(): Game[] {
    const filtered = this.favoritesService
      .games()
      .filter((game) => gameMatchesPlatformFilter(game.platforms, this.activeFilter, this.excludedPlatforms));

    return this.sortGames(filtered);
  }

  // Общее число избранного — не зависит от активного фильтра платформы,
  // в отличие от отфильтрованного списка games выше.
  get totalCount(): number {
    return this.favoritesService.games().length;
  }

  selectFilter(filter: string): void {
    this.activeFilter = filter;
  }

  onExcludedPlatformsChange(excluded: string[]): void {
    this.excludedPlatforms = excluded;
  }

  toggleSortMenu(): void {
    this.sortMenuOpen.update((open) => !open);
  }

  selectSort(order: SortOrder): void {
    this.sortOrder.set(order);
    this.sortMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.sortMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.sortMenuOpen.set(false);
  }

  private sortGames(games: Game[]): Game[] {
    switch (this.sortOrder()) {
      case 'dateAsc':
        return [...games].sort((a, b) => this.compareDates(a, b, 1));
      case 'dateDesc':
        return [...games].sort((a, b) => this.compareDates(a, b, -1));
      case 'alpha':
        return [...games].sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  // Игры без объявленной даты всегда уходят в конец — направление применяется
  // только после этой проверки, иначе при убывании они попадали бы в начало.
  private compareDates(a: Game, b: Game, direction: 1 | -1): number {
    if (!a.releaseDate && !b.releaseDate) return 0;
    if (!a.releaseDate) return 1;
    if (!b.releaseDate) return -1;

    return direction * (new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
  }
}
