import { Component, OnInit, Signal, signal } from '@angular/core';
import { PkPageContentDirective } from '../../common/directives/pk-page-content.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { DecksService } from '../decks/decks.service';
import { ActivatedRoute } from '@angular/router';
import { Deck } from '../../../../../common/types/decks';
import { NotificationService } from '../../common/services/notification.service';
import { parseError } from '../../utils/parse-error';
import { PkLoaderComponent } from '../../common/components/pk-loader.component';
import { DeckFormComponent } from '../decks/deck-form.component';

@Component({
  selector: 'pk-deck-editor',
  imports: [PkPageContentDirective, TranslatePipe, PkLoaderComponent, DeckFormComponent],
  providers: [],
  styles: `
    .deck-loading {
      display: flex;
      justify-content: center;
      padding-top: 10%;
      color: var(--color-primary);
    }
  `,
  template: `
    <div pkPageContent>
      @if (deckLoading()) {
        <div class="deck-loading">
          <pk-loader />
        </div>
      } @else {
        <h1>
          {{
            isNew()
              ? ('pages.newDeck' | translate)
              : ('pages.editDeck' | translate: { name: deckToEdit()?.name ?? '' })
          }}
        </h1>
        <pk-deck-form [deck]="deckToEdit()" />
      }
    </div>
  `,
})
export class DeckEditorComponent implements OnInit {
  public isNew = signal(false);
  public deckToEdit = signal<Deck | null>(null);
  public deckLoading: Signal<boolean>;
  public cardsLoading: Signal<boolean>;

  constructor(
    private decksService: DecksService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.deckLoading = this.decksService.loading;
    this.cardsLoading = signal(false); // TODO connect to cards loading
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const { id } = params;
      if (id === 'new') {
        this.isNew.set(true);
      } else {
        this.isNew.set(false);
        this.decksService.getDeck(id).subscribe({
          next: deck => this.deckToEdit.set(deck),
          error: e =>
            this.notificationService.showError(
              'errorNotifications.couldNotFetchDeck',
              parseError(e)
            ),
        });
      }
    });
  }
}
