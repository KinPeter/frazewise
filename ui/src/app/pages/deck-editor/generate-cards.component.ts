import { Component, computed, input, output, signal, Signal, WritableSignal } from '@angular/core';
import { AiService } from '../../common/services/ai.service';
import { DeckWithCards } from '../../../../../common/types/decks';
import { BulkCardsRequest } from '../../../../../common/types/cards';
import { CardFormValues, NewCardsFormComponent } from './new-cards-form.component';
import { MAX_CARD_COUNT } from '../../../../../common/utils/constants';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardType, GenerateCardsRequest, LanguageLevel } from '../../../../../common/types/ai';
import { PkLoaderComponent } from '../../common/components/pk-loader.component';
import { TranslatePipe } from '@ngx-translate/core';
import { PkInputComponent } from '../../common/components/pk-input.component';
import { PkInputDirective } from '../../common/directives/pk-input.directive';
import { NgIcon } from '@ng-icons/core';
import { PkButtonComponent } from '../../common/components/pk-button.component';
import { SupportedLanguage } from '../../../../../common/types/languages';
import { InfoMessageComponent } from '../../common/components/info-message.component';

@Component({
  selector: 'pk-generate-cards',
  imports: [
    PkLoaderComponent,
    TranslatePipe,
    ReactiveFormsModule,
    PkInputComponent,
    PkInputDirective,
    NewCardsFormComponent,
    NgIcon,
    PkButtonComponent,
    InfoMessageComponent,
  ],
  providers: [],
  styles: `
    p {
      margin-bottom: 0.5rem;

      &:last-of-type {
        margin-bottom: 1rem;
      }
    }

    .inputs {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;

      pk-input:first-of-type {
        flex-grow: 1;
      }

      pk-button {
        position: relative;
        top: 2px;
      }
    }

    .loading {
      display: flex;
      margin-top: 3rem;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: var(--color-primary);

      p {
        font-size: 1.5rem;
        margin-top: 1rem;
        text-align: center;

        ng-icon {
          position: relative;
          top: 6px;
        }
      }
    }
  `,
  template: `
    <h2>{{ 'cards.generateCards' | translate }}</h2>
    <p>{{ 'cards.generateCardsInfo1' | translate }}</p>
    <p>{{ 'cards.generateCardsInfo2' | translate }}</p>
    <p>{{ 'cards.generateCardsInfo3' | translate }}</p>
    <p>{{ 'cards.generateCardsInfo4' | translate }}</p>
    <form [formGroup]="form" (ngSubmit)="onGenerate()">
      <div class="inputs">
        <pk-input
          [label]="'cards.topic' | translate"
          width="100%"
          type="text"
          [disabled]="loading() || isLessThan10Remaining() || isFull()"
          [withAsterisk]="true"
          [error]="getError('topic') | translate">
          <input
            pkInput
            type="text"
            formControlName="topic"
            [placeholder]="'cards.topic' | translate" />
        </pk-input>
        <pk-input
          [label]="'cards.type' | translate"
          [withAsterisk]="true"
          [disabled]="loading() || isLessThan10Remaining() || isFull()"
          [error]="getError('type') | translate"
          width="200px"
          type="select">
          <select pkInput name="type" formControlName="type">
            @for (item of typeOptions; track item) {
              <option [value]="item">{{ 'cards.' + item | translate }}</option>
            }
          </select>
        </pk-input>
        <pk-input
          [label]="'cards.level' | translate"
          [withAsterisk]="true"
          [disabled]="loading() || isLessThan10Remaining() || isFull()"
          [error]="getError('level') | translate"
          width="100px"
          type="select">
          <select pkInput name="level" formControlName="level">
            @for (item of levelOptions; track item) {
              <option [value]="item">{{ 'cards.' + item | translate }}</option>
            }
          </select>
        </pk-input>
        <pk-input
          [label]="'cards.numberOfCards' | translate"
          [withAsterisk]="true"
          [disabled]="loading() || isLessThan10Remaining() || isFull()"
          [error]="getError('cardCount') | translate"
          width="120px"
          type="select">
          <select pkInput name="cardCount" formControlName="cardCount">
            @for (item of countOptions(); track item) {
              <option [value]="item">{{ item }}</option>
            }
          </select>
        </pk-input>
        <pk-button
          variant="outline"
          type="submit"
          [iconPrefix]="true"
          [disabled]="form.invalid || loading() || isLessThan10Remaining() || isFull()">
          <ng-icon name="tablerSparkles" size="1.2rem" />
          {{ 'cards.generateCards' | translate }}
        </pk-button>
      </div>
    </form>
    @if (loading()) {
      <div class="loading">
        <pk-loader />
        <p>
          <ng-icon name="tablerSparkles" size="2rem" />
          {{ 'cards.generateLoading' | translate }}
        </p>
      </div>
    } @else {
      <hr />
      @if (isFull()) {
        <pk-info-message type="warning" [message]="'cards.deckIsFull' | translate" />
      } @else if (isLessThan10Remaining()) {
        <pk-info-message type="warning" [message]="'cards.tooFewRemaining' | translate" />
      } @else {
        <pk-info-message
          type="info"
          [message]="'cards.remainingCount' | translate: { count: remainingCount() }" />
      }
      @if (errorMessage()) {
        <pk-info-message type="error" [message]="errorMessage() | translate" />
      }
      @if (formValues()) {
        <pk-info-message type="success" [message]="'cards.generateSuccess' | translate" />
        <pk-new-cards-form
          [cardCount]="deck().cardCount"
          [hasTargetAlt]="deck().hasTargetAlt"
          [importedValues]="formValues()"
          (saveCards)="onSaveCards($event)" />
      }
    }
  `,
})
export class GenerateCardsComponent {
  public deck = input.required<DeckWithCards>();
  public loading: Signal<boolean>;
  public saveNewCards = output<BulkCardsRequest>();
  public readonly MAX_CARD_COUNT = MAX_CARD_COUNT;
  public formValues: WritableSignal<CardFormValues[] | null> = signal(null);
  public remainingCount = computed(
    () => this.MAX_CARD_COUNT - (this.deck().cardCount + (this.formValues()?.length ?? 0))
  );
  public isFull = computed(
    () => this.deck().cardCount + (this.formValues()?.length ?? 0) >= this.MAX_CARD_COUNT
  );
  public isLessThan10Remaining = computed(() => this.remainingCount() < 10);
  public errorMessage = signal<string>('');
  public form: FormGroup;
  public countOptions = computed(() =>
    [10, 25, 50, 100].filter(num => num < this.remainingCount())
  );
  public levelOptions: LanguageLevel[] = ['basic', 'intermediate', 'advanced'];
  public typeOptions: CardType[] = ['mixed', 'wordsOnly', 'phrasesOnly'];

