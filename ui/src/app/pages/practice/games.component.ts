import { Component, computed, input, OnInit, output, Signal } from '@angular/core';
import { DeckWithCards } from '../../../../../common/types/decks';
import { PracticeRequest } from '../../../../../common/types/practice';
import { GamesService } from './games.service';
import {
  DerDieDasData,
  Game,
  GameType,
  MatchPairsData,
  MultipleChoiceData,
  SentenceData,
} from './games.types';
import { TranslatePipe } from '@ngx-translate/core';
import { SentenceGameComponent } from './sentence-game.component';
import { MatchPairsGameComponent } from './match-pairs-game.component';
import { MultipleChoiceGameComponent } from './multiple-choice-game.component';
import { DerDieDasGameComponent } from './der-die-das-game.component';

@Component({
  selector: 'pk-games',
  imports: [
    TranslatePipe,
    SentenceGameComponent,
    MatchPairsGameComponent,
    MultipleChoiceGameComponent,
    DerDieDasGameComponent,
  ],
  providers: [],
  styles: ``,
  template: `
    @if (isFinished()) {
      <div class="finished">
        <p>{{ 'practice.finished' | translate }}</p>
      </div>
    } @else if (currentGame()) {
      @switch (currentGame()!.type) {
        @case (GameType.SENTENCE) {
          <pk-sentence-game [data]="sentenceData()" (result)="onResult($event)" />
        }
        @case (GameType.MATCH_PAIRS) {
          <pk-match-pairs-game [data]="matchPairsData()" (results)="onResults($event)" />
        }
        @case (GameType.MULTIPLE_CHOICE) {
          <pk-multiple-choice-game [data]="multipleChoiceData()" (result)="onResult($event)" />
        }
        @case (GameType.DER_DIE_DAS) {
          <pk-der-die-das-game [data]="derDieDasData()" (result)="onResult($event)" />
        }
      }
    }
  `,
})
export class GamesComponent implements OnInit {
  public deck = input.required<DeckWithCards>();
  public result = output<PracticeRequest>();
  public currentGame: Signal<Game | null>;
  public gameIndex: Signal<number>;
  public isFinished: Signal<boolean>;
  public readonly GameType = GameType;

  constructor(private gamesService: GamesService) {
    this.currentGame = this.gamesService.currentGame;
    this.gameIndex = this.gamesService.gameIndex;
    this.isFinished = this.gamesService.isFinished;
  }

  // Need casting for template to believe it's the right type
  public sentenceData = computed(() => this.currentGame()!.data as SentenceData);
  public multipleChoiceData = computed(() => this.currentGame()!.data as MultipleChoiceData);
  public matchPairsData = computed(() => this.currentGame()!.data as MatchPairsData);
  public derDieDasData = computed(() => this.currentGame()!.data as DerDieDasData);

  ngOnInit() {
    this.gamesService.setupGames(this.deck());
  }

  public onResult(result: PracticeRequest): void {
    this.gamesService.pickNextGame();
    console.log({ result });
    // FIXME
    this.result.emit(result);
  }

  public onResults(results: PracticeRequest[]): void {
    this.gamesService.pickNextGame();
    console.log({ results });
    // FIXME
    results.forEach(result => {
      this.result.emit(result);
    });
  }
}
