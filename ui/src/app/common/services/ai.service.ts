import { computed, Injectable } from '@angular/core';
import { Store } from '../../utils/store';
import { ApiService } from './api.service';
import { ApiRoutes } from '../../utils/constants';
import { tap } from 'rxjs/operators';
import { GenerateCardsRequest, GenerateCardsResponse } from '../../../../../common/types/ai';
import { Observable } from 'rxjs';

interface AiState {
  loading: boolean;
}

const initialState: AiState = {
  loading: false,
};

@Injectable({ providedIn: 'root' })
export class AiService extends Store<AiState> {
  public loading = computed(() => this.state().loading);

  constructor(private apiService: ApiService) {
    super(initialState);
  }

  public generateCards(request: GenerateCardsRequest): Observable<GenerateCardsResponse> {
    this.setState({ loading: true });
    return this.apiService
      .post<GenerateCardsRequest, GenerateCardsResponse>(ApiRoutes.AI_GENERATE, request)
      .pipe(
        tap({
          next: () => this.setState({ loading: false }),
          error: () => this.setState({ loading: false }),
        })
      );
  }
}
