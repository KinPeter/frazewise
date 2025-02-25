export const DbCollection = {
  USERS: 'users',
  SETTINGS: 'settings',
  DECKS: 'decks',
  CARDS: 'cards',
} as const;

export type DbCollection = (typeof DbCollection)[keyof typeof DbCollection];
