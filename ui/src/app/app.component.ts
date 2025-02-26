import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ThemeSwitchComponent } from './components/core/theme-switch.component';

@Component({
  selector: 'pk-root',
  imports: [RouterOutlet, TranslatePipe, ThemeSwitchComponent],
  template: `
    <h1>{{ 'hello' | translate }} {{ title }}!</h1>

    <button (click)="toggleLanguage()">Switch language</button>
    <pk-theme-switch />
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'FrazeWise';

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  public toggleLanguage(): void {
    if (this.translateService.currentLang === 'en') {
      this.translateService.use('hu');
    } else {
      this.translateService.use('en');
    }
  }
}
