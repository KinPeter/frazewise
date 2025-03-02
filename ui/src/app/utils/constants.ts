export enum StoreKeys {
  AUTH = 'fw-auth',
  SETTINGS = 'fw-settings',
  LOCALE = 'fw-locale',
}

export enum ApiRoutes {
  AUTH_LOGIN = '/auth/login',
  AUTH_VERIFY_CODE = '/auth/verify-code',
  AUTH_TOKEN_REFRESH = '/auth/token-refresh',
  AUTH_PASSWORD_LOGIN = '/auth/password-login',
  SET_PASSWORD = '/auth/set-password',
  SETTINGS = '/settings',
  DATA_BACKUP_EMAIL = '/data-backup/email',
  DATA_BACKUP = '/data-backup/data',
  DECKS = '/decks',
  CARDS = '/cards',
  PRACTICE = '/practice',
}
