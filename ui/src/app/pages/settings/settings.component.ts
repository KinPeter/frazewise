import { Component } from '@angular/core';
import { PkPageContentDirective } from '../../common/directives/pk-page-content.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'pk-settings',
  imports: [PkPageContentDirective, TranslatePipe],
  providers: [],
  styles: ``,
  template: `
    <div pkPageContent>
      <h1>{{ 'pages.settings' | translate }}</h1>
    </div>
  `,
})
export class SettingsComponent {}
