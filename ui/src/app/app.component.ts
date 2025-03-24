import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './pages/auth/auth.service';
import { AppBarComponent } from './common/components/app-bar.component';
import { MainMenuComponent } from './common/components/main-menu.component';
import { LocaleService } from './common/services/locale.service';
import { TooltipHostComponent } from './common/components/tooltip-host.component';

@Component({
  selector: 'pk-root',
  imports: [RouterOutlet, AppBarComponent, MainMenuComponent, TooltipHostComponent],
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
    <pk-tooltip-host />
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
