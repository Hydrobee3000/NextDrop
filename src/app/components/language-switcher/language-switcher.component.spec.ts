import { WritableSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSwitcherComponent } from './language-switcher.component';
import { Locale } from '../../models/locale';
import { I18nService } from '../../services/i18n.service';

describe('LanguageSwitcherComponent', () => {
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let element: HTMLElement;
  let locale: WritableSignal<Locale>;
  let setLocale: jasmine.Spy;

  beforeEach(async () => {
    locale = signal<Locale>('ru');
    // Mirrors the real service: setLocale updates the locale signal.
    setLocale = jasmine.createSpy('setLocale').and.callFake((next: Locale) => locale.set(next));

    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent],
      providers: [{ provide: I18nService, useValue: { locale, setLocale } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  function trigger(): HTMLButtonElement {
    return element.querySelector<HTMLButtonElement>('.language-switcher__trigger')!;
  }

  function menu(): HTMLElement | null {
    return element.querySelector<HTMLElement>('.language-switcher__menu');
  }

  function option(code: string): HTMLElement {
    const found = Array.from(element.querySelectorAll<HTMLElement>('.language-switcher__option')).find(
      (item) => item.textContent?.trim() === code
    );
    if (!found) {
      throw new Error(`No option ${code}`);
    }
    return found;
  }

  function click(target: HTMLElement): void {
    target.click();
    fixture.detectChanges();
  }

  it('should show the current locale on the trigger', () => {
    expect(trigger().textContent?.trim()).toBe('RU');
  });

  it('should update the trigger when the locale changes elsewhere', () => {
    locale.set('en');
    fixture.detectChanges();

    expect(trigger().textContent?.trim()).toBe('EN');
  });

  it('should start with the menu closed', () => {
    expect(menu()).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('should open and close the menu from the trigger', () => {
    click(trigger());

    expect(menu()).not.toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().classList).toContain('open');

    click(trigger());

    expect(menu()).toBeNull();
  });

  it('should list both locales and mark the current one', () => {
    click(trigger());

    expect(option('RU').classList).toContain('active');
    expect(option('RU').getAttribute('aria-selected')).toBe('true');
    expect(option('EN').classList).not.toContain('active');
    expect(option('EN').getAttribute('aria-selected')).toBe('false');
  });

  it('should switch the locale and close the menu', () => {
    click(trigger());

    click(option('EN'));

    expect(setLocale).toHaveBeenCalledOnceWith('en');
    expect(menu()).toBeNull();
    expect(trigger().textContent?.trim()).toBe('EN');
  });

  it('should close on a click outside', () => {
    click(trigger());

    document.body.click();
    fixture.detectChanges();

    expect(menu()).toBeNull();
    expect(setLocale).not.toHaveBeenCalled();
  });

  it('should close on Escape', () => {
    click(trigger());

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(menu()).toBeNull();
  });
});
