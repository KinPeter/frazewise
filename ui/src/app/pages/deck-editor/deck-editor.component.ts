import { Component, computed, OnInit, Signal, signal } from '@angular/core';
import { PkPageContentDirective } from '../../common/directives/pk-page-content.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { DecksService } from '../decks/decks.service';
import { ActivatedRoute } from '@angular/router';
import { DeckWithCards } from '../../../../../common/types/decks';
import { NotificationService } from '../../common/services/notification.service';
import { parseError } from '../../utils/parse-error';
import { PkLoaderComponent } from '../../common/components/pk-loader.component';
import { DeckFormComponent } from './deck-form.component';
import { CardsComponent } from './cards.component';

@Component({
  selector: 'pk-deck-editor',
  imports: [
    PkPageContentDirective,
    TranslatePipe,
    PkLoaderComponent,
    DeckFormComponent,
    CardsComponent,
  ],
  providers: [],
  styles: `
    .deck-loading {
      display: flex;
      justify-content: center;
      padding-top: 10%;
      color: var(--color-primary);
    }

    .cards-container {
      background-color: var(--color-bg);
      padding: 0.5rem;
      height: calc(100vh - 200px);
      overflow-y: auto;
      border-radius: var(--radius-sm);
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
        <pk-deck-form
          [deck]="deckToEdit()"
          [isNew]="isNew()"
          (hasTargetAltChanged)="hasTargetAltOnForm.set($event)" />
        <div class="cards-container" id="deck-editor-cards-container">
          <pk-cards [loadedCards]="deckToEdit()?.cards ?? []" [hasTargetAlt]="hasTargetAlt()" />
        </div>
      }
    </div>
  `,
})
export class DeckEditorComponent implements OnInit {
  public isNew = signal(false);
  public deckToEdit = signal<DeckWithCards | null>(null);
  public deckLoading: Signal<boolean>;
  public cardsLoading: Signal<boolean>;
  public hasTargetAltOnForm = signal(false);

  constructor(
    private decksService: DecksService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.deckLoading = this.decksService.loading;
    this.cardsLoading = signal(false); // TODO connect to cards loading
  }

  public hasTargetAlt: Signal<boolean> = computed(() => {
    if (!this.isNew() && this.deckToEdit()) {
      return this.deckToEdit()!.hasTargetAlt;
    }
    return this.hasTargetAltOnForm();
  });

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
