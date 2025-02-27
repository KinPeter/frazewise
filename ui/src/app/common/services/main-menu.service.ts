import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MainMenuService {
  private isMenuOpen = signal(false);

  public isMainMenuOpen = computed(() => this.isMenuOpen());

  public toggleMainMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  public openMainMenu(): void {
    this.isMenuOpen.set(true);
  }

  public closeMainMenu(): void {
    this.isMenuOpen.set(false);
  }
}
