import { GenerateCardsRequest } from '../../common/types/ai';
import { logographicLanguages, supportedLanguages } from '../../common/constants/languages';
import { SupportedLanguage } from '../../common/types/languages';

export function getPromptForCards(request: GenerateCardsRequest): string {
  const sourceLang = supportedLanguages.get(request.sourceLang as SupportedLanguage)?.name;
  const targetLang = supportedLanguages.get(request.targetLang as SupportedLanguage)?.name;
  const { cardCount, topic, level, type, targetLang: targetLangCode } = request;

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
        type === 'phrasesOnly'
          ? ''
          : "If you add a noun always add if it's der/die/das. Please add it's plural form version as a separate card.";
      break;
    case 'zh':
      languageExtra =
        'The Chinese words should be in simplified Chinese hanzi, and please add the pinyin pronunciation too in the format specified below. For sentences please put spaces between the words.';
      break;
    case 'ja':
      languageExtra =
        'The Japanese words should use kanji, hiragana and katakana, and please add the romanized pronunciation too in the format specified below. For sentences please put spaces between the words.';
      break;
    case 'ko':
      languageExtra =
        'The Korean words should be in Hangul, and please add romanization too in the format specified below. For sentences, please put spaces between the words. Please use standard honorifics where applicable. Use the example specified below.';
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
        '[{"source": "water", "target": "水", "targetAlt": "Shuǐ"}, {"source": "hello", "target": "你好", "targetAlt": "Nǐ hǎo"}, {}{"source": "I speak Chinese.", "target": "我 说 中文", "targetAlt": "Wǒ shuō zhōngwén"}]';
      break;
    case 'ko':
      example =
        '[{"source": "water", "target": "물", "targetAlt": "mul"}, {"source": "Where is the subway station?", "target": "지하철역이 어디에 있어요?", "targetAlt": "jihacheolyeogi eodie isseoyo?"}]';
      break;
    case 'ja':
      example =
        '[{"source": "water", "target": "水", "targetAlt": "mizu"}, {"source": "Where is the subway station?", "target": "地下鉄の 駅は どこですか?", "targetAlt": "Chikatetsu no eki wa dokodesu ka?"}]';
      break;
  }

  let typeString = '';
  switch (type) {
    case 'mixed':
      typeString = 'words and phrases';
      break;
    case 'wordsOnly':
      typeString = 'words';
      break;
    case 'phrasesOnly':
      typeString = 'phrases and sentences';
      break;
  }

  const maxLengthString = logographicLanguages.has(targetLangCode)
    ? '10-15 characters (syllables or logograms) long.'
    : '100 characters long.';

  let typeExplanation = '';
  switch (type) {
    case 'mixed':
      typeExplanation = `Half of it should be words, the other half should be short sentences and common phrases. 
      At least half of the words should be nouns, the rest are other types of words.
      Sentences and phrases should be maximum ${maxLengthString}`;
      break;
    case 'wordsOnly':
      typeExplanation = 'Half of it should be nouns, the rest are other types of words.';
      break;
    case 'phrasesOnly':
      typeExplanation = `Please only include short sentences and common multi-word phrases, each should be maximum ${maxLengthString}`;
      break;
  }

  return `Please generate a list of ${cardCount} ${typeString} for memorizing ${targetLang} ${typeString} as flashcards.
The source language is ${sourceLang}, the target language is ${targetLang}.
The ${typeString} should be in the topic of ${topic}.
The level of the ${typeString} should be ${levelString}.
${typeExplanation}
${languageExtra}
Format the list as a JSON string, example:
${example}`;
}
