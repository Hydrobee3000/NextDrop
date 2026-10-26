import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameFiltersComponent } from './game-filters.component';
import { Locale } from '../../models/locale';
import { Theme } from '../../models/theme';
import { I18nService } from '../../services/i18n.service';
import { ThemeService } from '../../services/theme.service';
import { FILTER_PLATFORM_KEYS } from '../../shared/platform-filter';

interface FiltersInputs {
  activeFilter?: string;
  totalCount?: number;
  excludedPlatforms?: string[];
}

describe('GameFiltersComponent', () => {
  let fixture: ComponentFixture<GameFiltersComponent>;
  let element: HTMLElement;
  let activeFilterChanges: string[];
  let excludedChanges: string[][];

  beforeEach(async () => {
    // Translation keys are returned as-is: the tests check which key is used, not the text.
    const i18nStub = {
      t: (key: string) => key,
      locale: signal<Locale>('en'),
      setLocale: jasmine.createSpy('setLocale'),
    };
    const themeStub = { theme: signal<Theme>('dark'), toggle: jasmine.createSpy('toggle') };

    await TestBed.configureTestingModule({
      imports: [GameFiltersComponent],
      providers: [
        { provide: I18nService, useValue: i18nStub },
        { provide: ThemeService, useValue: themeStub },
      ],
    }).compileComponents();
  });

  function create(inputs: FiltersInputs = {}): void {
    fixture = TestBed.createComponent(GameFiltersComponent);
    fixture.componentRef.setInput('titleKey', 'search.title');
    fixture.componentRef.setInput('activeFilter', inputs.activeFilter ?? 'all');
    fixture.componentRef.setInput('totalCount', inputs.totalCount ?? 0);
    fixture.componentRef.setInput('excludedPlatforms', inputs.excludedPlatforms ?? []);

    activeFilterChanges = [];
    excludedChanges = [];
    fixture.componentInstance.activeFilterChange.subscribe((filter) => activeFilterChanges.push(filter));
    fixture.componentInstance.excludedPlatformsChange.subscribe((excluded) => excludedChanges.push(excluded));

    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
  }

  function chip(filter: string): HTMLElement {
    const chips = Array.from(element.querySelectorAll<HTMLElement>('.game-filters__chip-scroll .game-filters__chip'));
    const found = chips.find((item) => item.textContent?.includes(`filter.${filter}`));
    if (!found) {
      throw new Error(`No chip for ${filter}`);
    }
    return found;
  }

  function allChip(): HTMLElement {
    return element.querySelector<HTMLElement>('.game-filters__chip--all')!;
  }

  function openMenu(): void {
    element.querySelector<HTMLButtonElement>('.game-filters__chip-toggle')!.click();
    fixture.detectChanges();
  }

  function menu(): HTMLElement | null {
    return element.querySelector<HTMLElement>('.game-filters__platform-menu');
  }

  function option(key: string): HTMLElement {
    const found = Array.from(element.querySelectorAll<HTMLElement>('.game-filters__platform-option')).find(
      (item) => item.textContent?.includes(`filter.${key}`)
    );
    if (!found) {
      throw new Error(`No menu option for ${key}`);
    }
    return found;
  }

  function click(target: HTMLElement): void {
    target.click();
    fixture.detectChanges();
  }

  describe('header', () => {
    it('should render the translated title', () => {
      create();

      expect(element.querySelector('h2')?.textContent).toBe('search.title');
    });

    it('should hide the release count badge when the count is 0', () => {
      create({ totalCount: 0 });

      expect(element.querySelector('.tactile-badge')).toBeNull();
    });

    it('should show the release count badge when there are releases', () => {
      create({ totalCount: 3 });

      expect(element.querySelector('.tactile-badge')?.textContent).toContain('3');
    });
  });

  describe('platform chips', () => {
    it('should mark the "all" chip as active when no platform is selected', () => {
      create({ activeFilter: 'all' });

      expect(allChip().classList).toContain('active');
      expect(chip('pc').classList).not.toContain('active');
    });

    it('should mark only the selected platform chip as active', () => {
      create({ activeFilter: 'xbox' });

      expect(chip('xbox').classList).toContain('active');
      expect(chip('pc').classList).not.toContain('active');
      expect(allChip().classList).not.toContain('active');
    });

    it('should emit the clicked platform', () => {
      create({ activeFilter: 'all' });

      click(chip('switch'));

      expect(activeFilterChanges).toEqual(['switch']);
    });

    it('should not emit when the active chip is clicked again', () => {
      create({ activeFilter: 'pc' });

      click(chip('pc'));

      expect(activeFilterChanges).toEqual([]);
    });

    it('should emit "all" when the "all" label is clicked', () => {
      create({ activeFilter: 'pc' });

      click(element.querySelector<HTMLElement>('.game-filters__chip--all .game-filters__chip-label')!);

      expect(activeFilterChanges).toEqual(['all']);
    });
  });

  describe('platform menu', () => {
    it('should be closed initially and open from the chevron', () => {
      create();
      const toggle = element.querySelector<HTMLButtonElement>('.game-filters__chip-toggle')!;

      expect(menu()).toBeNull();
      expect(toggle.getAttribute('aria-expanded')).toBe('false');

      openMenu();

      expect(menu()).not.toBeNull();
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
    });

    it('should list every platform as included when nothing is excluded', () => {
      create();
      openMenu();

      for (const key of FILTER_PLATFORM_KEYS) {
        expect(option(key).classList).toContain('checked');
      }
      expect(element.querySelector('.game-filters__platform-option--reset')).toBeNull();
      expect(element.querySelector('.game-filters__exclude-badge')).toBeNull();
    });

    it('should exclude a platform and switch the active filter to "all"', () => {
      create({ activeFilter: 'pc' });
      openMenu();

      click(option('web'));

      expect(excludedChanges).toEqual([['web']]);
      expect(activeFilterChanges).toEqual(['all']);
    });

    it('should not emit a filter change when "all" is already active', () => {
      create({ activeFilter: 'all' });
      openMenu();

      click(option('web'));

      expect(excludedChanges).toEqual([['web']]);
      expect(activeFilterChanges).toEqual([]);
    });

    it('should include an excluded platform again', () => {
      create({ excludedPlatforms: ['web', 'android'] });
      openMenu();

      expect(option('web').classList).not.toContain('checked');

      click(option('web'));

      expect(excludedChanges).toEqual([['android']]);
    });

    it('should show how many platforms are excluded', () => {
      create({ excludedPlatforms: ['web', 'android'] });

      expect(element.querySelector('.game-filters__exclude-badge')?.textContent?.trim()).toBe('2');
    });

    it('should not allow excluding the last included platform', () => {
      const [lastIncluded, ...rest] = FILTER_PLATFORM_KEYS;
      create({ excludedPlatforms: rest });
      openMenu();

      expect(option(lastIncluded).classList).toContain('disabled');

      click(option(lastIncluded));

      expect(excludedChanges).toEqual([]);
    });

    it('should clear all exclusions from "select all"', () => {
      create({ excludedPlatforms: ['web'] });
      openMenu();

      click(element.querySelector<HTMLElement>('.game-filters__platform-option--reset')!);

      expect(excludedChanges).toEqual([[]]);
    });

    it('should stay open after clicking an option inside it', () => {
      create();
      openMenu();

      click(option('web'));

      expect(menu()).not.toBeNull();
    });

    it('should close on a click outside', () => {
      create();
      openMenu();

      document.body.click();
      fixture.detectChanges();

      expect(menu()).toBeNull();
    });

    it('should close on Escape', () => {
      create();
      openMenu();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();

      expect(menu()).toBeNull();
    });

    it('should close after a platform chip is selected', () => {
      create();
      openMenu();

      click(chip('pc'));

      expect(menu()).toBeNull();
    });
  });
});
