import { Component, computed, OnInit, signal } from '@angular/core';
import { PkPageContentDirective } from '../../common/directives/pk-page-content.directive';
import { AppBarService } from '../../common/services/app-bar.service';
import { DecksService } from '../decks/decks.service';
import { parseError } from '../../utils/parse-error';
import { NotificationService } from '../../common/services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { DeckWithCards } from '../../../../../common/types/decks';
import { PkLoaderComponent } from '../../common/components/pk-loader.component';
import { GamesComponent } from './games.component';
import { PracticeRequest } from '../../../../../common/types/practice';
import { PracticeService } from './practice.service';
import { GamesService } from './games.service';

@Component({
  selector: 'pk-practice',
  imports: [PkPageContentDirective, PkLoaderComponent, GamesComponent],
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
      } @else if (deck()) {
        <pk-games [deck]="deck()!" (result)="onSaveResult($event)" />
      }
    </div>
  `,
})
export class PracticeComponent implements OnInit {
  public deck = signal<DeckWithCards | null>(null);
  public loading = computed(() => this.decksService.loading() || this.gamesService.loading());

  constructor(
    private appBarService: AppBarService,
    private decksService: DecksService,
    private practiceService: PracticeService,
    private gamesService: GamesService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute
  ) {
    this.appBarService.setTitle('pages.practice');
    this.appBarService.setBackRoute(['/decks']);
  }

  ngOnInit() {
    this.appBarService.setBackRoute(['/decks']);
    this.activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.getDeckWithCards(id);
    });
  }

  public onSaveResult(result: PracticeRequest): void {
    this.practiceService.savePractice(result);
  }

  private getDeckWithCards(id: string): void {
    this.decksService.getDeck(id).subscribe({
      next: deck => {
        this.deck.set(deck);
        this.appBarService.setTitle(deck.name);
      },
      error: e =>
        this.notificationService.showError('errorNotifications.couldNotFetchDeck', parseError(e)),
    });
  }
}
