import { Component, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'pk-language-select',
  imports: [FormsModule, NgIcon],
  providers: [],
  styles: `
    .container {
      display: flex;
      align-items: center;
      padding: 0.5rem 0.75rem;
      color: var(--color-text);

      select {
        background-color: var(--color-bg);
        color: inherit;
        border: none;
        padding: 0.5rem 0.4rem;
        font-size: 1rem;
        border-radius: var(--radius-default);
        cursor: pointer;
      }
    }
  `,
  template: `<div class="container">
    <ng-icon name="tablerLanguage" size="1.4rem" />
    <select [(ngModel)]="selectedLanguage" (ngModelChange)="setLanguage($event)">
      @for (item of languages; track item.value) {
        <option [value]="item.value">{{ item.label }}</option>
      }
    </select>
  </div>`,
})
export class LanguageSelectComponent {
  public languages = [
    { value: 'en', label: 'English' },
    { value: 'hu', label: 'Magyar' },
    { value: 'ko', label: '한국어' },
  ];
  public selectedLanguage = signal('en');

  constructor(
    private translateService: TranslateService,
    private languageService: LanguageService
  ) {
    this.selectedLanguage.set(this.translateService.currentLang);
  }

  public setLanguage(selectedLanguage: string): void {
    this.languageService.changeLanguage(selectedLanguage);
  }
}
