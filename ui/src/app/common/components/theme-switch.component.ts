import { Component, Renderer2 } from '@angular/core';
import { PkButtonComponent } from './pk-button.component';

@Component({
  selector: 'pk-theme-switch',
  imports: [PkButtonComponent],
  providers: [],
  styles: ``,
  template: ` <pk-button (click)="onThemeSwitch()">Switch Theme</pk-button> `,
})
export class ThemeSwitchComponent {
  constructor(private renderer: Renderer2) {}

  public onThemeSwitch(): void {
    if (document.body.classList.contains('dark')) {
      this.renderer.removeClass(document.body, 'dark');
    } else {
      this.renderer.addClass(document.body, 'dark');
    }
  }
}
