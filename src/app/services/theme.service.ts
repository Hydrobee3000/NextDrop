import { Injectable, effect, signal } from '@angular/core';
import { Theme } from '../models/theme';

const STORAGE_KEY = 'nextdrop:theme';

function loadTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' ? 'light' : 'dark';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly currentTheme = signal<Theme>(loadTheme());
  readonly theme = this.currentTheme.asReadonly();

  constructor() {
    effect(() => {
      const theme = this.currentTheme();
      localStorage.setItem(STORAGE_KEY, theme);
      document.documentElement.setAttribute('data-theme', theme);
    });
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  toggle(): void {
    this.currentTheme.update((theme) => (theme === 'dark' ? 'light' : 'dark'));
  }
}
