import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './pages/auth/auth.service';
import { AppBarComponent } from './common/components/app-bar.component';
import { MainMenuComponent } from './common/components/main-menu.component';
import { LocaleService } from './common/services/locale.service';

@Component({
  selector: 'pk-root',
  imports: [RouterOutlet, AppBarComponent, MainMenuComponent],
  styles: `
    .wrapper {
      height: 100vh;
      overflow: auto;
    }
  `,
  template: `
    <pk-app-bar />
    <div class="wrapper">
      <router-outlet />
    </div>
    <pk-main-menu />
  `,
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
