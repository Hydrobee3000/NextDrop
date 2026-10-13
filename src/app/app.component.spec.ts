import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      // Настоящие сервисы, но HttpClient — тестовый: ни одного реального запроса к RAWG.
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the router outlet inside the layout', () => {
    const element = render();

    expect(element.querySelector('app-layout router-outlet')).not.toBeNull();
  });

  it('should render the game detail modal outside the layout', () => {
    const element = render();

    expect(element.querySelector(':scope > app-game-detail-modal')).not.toBeNull();
    expect(element.querySelector('app-layout app-game-detail-modal')).toBeNull();
  });

  it('should not send any HTTP requests on startup', () => {
    render();

    TestBed.inject(HttpTestingController).verify();
  });
});
