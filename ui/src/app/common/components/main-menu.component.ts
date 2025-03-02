import { Component, Signal } from '@angular/core';
import { DrawerComponent } from './drawer.component';
import { TranslatePipe } from '@ngx-translate/core';
import { MainMenuService } from '../services/main-menu.service';
import { AuthService } from '../../pages/auth/auth.service';
import { NgIcon } from '@ng-icons/core';
import { Router } from '@angular/router';
import { LocaleSelectComponent } from './locale-select.component';
import { AuthStore } from '../../pages/auth/auth.store';
import { ThemeSwitchComponent } from './theme-switch.component';

@Component({
  selector: 'pk-main-menu',
  imports: [DrawerComponent, TranslatePipe, NgIcon, LocaleSelectComponent, ThemeSwitchComponent],
  providers: [],
  styles: `
    nav {
      padding-top: 2rem;
    }
    button {
      display: flex;
      align-items: center;
      padding: 1rem 0.75rem;
      gap: 0.75rem;
      width: 100%;
      border-radius: var(--radius-default);
      font-size: 1rem;

      &:hover {
        background-color: var(--color-bg-opaque-lighter);
      }

      ng-icon {
        position: relative;
        top: -1px;
      }
    }
  `,
  template: `
    <pk-drawer [name]="'menu.menu' | translate" [open]="open()" size="sm" (close)="close()">
      @if (isAuth()) {
        <nav>
          @for (item of items; track item.label) {
            <button type="button" (click)="item.action()">
              <ng-icon [name]="item.icon" size="1.2rem" />
              <span>{{ item.label | translate }}</span>
            </button>
          }
        </nav>
        <hr />
      }
      <pk-theme-switch />
      <pk-locale-select />
    </pk-drawer>
  `,
})
export class MainMenuComponent {
  public open: Signal<boolean>;
  public isAuth: Signal<boolean>;

  constructor(
    private mainMenuService: MainMenuService,
    private authService: AuthService,
    private authStore: AuthStore,
    private router: Router
  ) {
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      if (this.mainMenuService.isMainMenuOpen() && e.key === 'Escape') {
        this.mainMenuService.closeMainMenu();
      }
    });
    this.open = this.mainMenuService.isMainMenuOpen;
    this.isAuth = this.authStore.isAuth;
  }

  public items = [
    {
      icon: 'tablerHome',
      label: 'pages.home',
      action: () => this.router.navigate(['/']),
    },
    {
      icon: 'tablerVersions',
      label: 'pages.decks',
      action: () => this.router.navigate(['/decks']),
    },
    {
      icon: 'tablerSettings',
      label: 'pages.settings',
      action: () => this.router.navigate(['/settings']),
    },
    {
      icon: 'tablerCloudDown',
      label: 'menu.emailDataBackup',
      action: () => console.log('todo'),
    },
    {
      icon: 'tablerCloudDownload',
      label: 'menu.downloadDataBackup',
      action: () => console.log('todo'),
    },
    {
      icon: 'tablerArrowsMaximize',
      label: 'menu.enterFullscreen',
      action: () => this.enterFullScreen(),
    },
    {
      icon: 'tablerLogout',
      label: 'menu.logOut',
      action: () => {
        this.authService.logout();
        location.reload();
      },
    },
  ];

  private enterFullScreen(): void {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  }

  public close(): void {
    this.mainMenuService.closeMainMenu();
  }
}
