import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './pages/auth/auth.service';
import { AppBarComponent } from './common/components/app-bar.component';
import { MainMenuComponent } from './common/components/main-menu.component';
import { LocaleService } from './common/services/locale.service';

@Component({
  selector: 'pk-root',
  imports: [RouterOutlet, AppBarComponent, MainMenuComponent],
  template: `
    <pk-app-bar />
    <router-outlet />
    <pk-main-menu />
  `,
  styles: [],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private languageService: LocaleService
  ) {
    this.languageService.init();
    this.authService.autoLogin();
  }
}
