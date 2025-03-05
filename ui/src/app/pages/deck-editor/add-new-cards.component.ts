import { Component, input, output } from '@angular/core';
import { DeckWithCards } from '../../../../../common/types/decks';
import { CardFormValues, NewCardsFormComponent } from './new-cards-form.component';
import { MAX_CARD_COUNT } from '../../../../../common/utils/constants';
import { BulkCardsRequest } from '../../../../../common/types/cards';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'pk-add-new-cards',
  imports: [NewCardsFormComponent, TranslatePipe],
  providers: [],
  styles: ``,
  template: `
    @if (deck().cards.length < MAX_CARD_COUNT) {
      <pk-new-cards-form
        [hasTargetAlt]="deck().hasTargetAlt"
        [cardCount]="deck().cardCount"
        (saveCards)="onBulkSave($event)" />
    } @else {
      <p>{{ 'decks.deckIsFull' | translate }}</p>
    }
  `,
})
export class AddNewCardsComponent {
  public deck = input.required<DeckWithCards>();
  public saveNewCards = output<BulkCardsRequest>();
  public readonly MAX_CARD_COUNT = MAX_CARD_COUNT;

  public onBulkSave(cards: CardFormValues[]): void {
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
