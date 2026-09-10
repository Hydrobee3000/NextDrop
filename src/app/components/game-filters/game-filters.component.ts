import { Component, inject, input, output } from '@angular/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { I18nService } from '../../services/i18n.service';
import { pluralizeEn, pluralizeRu } from '../../shared/pluralize';

@Component({
  selector: 'app-game-filters',
  imports: [LanguageSwitcherComponent, PlatformIconComponent, TranslatePipe],
  templateUrl: './game-filters.component.html',
  styleUrl: './game-filters.component.scss'
})
export class GameFiltersComponent {
  private readonly i18n = inject(I18nService);

  titleKey = input.required<string>();
  activeFilter = input.required<string>();
  totalCount = input<number>(0);
  activeFilterChange = output<string>();

  readonly filters = ['all', 'pc', 'playstation', 'xbox', 'switch'];

  select(filter: string): void {
    if (filter !== this.activeFilter()) {
      this.activeFilterChange.emit(filter);
    }
  }

  countLabel(): string {
    const count = this.totalCount();
    return this.i18n.locale() === 'ru'
      ? pluralizeRu(count, [this.i18n.t('release.one'), this.i18n.t('release.few'), this.i18n.t('release.many')])
      : pluralizeEn(count, [this.i18n.t('release.one'), this.i18n.t('release.other')]);
  }
}
