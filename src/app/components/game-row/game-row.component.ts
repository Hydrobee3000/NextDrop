import { Component, input } from '@angular/core';

@Component({
  selector: 'app-game-row',
  imports: [],
  templateUrl: './game-row.component.html',
  styleUrl: './game-row.component.scss'
})
export class GameRowComponent {
  title = input.required<string>();
  platforms = input.required<string[]>();
  coverInitials = input.required<string>();
  coverGradient = input.required<string>();
  daysUntilRelease = input.required<number>();
}
