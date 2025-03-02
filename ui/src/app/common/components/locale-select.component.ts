import { Component, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { LocaleService } from '../services/locale.service';

@Component({
  selector: 'pk-locale-select',
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
  template: ` <div class="container">
    <ng-icon name="tablerLanguage" size="1.4rem" />
    <select [(ngModel)]="selectedLocale" (ngModelChange)="setLocale($event)">
      @for (item of locales; track item.value) {
        <option [value]="item.value">{{ item.label }}</option>
      }
    </select>
  </div>`,
})
export class LocaleSelectComponent {
  public locales = [
    { value: 'en', label: 'English' },
    { value: 'hu', label: 'Magyar' },
    { value: 'ko', label: '한국어' },
  ];
  public selectedLocale = signal('en');

  constructor(
    private translateService: TranslateService,
    private locale: LocaleService
  ) {
    this.selectedLocale.set(this.translateService.currentLang);
  }

  public setLocale(selectedLanguage: string): void {
    this.locale.changeLocale(selectedLanguage);
  }
}
