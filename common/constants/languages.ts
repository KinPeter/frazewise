import { LanguageInfo, SupportedLanguage } from '../types/languages';

export const supportedLanguages = new Map<SupportedLanguage, LanguageInfo>([
  ['en', { name: 'English', translation: 'supportedLanguages.en', flag: null }],
  ['ko', { name: 'Korean', translation: 'supportedLanguages.ko', flag: null }],
  ['hu', { name: 'Hungarian', translation: 'supportedLanguages.hu', flag: null }],
  ['de', { name: 'German', translation: 'supportedLanguages.de', flag: null }],
  ['zh', { name: 'Chinese', translation: 'supportedLanguages.zh', flag: null }],
]);
