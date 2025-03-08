import { Injectable } from '@angular/core';
import { ApiService } from '../../common/services/api.service';
import { PracticeRequest } from '../../../../../common/types/practice';
import { ApiRoutes } from '../../utils/constants';
import { NotificationService } from '../../common/services/notification.service';
import { parseError } from '../../utils/parse-error';

@Injectable({ providedIn: 'root' })
export class PracticeService {
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  public savePractice(request: PracticeRequest): void {
    this.apiService.post(ApiRoutes.PRACTICE, request).subscribe({
      error: e => {
        this.notificationService.showError('', parseError(e));
      },
    });
  }
}
