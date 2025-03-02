import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface CardFormValues {
  source: string;
  target: string;
  targetAlt: string | null;
}

import { Component, output } from '@angular/core';
import {
  MAX_CARD_CONTENT_LENGTH,
  MIN_CARD_CONTENT_LENGTH,
} from '../../../../../common/validators/cards';
import { PkCardDirective } from '../../common/directives/pk-card.directive';

@Component({
  selector: 'pk-new-cards-form',
  imports: [PkCardDirective, ReactiveFormsModule],
  providers: [],
  styles: ``,
  template: `
    <div pkCard>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        @for (card of cards; let idx = $index; track idx) {
          <div class="card-form"></div>
        }
        <div class="actions"></div>
      </form>
    </div>
  `,
})
export class NewCardsFormComponent {
  public saveCards = output<CardFormValues[]>();
  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      cards: this.formBuilder.array([]),
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
    cards.push(
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
      })
    );
  }

  public removeCard(index: number): void {
    const cards = this.form.get('cards') as FormArray;
    cards.removeAt(index);
  }

  public hasError(index: number, formControlName: string): boolean {
    const control = (this.form?.get('cards') as FormArray).at(index).get(formControlName);
    return (control?.errors && (control?.dirty || !control?.untouched)) ?? false;
  }
}
