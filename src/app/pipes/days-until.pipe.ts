import { Pipe, PipeTransform, inject } from '@angular/core';

import { I18nService } from '../services/i18n.service';
import { pluralizeEn, pluralizeRu } from '../shared/pluralize';

/**
 * Человекочитаемая метка для количества дней до релиза:
 * null → "???" (дата вообще неизвестна), < 0 → "Уже вышла", 0 → "Сегодня",
 * 1 → "Завтра", иначе "N дней" с верным склонением. Если isTba — дата у RAWG
 * помечена как неподтверждённая, добавляем "~" перед меткой (кроме "???").
 */
@Pipe({ name: 'daysUntil', pure: false })
export class DaysUntilPipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(days: number | null, isTba = false): string {
    if (days === null) return this.i18n.t('days.tba');

    const prefix = isTba ? '~' : '';
    if (days < 0) return prefix + this.i18n.t('days.released');
    if (days === 0) return prefix + this.i18n.t('days.today');
    if (days === 1) return prefix + this.i18n.t('days.tomorrow');

    const word =
      this.i18n.locale() === 'ru'
        ? pluralizeRu(days, [this.i18n.t('day.one'), this.i18n.t('day.few'), this.i18n.t('day.many')])
        : pluralizeEn(days, [this.i18n.t('day.one'), this.i18n.t('day.other')]);

    return `${prefix}${days} ${word}`;
  }
}
