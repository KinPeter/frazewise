import { Injectable } from '@angular/core';
import { LocalStore } from '../../utils/store';
import { Settings } from '../../../../../common/types/settings';
import { StoreKeys } from '../../utils/constants';

export type UserSettings = Omit<Settings, 'userId' | 'createdAt'>;

const initialState: UserSettings = {
  id: '',
  name: null,
  language: 'en',
  profilePicUrl: null,
};

@Injectable({ providedIn: 'root' })
export class SettingsStore extends LocalStore<UserSettings> {
  constructor() {
    super(StoreKeys.SETTINGS, { ...initialState });
  }

  public setSettings(settings: UserSettings): void {
    this.setState(settings);
  }

  public clearSettings(): void {
    this.setState({ ...initialState });
  }
}
