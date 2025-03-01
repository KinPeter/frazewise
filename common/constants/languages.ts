import { LanguageInfo, SupportedLanguage } from '../types/languages';

export const supportedLanguages = new Map<SupportedLanguage, LanguageInfo>([
  ['en', { name: 'English', flag: null }],
  ['ko', { name: 'Korean', flag: null }],
  ['hu', { name: 'Hungarian', flag: null }],
  ['de', { name: 'German', flag: null }],
  ['zh', { name: 'Chinese', flag: null }],
]);
