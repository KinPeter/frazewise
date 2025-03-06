import {
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { DeckWithCards } from '../../../../../common/types/decks';
import { BulkCardsRequest } from '../../../../../common/types/cards';
import { MAX_CARD_COUNT } from '../../../../../common/utils/constants';
import { PkInputComponent } from '../../common/components/pk-input.component';
import { PkInputDirective } from '../../common/directives/pk-input.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { CardFormValues, NewCardsFormComponent } from './new-cards-form.component';
import { NgIcon } from '@ng-icons/core';
import { PkButtonComponent } from '../../common/components/pk-button.component';

@Component({
  selector: 'pk-import-cards',
  imports: [
    PkInputComponent,
    PkInputDirective,
    TranslatePipe,
    NewCardsFormComponent,
    NgIcon,
    PkButtonComponent,
  ],
  providers: [],
  styles: `
    p {
      margin-bottom: 1rem;
    }

    p ng-icon {
      position: relative;
      top: 3px;
    }

    .paste-area {
      margin-bottom: 1rem;
    }
  `,
  template: `
    <h2>{{ 'cards.importFromSheets' | translate }}</h2>
    <p>{{ 'cards.importFromSheetsInfo' | translate }}</p>
    <pk-input width="100%" class="paste-area">
      <textarea
        pkInput
        [placeholder]="'cards.pasteHere' | translate"
        rows="4"
        (input)="onPaste($event)"></textarea>
    </pk-input>
    <h2>{{ 'cards.importExportedDeck' | translate }}</h2>
    <p>{{ 'cards.importExportedDeckInfo' | translate }}</p>
    <pk-button variant="outline" [iconPrefix]="true" (clicked)="onImportClick()">
      <ng-icon name="tablerFileUpload" size="1.2rem" />
      {{ 'cards.importFromFile' | translate }}
    </pk-button>
    <input
      type="file"
      accept=".json, application/json"
      (change)="onFileSelected($event)"
      style="display: none;"
      #fileInput />
    <hr />
    @if (isFull()) {
      <p class="warning">
        <ng-icon name="tablerAlertTriangle" size="1.2rem" />
        {{ 'cards.deckIsFull' | translate }}
      </p>
    } @else {
      <p class="info">
        <ng-icon name="tablerInfoCircle" size="1.2rem" />
        {{ 'cards.remainingCount' | translate: { count: remainingCount() } }}
      </p>
    }
    @if (errorMessage()) {
      <p class="error">
        <ng-icon name="tablerAlertTriangle" size="1.2rem" />
        {{ errorMessage() | translate }}
      </p>
    }
    @if (formValues()) {
      <p class="success">
        <ng-icon name="tablerCheck" size="1.2rem" />
        {{ 'cards.importSuccess' | translate }}
      </p>
      <pk-new-cards-form
        [cardCount]="deck().cardCount"
        [hasTargetAlt]="deck().hasTargetAlt"
        [importedValues]="formValues()"
        (saveCards)="onSaveCards($event)" />
    }
  `,
})
export class ImportCardsComponent {
  public deck = input.required<DeckWithCards>();
  public saveNewCards = output<BulkCardsRequest>();
  public readonly MAX_CARD_COUNT = MAX_CARD_COUNT;
  public formValues: WritableSignal<CardFormValues[] | null> = signal(null);
  public remainingCount = computed(
    () => this.MAX_CARD_COUNT - (this.deck().cardCount + (this.formValues()?.length ?? 0))
  );
  public isFull = computed(
    () => this.deck().cardCount + (this.formValues()?.length ?? 0) >= this.MAX_CARD_COUNT
  );
  public errorMessage = signal<string>('');
  public fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  public onPaste($event: Event): void {
    try {
      const text = ($event.target as HTMLTextAreaElement).value;
      if (text) {
        const cards = text.split('\n').map(line => line.split('\t'));
        const pasteResult: CardFormValues[] = cards.map(card => ({
          source: card[0],
          target: card[1],
          targetAlt: this.deck().hasTargetAlt ? (card[2]?.length ? card[2] : null) : null,
        }));
        let formValues = pasteResult;
        if (pasteResult.length > this.remainingCount()) {
          formValues = pasteResult.slice(0, this.remainingCount());
        }
        this.formValues.set(formValues);
        this.errorMessage.set('');
      }
    } catch (e) {
      console.error(e);
      this.errorMessage.set('cards.unableToImport');
    }
  }

  public onImportClick(): void {
    const fileInput = this.fileInput()?.nativeElement;
    this.errorMessage.set('');
    if (fileInput) {
      fileInput.click();
    }
  }

  public onFileSelected(event: Event): void {
    try {
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) return;
      const file = input.files[0];
      if (file.type !== 'application/json') {
        this.errorMessage.set('cards.unableToImport');
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const text = (e.target?.result as string) || '';
          const parsed = JSON.parse(text);
          if (!Array.isArray(parsed) || parsed.some(card => !card.source || !card.target)) {
            this.errorMessage.set('cards.unableToImport');
            return;
          }
          const result = parsed.map(card => ({
            source: card.source,
            target: card.target,
            targetAlt: this.deck().hasTargetAlt
              ? card.targetAlt.length
                ? card.targetAlt
                : null
              : null,
          }));
          let formValues = result;
          if (result.length > this.remainingCount()) {
            formValues = result.slice(0, this.remainingCount());
          }
          this.formValues.set(formValues);
          this.errorMessage.set('');
        } catch (e) {
          console.error(e);
          this.errorMessage.set('cards.unableToImport');
        }
      };
      reader.readAsText(file);
    } catch (e) {
      console.error(e);
      this.errorMessage.set('cards.unableToImport');
    }
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
}
