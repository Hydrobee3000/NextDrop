import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformIconComponent } from './platform-icon.component';

describe('PlatformIconComponent', () => {
  let fixture: ComponentFixture<PlatformIconComponent>;

  function createWithPlatform(platform: string): void {
    fixture = TestBed.createComponent(PlatformIconComponent);
    fixture.componentRef.setInput('platform', platform);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformIconComponent],
    }).compileComponents();
  });

  it('creates', () => {
    createWithPlatform('PC');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('resolves the icon kind from the platform name', () => {
    createWithPlatform('Xbox Series S/X');
    expect(fixture.componentInstance.kind()).toBe('xbox');
  });

  it('falls back to "pc" for an unrecognized platform', () => {
    createWithPlatform('Some Unknown Platform');
    expect(fixture.componentInstance.kind()).toBe('pc');
  });

  it('exposes a brand svg path only for kinds with a simple-icons logo', () => {
    createWithPlatform('Android');
    expect(fixture.componentInstance.brandPath()).toBeTruthy();

    createWithPlatform('Xbox Series S/X');
    expect(fixture.componentInstance.brandPath()).toBeUndefined();
  });

  it('renders the brand svg path in the template when one is available', () => {
    createWithPlatform('PlayStation 5');
    const path = fixture.nativeElement.querySelector('path[d]');
    expect(path).toBeTruthy();
  });

  it('renders a hand-drawn icon (no brand path) for kinds without a logo, e.g. Xbox', () => {
    createWithPlatform('Xbox Series S/X');
    expect(fixture.componentInstance.brandPath()).toBeUndefined();
    expect(fixture.nativeElement.querySelector('svg')).toBeTruthy();
  });
});
