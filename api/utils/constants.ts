export const ApiModule = {
  AUTH: 'auth',
  SETTINGS: 'settings',
  DECKS: 'decks',
  CARDS: 'cards',
} as const;

export type ApiModule = (typeof ApiModule)[keyof typeof ApiModule];
