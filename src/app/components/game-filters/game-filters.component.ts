import { Component, input, output } from '@angular/core';
import { PlatformIconComponent } from '../platform-icon/platform-icon.component';

@Component({
  selector: 'app-game-filters',
  imports: [PlatformIconComponent],
  templateUrl: './game-filters.component.html',
  styleUrl: './game-filters.component.scss'
})
export class GameFiltersComponent {
  title = input.required<string>();
  activeFilter = input.required<string>();
  activeFilterChange = output<string>();

  readonly filters = ['Все', 'PC', 'PlayStation', 'Xbox', 'Switch', 'Web', 'Apple', 'Android'];

  select(filter: string): void {
    if (filter !== this.activeFilter()) {
      this.activeFilterChange.emit(filter);
    }
  }
}
