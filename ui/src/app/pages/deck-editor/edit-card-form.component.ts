import { Component, effect, input } from '@angular/core';
import { Card } from '../../../../../common/types/cards';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAX_CARD_CONTENT_LENGTH,
  MIN_CARD_CONTENT_LENGTH,
} from '../../../../../common/validators/cards';

@Component({
  selector: 'pk-edit-card-form',
  imports: [],
  providers: [],
  styles: ``,
  template: ``,
})
export class EditCardFormComponent {
  public card = input.required<Card>();
  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
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

    effect(() => {
      if (this.card()) {
        const { source, target, targetAlt } = this.card() as Card;
        this.form.setValue({ source, target, targetAlt });
      }
    });
  }

  public hasError(formControlName: string): boolean {
    const control = this.form?.get(formControlName);
    return (control?.errors && (control?.dirty || !control?.untouched)) ?? false;
  }

  public onSubmit(): void {
    // update card
  }
}
