import { Card } from './cards';
import { SupportedLanguage } from './languages';

export type LanguageLevel = 'basic' | 'intermediate' | 'advanced';

export interface GenerateCardsRequest {
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
  level: LanguageLevel;
  topic: string;
  cardCount: number;
}

export type GeneratedCard = Pick<Card, 'source' | 'target' | 'targetAlt'>;

export interface GenerateCardsResponse {
  cards: GeneratedCard[];
}
