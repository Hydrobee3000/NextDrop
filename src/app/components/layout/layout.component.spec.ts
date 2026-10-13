import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { LayoutComponent } from './layout.component';

// Пустая страница-заглушка: тесту важны только URL-ы, а не настоящие страницы.
@Component({ template: '' })
class StubPageComponent {}

// Хост, чтобы проверить, что layout выводит переданный ему контент.
@Component({
  imports: [LayoutComponent],
  template: '<app-layout><p class="projected">page</p></app-layout>',
})
class HostComponent {}

describe('LayoutComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideRouter([
          { path: '', component: StubPageComponent },
          { path: 'search', component: StubPageComponent },
          { path: 'favorites', component: StubPageComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  async function navigate(url: string): Promise<void> {
    await TestBed.inject(Router).navigateByUrl(url);
    fixture.detectChanges();
  }

  function navLinks(): HTMLAnchorElement[] {
    return Array.from(element.querySelectorAll<HTMLAnchorElement>('.layout__nav-item'));
  }

  function activeHrefs(): (string | null)[] {
    return navLinks()
      .filter((link) => link.classList.contains('active'))
      .map((link) => link.getAttribute('href'));
  }

  it('should render a nav link for every page', () => {
    expect(navLinks().map((link) => link.getAttribute('href'))).toEqual(['/', '/search', '/favorites']);
  });

  it('should render an icon and a label in every nav link', () => {
    for (const link of navLinks()) {
      expect(link.querySelector('svg')).not.toBeNull();
      expect(link.querySelector('.layout__nav-label')?.textContent?.trim()).toBeTruthy();
    }
  });

  it('should mark only the search link as active on /search', async () => {
    await navigate('/search');

    expect(activeHrefs()).toEqual(['/search']);
  });

  it('should mark only the home link as active on /', async () => {
    await navigate('/');

    expect(activeHrefs()).toEqual(['/']);
  });

  it('should mark only the favorites link as active on /favorites', async () => {
    await navigate('/favorites');

    expect(activeHrefs()).toEqual(['/favorites']);
  });

  it('should render the projected page content inside main', () => {
    expect(element.querySelector('main.layout__content .projected')?.textContent).toBe('page');
  });
});
