import { computed, Injectable } from '@angular/core';
import { DeckWithCards } from '../../../../../common/types/decks';
import { Store } from '../../utils/store';
import { Game, GameType } from './games.types';
import {
  getAlternativesFor,
  getByChance,
  getExtraWordsForSentence,
  isGermanNoun,
  isSentence,
  sortCards,
  splitCardsByTargetLength,
} from '../../utils/games';
import { Card } from '../../../../../common/types/cards';

export const derDieDas: Game = {
  type: GameType.DER_DIE_DAS,
  data: {
    card: {
      target: 'der Hund',
      targetLang: 'de',
      source: 'dog',
      sourceLang: 'en',
      id: '1',
    } as Card,
  },
};

export const multipleChoice: Game = {
  type: GameType.MULTIPLE_CHOICE,
  data: {
    card: {
      target: 'der Hund',
      targetLang: 'de',
      source: 'dog',
      sourceLang: 'en',
      id: '1',
    } as Card,
    options: [
      {
        target: 'die Eule',
        targetLang: 'de',
        source: 'owl',
        sourceLang: 'en',
        id: '2',
      } as Card,
      {
        target: 'die Katze',
        targetLang: 'de',
        source: 'cat',
        sourceLang: 'en',
        id: '3',
      } as Card,
      {
        target: 'der Elefant',
        targetLang: 'de',
        source: 'elephant',
        sourceLang: 'en',
        id: '4',
      } as Card,
    ],
  },
};

export const matchPairs: Game = {
  type: GameType.MATCH_PAIRS,
  data: {
    cards: [
      {
        target: 'der Hund',
        targetLang: 'de',
        source: 'dog',
        sourceLang: 'en',
        id: '1',
      } as Card,
      {
        target: 'die Eule',
        targetLang: 'de',
        source: 'owl',
        sourceLang: 'en',
        id: '2',
      } as Card,
      {
        target: 'die Katze',
        targetLang: 'de',
        source: 'cat',
        sourceLang: 'en',
        id: '3',
      } as Card,
      {
        target: 'der Elefant',
        targetLang: 'de',
        source: 'elephant',
        sourceLang: 'en',
        id: '4',
      } as Card,
    ],
  },
};

export const sentence: Game = {
  type: GameType.SENTENCE,
  data: {
    card: {
      target: 'Wo ist der Hund?',
      targetLang: 'de',
      source: 'Where is the dog?',
      sourceLang: 'en',
      id: '1',
    } as Card,
    extraWords: ['die', 'wirklich', 'Elefant'],
  },
};

interface GamesState {
  loading: boolean;
  games: Game[];
  gameIndex: number;
  isFinished: boolean;
}

const initialState: GamesState = {
  loading: false,
  games: [],
  gameIndex: 0,
  isFinished: false,
};

@Injectable({ providedIn: 'root' })
export class GamesService extends Store<GamesState> {
  constructor() {
    super(initialState);
  }

  public loading = computed(() => this.state().loading);
  public currentGame = computed<Game | null>(() =>
    this.state().games.length ? this.state().games[this.state().gameIndex] : null
  );
  public gameCount = computed(() => this.state().games.length);
  public gameIndex = computed(() => this.state().gameIndex);
  public isFinished = computed(() => this.state().isFinished);

  public setupGames(deck: DeckWithCards): void {
    this.setState({ loading: true });
    const { cards } = deck;
    const sortedCards = sortCards([...cards]);
    const games: Game[] = [];
    const { words } = splitCardsByTargetLength(sortedCards);
    sortedCards.forEach(card => {
      if (isSentence(card)) {
        this.addSentenceGame(card, games, words);
        return;
      }
      if (isGermanNoun(card)) {
        this.addGameForGermanNoun(card, games, words);
        return;
      }
      this.addGameForWord(card, games, words);
    });
    this.setState({ loading: false, games, gameIndex: 0, isFinished: false });
  }

  public pickNextGame(): void {
    const currentIndex = this.state().gameIndex;
    const totalGames = this.state().games.length;
    if (currentIndex >= totalGames - 1) {
      this.setState({ isFinished: true });
      return;
    }
    this.setState({
      gameIndex: currentIndex + 1,
    });
  }

  private addGameForGermanNoun(card: Card, games: Game[], words: Card[]): void {
    const shouldBeDerDieDas = getByChance(25);
    if (shouldBeDerDieDas) {
      this.addDerDieDasGame(card, games);
    } else {
      this.addGameForWord(card, games, words);
    }
  }

  private addGameForWord(card: Card, games: Game[], words: Card[]): void {
    if (words.length > 10) {
      const shouldBeMatchPairs = getByChance(50);
      if (shouldBeMatchPairs) {
        this.addMatchPairsGame(card, words, games);
      } else {
        this.addMultipleChoiceGame(card, words, games);
      }
    } else {
      this.addMultipleChoiceGame(card, words, games);
    }
  }

  private addSentenceGame(card: Card, games: Game[], otherCards: Card[]): void {
    games.push({
      type: GameType.SENTENCE,
      data: {
        card,
        extraWords: getExtraWordsForSentence(card, otherCards),
      },
    });
  }

  private addMultipleChoiceGame(card: Card, otherWords: Card[], games: Game[]): void {
    games.push({
      type: GameType.MULTIPLE_CHOICE,
      data: {
        card,
        options: getAlternativesFor(card, otherWords),
      },
    });
  }

  private addMatchPairsGame(card: Card, otherWords: Card[], games: Game[]): void {
    games.push({
      type: GameType.MATCH_PAIRS,
      data: {
        cards: [card, ...getAlternativesFor(card, otherWords)],
      },
    });
  }

  private addDerDieDasGame(card: Card, games: Game[]): void {
    games.push({
      type: GameType.DER_DIE_DAS,
      data: {
        card,
      },
    });
  }
}
