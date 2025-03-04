import { Component, effect, input, output, signal } from '@angular/core';
import { Card, UpdateCardRequest } from '../../../../../common/types/cards';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAX_CARD_CONTENT_LENGTH,
  MIN_CARD_CONTENT_LENGTH,
} from '../../../../../common/validators/cards';
import { PkCardDirective } from '../../common/directives/pk-card.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { PkInputComponent } from '../../common/components/pk-input.component';
import { PkInputDirective } from '../../common/directives/pk-input.directive';
import { NgIcon } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/components/pk-icon-button.component';
import { UUID } from '../../../../../common/types/misc';

@Component({
  selector: 'pk-editable-card',
  imports: [
    PkCardDirective,
    TranslatePipe,
    ReactiveFormsModule,
    PkInputComponent,
    PkInputDirective,
    NgIcon,
    PkIconButtonComponent,
  ],
  providers: [],
  styles: `
    .form,
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

    pk-icon-button {
      position: relative;
      top: 0.2rem;
    }

    .number {
      width: 30px;
      text-align: center;
    }
  `,
  template: `
    <div pkCard>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form">
          <div class="part-1">
            <span class="number">{{ number() }}</span>
            <pk-input width="100%" [error]="getError('source') | translate">
              <input
                pkInput
                type="text"
                [placeholder]="'cards.source' | translate"
                [attr.aria-label]="'cards.source' | translate"
                formControlName="source" />
            </pk-input>
            <pk-input width="100%" [error]="getError('target') | translate">
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
              <pk-input width="100%" [error]="getError('targetAlt') | translate">
                <input
                  pkInput
                  type="text"
                  [placeholder]="'cards.alternative' | translate"
                  [attr.aria-label]="'cards.alternative' | translate"
                  formControlName="targetAlt" />
              </pk-input>
            }
            @if (isConfirmMode()) {
              <pk-icon-button
                variant="default"
                (clicked)="onCancelDelete()"
                [tooltip]="'common.cancel' | translate">
                <ng-icon name="tablerX" size="1.2rem" />
              </pk-icon-button>
              <pk-icon-button
                variant="outline"
                (clicked)="onConfirmDelete()"
                [tooltip]="'common.confirm' | translate">
                <ng-icon name="tablerCheck" size="1.2rem" />
              </pk-icon-button>
            } @else {
              <pk-icon-button
                variant="default"
                (clicked)="onDelete()"
                [tooltip]="'cards.deleteCard' | translate">
                <ng-icon name="tablerTrash" size="1.2rem" />
              </pk-icon-button>
              <pk-icon-button
                variant="filled"
                type="submit"
                [tooltip]="'cards.saveCard' | translate"
                [disabled]="form.invalid || !form.dirty">
                <ng-icon name="tablerDeviceFloppy" size="1.2rem" />
              </pk-icon-button>
            }
          </div>
        </div>
      </form>
    </div>
  `,
})
export class EditableCardComponent {
  public card = input.required<Card>();
  public number = input.required<number>();
  public hasTargetAlt = input.required<boolean>();
  public updateCard = output<UpdateCardRequest & { id: UUID }>();
  public deleteCard = output<UUID>();
  public form: FormGroup;
  public isConfirmMode = signal<boolean>(false);

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

  public getError(formControlName: string): string {
    const control = this.form?.get(formControlName);
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

  public onSubmit(): void {
    this.updateCard.emit({ ...this.card(), ...this.form.value });
  }

  public onDelete(): void {
    this.isConfirmMode.set(true);
  }

  public onCancelDelete(): void {
    this.isConfirmMode.set(false);
  }

  public onConfirmDelete(): void {
    this.deleteCard.emit(this.card().id);
  }
}
