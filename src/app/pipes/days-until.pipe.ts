import { Pipe, PipeTransform } from '@angular/core';

import { pluralizeRu } from '../shared/pluralize';

/**
 * Человекочитаемая метка для количества дней до релиза:
 * < 0 → "Уже вышла", 0 → "Сегодня", 1 → "Завтра", 2 → "Послезавтра", иначе "N дней".
 */
@Pipe({ name: 'daysUntil' })
export class DaysUntilPipe implements PipeTransform {
  transform(days: number): string {
    if (days < 0) return 'Уже вышла';
    if (days === 0) return 'Сегодня';
    if (days === 1) return 'Завтра';
    if (days === 2) return 'Послезавтра';
    return `${days} ${pluralizeRu(days, ['день', 'дня', 'дней'])}`;
  }
}
