import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideHouse, LucideSearch, LucideHeart, LucideCalendar } from '@lucide/angular';

type NavIcon = 'house' | 'search' | 'heart' | 'calendar';

interface NavItem {
  label: string;
  icon: NavIcon;
  path?: string;
}

@Component({
  selector: 'app-layout',
  imports: [LucideHouse, LucideSearch, LucideHeart, LucideCalendar, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  readonly navItems: NavItem[] = [
    { label: 'Главная', icon: 'house', path: '/' },
    { label: 'Поиск', icon: 'search', path: '/search' },
    { label: 'Мой список', icon: 'heart', path: '/favorites' },
    { label: 'Календарь', icon: 'calendar' },
  ];
}
