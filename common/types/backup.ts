import { User } from './auth';
import { Deck } from './decks';
import { Card } from './cards';
import { Settings } from './settings';

export interface DataBackup {
  user: User;
  settings: Settings;
  decks: Deck[];
  cards: Card[];
}
