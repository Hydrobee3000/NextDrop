import { Pipe, PipeTransform, inject } from '@angular/core';

import { I18nService } from '../services/i18n.service';
import { pluralizeEn, pluralizeRu } from '../shared/pluralize';

/**
 * Человекочитаемая метка для количества дней до релиза:
 * < 0 → "Уже вышла", 0 → "Сегодня", 1 → "Завтра", 2 → "Послезавтра", иначе "N дней".
 */
@Pipe({ name: 'daysUntil', pure: false })
export class DaysUntilPipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(days: number): string {
    if (days < 0) return this.i18n.t('days.released');
    if (days === 0) return this.i18n.t('days.today');
    if (days === 1) return this.i18n.t('days.tomorrow');
    if (days === 2) return this.i18n.t('days.dayAfterTomorrow');

    const word =
      this.i18n.locale() === 'ru'
        ? pluralizeRu(days, [this.i18n.t('day.one'), this.i18n.t('day.few'), this.i18n.t('day.many')])
        : pluralizeEn(days, [this.i18n.t('day.one'), this.i18n.t('day.other')]);

    return `${days} ${word}`;
  }
}
