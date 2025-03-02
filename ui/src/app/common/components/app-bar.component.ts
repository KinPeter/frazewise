import { Component } from '@angular/core';
import { PkIconButtonComponent } from './pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';
import { MainMenuService } from '../services/main-menu.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'pk-app-bar',
  imports: [PkIconButtonComponent, NgIcon, TranslatePipe],
  providers: [],
  styles: `
    header {
      padding: 0.5rem;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      background-color: var(--color-body);
    }
  `,
  template: `
    <header>
      <pk-icon-button
        variant="ghost"
        [tooltip]="'menu.menu' | translate"
        (clicked)="openMainMenu()">
        <ng-icon name="tablerMenu2" size="2rem" />
      </pk-icon-button>
    </header>
  `,
})
export class AppBarComponent {
  constructor(private mainMenuService: MainMenuService) {}

  public openMainMenu(): void {
    this.mainMenuService.openMainMenu();
  }
}
