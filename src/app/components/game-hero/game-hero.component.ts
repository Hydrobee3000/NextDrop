import { Component, input } from '@angular/core';
import { LucideHeart } from '@lucide/angular';

@Component({
  selector: 'app-game-hero',
  imports: [LucideHeart],
  templateUrl: './game-hero.component.html',
  styleUrl: './game-hero.component.scss'
})
export class GameHeroComponent {
  title = input.required<string>();
  platforms = input.required<string[]>();
  coverImageUrl = input.required<string | null>();
  coverInitials = input.required<string>();
  coverGradient = input.required<string>();
  daysUntilRelease = input.required<number>();
  releaseDateLabel = input.required<string>();
}
