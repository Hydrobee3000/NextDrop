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

  setLocale(locale: Locale): void {
    this.i18n.setLocale(locale);
  }
}
