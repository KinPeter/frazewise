import { computed, Injectable } from '@angular/core';
import {
  BulkCardsRequest,
  BulkCardsResponse,
  Card,
  UpdateCardRequest,
} from '../../../../../common/types/cards';
import { Store } from '../../utils/store';
import { ApiService } from '../../common/services/api.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiRoutes } from '../../utils/constants';
import { IdObject, UUID } from '../../../../../common/types/misc';

interface CardsState {
  loading: boolean;
}

const initialState: CardsState = {
  loading: false,
};

@Injectable({ providedIn: 'root' })
export class CardsService extends Store<CardsState> {
  public loading = computed(() => this.state().loading);

  constructor(private apiService: ApiService) {
    super(initialState);
  }

  public bulkCreate(request: BulkCardsRequest): Observable<BulkCardsResponse> {
    this.setState({ loading: true });
    return this.apiService.post<BulkCardsRequest, BulkCardsResponse>(ApiRoutes.CARDS, request).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    );
  }

  public update(id: UUID, card: UpdateCardRequest): Observable<Card> {
    this.setState({ loading: true });
    return this.apiService.put<UpdateCardRequest, Card>(`${ApiRoutes.CARDS}/${id}`, card).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    );
  }

  public delete(id: UUID): Observable<IdObject> {
    this.setState({ loading: true });
    return this.apiService.delete<IdObject>(`${ApiRoutes.CARDS}/${id}`).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    );
  }
}
