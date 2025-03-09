import { Component, computed, input, output, signal } from '@angular/core';
import { DerDieDasData } from './games.types';
import { PracticeRequest } from '../../../../../common/types/practice';
import { GameCardComponent } from './game-card.component';
import { DER_DIE_DAS_REGEX } from '../../utils/games';

@Component({
  selector: 'pk-der-die-das-game',
  imports: [GameCardComponent],
  providers: [],
  styles: ``,
  template: `
    <div class="container">
      <div class="source">
        {{ data().card.source }}
      </div>
      <div class="options">
        @for (option of options(); track option.value) {
          <pk-game-card
            [text]="option.value"
            lang="de"
            [success]="option.success"
            [miss]="option.miss"
            [info]="option.info"
            (clicked)="onClick(option.value)" />
        }
      </div>
      {{ target() }}
    </div>
  `,
})
export class DerDieDasGameComponent {
  public data = input.required<DerDieDasData>();
  public result = output<PracticeRequest>();

  public options = signal([
    { value: 'der', success: false, miss: false, info: false },
    { value: 'die', success: false, miss: false, info: false },
    { value: 'das', success: false, miss: false, info: false },
  ]);

  public target = computed(() => this.data().card.target.replace(DER_DIE_DAS_REGEX, ''));
  public correct = computed(() => {
    const match = this.data().card.target.match(DER_DIE_DAS_REGEX);
    if (!match) throw new Error("Couldn't find der/die/das in target");
    return match[0].toLowerCase();
  });

  public onClick(value: string) {
    if (value === this.correct()) {
      this.options.update(options =>
        options.map(option => ({
          ...option,
          success: option.value === value,
          miss: false,
          info: false,
        }))
      );
      this.result.emit({ cardId: this.data().card.id, isSuccess: true });
    } else {
      this.options.update(options =>
        options.map(option => ({
          ...option,
          success: false,
          miss: option.value === value,
          info: option.value === this.correct(),
        }))
      );
      this.result.emit({ cardId: this.data().card.id, isSuccess: false });
    }
  }
}
