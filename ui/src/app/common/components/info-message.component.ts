import { Component, computed, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

type MessageType = 'info' | 'warning' | 'error' | 'success';

@Component({
  selector: 'pk-info-message',
  imports: [NgIcon],
  providers: [],
  styles: `
    p {
      margin-bottom: 1rem;
    }

    p ng-icon {
      position: relative;
      top: 3px;
    }
  `,
  template: `
    <p [class]="type()">
      <ng-icon [name]="iconName()" size="1.2rem" />
      {{ message() }}
    </p>
  `,
})
export class InfoMessageComponent {
  public type = input.required<MessageType>();
  public message = input.required<string>();
  public iconName = computed(() => {
    switch (this.type()) {
      case 'info':
        return 'tablerInfoCircle';
      case 'warning':
        return 'tablerAlertTriangle';
      case 'error':
        return 'tablerExclamationCircle';
      case 'success':
        return 'tablerCircleCheck';
      default:
        return 'tablerInfoCircle';
    }
  });
}
