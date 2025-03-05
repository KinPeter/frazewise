import { Component, computed, input, output } from '@angular/core';
import { EditableCardComponent } from './editable-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { MAX_CARD_COUNT } from '../../../../../common/utils/constants';
import { CardFormValues, NewCardsFormComponent } from './new-cards-form.component';
import { DeckWithCards } from '../../../../../common/types/decks';
import { BulkCardsRequest, UpdateCardRequest } from '../../../../../common/types/cards';
import { UUID } from '../../../../../common/types/misc';

@Component({
  selector: 'pk-cards',
  imports: [EditableCardComponent, TranslatePipe, NewCardsFormComponent],
  providers: [],
  styles: ``,
  template: `
    <div class="container">
      <div class="loaded-cards">
        @if (cards().length === 0) {
          <p>{{ 'decks.noCards' | translate }}</p>
        }
        @for (card of cards(); let idx = $index; track card.id) {
          <pk-editable-card
            [card]="card"
            [number]="idx + 1"
            [hasTargetAlt]="deck().hasTargetAlt"
            (updateCard)="updateCard.emit($event)"
            (deleteCard)="deleteCard.emit($event)" />
        }
      </div>
      @if (cards().length < MAX_CARD_COUNT) {
        <pk-new-cards-form
          [hasTargetAlt]="deck().hasTargetAlt"
          [cardCount]="deck().cardCount"
          (saveCards)="onBulkSave($event)" />
      }
    </div>
  `,
})
export class CardsComponent {
  public deck = input.required<DeckWithCards>();
  public saveNewCards = output<BulkCardsRequest>();
  public deleteCard = output<UUID>();
  public updateCard = output<UpdateCardRequest & { id: UUID }>();
  public readonly MAX_CARD_COUNT = MAX_CARD_COUNT;

  public cards = computed(() => this.deck().cards);

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
