import { BaseEntity, UUID } from './misc';

export interface Deck extends BaseEntity {
  userId: UUID;
  name: string;
  sourceLang: string;
  hasSourceAlt: boolean;
  targetLang: string;
  hasTargetAlt: boolean;
  cardCount: number;
  lastPracticed: string | Date | null;
  // TODO add stats, score, gamification?
}

export type DeckRequest = Pick<
  Deck,
  'name' | 'sourceLang' | 'hasSourceAlt' | 'targetLang' | 'hasTargetAlt'
>;
