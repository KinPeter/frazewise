import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiErrorMap } from '../../../common/enums/api-errors';

@Component({
  selector: 'pk-root',
  imports: [RouterOutlet],
  template: `
    <h1>Welcome to {{ title }}!</h1>
    {{ ApiErrorMap.EXPIRED_AUTH_TOKEN }}

    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'FrazeWise';
  protected readonly ApiErrorMap = ApiErrorMap;
}
