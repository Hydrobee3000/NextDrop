import { Component, input, output } from '@angular/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-game-filters',
  imports: [LanguageSwitcherComponent, PlatformIconComponent, TranslatePipe],
  templateUrl: './game-filters.component.html',
  styleUrl: './game-filters.component.scss'
})
export class GameFiltersComponent {
  titleKey = input.required<string>();
  activeFilter = input.required<string>();
  activeFilterChange = output<string>();

  readonly filters = ['all', 'pc', 'playstation', 'xbox', 'switch'];

  select(filter: string): void {
    if (filter !== this.activeFilter()) {
      this.activeFilterChange.emit(filter);
    }
  }
}
