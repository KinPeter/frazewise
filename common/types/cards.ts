import { BaseEntity, UUID } from './misc';

export interface Card extends BaseEntity {
  userId: UUID;
  deckId: UUID;
  source: string;
  sourceAlt: string | null;
  target: string;
  targetAlt: string | null;
  lastPracticed: string | Date | null;
  successCount: number;
  missCount: number;
}

export type CardRequest = Pick<Card, 'deckId' | 'source' | 'sourceAlt' | 'target' | 'targetAlt'>;

export interface PracticeRequest {
  cardId: UUID;
  isSuccess: boolean;
}
