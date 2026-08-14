import { Component } from '@angular/core';
import { GameHeroComponent } from '../../components/game-hero/game-hero.component';
import { GameRowComponent } from '../../components/game-row/game-row.component';
import { Game } from '../../models/game';

@Component({
  selector: 'app-home',
  imports: [GameHeroComponent, GameRowComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly games: Game[] = [
    {
      id: 'gta-vi',
      title: 'Grand Theft Auto VI',
      platforms: ['PS5', 'Xbox Series X|S'],
      coverInitials: 'GTA VI',
      coverGradient: 'linear-gradient(135deg, var(--color-accent-800), var(--color-neutral-900))',
      daysUntilRelease: 92,
      releaseDateLabel: '19 ноября 2026',
    },
    {
      id: 'silksong',
      title: 'Hollow Knight: Silksong',
      platforms: ['Switch 2', 'PC', 'PS5'],
      coverInitials: 'SILKSONG',
      coverGradient: 'linear-gradient(135deg, var(--color-accent-700), var(--color-neutral-900))',
      daysUntilRelease: 14,
      releaseDateLabel: 'Уточняется, 2026',
    },
    {
      id: 'metroid-prime-4',
      title: 'Metroid Prime 4: Beyond',
      platforms: ['Switch 2'],
      coverInitials: 'MP4',
      coverGradient: 'linear-gradient(135deg, var(--color-neutral-700), var(--color-neutral-900))',
      daysUntilRelease: 33,
      releaseDateLabel: 'Декабрь 2026',
    },
    {
      id: 'death-stranding-2',
      title: 'Death Stranding 2',
      platforms: ['PS5'],
      coverInitials: 'DS2',
      coverGradient: 'linear-gradient(135deg, var(--color-accent-700), var(--color-neutral-900))',
      daysUntilRelease: 58,
      releaseDateLabel: 'Январь 2027',
    },
  ];

  get heroGame(): Game {
    return this.games[0];
  }

  get sideGames(): Game[] {
    return this.games.slice(1);
  }
}
