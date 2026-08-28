import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideHouse, LucideSearch, LucideHeart } from '@lucide/angular';

import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

type NavIcon = 'house' | 'search' | 'heart';

interface NavItem {
  labelKey: string;
  icon: NavIcon;
  path: string;
}

@Component({
  selector: 'app-layout',
  imports: [LucideHouse, LucideSearch, LucideHeart, RouterLink, RouterLinkActive, LanguageSwitcherComponent, TranslatePipe],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  readonly navItems: NavItem[] = [
    { labelKey: 'nav.home', icon: 'house', path: '/' },
    { labelKey: 'nav.search', icon: 'search', path: '/search' },
    { labelKey: 'nav.favorites', icon: 'heart', path: '/favorites' },
  ];
}
