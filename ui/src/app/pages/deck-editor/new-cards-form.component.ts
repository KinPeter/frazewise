import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PkCardDirective } from '../../common/directives/pk-card.directive';
import { Component, effect, input, output } from '@angular/core';
import {
  MAX_CARD_CONTENT_LENGTH,
  MAX_CARD_COUNT,
  MIN_CARD_CONTENT_LENGTH,
} from '../../../../../common/utils/constants';
import { PkInputComponent } from '../../common/components/pk-input.component';
import { PkInputDirective } from '../../common/directives/pk-input.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { PkButtonComponent } from '../../common/components/pk-button.component';
import { NgIcon } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/components/pk-icon-button.component';

export interface CardFormValues {
  source: string;
  target: string;
  targetAlt: string | null;
}

@Component({
  selector: 'pk-new-cards-form',
  imports: [
    PkCardDirective,
    ReactiveFormsModule,
    PkInputComponent,
    PkInputDirective,
    TranslatePipe,
    PkButtonComponent,
    NgIcon,
    PkIconButtonComponent,
  ],
  providers: [],
  styles: `
    .card-form,
    .part-1,
    .part-2 {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .part-1,
    .part-2,
    pk-input {
      flex-grow: 1;
    }

    .card-form pk-icon-button {
      position: relative;
      top: 0.2rem;
    }

    .number {
      width: 30px;
      text-align: center;
    }

    .only-sm {
      display: block;

      @media (min-width: 960px) {
        display: none;
      }
    }

    .only-lg {
      display: none;

      @media (min-width: 960px) {
        display: block;
      }
    }

    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `,
  template: `
    <div pkCard>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        @for (card of cards; let idx = $index; track idx) {
          <div [formGroup]="card" class="card-form">
            <div class="part-1">
              <span class="number">{{ cardCount() + idx + 1 }}</span>
              <pk-icon-button class="only-sm" variant="default" (clicked)="removeCard(idx)">
                <ng-icon name="tablerTrash" size="1.2rem" />
              </pk-icon-button>
              <pk-input width="100%" [error]="getError(idx, 'source') | translate">
                <input
                  pkInput
                  type="text"
                  [placeholder]="'cards.source' | translate"
                  [attr.aria-label]="'cards.source' | translate"
                  formControlName="source" />
              </pk-input>
              <pk-input width="100%" [error]="getError(idx, 'target') | translate">
                <input
                  pkInput
                  type="text"
                  [placeholder]="'cards.target' | translate"
                  [attr.aria-label]="'cards.target' | translate"
                  formControlName="target" />
              </pk-input>
            </div>
            <div class="part-2">
              @if (hasTargetAlt()) {
                <pk-input width="100%" [error]="getError(idx, 'targetAlt') | translate">
                  <input
                    pkInput
                    type="text"
                    [placeholder]="'cards.alternative' | translate"
                    [attr.aria-label]="'cards.alternative' | translate"
                    formControlName="targetAlt" />
                </pk-input>
              }
              <pk-icon-button
                class="only-lg"
                variant="default"
                (clicked)="removeCard(idx)"
                [tooltip]="'cards.deleteCard' | translate">
                <ng-icon name="tablerTrash" size="1.2rem" />
              </pk-icon-button>
            </div>
          </div>
          <hr class="only-sm" />
        }
        <div class="actions">
          <div class="left">
            <pk-button
              variant="outline"
              [iconPrefix]="true"
              [disabled]="cardCount() + cards.length >= MAX_CARD_COUNT"
              (clicked)="addCard()">
              <ng-icon name="tablerPlus" />
              {{ 'cards.addCard' | translate }}
            </pk-button>
          </div>
          <div class="right">
            @if (cards.length > 0) {
              <pk-button variant="filled" type="submit" [disabled]="form.invalid">
                {{ 'cards.saveNewCards' | translate }}
              </pk-button>
            }
          </div>
        </div>
      </form>
    </div>
  `,
})
export class NewCardsFormComponent {
  public cardCount = input.required<number>();
  public hasTargetAlt = input.required<boolean>();
  public importedValues = input<CardFormValues[] | null>(null);
  public saveCards = output<CardFormValues[]>();
  public form: FormGroup;
  public readonly MAX_CARD_COUNT = MAX_CARD_COUNT;

  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      cards: this.formBuilder.array([]),
    });

    effect(() => {
      if (this.importedValues()) {
        this.form.reset();
        const cards = this.form.get('cards') as FormArray;
        this.importedValues()?.forEach(() => {
          cards.push(this.cardFormGroup());
        });
        setTimeout(() => {
          this.form.patchValue({ cards: this.importedValues() });
        });
      } else {
        this.form.reset();
      }
    });
  }

  public get cards(): FormGroup[] {
    return (this.form.get('cards') as FormArray).controls as FormGroup[];
  }

  public onSubmit(): void {
    this.saveCards.emit(this.form.value.cards);
  }

  public addCard(): void {
    const cards = this.form.get('cards') as FormArray;
    cards.push(this.cardFormGroup());
    setTimeout(() => {
      document
        .getElementById('deck-editor-cards-container')
        ?.scrollBy({ top: 200, behavior: 'smooth' });
    });
  }

  public removeCard(index: number): void {
    const cards = this.form.get('cards') as FormArray;
    cards.removeAt(index);
  }

  public getError(index: number, formControlName: string): string {
    const control = (this.form?.get('cards') as FormArray).at(index).get(formControlName);
    if (!control?.dirty || control?.untouched) {
      return '';
    }
    if (control?.errors?.['required']) {
      return 'validationErrors.STRING_REQUIRED';
    } else if (control?.errors?.['maxlength']) {
      return 'validationErrors.MAX_LENGTH';
    }
    return '';
  }

  private cardFormGroup = () =>
    this.formBuilder.group({
      source: [
        '',
        [
          Validators.required,
          Validators.minLength(MIN_CARD_CONTENT_LENGTH),
          Validators.maxLength(MAX_CARD_CONTENT_LENGTH),
        ],
      ],
      target: [
        '',
        [
          Validators.required,
          Validators.minLength(MIN_CARD_CONTENT_LENGTH),
          Validators.maxLength(MAX_CARD_CONTENT_LENGTH),
        ],
      ],
      targetAlt: [
        '',
        [
          Validators.minLength(MIN_CARD_CONTENT_LENGTH),
          Validators.maxLength(MAX_CARD_CONTENT_LENGTH),
        ],
      ],
    });
}
