import { Component, inject } from '@angular/core';
import { Locale } from '../../models/locale';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-language-switcher',
  imports: [],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent {
  private readonly i18n = inject(I18nService);

  locale = this.i18n.locale;

  onChange(event: Event): void {
    const locale = (event.target as HTMLSelectElement).value as Locale;
    this.i18n.setLocale(locale);
  }
}
