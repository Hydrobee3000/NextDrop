import { Pipe, PipeTransform, inject } from '@angular/core';

import { I18nService } from '../services/i18n.service';
import { pluralizeEn, pluralizeRu } from '../shared/pluralize';

/**
 * Человекочитаемая метка для количества найденных релизов: "N релизов" с верным склонением.
 */
@Pipe({ name: 'releaseCount', pure: false })
export class ReleaseCountPipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(count: number): string {
    const word =
      this.i18n.locale() === 'ru'
        ? pluralizeRu(count, [this.i18n.t('release.one'), this.i18n.t('release.few'), this.i18n.t('release.many')])
        : pluralizeEn(count, [this.i18n.t('release.one'), this.i18n.t('release.other')]);

    return `${count} ${word}`;
  }
}
