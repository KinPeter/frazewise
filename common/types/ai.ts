import { Card } from './cards';
import { SupportedLanguage } from './languages';

export type LanguageLevel = 'basic' | 'intermediate' | 'advanced';
export type CardType = 'wordsOnly' | 'mixed' | 'phrasesOnly';

export interface GenerateCardsRequest {
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
  level: LanguageLevel;
  type: CardType;
  topic: string;
  cardCount: number;
}

export type GeneratedCard = Pick<Card, 'source' | 'target' | 'targetAlt'>;

export interface GenerateCardsResponse {
  cards: GeneratedCard[];
}
