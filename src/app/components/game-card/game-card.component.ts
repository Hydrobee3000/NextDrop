import { Component, input } from '@angular/core';
import { PlatformIconComponent } from '../platform-icon/platform-icon.component';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';
import { platformMatchesFilter } from '../../shared/platform-filter';

@Component({
  selector: 'app-game-card',
  imports: [DaysUntilPipe, PlatformIconComponent],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss'
})
export class GameCardComponent {
  title = input.required<string>();
  platforms = input.required<string[]>();
  coverImageUrl = input.required<string | null>();
  coverInitials = input.required<string>();
  coverGradient = input.required<string>();
  daysUntilRelease = input.required<number>();
  activeFilter = input<string>('Все');

  matchesFilter(platform: string): boolean {
    return platformMatchesFilter(platform, this.activeFilter());
  }
}
