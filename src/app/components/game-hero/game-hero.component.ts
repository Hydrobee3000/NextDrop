import { Component, input } from '@angular/core';
import { LucideHeart } from '@lucide/angular';

import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';
import { getPlatformIconKind } from '../../shared/platform-icon';
import { pluralizeRu } from '../../shared/pluralize';
import { platformMatchesFilter } from '../../shared/platform-filter';

@Component({
  selector: 'app-game-hero',
  imports: [LucideHeart, DaysUntilPipe, PlatformIconComponent],
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
  activeFilter = input<string>('Все');

  daysWord(): string {
    return pluralizeRu(this.daysUntilRelease(), ['день', 'дня', 'дней']);
  }

  matchesFilter(platform: string): boolean {
    return platformMatchesFilter(platform, this.activeFilter());
  }

  iconKind(platform: string): string {
    return getPlatformIconKind(platform);
  }
}
