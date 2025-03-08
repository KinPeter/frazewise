import { Card } from '../../../../common/types/cards';

export const DER_DIE_DAS_REGEX = /^(der|die|das)\b/i; // Matches "der", "die", or "das" at the beginning of the string

export function sortCards(cards: Card[]): Card[] {
  return cards.sort((a, b) => {
    // Sort by missCount, descending
    if (a.missCount !== b.missCount) {
      return b.missCount - a.missCount;
    }

    // Sort by lastPracticed, ascending (older dates first)
    if (a.missCount === b.missCount) {
      const dateA = a.lastPracticed ? new Date(a.lastPracticed).getTime() : 0;
      const dateB = b.lastPracticed ? new Date(b.lastPracticed).getTime() : 0;

      if (dateA !== dateB) {
        return dateA - dateB; // Earlier dates come first
      }
    }

    // Sort by successCount, ascending
    if (a.successCount !== b.successCount) {
      return a.successCount - b.successCount;
    }

    // Sort by lastPracticed within same successCount (ascending, older dates first)
    if (a.successCount === b.successCount) {
      const dateA = a.lastPracticed ? new Date(a.lastPracticed).getTime() : 0;
      const dateB = b.lastPracticed ? new Date(b.lastPracticed).getTime() : 0;

      if (dateA !== dateB) {
        return dateA - dateB; // Earlier dates come first
      }
    }

    // Randomize those with 0 missCount, 0 successCount, and null lastPracticed
    if (
      a.missCount === 0 &&
      b.missCount === 0 &&
      a.successCount === 0 &&
      b.successCount === 0 &&
      a.lastPracticed === null &&
      b.lastPracticed === null
    ) {
      return Math.random() - 0.5; // Randomized sorting
    }

    return 0; // If all conditions are the same, maintain original order
  });
}

export function splitCardsByTargetLength(cards: Card[]): { words: Card[]; sentences: Card[] } {
  const words: Card[] = [];
  const sentences: Card[] = [];

  cards.forEach(card => {
    if (isSentence(card)) {
      sentences.push(card);
    } else {
      words.push(card);
    }
  });

  return { words, sentences };
}

export function isGermanNoun(card: Card): boolean {
  if (card.targetLang !== 'de') return false;
  return DER_DIE_DAS_REGEX.test(card.target.trim());
}

export function isSentence(card: Card): boolean {
  const wordCount = card.target.trim().split(/\s+/).length;
  return wordCount > 2;
}

export function getByChance(percentage: number): boolean {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be between 0 and 100');
  }
  return Math.random() * 100 < percentage;
}

export function getAlternativesFor(base: Card, array: Card[]): Card[] {
  // Filter out cards with the same target string
  const filteredArray = array.filter(card => card.target !== base.target);

  // Shuffle the filtered array to randomize the order
  const shuffledArray = filteredArray.sort(() => Math.random() - 0.5);

  // Pick the first 3 cards, or fewer if there are less than 3 cards available
  return shuffledArray.slice(0, 3);
}
