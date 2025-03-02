import { Injectable } from '@angular/core';
import { Language, TranslateService } from '@ngx-translate/core';
import { LocalStore } from '../../utils/store';
import { StoreKeys } from '../../utils/constants';

interface LocaleState {
  selectedLocale: Language;
}

const initialState: LocaleState = {
  selectedLocale: 'en',
};

@Injectable({ providedIn: 'root' })
export class LocaleService extends LocalStore<LocaleState> {
  public readonly locales: Language[] = ['en', 'hu', 'ko'];

  constructor(private translateService: TranslateService) {
    super(StoreKeys.LOCALE, initialState);
  }

  public init(): void {
    this.translateService.addLangs(this.locales);
    this.translateService.setDefaultLang('en');
    this.translateService.use(this.state().selectedLocale);
  }

  public changeLocale(language: Language): void {
    this.translateService.use(language);
    this.setState({ selectedLocale: language });
  }
}
