import { Injectable } from '@angular/core';
import { Language, TranslateService } from '@ngx-translate/core';
import { LocalStore } from '../../utils/store';
import { StoreKeys } from '../../utils/constants';

interface LanguageState {
  selectedLanguage: Language;
}

const initialState: LanguageState = {
  selectedLanguage: 'en',
};

@Injectable({ providedIn: 'root' })
export class LanguageService extends LocalStore<LanguageState> {
  public readonly languages: Language[] = ['en', 'hu', 'ko'];

  constructor(private translateService: TranslateService) {
    super(StoreKeys.LOCALE, initialState);
  }

  public init(): void {
    this.translateService.addLangs(this.languages);
    this.translateService.setDefaultLang('en');
    this.translateService.use(this.state().selectedLanguage);
  }

  public changeLanguage(language: Language): void {
    this.translateService.use(language);
    this.setState({ selectedLanguage: language });
  }
}
