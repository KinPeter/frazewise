import {
  Component,
  computed,
  input,
  OnChanges,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { PracticeRequest } from '../../../../../common/types/practice';
import { GameCardProps, MultipleChoiceData } from './games.types';
import { GameCardComponent } from './game-card.component';
import { getByChance, shuffleArray } from '../../utils/games';
import { TtsService } from '../../common/services/tts.service';

@Component({
  selector: 'pk-multiple-choice-game',
  imports: [GameCardComponent],
  providers: [],
  styles: `
    .source {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      margin-bottom: 1rem;
      padding: 3rem 0;

      &.hanzi {
        font-size: 3rem;

        .source-alt {
          font-size: 1rem;
        }
      }
    }

    .alternatives {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `,
  template: `
    <div class="container">
      <div class="source" [class.hanzi]="isTargetFirst() && data().card.targetLang === 'zh'">
        <span (click)="readSource()">{{ source() }}</span>
        @if (sourceAlt()) {
          <span class="source-alt">{{ sourceAlt() }}</span>
        }
      </div>
      <div class="alternatives">
        @for (option of alternatives(); track option.value) {
          <pk-game-card
            [text]="option.text"
            [altText]="option.textAlt"
            [lang]="option.lang"
            [success]="option.success"
            [miss]="option.miss"
            [info]="option.info"
            [disabled]="isDone()"
            (clicked)="onClick(option.value)" />
        }
      </div>
    </div>
  `,
})
export class MultipleChoiceGameComponent implements OnChanges {
  public data = input.required<MultipleChoiceData>();
  public result = output<PracticeRequest>();
  public source = signal<string>('');
  public sourceAlt = signal<string>('');
  public isTargetFirst = signal<boolean>(false);
  public isDone = signal<boolean>(false);
  public alternatives = signal<GameCardProps[]>([]);
  public correct = computed(() => this.data().card.id);

  constructor(private ttsService: TtsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['data']) return;
    const isTargetFirst = getByChance(50);
    const card = this.data().card;
    if (isTargetFirst) {
      this.ttsService.readOut(card.target);
    }
    this.isTargetFirst.set(isTargetFirst);
    this.isDone.set(false);
    this.source.set(isTargetFirst ? this.data().card.target : this.data().card.source);
    this.sourceAlt.set(isTargetFirst ? (this.data().card.targetAlt ?? '') : '');
    this.alternatives.set(
      shuffleArray([
        {
          value: card.id,
          lang: isTargetFirst ? card.sourceLang : card.targetLang,
          text: isTargetFirst ? card.source : card.target,
          textAlt: isTargetFirst ? null : card.targetAlt,
          success: false,
          miss: false,
          info: false,
        },
        ...this.data().options.map(option => ({
          value: option.id,
          lang: isTargetFirst ? option.sourceLang : option.targetLang,
          text: isTargetFirst ? option.source : option.target,
          textAlt: isTargetFirst ? null : option.targetAlt,
          success: false,
          miss: false,
          info: false,
        })),
      ])
    );
  }

  public onClick(value: string) {
    this.isDone.set(true);
    if (!this.isTargetFirst()) {
      const card = this.alternatives().find(option => option.value === value);
      this.ttsService.readOut(card?.text ?? '');
    }

    if (value === this.correct()) {
      this.alternatives.update(options =>
        options.map(option => ({
          ...option,
          success: option.value === value,
          miss: false,
          info: false,
        }))
      );
      setTimeout(() => {
        this.result.emit({ cardId: this.data().card.id, isSuccess: true });
      }, 1000);
    } else {
      this.alternatives.update(options =>
        options.map(option => ({
          ...option,
          success: false,
          miss: option.value === value,
          info: option.value === this.correct(),
        }))
      );
      setTimeout(() => {
        this.result.emit({ cardId: this.data().card.id, isSuccess: false });
      }, 2000);
    }
  }

  public readSource() {
    if (this.isTargetFirst()) {
      this.ttsService.readOut(this.data().card.target);
    }
  }
}
