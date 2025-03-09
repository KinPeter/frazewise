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
  extraWords: string[];
}

export interface DerDieDasData {
  card: Card;
}

export interface Game {
  type: GameType;
  data: MatchPairsData | MultipleChoiceData | SentenceData | DerDieDasData;
}

export interface GameCardProps {
  value: string;
  text: string;
  lang: string;
  success: boolean;
  miss: boolean;
  info: boolean;
  textAlt?: string | null;
  selected?: boolean;
}
