import { Component, effect, signal, Signal, WritableSignal } from '@angular/core';
import { PkPageContentDirective } from '../../common/directives/pk-page-content.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { DecksService } from './decks.service';
import { Deck } from '../../../../../common/types/decks';
import { PkButtonComponent } from '../../common/components/pk-button.component';
import { Router } from '@angular/router';
import { UUID } from '../../../../../common/types/misc';
import { NgIcon } from '@ng-icons/core';
import { PkLoaderComponent } from '../../common/components/pk-loader.component';
import { DeckCardComponent } from './deck-card.component';
import { NotificationService } from '../../common/services/notification.service';
import { parseError } from '../../utils/parse-error';
import { AppBarService } from '../../common/services/app-bar.service';
import { PkInputComponent } from '../../common/components/pk-input.component';
import { PkInputDirective } from '../../common/directives/pk-input.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { PkIconButtonComponent } from '../../common/components/pk-icon-button.component';

@Component({
  selector: 'pk-decks',
  imports: [
    PkPageContentDirective,
    TranslatePipe,
    PkButtonComponent,
    NgIcon,
    PkLoaderComponent,
    DeckCardComponent,
    PkInputComponent,
    PkInputDirective,
    ReactiveFormsModule,
    PkIconButtonComponent,
  ],
  providers: [],
  styles: `
    .loading {
      display: flex;
      justify-content: center;
      padding-top: 30%;
      color: var(--color-primary);
    }

    .toolbar {
      padding: 0.5rem 2px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      overflow-x: auto;

      pk-button {
        display: none;
        min-width: 182px;
        margin-top: 4px;
      }

      pk-icon-button {
        display: block;
        margin-top: 4px;
      }

      @media screen and (min-width: 630px) {
        pk-button {
          display: block;
        }
        pk-icon-button {
          display: none;
        }
      }
    }
  `,
  template: `
    <div pkPageContent>
      @if (loading()) {
        <div class="loading">
          <pk-loader />
        </div>
      } @else {
        <div class="toolbar">
          <pk-button [iconPrefix]="true" (clicked)="createNewDeck()">
            <ng-icon name="tablerPlus" />
            {{ 'decks.createNew' | translate }}
          </pk-button>
          <pk-icon-button
            variant="filled"
            [tooltip]="'decks.createNew' | translate"
            (clicked)="createNewDeck()">
            <ng-icon name="tablerPlus" size="1.6rem" />
          </pk-icon-button>
          <pk-input width="250px">
            <input
              pkInput
              type="text"
              [placeholder]="'common.search' | translate"
              (input)="search($event)" />
          </pk-input>
        </div>
        @for (deck of decks(); track deck.id) {
          <pk-deck-card [deck]="deck" (edit)="editDeck($event)" (delete)="deleteDeck($event)" />
        }
      }
    </div>
  `,
})
export class DecksComponent {
  public allDecks: Signal<Deck[]>;
  public decks: WritableSignal<Deck[]> = signal([]);
  public loading: Signal<boolean>;
  private debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private decksService: DecksService,
    private notificationService: NotificationService,
    private appBarService: AppBarService,
    private router: Router
  ) {
    this.allDecks = this.decksService.decks;
    this.loading = this.decksService.loading;
    this.decksService.fetchDecks();
    this.appBarService.setTitle('pages.decks');
    this.appBarService.setBackRoute(['/']);

    effect(() => {
      this.decks.set([...this.decksService.decks()]);
    });
  }

  public createNewDeck(): void {
    this.router.navigate(['deck', 'new']);
  }

  public editDeck(id: UUID): void {
    this.router.navigate(['deck', id]);
  }

  public deleteDeck(id: UUID): void {
    this.decksService.delete(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('successNotifications.deckDeleted');
        this.decksService.fetchDecks();
      },
      error: e =>
        this.notificationService.showError('errorNotifications.couldNotDeleteDeck', parseError(e)),
    });
  }

  public search(event: Event): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(() => {
      const target = event.target as HTMLInputElement;
      const value = target.value;
      if (value) {
        this.decks.set(
          this.allDecks().filter(deck => deck.name.toLowerCase().includes(value.toLowerCase()))
        );
      } else {
        this.decks.set(this.allDecks());
      }
    }, 300);
  }
}
