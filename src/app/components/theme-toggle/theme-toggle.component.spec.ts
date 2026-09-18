import { WritableSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeToggleComponent } from './theme-toggle.component';
import { Theme } from '../../models/theme';
import { ThemeService } from '../../services/theme.service';

describe('ThemeToggleComponent', () => {
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeSignal: WritableSignal<Theme>;
  let toggleSpy: jasmine.Spy;

  function create(): void {
    fixture = TestBed.createComponent(ThemeToggleComponent);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    themeSignal = signal<Theme>('dark');
    toggleSpy = jasmine.createSpy('toggle');

    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
      providers: [{ provide: ThemeService, useValue: { theme: themeSignal, toggle: toggleSpy } }],
    }).compileComponents();
  });

  it('creates', () => {
    create();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the sun icon and offers to switch to light theme when currently dark', () => {
    themeSignal.set('dark');
    create();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.querySelector('svg')).toBeTruthy();
    expect(button.getAttribute('aria-label')).toBe('Light theme');
  });

  it('shows the moon icon and offers to switch to dark theme when currently light', () => {
    themeSignal.set('light');
    create();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Dark theme');
  });

  it('calls ThemeService.toggle() when clicked', () => {
    create();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(toggleSpy).toHaveBeenCalledTimes(1);
  });
});
