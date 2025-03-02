import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from './pages/auth/auth.service';
import { AppBarComponent } from './common/components/app-bar.component';
import { MainMenuComponent } from './common/components/main-menu.component';
import { LocaleService } from './common/services/locale.service';

@Component({
  selector: 'pk-root',
  imports: [RouterOutlet, TranslatePipe, AppBarComponent, MainMenuComponent],
  template: `
    <pk-app-bar />
    <h1>{{ 'hello' | translate }} {{ title }}!</h1>

    <router-outlet />
    <pk-main-menu />
  `,
  styles: [],
})
export class AppComponent {
  title = 'FrazeWise';

  constructor(
    private authService: AuthService,
    private languageService: LocaleService
  ) {
    this.languageService.init();
    this.authService.autoLogin();
  }
}
