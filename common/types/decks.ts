import { BaseEntity, UUID } from './misc';
import { Card } from './cards';

export interface Deck extends BaseEntity {
  userId: UUID;
  name: string;
  sourceLang: string;
  targetLang: string;
  hasTargetAlt: boolean;
  cardCount: number;
  lastPracticed: string | Date | null;
  lastModified: string | Date;
  // TODO add stats, score, gamification?
}

export interface DeckWithCards extends Deck {
  cards: Card[];
}

export type DeckRequest = Pick<Deck, 'name' | 'sourceLang' | 'targetLang' | 'hasTargetAlt'>;
