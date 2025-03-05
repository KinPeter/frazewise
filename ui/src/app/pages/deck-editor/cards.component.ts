import { Component, computed, input, output } from '@angular/core';
import { EditableCardComponent } from './editable-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { DeckWithCards } from '../../../../../common/types/decks';
import { UpdateCardRequest } from '../../../../../common/types/cards';
import { UUID } from '../../../../../common/types/misc';

@Component({
  selector: 'pk-cards',
  imports: [EditableCardComponent, TranslatePipe],
  providers: [],
  styles: ``,
  template: `
    <div class="container">
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
  `,
})
export class CardsComponent {
  public deck = input.required<DeckWithCards>();
  public deleteCard = output<UUID>();
  public updateCard = output<UpdateCardRequest & { id: UUID }>();
  public cards = computed(() => this.deck().cards);
}
