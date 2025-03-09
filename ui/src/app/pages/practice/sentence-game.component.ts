import { Component, input, OnChanges, output, signal, SimpleChanges } from '@angular/core';
import { PracticeRequest } from '../../../../../common/types/practice';
import { SentenceData } from './games.types';
import { shuffleArray, stripParts } from '../../utils/games';
import { PkButtonComponent } from '../../common/components/pk-button.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'pk-sentence-game',
  imports: [PkButtonComponent, TranslatePipe],
  providers: [],
  styles: `
    .container {
      padding: 0 0.5rem;
    }

    .parts button,
    .input button {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-default);
      padding: 1rem;
      background: none;
      font-size: 1rem;
    }

    .source {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      margin-bottom: 1rem;
      padding: 3rem 0;
    }

    .input,
    .parts {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .input-wrapper,
    .parts-wrapper {
      min-height: 177px;
      padding: 1.5rem 0.5rem;
    }

    .input {
      min-height: 52px;
      border-bottom: 1px solid var(--color-border);
    }

    .success {
      border: 2px solid var(--color-success);
      border-radius: var(--radius-default);
      color: var(--color-success);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.2rem;
      padding: 1rem 0;
    }

    .incorrect {
      border: 2px solid var(--color-error);
      border-radius: var(--radius-default);
      color: var(--color-error);
      padding: 1rem;

      p {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;

        &:first-child {
          font-weight: bold;
        }
      }
    }
  `,
  template: `
    <div class="container">
      <div class="source">
        {{ data().card.source }}
      </div>
      <div class="input-wrapper">
        <div class="input">
          @for (part of input(); track part) {
            <button (click)="onClickInputPart(part)">
              {{ part }}
            </button>
          }
        </div>
      </div>
      <div class="parts-wrapper">
        <div class="parts">
          @for (part of parts(); track part) {
            <button (click)="onClickPart(part)">
              {{ part }}
            </button>
          }
        </div>
      </div>
      <div class="check-result">
        @switch (isSuccess()) {
          @case (null) {
            <pk-button variant="outline" size="100%" (clicked)="onCheck()">
              {{ 'practice.check' | translate }}
            </pk-button>
          }
          @case (true) {
            <div class="success">
              {{ 'practice.correct' | translate }}
            </div>
          }
          @case (false) {
            <div class="incorrect">
              <p>{{ 'practice.incorrect' | translate }}</p>
              <p>{{ data().card.target }}</p>
              <pk-button variant="subtle" size="100%" (clicked)="onContinue()">
                {{ 'practice.continue' | translate }}
              </pk-button>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class SentenceGameComponent implements OnChanges {
  public data = input.required<SentenceData>();
  public result = output<PracticeRequest>();
  public correct = signal<string[]>([]);
  public input = signal<string[]>([]);
  public parts = signal<string[]>([]);
  public isSuccess = signal<boolean | null>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['data']) return;
    const target = stripParts(this.data().card.target);
    this.correct.set([...target]);
    this.input.set([]);
    this.isSuccess.set(null);
    this.parts.set(shuffleArray([...target, ...this.data().extraWords]));
  }

  public onClickPart(part: string): void {
    this.input.update(input => [...input, part]);
    this.parts.update(parts => parts.filter(p => p !== part));
  }

  public onClickInputPart(part: string): void {
    this.input.update(input => input.filter(p => p !== part));
    this.parts.update(parts => [...parts, part]);
  }

  public onCheck(): void {
    const isCorrect =
      this.input().length === this.correct().length &&
      this.input().every((part, index) => part === this.correct()[index]);
    this.isSuccess.set(isCorrect);
    if (isCorrect) {
      setTimeout(() => {
        this.result.emit({ cardId: this.data().card.id, isSuccess: true });
      }, 1000);
    }
  }

  public onContinue(): void {
    this.result.emit({ cardId: this.data().card.id, isSuccess: false });
  }
}
