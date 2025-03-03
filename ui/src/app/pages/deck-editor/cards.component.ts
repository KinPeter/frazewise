import { Component, input } from '@angular/core';
import { Card } from '../../../../../common/types/cards';
import { EditableCardComponent } from './editable-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { MAX_CARD_COUNT } from '../../../../../common/validators/cards';
import { NewCardsFormComponent } from './new-cards-form.component';

@Component({
  selector: 'pk-cards',
  imports: [EditableCardComponent, TranslatePipe, NewCardsFormComponent],
  providers: [],
  styles: ``,
  template: `
    <div class="container">
      <div class="loaded-cards">
        @if (loadedCards().length === 0) {
          <p>{{ 'decks.noCards' | translate }}</p>
        }
        @for (card of loadedCards(); let idx = $index; track card.id) {
          <pk-editable-card [card]="card" [number]="idx + 1" [hasTargetAlt]="hasTargetAlt()" />
        }
      </div>
      @if (loadedCards().length < MAX_CARD_COUNT) {
        <pk-new-cards-form [hasTargetAlt]="hasTargetAlt()" [cardCount]="loadedCards().length" />
      }
    </div>
  `,
})
export class CardsComponent {
  public loadedCards = input.required<Card[]>();
  public hasTargetAlt = input.required<boolean>();
  protected readonly MAX_CARD_COUNT = MAX_CARD_COUNT;
}
