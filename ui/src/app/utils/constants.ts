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
  SETTINGS = '/settings',
  DATA_BACKUP_EMAIL = '/data-backup/email',
  DATA_BACKUP = '/data-backup/data',
  DECKS = '/decks',
  CARDS = '/cards',
}

export const publicApiRoutes = [
  ApiRoutes.AUTH_VERIFY_CODE,
  ApiRoutes.AUTH_LOGIN,
  ApiRoutes.AUTH_PASSWORD_LOGIN,
];

export const authenticatedApiRoutes = [
  ApiRoutes.AUTH_TOKEN_REFRESH,
  ApiRoutes.DATA_BACKUP,
  ApiRoutes.DATA_BACKUP_EMAIL,
  ApiRoutes.SETTINGS,
  ApiRoutes.DECKS,
  ApiRoutes.CARDS,
];
