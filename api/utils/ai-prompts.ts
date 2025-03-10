import { GenerateCardsRequest } from '../../common/types/ai';
import { supportedLanguages } from '../../common/constants/languages';
import { SupportedLanguage } from '../../common/types/languages';

export function getPromptForCards(request: GenerateCardsRequest): string {
  const sourceLang = supportedLanguages.get(request.sourceLang as SupportedLanguage)?.name;
  const targetLang = supportedLanguages.get(request.targetLang as SupportedLanguage)?.name;
  const { cardCount, topic, level, targetLang: targetLangCode } = request;

  let levelString: string;
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

  let languageExtra: string;
  switch (targetLangCode) {
    case 'de':
      languageExtra =
        "If you add a noun always add if it's der/die/das. Please add it's plural form version as a separate card.";
      break;
    case 'zh':
      languageExtra =
        'The Chinese words should be in simplified Chinese hanzi, and please add the pinyin pronunciation too in the format specified below. For sentences please put spaces between the words.';
      break;
    case 'ko':
      languageExtra =
        'The Korean words should be in Hangul, and no need for romanization. For sentences, please put spaces between the words. Please use standard honorifics where applicable. Use the example specified below.';
      break;
    default:
      languageExtra = '';
      break;
  }

  let example = '';
  switch (targetLangCode as SupportedLanguage) {
    case 'en':
      example =
        '[{"source": "물", "target": "water"}, {"source": "지하철역이 어디에 있어요?", "target": "Where is the subway station?"}]';
      break;
    case 'hu':
      example =
        '[{"source": "map", "target": "térkép"}, {"source": "How are you?", "target": "Hogy vagy?"}]';
      break;
    case 'de':
      example =
        '[{"source": "map", "target": "die Karte"}, {"source": "maps", "target": "die Karten"}, {"source": "How are you?", "target": "Wie geht es dir?"}]';
      break;
    case 'zh':
      example =
        '[{"source": "water", "target": "水", "targetAlt": "Shuǐ"}, {"source": "hello", "target": "你好", "targetAlt": "Nǐ hǎo"}]';
      break;
    case 'ko':
      example =
        '[{"source": "water", "target": "물"}, {"source": "Where is the subway station?", "target": "지하철역이 어디에 있어요?"}]';
      break;
  }

  return `Please generate a list of ${cardCount} words for memorizing ${targetLang} words and phrases as flashcards.
The source language is ${sourceLang}, the target language is ${targetLang}.
The words should be in the topic of ${topic}.
The level of the words should be ${levelString}.
Half of it should be nouns, but include all other kinds of words or phrases and short sentences.
Phrases and sentences should be maximum 100 characters long.
${languageExtra}
Format the list as a JSON string, example:
${example}`;
}
