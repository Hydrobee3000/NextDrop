import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteButtonComponent, FavoriteButtonSize } from './favorite-button.component';
import { Game } from '../../models/game';
import { FavoritesService } from '../../services/favorites.service';
import { I18nService } from '../../services/i18n.service';

const TEST_GAME: Game = {
  id: 'game-1',
  title: 'Test Game',
  platforms: ['PC'],
  coverImageUrl: null,
  coverInitials: 'TG',
  coverGradient: 'linear-gradient(135deg, #000, #111)',
  daysUntilRelease: 5,
  releaseDate: '2026-01-01',
  isTba: false,
};

describe('FavoriteButtonComponent', () => {
  let fixture: ComponentFixture<FavoriteButtonComponent>;
  let favoritesServiceSpy: jasmine.SpyObj<FavoritesService>;
  let i18nServiceSpy: jasmine.SpyObj<I18nService>;

  function create(size?: FavoriteButtonSize): void {
    fixture = TestBed.createComponent(FavoriteButtonComponent);
    fixture.componentRef.setInput('game', TEST_GAME);
    if (size) {
      fixture.componentRef.setInput('size', size);
    }
    fixture.detectChanges();
  }

  beforeEach(async () => {
    favoritesServiceSpy = jasmine.createSpyObj<FavoritesService>('FavoritesService', ['isFavorite', 'toggle']);
    i18nServiceSpy = jasmine.createSpyObj<I18nService>('I18nService', ['t']);
    // Возвращаем сам ключ перевода — тесту важно, какой ключ выбрал компонент, а не текст.
    i18nServiceSpy.t.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      imports: [FavoriteButtonComponent],
      providers: [
        { provide: FavoritesService, useValue: favoritesServiceSpy },
        { provide: I18nService, useValue: i18nServiceSpy },
      ],
    }).compileComponents();
  });

  it('creates', () => {
    favoritesServiceSpy.isFavorite.and.returnValue(false);
    create();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the "add" label and no active state when the game is not a favorite', () => {
    favoritesServiceSpy.isFavorite.and.returnValue(false);
    create();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('active')).toBeFalse();
    expect(button.getAttribute('aria-label')).toBe('favorite.add');
  });

  it('shows the "remove" label and the active state when the game is a favorite', () => {
    favoritesServiceSpy.isFavorite.and.returnValue(true);
    create();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('active')).toBeTrue();
    expect(button.getAttribute('aria-label')).toBe('favorite.remove');
  });

  it('reflects the requested size via the data-size attribute', () => {
    favoritesServiceSpy.isFavorite.and.returnValue(false);
    create('l');

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('data-size')).toBe('l');
  });

  it('toggles the game in FavoritesService when clicked', () => {
    favoritesServiceSpy.isFavorite.and.returnValue(false);
    create();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(favoritesServiceSpy.toggle).toHaveBeenCalledOnceWith(TEST_GAME);
  });

  it('stops the click event from bubbling, so it never triggers a parent card click', () => {
    favoritesServiceSpy.isFavorite.and.returnValue(false);
    create();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    spyOn(clickEvent, 'stopPropagation');
    button.dispatchEvent(clickEvent);

    expect(clickEvent.stopPropagation).toHaveBeenCalled();
  });
});
