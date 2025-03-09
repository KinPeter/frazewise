import { Component, input, OnInit, output, signal } from '@angular/core';
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
    .parts button,
    .input button {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-default);
      padding: 1rem;
      background: none;
    }
  `,
  template: `
    <div class="container">
      <div class="source">
        {{ data().card.source }}
      </div>
      <div class="input">
        @for (part of input(); track part) {
          <button (click)="onClickInputPart(part)">
            {{ part }}
          </button>
        }
      </div>
      <div class="parts">
        @for (part of parts(); track part) {
          <button (click)="onClickPart(part)">
            {{ part }}
          </button>
        }
      </div>
      <div class="check-result">
        @switch (isSuccess()) {
          @case (null) {
            <pk-button variant="outline" (clicked)="onCheck()">
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
              <pk-button variant="outline" (clicked)="onContinue()">
                {{ 'practice.continue' | translate }}
              </pk-button>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class SentenceGameComponent implements OnInit {
  public data = input.required<SentenceData>();
  public result = output<PracticeRequest>();
  public correct = signal<string[]>([]);
  public input = signal<string[]>([]);
  public parts = signal<string[]>([]);
  public isSuccess = signal<boolean | null>(null);

  ngOnInit() {
    const target = stripParts(this.data().card.target);
    this.correct.set([...target]);
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
