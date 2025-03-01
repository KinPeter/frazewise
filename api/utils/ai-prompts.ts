import { GenerateCardsRequest } from '../../common/types/ai';
import { supportedLanguages } from '../../common/constants/languages';
import { SupportedLanguage } from '../../common/types/languages';

export function getPromptForCards(request: GenerateCardsRequest): string {
  const sourceLang = supportedLanguages.get(request.sourceLang as SupportedLanguage)?.name;
  const targetLang = supportedLanguages.get(request.targetLang as SupportedLanguage)?.name;
  const { cardCount, topic, level, targetLang: targetLangCode } = request;

  let levelString = '';
  switch (level) {
    case 'basic':
      levelString = 'basic, for beginners';
      break;
    case 'intermediate':
      levelString = 'intermediate, for learners on a conversational level';
      break;
    case 'advanced':
      levelString = 'advanced, for good speakers';
      break;
  }

  let languageExtra = '';
  switch (targetLangCode) {
    case 'de':
      languageExtra =
        "If you add a noun always add if it's der/die/das. Please add it's plural form version as a separate card.";
      break;
    case 'zh':
      languageExtra =
        'The Chinese word should be in simplified Chinese hanzhi, and please add the pinyin pronunciation too in the format specified below.';
      break;
    default:
      languageExtra = '';
      break;
  }

  let example = '';
  switch (targetLangCode as SupportedLanguage) {
    case 'en':
    case 'de':
    case 'hu':
    case 'ko':
      example =
        '[{"source": "map", "target": "die Karte"}, {"source": "maps", "target": "die Karten"}]';
      break;
    case 'zh':
      example =
        '[{"source": "water", "target": "水", "targetAlt": "Shuǐ"}, {"source": "hello", "target": "你好", "targetAlt": "Nǐ hǎo"}]';
      break;
  }

  return `Please generate a list of ${cardCount} words for memorizing ${targetLang} words as flashcards.
The source language is ${sourceLang}, the target language is ${targetLang}.
The words should be in the topic of ${topic}.
The level of the words should be ${levelString}.
Half of it should be nouns, but include all other kinds of words or phrases.
Phrases should be maximum a 100 characters long.
${languageExtra}
Format the list as a JSON string, example:
${example}`;
}
