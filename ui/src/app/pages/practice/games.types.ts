import { Card } from '../../../../../common/types/cards';

export enum GameType {
  MATCH_PAIRS = 'MATCH_PAIRS',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SENTENCE = 'SENTENCE',
  DER_DIE_DAS = 'DER_DIE_DAS',
}

export interface MatchPairsData {
  cards: Card[];
}

export interface MultipleChoiceData {
  card: Card;
  options: Card[];
}

export interface SentenceData {
  card: Card;
}

export interface DerDieDasData {
  card: Card;
}

export interface Game {
  type: GameType;
  data: MatchPairsData | MultipleChoiceData | SentenceData | DerDieDasData;
}
