import { computed, Injectable } from '@angular/core';
import { Store } from '../../utils/store';
import { Deck, DeckRequest, DeckWithCards } from '../../../../../common/types/decks';
import { IdObject, UUID } from '../../../../../common/types/misc';
import { NotificationService } from '../../common/services/notification.service';
import { ApiService } from '../../common/services/api.service';
import { ApiRoutes } from '../../utils/constants';
import { parseError } from '../../utils/parse-error';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface DecksState {
  decks: Deck[];
  loading: boolean;
}

const initialState: DecksState = {
  decks: [],
  loading: false,
};

@Injectable({ providedIn: 'root' })
export class DecksService extends Store<DecksState> {
  public loading = computed(() => this.state().loading);
  public decks = computed(() => this.state().decks);

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    super(initialState);
  }

  public fetchDecks(): void {
    this.setState({ loading: true });
    this.apiService.get<Deck[]>(ApiRoutes.DECKS).subscribe({
      next: res => {
        this.setState({
          decks: res,
          loading: false,
        });
      },
      error: err => {
        this.notificationService.showError(
          'errorNotifications.couldNotFetchDecks',
          parseError(err)
        );
        this.setState({ loading: false });
      },
    });
  }

  public getDeck(id: UUID): Observable<DeckWithCards> {
    this.setState({ loading: true });
    return this.apiService.get<DeckWithCards>(ApiRoutes.DECKS + `/${id}`).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    );
  }

  public create(request: DeckRequest): Observable<Deck> {
    this.setState({ loading: true });
    return this.apiService.post<DeckRequest, Deck>(ApiRoutes.DECKS, request).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    );
  }

  public update(id: UUID, request: DeckRequest): Observable<Deck> {
    this.setState({ loading: true });
    return this.apiService.put<DeckRequest, Deck>(ApiRoutes.DECKS + `/${id}`, request).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    );
  }

  public delete(id: UUID): Observable<IdObject> {
    this.setState({ loading: true });
    return this.apiService.delete<IdObject>(ApiRoutes.DECKS + `/${id}`).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    );
  }
}
