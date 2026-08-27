import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideHouse, LucideSearch, LucideHeart } from '@lucide/angular';

type NavIcon = 'house' | 'search' | 'heart';

interface NavItem {
  label: string;
  icon: NavIcon;
  path: string;
}

@Component({
  selector: 'app-layout',
  imports: [LucideHouse, LucideSearch, LucideHeart, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  readonly navItems: NavItem[] = [
    { label: 'Главная', icon: 'house', path: '/' },
    { label: 'Поиск', icon: 'search', path: '/search' },
    { label: 'Мой список', icon: 'heart', path: '/favorites' },
  ];
}
