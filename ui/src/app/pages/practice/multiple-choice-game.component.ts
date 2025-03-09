import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { PracticeRequest } from '../../../../../common/types/practice';
import { GameCardProps, MultipleChoiceData } from './games.types';
import { GameCardComponent } from './game-card.component';
import { getByChance, shuffleArray } from '../../utils/games';

@Component({
  selector: 'pk-multiple-choice-game',
  imports: [GameCardComponent],
  providers: [],
  styles: ``,
  template: `
    <div class="container">
      <div class="source">
        {{ source() }}
      </div>
      <div class="alternatives">
        @for (option of alternatives(); track option.value) {
          <pk-game-card
            [text]="option.text"
            [lang]="option.lang"
            [success]="option.success"
            [miss]="option.miss"
            [info]="option.info"
            (clicked)="onClick(option.value)" />
        }
      </div>
    </div>
  `,
})
export class MultipleChoiceGameComponent implements OnInit {
  public data = input.required<MultipleChoiceData>();
  public result = output<PracticeRequest>();
  public source = signal<string>('');
  public alternatives = signal<GameCardProps[]>([]);
  public correct = computed(() => this.data().card.id);

  ngOnInit() {
    const isTargetFirst = getByChance(50);
    const card = this.data().card;
    this.source.set(isTargetFirst ? this.data().card.target : this.data().card.source);
    this.alternatives.set(
      shuffleArray([
        {
          value: card.id,
          lang: isTargetFirst ? card.sourceLang : card.targetLang,
          text: isTargetFirst ? card.source : card.target,
          success: false,
          miss: false,
          info: false,
        },
        ...this.data().options.map(option => ({
          value: option.id,
          lang: isTargetFirst ? option.sourceLang : option.targetLang,
          text: isTargetFirst ? option.source : option.target,
          success: false,
          miss: false,
          info: false,
        })),
      ])
    );
  }

  public onClick(value: string) {
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
      }, 500);
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
}
