import { Component, effect, input, output } from '@angular/core';
import { Deck, DeckRequest } from '../../../../../common/types/decks';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { supportedLanguages } from '../../../../../common/constants/languages';
import { CustomValidators } from '../../utils/custom-validators';
import { PkInputComponent } from '../../common/components/pk-input.component';
import { PkInputDirective } from '../../common/directives/pk-input.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { PkCheckboxComponent } from '../../common/components/pk-checkbox.component';
import { PkCheckboxDirective } from '../../common/directives/pk-checkbox.directive';
import { NgIcon } from '@ng-icons/core';
import { MAX_DECK_NAME_LENGTH, MIN_DECK_NAME_LENGTH } from '../../../../../common/validators/decks';
import { PkIconButtonComponent } from '../../common/components/pk-icon-button.component';

@Component({
  selector: 'pk-deck-form',
  imports: [
    ReactiveFormsModule,
    PkInputComponent,
    PkInputDirective,
    TranslatePipe,
    PkCheckboxComponent,
    PkCheckboxDirective,
    NgIcon,
    PkIconButtonComponent,
  ],
  providers: [],
  styles: `
    form {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;

      .name {
        flex-grow: 1;
      }

      .languages {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: center;

        .source-target {
          display: flex;
          gap: 1rem;
        }
      }

      .alternative {
        .info-icon {
          color: var(--color-accent);
          position: relative;
          top: 4px;
        }
      }
    }
  `,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="name">
        <pk-input
          [label]="'decks.name' | translate"
          width="100%"
          [withAsterisk]="true"
          [error]="getError('name') | translate">
          <input pkInput formControlName="name" type="text" />
        </pk-input>
      </div>
      <div class="languages">
        <div class="source-target">
          <pk-input
            [label]="'decks.sourceLang' | translate"
            [withAsterisk]="true"
            [disabled]="!isNew()"
            [error]="getError('sourceLang') | translate"
            width="150px"
            type="select">
            <select pkInput name="sourceLang" formControlName="sourceLang">
              @for (item of languageOptions; track item.value) {
                <option [value]="item.value">{{ item.label }}</option>
              }
            </select>
          </pk-input>
          <pk-input
            [label]="'decks.targetLang' | translate"
            [withAsterisk]="true"
            [disabled]="!isNew()"
            [error]="getError('targetLang') | translate"
            width="150px"
            type="select">
            <select pkInput name="targetLang" formControlName="targetLang">
              @for (item of languageOptions; track item.value) {
                <option [value]="item.value">{{ item.label }}</option>
              }
            </select>
          </pk-input>
        </div>
        <div class="alternative">
          <pk-checkbox [label]="'decks.alternative' | translate" [disabled]="!isNew()">
            <input pkCheckbox type="checkbox" formControlName="hasTargetAlt" />
          </pk-checkbox>
          <ng-icon name="tablerInfoCircle" class="info-icon" size="1.2rem" />
        </div>
        <div class="actions">
          <pk-icon-button
            variant="filled"
            type="submit"
            [tooltip]="'common.save' | translate"
            [disabled]="form.untouched || !form.dirty || form.invalid">
            <ng-icon name="tablerDeviceFloppy" size="1.2rem" />
          </pk-icon-button>
        </div>
      </div>
    </form>
  `,
})
export class DeckFormComponent {
  public isNew = input.required<boolean>();
  public deck = input.required<Deck | null>();
  public save = output<DeckRequest>();
  public form: FormGroup;
  public supportedLanguageCodes = Array.from(supportedLanguages.keys());
  public languageOptions = Array.from(supportedLanguages.entries()).map(([code, { name }]) => ({
    value: code,
    label: name,
  }));

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(MIN_DECK_NAME_LENGTH),
          Validators.maxLength(MAX_DECK_NAME_LENGTH),
        ],
      ],
      sourceLang: ['', [Validators.required, CustomValidators.oneOf(this.supportedLanguageCodes)]],
      targetLang: ['', [Validators.required, CustomValidators.oneOf(this.supportedLanguageCodes)]],
      hasTargetAlt: [false, Validators.required],
    });

    effect(() => {
      if (this.deck()) {
        const { name, sourceLang, targetLang, hasTargetAlt } = this.deck() as Deck;
        this.form.setValue({
          name,
          sourceLang,
          targetLang,
          hasTargetAlt,
        });
      } else {
        this.resetForm();
      }
    });
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

  public onSubmit(): void {
    this.save.emit(this.form.value);
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      sourceLang: '',
      targetLang: '',
      hasTargetAlt: false,
    });
  }
}
