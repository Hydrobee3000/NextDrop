import { Component } from '@angular/core';
import { LucideHouse, LucideSearch, LucideHeart, LucideCalendar, LucideBell } from '@lucide/angular';

type NavIcon = 'house' | 'search' | 'heart' | 'calendar' | 'bell';

interface NavItem {
  label: string;
  icon: NavIcon;
}

@Component({
  selector: 'app-layout',
  imports: [LucideHouse, LucideSearch, LucideHeart, LucideCalendar, LucideBell],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  readonly navItems: NavItem[] = [
    { label: 'Главная', icon: 'house' },
    { label: 'Поиск', icon: 'search' },
    { label: 'Мой список', icon: 'heart' },
    { label: 'Календарь', icon: 'calendar' },
    { label: 'Уведомления', icon: 'bell' },
  ];
}
