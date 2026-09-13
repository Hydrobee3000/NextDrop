import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { GameFiltersComponent } from '../../components/game-filters/game-filters.component';
import { Game } from '../../models/game';
import { SortOrder } from '../../models/sort-order';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { FavoritesService } from '../../services/favorites.service';
import { platformMatchesFilter } from '../../shared/platform-filter';

@Component({
  selector: 'app-favorites',
  imports: [GameCardComponent, GameFiltersComponent, TranslatePipe],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly sortOptions: SortOrder[] = ['saved', 'dateAsc', 'dateDesc', 'alpha'];

  activeFilter = 'all';
  sortOrder = signal<SortOrder>('saved');
  sortMenuOpen = signal(false);

  get games(): Game[] {
    const filtered = this.favoritesService
      .games()
      .filter((game) => game.platforms.some((platform) => platformMatchesFilter(platform, this.activeFilter)));

    return this.sortGames(filtered);
  }

  selectFilter(filter: string): void {
    this.activeFilter = filter;
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
        return [...games].sort((a, b) => this.releaseTime(a) - this.releaseTime(b));
      case 'dateDesc':
        return [...games].sort((a, b) => this.releaseTime(b) - this.releaseTime(a));
      case 'alpha':
        return [...games].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return games;
    }
  }

  // Игры без объявленной даты уходят в конец независимо от направления сортировки.
  private releaseTime(game: Game): number {
    return game.releaseDate ? new Date(game.releaseDate).getTime() : Number.POSITIVE_INFINITY;
  }
}
