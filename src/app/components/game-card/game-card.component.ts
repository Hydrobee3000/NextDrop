import { Component, input } from '@angular/core';
import { DaysUntilPipe } from '../../pipes/days-until.pipe';

@Component({
  selector: 'app-game-card',
  imports: [DaysUntilPipe],
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
}
