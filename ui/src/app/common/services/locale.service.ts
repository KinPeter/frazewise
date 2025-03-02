import { Injectable } from '@angular/core';
import { Language, TranslateService } from '@ngx-translate/core';
import { LocalStore } from '../../utils/store';
import { StoreKeys } from '../../utils/constants';

interface LocaleState {
  selectedLocale: Language | undefined;
}

const initialState: LocaleState = {
  selectedLocale: undefined,
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
    const browserLang = this.translateService.getBrowserLang();
    const langInState = this.state().selectedLocale;
    if (langInState) {
      this.translateService.use(langInState);
    } else if (browserLang && this.locales.includes(browserLang)) {
      this.changeLocale(browserLang);
    } else {
      this.translateService.use('en');
    }
  }

  public changeLocale(language: Language): void {
    this.translateService.use(language);
    this.setState({ selectedLocale: language });
  }
}
