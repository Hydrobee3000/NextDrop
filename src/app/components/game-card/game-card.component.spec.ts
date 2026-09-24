import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCardComponent } from './game-card.component';
import { Game } from '../../models/game';
import { GameDetailService } from '../../services/game-detail.service';

function buildGame(overrides: Partial<Game> = {}): Game {
  return {
    id: 'game-1',
    title: 'Test Game',
    platforms: ['PC', 'PlayStation 5'],
    coverImageUrl: null,
    coverInitials: 'TG',
    coverGradient: 'linear-gradient(135deg, #000, #111)',
    daysUntilRelease: 5,
    releaseDate: null,
    isTba: false,
    ...overrides,
  };
}

describe('GameCardComponent', () => {
  let fixture: ComponentFixture<GameCardComponent>;
  let detailServiceSpy: jasmine.SpyObj<GameDetailService>;

  function create(game: Game, activeFilter?: string, excludedPlatforms?: string[]): void {
    fixture = TestBed.createComponent(GameCardComponent);
    fixture.componentRef.setInput('game', game);
    if (activeFilter !== undefined) {
      fixture.componentRef.setInput('activeFilter', activeFilter);
    }
    if (excludedPlatforms !== undefined) {
      fixture.componentRef.setInput('excludedPlatforms', excludedPlatforms);
    }
    fixture.detectChanges();
  }

  beforeEach(async () => {
    // Фиксируем "сегодня" — daysUntilRelease() пересчитывается от Date.now() при каждом рендере.
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2026-01-01T00:00:00.000Z'));

    // GameDetailService тянет GamesApiService -> HttpClient, которого нет в тестовом модуле — мокаем.
    detailServiceSpy = jasmine.createSpyObj<GameDetailService>('GameDetailService', ['open', 'close']);

    await TestBed.configureTestingModule({
      imports: [GameCardComponent],
      providers: [{ provide: GameDetailService, useValue: detailServiceSpy }],
    }).compileComponents();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('creates', () => {
    create(buildGame());
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the game title and cover initials when there is no image', () => {
    create(buildGame({ title: 'Elden Ring 2', coverImageUrl: null, coverInitials: 'ER' }));

    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('.game-card__title')?.textContent).toContain('Elden Ring 2');
    expect(compiled.querySelector('.game-card__initials')?.textContent).toContain('ER');
    expect(compiled.querySelector('.game-card__image')).toBeNull();
  });

  it('renders an image instead of initials when a cover image is available', () => {
    create(buildGame({ coverImageUrl: 'https://example.com/cover.jpg' }));

    const image: HTMLImageElement | null = fixture.nativeElement.querySelector('.game-card__image');
    expect(image?.src).toBe('https://example.com/cover.jpg');
    expect(fixture.nativeElement.querySelector('.game-card__initials')).toBeNull();
  });

  it('opens the game detail via GameDetailService when clicked', () => {
    const game = buildGame();
    create(game);

    fixture.nativeElement.querySelector('.game-card').click();

    expect(detailServiceSpy.open).toHaveBeenCalledOnceWith(game);
  });

  it('renders one platform tag per platform, all active when the filter is "all"', () => {
    create(buildGame({ platforms: ['PC', 'PlayStation 5', 'Xbox Series S/X'] }));

    const tags: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.tag');
    expect(tags.length).toBe(3);
    tags.forEach((tag) => expect(tag.classList.contains('tag--muted')).toBeFalse());
  });

  it('mutes platform tags that do not match the active filter', () => {
    create(buildGame({ platforms: ['PC', 'PlayStation 5'] }), 'pc');

    const tags: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.tag');
    expect(tags[0].classList.contains('tag--muted')).toBeFalse();
    expect(tags[1].classList.contains('tag--muted')).toBeTrue();
  });

  it('shows the release countdown badge with the matching urgency tier', () => {
    create(buildGame({ releaseDate: '2026-01-02' })); // "сегодня" зафиксировано на 2026-01-01 -> 1 день -> tier 1

    const badge: HTMLElement | null = fixture.nativeElement.querySelector('.game-card__days');
    expect(badge?.getAttribute('data-urgency')).toBe('1');
  });

  it('shows a "tba" badge with "???" when there is no release date at all', () => {
    create(buildGame({ releaseDate: null }));

    const badge: HTMLElement | null = fixture.nativeElement.querySelector('.game-card__days');
    expect(badge?.getAttribute('data-urgency')).toBe('tba');
    expect(badge?.textContent?.trim()).toBe('???');
  });
});
