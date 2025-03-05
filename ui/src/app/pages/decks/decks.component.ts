import { Component, Signal } from '@angular/core';
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

@Component({
  selector: 'pk-decks',
  imports: [
    PkPageContentDirective,
    TranslatePipe,
    PkButtonComponent,
    NgIcon,
    PkLoaderComponent,
    DeckCardComponent,
  ],
  providers: [],
  styles: `
    .loading {
      display: flex;
      justify-content: center;
      padding-top: 30%;
      color: var(--color-primary);
    }
  `,
  template: `
    <div pkPageContent>
      @if (loading()) {
        <div class="loading">
          <pk-loader />
        </div>
      } @else {
        <pk-button [iconPrefix]="true" (clicked)="createNewDeck()">
          <ng-icon name="tablerPlus" />
          {{ 'decks.createNew' | translate }}
        </pk-button>
        @for (deck of decks(); track deck.id) {
          <pk-deck-card [deck]="deck" (edit)="editDeck($event)" (delete)="deleteDeck($event)" />
        }
      }
    </div>
  `,
})
export class DecksComponent {
  public decks: Signal<Deck[]>;
  public loading: Signal<boolean>;

  constructor(
    private decksService: DecksService,
    private notificationService: NotificationService,
    private appBarService: AppBarService,
    private router: Router
  ) {
    this.decks = this.decksService.decks;
    this.loading = this.decksService.loading;
    this.decksService.fetchDecks();
    this.appBarService.setTitle('pages.decks');
    this.appBarService.setBackRoute(['/']);
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
}
