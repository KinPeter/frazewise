import { computed, effect, Injectable } from '@angular/core';
import { Store } from '../../utils/store';

export enum MessageType {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

export interface Notification {
  type: MessageType;
  message: string;
  date: Date;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

@Injectable({ providedIn: 'root' })
export class NotificationService extends Store<NotificationState> {
  constructor() {
    super(initialState);

    // FIXME remove when notifications are displayed
    effect(() => {
      console.log('[Notifications]', this.notifications());
    });
  }

  public notifications = computed(() => this.state().notifications);

  public clearState(): void {
    this.setState({
      notifications: [],
    });
  }

  public showError(message: string): void {
    this.setState({
      notifications: [
        {
          type: MessageType.ERROR,
          date: new Date(),
          message,
        },
        ...this.state().notifications,
      ],
    });
  }

  public showWarning(message: string): void {
    this.setState({
      notifications: [
        {
          type: MessageType.WARNING,
          date: new Date(),
          message,
        },
        ...this.state().notifications,
      ],
    });
  }

  public showSuccess(message: string): void {
    this.setState({
      notifications: [
        {
          type: MessageType.SUCCESS,
          date: new Date(),
          message,
        },
        ...this.state().notifications,
      ],
    });
  }

  public showInfo(message: string): void {
    this.setState({
      notifications: [
        {
          type: MessageType.INFO,
          date: new Date(),
          message,
        },
        ...this.state().notifications,
      ],
    });
  }
}
