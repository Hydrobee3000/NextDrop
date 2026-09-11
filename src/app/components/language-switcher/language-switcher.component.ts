import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
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
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly locales: Locale[] = ['ru', 'en'];
  locale = this.i18n.locale;
  open = signal(false);

  toggle(): void {
    this.open.update((value) => !value);
  }

  select(locale: Locale): void {
    this.i18n.setLocale(locale);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.open.set(false);
  }
}
