import { AfterViewInit, Component, input, output, signal } from '@angular/core';
import { EditableCardComponent } from './editable-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { DeckWithCards } from '../../../../../common/types/decks';
import { Card, UpdateCardRequest } from '../../../../../common/types/cards';
import { UUID } from '../../../../../common/types/misc';
import { InfoMessageComponent } from '../../common/components/info-message.component';
import { MAX_CARD_COUNT } from '../../../../../common/utils/constants';
import { PkInputComponent } from '../../common/components/pk-input.component';
import { PkInputDirective } from '../../common/directives/pk-input.directive';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pk-cards',
  imports: [
    EditableCardComponent,
    TranslatePipe,
    InfoMessageComponent,
    PkInputComponent,
    PkInputDirective,
    FormsModule,
  ],
  providers: [],
  styles: `
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  `,
  template: `
    <div class="container">
      @if (deck().cards.length === 0) {
        <pk-info-message type="info" [message]="'decks.noCards' | translate" />
      } @else {
        <div class="toolbar">
          <pk-info-message
            type="info"
            [message]="
              'cards.nCardsInThisDeck'
                | translate: { count: deck().cards.length, total: MAX_CARD_COUNT }
            " />
          <pk-input width="250px">
            <input
              pkInput
              type="text"
              [placeholder]="'common.search' | translate"
              (input)="onInput($event)" />
          </pk-input>
        </div>
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
export class CardsComponent implements AfterViewInit {
  public deck = input.required<DeckWithCards>();
  public deleteCard = output<UUID>();
  public updateCard = output<UpdateCardRequest & { id: UUID }>();
  public readonly MAX_CARD_COUNT = MAX_CARD_COUNT;
  private debounceTimeout: ReturnType<typeof setTimeout> | null = null;
  public cards = signal<Card[]>([]);

  ngAfterViewInit() {
    this.cards.set([...this.deck().cards]);
  }

  public onInput(event: Event): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(() => {
      const value = (event.target as HTMLInputElement).value;
      if (value === '') {
        this.cards.set([...this.deck().cards]);
      } else {
        this.cards.set([
          ...this.deck().cards.filter(card => {
            const source = card.source.toLocaleLowerCase();
            const target = card.target.toLocaleLowerCase();
            const targetAlt = card.targetAlt?.toLocaleLowerCase() ?? '';
            const searchTerm = value.toLocaleLowerCase();

            return (
              source.includes(searchTerm) ||
              target.includes(searchTerm) ||
              targetAlt.includes(searchTerm)
            );
          }),
        ]);
      }
    }, 300);
  }
}
