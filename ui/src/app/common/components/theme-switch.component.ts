import { Component, effect, Renderer2, signal, WritableSignal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'pk-theme-switch',
  imports: [NgIcon, TranslatePipe],
  providers: [],
  styles: `
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
    <button type="button" (click)="onThemeSwitch()">
      <ng-icon [name]="isDarkMode() ? 'tablerSunHigh' : 'tablerMoon'" size="1.2rem" />
      <span>{{ (isDarkMode() ? 'menu.lightTheme' : 'menu.darkTheme') | translate }}</span>
    </button>
  `,
})
export class ThemeSwitchComponent {
  public isDarkMode: WritableSignal<boolean> = signal(true);

  constructor(private renderer: Renderer2) {
    if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDarkMode.set(false);
    }

    effect(() => {
      if (this.isDarkMode()) {
        this.renderer.addClass(document.body, 'dark');
      } else {
        this.renderer.removeClass(document.body, 'dark');
      }
    });
  }

  public onThemeSwitch(): void {
    this.isDarkMode.set(!this.isDarkMode());
  }
}
