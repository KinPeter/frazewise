import { Component, Signal } from '@angular/core';
import { PkIconButtonComponent } from './pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';
import { MainMenuService } from '../services/main-menu.service';
import { TranslatePipe } from '@ngx-translate/core';
import { PkPageContentDirective } from '../directives/pk-page-content.directive';
import { AppBarService } from '../services/app-bar.service';

@Component({
  selector: 'pk-app-bar',
  imports: [PkIconButtonComponent, NgIcon, TranslatePipe, PkPageContentDirective],
  providers: [],
  styles: `
    header {
      padding: 0.5rem;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      background-color: var(--color-body);

      @media (max-width: 600px) {
        h1 > span {
          display: inline-block;
          max-width: 180px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }

    pk-icon-button.menu-button {
      position: absolute;
    }

    pk-icon-button.back-button {
      position: absolute;
      left: 4rem;
    }

    .content {
      padding: 0.3rem 0 0;

      @media (max-width: 1000px) {
        text-align: center;
      }

      h1 {
        font-size: 1.2rem;
        padding-top: 0.2rem;

        @media (min-width: 500px) {
          font-size: 1.5rem;
          padding-top: 0;
        }
      }
    }
  `,
  template: `
    <header>
      <pk-icon-button
        class="menu-button"
        variant="ghost"
        [tooltip]="'menu.menu' | translate"
        (clicked)="openMainMenu()">
        <ng-icon name="tablerMenu2" size="2rem" />
      </pk-icon-button>
      @if (hasBackButton()) {
        <pk-icon-button
          class="back-button"
          variant="ghost"
          [tooltip]="'common.back' | translate"
          (clicked)="goBack()">
          <ng-icon name="tablerChevronLeft" size="2rem" />
        </pk-icon-button>
      }
      <div pkPageContent class="content">
        <h1>
          <span>{{ title() | translate }}</span>
        </h1>
      </div>
    </header>
  `,
})
export class AppBarComponent {
  public hasBackButton: Signal<boolean>;
  public title: Signal<string>;

  constructor(
    private mainMenuService: MainMenuService,
    private appBarService: AppBarService
  ) {
    this.hasBackButton = this.appBarService.hasBackButton;
    this.title = this.appBarService.title;
  }

  public openMainMenu(): void {
    this.mainMenuService.openMainMenu();
  }

  public goBack(): void {
    this.appBarService.navigateBack();
  }
}
