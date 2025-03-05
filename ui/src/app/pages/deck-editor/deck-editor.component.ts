import { Component, OnInit, Signal, signal } from '@angular/core';
import { PkPageContentDirective } from '../../common/directives/pk-page-content.directive';
import { DecksService } from '../decks/decks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeckRequest, DeckWithCards } from '../../../../../common/types/decks';
import { NotificationService } from '../../common/services/notification.service';
import { parseError } from '../../utils/parse-error';
import { PkLoaderComponent } from '../../common/components/pk-loader.component';
import { DeckFormComponent } from './deck-form.component';
import { CardsComponent } from './cards.component';
import { CardsService } from './cards.service';
import { BulkCardsRequest, UpdateCardRequest } from '../../../../../common/types/cards';
import { UUID } from '../../../../../common/types/misc';
import { AppBarService } from '../../common/services/app-bar.service';
import { CardsTab, CardsToolbarComponent } from './cards-toolbar.component';
import { AddNewCardsComponent } from './add-new-cards.component';
import { ImportCardsComponent } from './import-cards.component';

@Component({
  selector: 'pk-deck-editor',
  imports: [
    PkPageContentDirective,
    PkLoaderComponent,
    DeckFormComponent,
    CardsComponent,
    CardsToolbarComponent,
    AddNewCardsComponent,
    ImportCardsComponent,
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
      height: calc(100vh - 220px);
      overflow-y: auto;
      border-radius: var(--radius-sm);
    }
  `,
  template: `
    <div pkPageContent>
      @if (deckLoading() || cardsLoading()) {
        <div class="deck-loading">
          <pk-loader />
        </div>
      } @else {
        <pk-deck-form [deck]="deckToEdit()" [isNew]="isNew()" (save)="saveDeck($event)" />
        @if (!isNew() && deckToEdit()) {
          <pk-cards-toolbar (tabChanged)="setTab($event)" />
          <div class="cards-container" id="deck-editor-cards-container">
            @switch (tab()) {
              @case ('cards') {
                <pk-cards
                  [deck]="deckToEdit()!"
                  (updateCard)="updateCard($event)"
                  (deleteCard)="deleteCard($event)" />
              }
              @case ('addNew') {
                <pk-add-new-cards [deck]="deckToEdit()!" (saveNewCards)="saveNewCards($event)" />
              }
              @case ('import') {
                <pk-import-cards [deck]="deckToEdit()!" (saveNewCards)="saveNewCards($event)" />
              }
            }
          </div>
        }
      }
    </div>
  `,
})
export class DeckEditorComponent implements OnInit {
  public isNew = signal(false);
  public deckToEdit = signal<DeckWithCards | null>(null);
  public tab = signal<CardsTab>('cards');
  public deckLoading: Signal<boolean>;
  public cardsLoading: Signal<boolean>;

  constructor(
    private decksService: DecksService,
    private cardsService: CardsService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private appBarService: AppBarService,
    private router: Router
  ) {
    this.deckLoading = this.decksService.loading;
    this.cardsLoading = this.cardsService.loading;
  }

  ngOnInit() {
    this.appBarService.setBackRoute(['/decks']);
    this.activatedRoute.params.subscribe(params => {
      const { id } = params;
      if (id === 'new') {
        this.isNew.set(true);
        this.appBarService.setTitle('pages.newDeck');
      } else {
        this.isNew.set(false);
        this.getDeckWithCards(id);
      }
    });
  }

  public setTab(tab: CardsTab): void {
    this.tab.set(tab);
  }

  public saveDeck(values: DeckRequest): void {
    const deckToEdit = this.deckToEdit();
    if (!deckToEdit) {
      this.decksService.create(values).subscribe({
        next: res => {
          this.notificationService.showSuccess('successNotifications.deckCreated');
          this.router.navigate(['/deck', res.id]);
        },
        error: e =>
          this.notificationService.showError(
            'errorNotifications.couldNotCreateDeck',
            parseError(e)
          ),
      });
    } else {
      this.decksService.update(deckToEdit.id, values).subscribe({
        next: () => {
          this.notificationService.showSuccess('successNotifications.deckUpdated');
          this.getDeckWithCards(deckToEdit.id);
        },
        error: e =>
          this.notificationService.showError(
            'errorNotifications.couldNotUpdateDeck',
            parseError(e)
          ),
      });
    }
  }

  public saveNewCards(req: BulkCardsRequest): void {
    this.cardsService.bulkCreate(req).subscribe({
      next: () => {
        this.notificationService.showSuccess('successNotifications.cardsCreated');
        this.getDeckWithCards(this.deckToEdit()!.id);
      },
      error: e =>
        this.notificationService.showError('errorNotifications.couldNotCreateCards', parseError(e)),
    });
  }

  public updateCard(card: UpdateCardRequest & { id: UUID }): void {
    this.cardsService.update(card.id, card).subscribe({
      next: () => {
        this.notificationService.showSuccess('successNotifications.cardUpdated');
        this.getDeckWithCards(this.deckToEdit()!.id);
      },
      error: e =>
        this.notificationService.showError('errorNotifications.couldNotUpdateCard', parseError(e)),
    });
  }

  public deleteCard(id: string): void {
    this.cardsService.delete(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('successNotifications.cardDeleted');
        this.getDeckWithCards(this.deckToEdit()!.id);
      },
      error: e =>
        this.notificationService.showError('errorNotifications.couldNotDeleteCard', parseError(e)),
    });
  }

  private getDeckWithCards(id: string): void {
    this.decksService.getDeck(id).subscribe({
      next: deck => {
        this.deckToEdit.set(deck);
        this.appBarService.setTitle(deck.name);
        this.setTab('cards');
      },
      error: e =>
        this.notificationService.showError('errorNotifications.couldNotFetchDeck', parseError(e)),
    });
  }
}
