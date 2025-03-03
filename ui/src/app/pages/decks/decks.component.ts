import { Component, Signal } from '@angular/core';
import { PkPageContentDirective } from '../../common/directives/pk-page-content.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { DecksService } from './decks.service';
import { Deck } from '../../../../../common/types/decks';
import { PkCardDirective } from '../../common/directives/pk-card.directive';
import { PkButtonComponent } from '../../common/components/pk-button.component';
import { Router } from '@angular/router';
import { UUID } from '../../../../../common/types/misc';
import { PkIconButtonComponent } from '../../common/components/pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';
import { PkLoaderComponent } from '../../common/components/pk-loader.component';

@Component({
  selector: 'pk-decks',
  imports: [
    PkPageContentDirective,
    TranslatePipe,
    PkCardDirective,
    PkButtonComponent,
    PkIconButtonComponent,
    NgIcon,
    PkLoaderComponent,
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
        <h1>{{ 'pages.decks' | translate }}</h1>
        <pk-button [iconPrefix]="true" (clicked)="createNewDeck()">
          <ng-icon name="tablerPlus" />
          {{ 'decks.createNew' | translate }}
        </pk-button>
        @for (deck of decks(); track deck.id) {
          <div pkCard>
            <h2>{{ deck.name }}</h2>
            <pk-icon-button (clicked)="editDeck(deck.id)">
              <ng-icon name="tablerEdit" />
            </pk-icon-button>
          </div>
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
    private router: Router
  ) {
    this.decks = this.decksService.decks;
    this.loading = this.decksService.loading;
    this.decksService.fetchDecks();
  }

  public createNewDeck(): void {
    this.router.navigate(['deck', 'new']);
  }

  public editDeck(id: UUID): void {
    this.router.navigate(['deck', id]);
  }
}
