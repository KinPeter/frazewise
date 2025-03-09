import {
  Component,
  computed,
  input,
  OnChanges,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { DerDieDasData, GameCardProps } from './games.types';
import { PracticeRequest } from '../../../../../common/types/practice';
import { GameCardComponent } from './game-card.component';
import { DER_DIE_DAS_REGEX } from '../../utils/games';
import { TtsService } from '../../common/services/tts.service';

@Component({
  selector: 'pk-der-die-das-game',
  imports: [GameCardComponent],
  providers: [],
  styles: `
    .source,
    .target {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      margin-bottom: 1rem;
      padding: 3rem 0;
    }

    .options {
      display: flex;
      gap: 0.5rem;

      > div {
        flex-grow: 1;
      }
      margin-bottom: 1rem;
    }

    .target {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-default);
      padding: 1rem;
    }
  `,
  template: `
    <div class="container">
      <div class="source">
        {{ data().card.source }}
      </div>
      <div class="options">
        @for (option of options(); track option.value) {
          <div>
            <pk-game-card
              [text]="option.value"
              lang="de"
              [success]="option.success"
              [miss]="option.miss"
              [info]="option.info"
              (clicked)="onClick(option.value)" />
          </div>
        }
      </div>
      <div class="target">
        {{ target() }}
      </div>
    </div>
  `,
})
export class DerDieDasGameComponent implements OnChanges {
  public data = input.required<DerDieDasData>();
  public result = output<PracticeRequest>();

  public options = signal<GameCardProps[]>([]);

  public target = computed(() => this.data().card.target.replace(DER_DIE_DAS_REGEX, ''));
  public correct = computed(() => {
    const match = this.data().card.target.match(DER_DIE_DAS_REGEX);
    if (!match) throw new Error("Couldn't find der/die/das in target");
    return match[0].toLowerCase();
  });

  constructor(private ttsService: TtsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['data']) return;
    this.options.set([
      { value: 'der', success: false, miss: false, info: false },
      { value: 'die', success: false, miss: false, info: false },
      { value: 'das', success: false, miss: false, info: false },
    ] as GameCardProps[]);
  }

  public onClick(value: string) {
    this.ttsService.readOut(this.data().card.target);
    if (value === this.correct()) {
      this.options.update(options =>
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
      this.options.update(options =>
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
