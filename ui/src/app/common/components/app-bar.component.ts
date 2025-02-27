import { Component } from '@angular/core';
import { PkIconButtonComponent } from './pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';
import { MainMenuService } from '../services/main-menu.service';

@Component({
  selector: 'pk-app-bar',
  imports: [PkIconButtonComponent, NgIcon],
  providers: [],
  styles: `
    header {
      padding: 0.5rem;
    }
  `,
  template: `
    <header>
      <pk-icon-button variant="ghost" (clicked)="openMainMenu()">
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
