import { LanguageInfo, SupportedLanguage } from '../types/languages';

export const supportedLanguages = new Map<SupportedLanguage, LanguageInfo>([
  ['en', { name: 'English', translation: 'supportedLanguages.en', flag: 'en.png' }],
  ['ko', { name: 'Korean', translation: 'supportedLanguages.ko', flag: 'ko.png' }],
  ['hu', { name: 'Hungarian', translation: 'supportedLanguages.hu', flag: 'hu.png' }],
  ['de', { name: 'German', translation: 'supportedLanguages.de', flag: 'de.png' }],
  ['zh', { name: 'Chinese', translation: 'supportedLanguages.zh', flag: 'zh.png' }],
]);
