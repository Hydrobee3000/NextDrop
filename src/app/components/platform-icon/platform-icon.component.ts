import { Component, input } from '@angular/core';
import { siPlaystation, siApple, siAndroid, siLinux, siSteam } from 'simple-icons';
import { LucideGlobe } from '@lucide/angular';

import { getPlatformIconKind, PlatformIconKind } from '../../shared/platform-icon';

const BRAND_PATHS: Partial<Record<PlatformIconKind, string>> = {
  playstation: siPlaystation.path,
  apple: siApple.path,
  android: siAndroid.path,
  linux: siLinux.path,
  steam: siSteam.path,
};

@Component({
  selector: 'app-platform-icon',
  imports: [LucideGlobe],
  templateUrl: './platform-icon.component.html',
  styleUrl: './platform-icon.component.scss',
})
export class PlatformIconComponent {
  platform = input.required<string>();

  kind(): PlatformIconKind {
    return getPlatformIconKind(this.platform());
  }

  brandPath(): string | undefined {
    return BRAND_PATHS[this.kind()];
  }
}