  constructor(
    private aiService: AiService,
    private formBuilder: FormBuilder
  ) {
    this.loading = this.aiService.loading;
    this.form = this.formBuilder.group({
      topic: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      level: ['basic', Validators.required],
      type: ['mixed', Validators.required],
      cardCount: [10, [Validators.required, Validators.min(10), Validators.max(100)]],
    });
  }

  public onGenerate(): void {
    this.errorMessage.set('');
    const { topic, level, type, cardCount } = this.form.value;
    const deck = this.deck();
    const request: GenerateCardsRequest = {
      sourceLang: deck.sourceLang as SupportedLanguage,
      targetLang: deck.targetLang as SupportedLanguage,
      cardCount: Number(cardCount),
      topic,
      level,
      type,
    };
    this.aiService.generateCards(request).subscribe({
      next: response => {
        if (response.cards) {
          this.formValues.set(response.cards);
        }
      },
      error: error => {
        this.errorMessage.set(error.message);
      },
    });
  }

  public onSaveCards(cards: CardFormValues[]): void {
    const request: BulkCardsRequest = {
      deckId: this.deck().id,
      cards: cards.map(card => ({
        source: card.source,
        sourceLang: this.deck().sourceLang,
        target: card.target,
        targetLang: this.deck().targetLang,
        targetAlt: this.deck().hasTargetAlt
          ? card.targetAlt?.length
            ? card.targetAlt
            : null
          : null,
      })),
    };
    this.saveNewCards.emit(request);
  }

  public getError(formControlName: string): string {
    const control = this.form?.get(formControlName);
    if (control?.untouched) {
      return '';
    }
    if (control?.errors?.['required']) {
      return 'validationErrors.REQUIRED_FIELD';
    } else if (control?.errors?.['maxlength']) {
      return 'validationErrors.MAX_LENGTH';
    } else if (control?.errors?.['minlength']) {
      return 'validationErrors.MIN_LENGTH';
    }
    return '';
  }
}
