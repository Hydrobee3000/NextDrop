import { Component } from '@angular/core';
import { LucideHouse, LucideSearch, LucideHeart, LucideCalendar, LucideBell } from '@lucide/angular';

type NavIcon = 'house' | 'search' | 'heart' | 'calendar' | 'bell';

interface NavItem {
  label: string;
  icon: NavIcon;
  active: boolean;
}

@Component({
  selector: 'app-layout',
  imports: [LucideHouse, LucideSearch, LucideHeart, LucideCalendar, LucideBell],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  readonly navItems: NavItem[] = [
    { label: 'Главная', icon: 'house', active: true },
    { label: 'Поиск', icon: 'search', active: false },
    { label: 'Мой список', icon: 'heart', active: false },
    { label: 'Календарь', icon: 'calendar', active: false },
    { label: 'Уведомления', icon: 'bell', active: false },
  ];
}
