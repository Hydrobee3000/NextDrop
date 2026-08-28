import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../services/i18n.service';

@Pipe({ name: 'localizedDate', pure: false })
export class LocalizedDatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(releaseDate: string | null): string {
    if (!releaseDate) {
      return this.i18n.t('date.tba');
    }

    const locale = this.i18n.locale() === 'ru' ? 'ru-RU' : 'en-US';
    return new Date(releaseDate).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
