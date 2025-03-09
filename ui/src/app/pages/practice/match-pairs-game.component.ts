import { Component, input, OnChanges, output, signal, SimpleChanges } from '@angular/core';
import { PracticeRequest } from '../../../../../common/types/practice';
import { GameCardProps, MatchPairsData } from './games.types';
import { shuffleArray } from '../../utils/games';
import { GameCardComponent } from './game-card.component';

@Component({
  selector: 'pk-match-pairs-game',
  imports: [GameCardComponent],
  providers: [],
  styles: `
    .container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 5rem 2px 0;
    }

    .source,
    .target {
      flex-basis: 50%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `,
  template: `
    <div class="container">
      <div class="source">
        @for (option of sourceCards(); track option.value) {
          <pk-game-card
            [text]="option.text"
            [lang]="option.lang"
            [success]="option.success"
            [miss]="option.miss"
            [info]="option.info"
            [selected]="option.selected"
            [narrow]="true"
            (clicked)="onClickSource(option.value)" />
        }
      </div>
      <div class="target">
        @for (option of targetCards(); track option.value) {
          <pk-game-card
            [text]="option.text"
            [altText]="option.textAlt"
            [lang]="option.lang"
            [success]="option.success"
            [miss]="option.miss"
            [info]="option.info"
            [selected]="option.selected"
            [narrow]="true"
            (clicked)="onClickTarget(option.value)" />
        }
      </div>
    </div>
  `,
})
export class MatchPairsGameComponent implements OnChanges {
  public data = input.required<MatchPairsData>();
  public results = output<PracticeRequest[]>();
  public sourceCards = signal<GameCardProps[]>([]);
  public targetCards = signal<GameCardProps[]>([]);
  public selectedSource = signal<string | null>(null);
  public selectedTarget = signal<string | null>(null);
  public matchResults = signal<PracticeRequest[]>([]);

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['data']) return;
    const cards = this.data().cards;
    this.selectedSource.set(null);
    this.selectedTarget.set(null);
    this.matchResults.set([]);
    this.sourceCards.set(
      shuffleArray(
        cards.map(card => ({
          value: card.id,
          lang: card.sourceLang,
          text: card.source,
          success: false,
          miss: false,
          info: false,
          selected: false,
        }))
      )
    );
    this.targetCards.set(
      shuffleArray(
        cards.map(card => ({
          value: card.id,
          lang: card.targetLang,
          text: card.target,
          textAlt: card.targetAlt,
          success: false,
          miss: false,
          info: false,
          selected: false,
        }))
      )
    );
  }

  public onClickSource(clickedId: string): void {
    if (this.sourceCards().find(card => card.value === clickedId)?.success) return;
    this.selectedSource.set(clickedId);
    if (!this.selectedTarget()) {
      this.sourceCards.update(options =>
        options.map(option => ({ ...option, selected: option.value === clickedId }))
      );
    } else if (clickedId === this.selectedTarget()) {
      this.handleCorrectMatch(clickedId);
    } else {
      this.handleMissedMatch(clickedId, this.selectedTarget()!);
    }
  }

  public onClickTarget(clickedId: string): void {
    if (this.targetCards().find(card => card.value === clickedId)?.success) return;
    this.selectedTarget.set(clickedId);
    if (!this.selectedSource()) {
      this.targetCards.update(options =>
        options.map(option => ({ ...option, selected: option.value === clickedId }))
      );
    } else if (clickedId === this.selectedSource()) {
      this.handleCorrectMatch(clickedId);
    } else {
      this.handleMissedMatch(clickedId, this.selectedSource()!);
    }
  }

  private handleCorrectMatch(clickedId: string): void {
    this.selectedSource.set(null);
    this.selectedTarget.set(null);
    this.sourceCards.update(options =>
      options.map(option => ({
        ...option,
        success: option.success || option.value === clickedId,
        selected: false,
      }))
    );
    this.targetCards.update(options =>
      options.map(option => ({
        ...option,
        success: option.success || option.value === clickedId,
        selected: false,
      }))
    );
    this.matchResults.update(results => [...results, { cardId: clickedId, isSuccess: true }]);
    this.checkResults();
  }

  public handleMissedMatch(clickedId: string, otherSelectedId: string): void {
    this.sourceCards.update(options =>
      options.map(option => ({
        ...option,
        miss: option.miss || option.value === clickedId || option.value === otherSelectedId,
        selected: false,
      }))
    );
    this.targetCards.update(options =>
      options.map(option => ({
        ...option,
        miss: option.miss || option.value === clickedId || option.value === otherSelectedId,
        selected: false,
      }))
    );
    this.selectedTarget.set(null);
    this.selectedSource.set(null);
    this.matchResults.update(results => [
      ...results,
      { cardId: clickedId, isSuccess: false },
      { cardId: otherSelectedId, isSuccess: false },
    ]);
    setTimeout(() => {
      this.sourceCards.update(options =>
        options.map(option => ({
          ...option,
          miss: false,
        }))
      );
      this.targetCards.update(options =>
        options.map(option => ({
          ...option,
          miss: false,
        }))
      );
    }, 500);
  }

  public checkResults(): void {
    const successfulMatchedIds = this.matchResults()
      .filter(result => result.isSuccess)
      .map(result => result.cardId);
    const allIds = this.data().cards.map(card => card.id);
    const allMatched = successfulMatchedIds.length === allIds.length;
    if (allMatched) {
      setTimeout(() => {
        this.results.emit(this.matchResults());
      }, 500);
    }
  }
}
