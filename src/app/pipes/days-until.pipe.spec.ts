import { WritableSignal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DaysUntilPipe } from './days-until.pipe';
import { Locale } from '../models/locale';
import { I18nService } from '../services/i18n.service';
import { TRANSLATIONS } from '../shared/translations';

describe('DaysUntilPipe', () => {
  let locale: WritableSignal<Locale>;
  let pipe: DaysUntilPipe;

  beforeEach(() => {
    locale = signal<Locale>('ru');
    // Real translation strings, but no localStorage or navigator.language involved.
    const i18nStub = { locale, t: (key: string) => TRANSLATIONS[locale()][key] ?? key };

    TestBed.configureTestingModule({
      providers: [{ provide: I18nService, useValue: i18nStub }],
    });
    pipe = TestBed.runInInjectionContext(() => new DaysUntilPipe());
  });

  describe('special values', () => {
    it('should show "???" when the date is unknown', () => {
      expect(pipe.transform(null)).toBe('???');
    });

    it('should not add "~" to an unknown date', () => {
      expect(pipe.transform(null, true)).toBe('???');
    });

    it('should show "released" for a past date', () => {
      expect(pipe.transform(-3)).toBe('Уже вышла');
    });

    it('should show "today" for 0 days', () => {
      expect(pipe.transform(0)).toBe('Сегодня');
    });

    it('should show "tomorrow" for 1 day', () => {
      expect(pipe.transform(1)).toBe('Завтра');
    });
  });

  describe('Russian plural forms', () => {
    const cases: [number, string][] = [
      [2, '2 дня'],
      [4, '4 дня'],
      [5, '5 дней'],
      [11, '11 дней'],
      [12, '12 дней'],
      [14, '14 дней'],
      [21, '21 день'],
      [22, '22 дня'],
      [25, '25 дней'],
      [101, '101 день'],
      [111, '111 дней'],
    ];

    for (const [days, expected] of cases) {
      it(`should format ${days} as "${expected}"`, () => {
        expect(pipe.transform(days)).toBe(expected);
      });
    }
  });

  describe('English', () => {
    beforeEach(() => locale.set('en'));

    it('should use English labels', () => {
      expect(pipe.transform(null)).toBe('???');
      expect(pipe.transform(-1)).toBe('Already out');
      expect(pipe.transform(0)).toBe('Today');
      expect(pipe.transform(1)).toBe('Tomorrow');
    });

    it('should use "days" for every count above 1', () => {
      expect(pipe.transform(2)).toBe('2 days');
      expect(pipe.transform(21)).toBe('21 days');
    });

    it('should follow a locale switch without recreating the pipe', () => {
      expect(pipe.transform(5)).toBe('5 days');

      locale.set('ru');

      expect(pipe.transform(5)).toBe('5 дней');
    });
  });

  describe('unconfirmed (TBA) dates', () => {
    it('should prefix the day count with "~"', () => {
      expect(pipe.transform(5, true)).toBe('~5 дней');
    });

    it('should prefix "today" and "tomorrow" with "~"', () => {
      expect(pipe.transform(0, true)).toBe('~Сегодня');
      expect(pipe.transform(1, true)).toBe('~Завтра');
    });

    it('should not add "~" for a confirmed date', () => {
      expect(pipe.transform(5, false)).toBe('5 дней');
    });
  });
});
