import { BaseEntity, UUID } from './misc';

export interface Card extends BaseEntity {
  userId: UUID;
  deckId: UUID;
  source: string;
  sourceLang: string;
  target: string;
  targetLang: string;
  targetAlt: string | null;
  lastPracticed: string | Date | null;
  successCount: number;
  missCount: number;
}

export type BaseCardRequest = Pick<
  Card,
  'source' | 'sourceLang' | 'target' | 'targetLang' | 'targetAlt'
>;

export type UpdateCardRequest = Pick<
  Card,
  'deckId' | 'source' | 'sourceLang' | 'target' | 'targetLang' | 'targetAlt'
>;

export interface BulkCardsRequest {
  deckId: UUID;
  cards: Card[];
}
