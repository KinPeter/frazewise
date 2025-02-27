import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ThemeSwitchComponent } from './common/components/theme-switch.component';
import { AuthService } from './pages/auth/auth.service';
import { PkButtonComponent } from './common/components/pk-button.component';

@Component({
  selector: 'pk-root',
  imports: [RouterOutlet, TranslatePipe, ThemeSwitchComponent, PkButtonComponent],
  template: `
    <h1>{{ 'hello' | translate }} {{ title }}!</h1>

    <div [style]="{ display: 'flex' }">
      <pk-button (click)="toggleLanguage()">Switch language</pk-button>
      <pk-theme-switch />
      <pk-button (click)="logout()">Log out</pk-button>
    </div>
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'FrazeWise';

  constructor(
    private authService: AuthService,
    private translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
    this.authService.autoLogin();
  }

  public toggleLanguage(): void {
    if (this.translateService.currentLang === 'en') {
      this.translateService.use('hu');
    } else {
      this.translateService.use('en');
    }
  }

  public logout(): void {
    this.authService.logout();
    location.reload();
  }
}
