import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from './pages/auth/auth.service';

@Component({
  selector: 'pk-root',
  imports: [RouterOutlet, TranslatePipe],
  template: `
    <h1>{{ 'hello' | translate }} {{ title }}!</h1>

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
}
