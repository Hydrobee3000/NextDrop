import { Injectable, effect, signal } from '@angular/core';
import { Locale } from '../models/locale';
import { TRANSLATIONS } from '../shared/translations';

const STORAGE_KEY = 'nextdrop:locale';

function loadLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'en' ? 'en' : 'ru';
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly currentLocale = signal<Locale>(loadLocale());
  readonly locale = this.currentLocale.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, this.currentLocale());
    });
  }

  setLocale(locale: Locale): void {
    this.currentLocale.set(locale);
  }

  t(key: string): string {
    return TRANSLATIONS[this.currentLocale()][key] ?? key;
  }
}
