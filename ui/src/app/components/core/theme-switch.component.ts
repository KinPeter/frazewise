import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'pk-theme-switch',
  imports: [],
  providers: [],
  styles: ``,
  template: ` <button (click)="onThemeSwitch()">Switch Theme</button> `,
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
