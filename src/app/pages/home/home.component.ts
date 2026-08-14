import { Component } from '@angular/core';
import { GameHeroComponent } from '../../components/game-hero/game-hero.component';
import { Game } from '../../models/game';

@Component({
  selector: 'app-home',
  imports: [GameHeroComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly heroGame: Game = {
    id: 'gta-vi',
    title: 'Grand Theft Auto VI',
    platforms: ['PS5', 'Xbox Series X|S'],
    coverInitials: 'GTA VI',
    coverGradient: 'linear-gradient(135deg, var(--color-accent-800), var(--color-neutral-900))',
    daysUntilRelease: 92,
    releaseDateLabel: '19 ноября 2026',
  };
}
