import { Component } from '@angular/core';
import { PkPageContentDirective } from '../../common/components/pk-page-content.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'pk-decks',
  imports: [PkPageContentDirective, TranslatePipe],
  providers: [],
  styles: ``,
  template: `
    <div pkPageContent>
      <h1>{{ 'pages.decks' | translate }}</h1>
    </div>
  `,
})
export class DecksComponent {}
