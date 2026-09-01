import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from "./components/layout/layout.component";
import { GameDetailModalComponent } from './components/game-detail-modal/game-detail-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent, GameDetailModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'nextdrop';
}
