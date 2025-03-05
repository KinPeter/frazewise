import { Component } from '@angular/core';
import { PkPageContentDirective } from '../../common/directives/pk-page-content.directive';
import { AppBarService } from '../../common/services/app-bar.service';

@Component({
  selector: 'pk-practice',
  imports: [PkPageContentDirective],
  providers: [],
  styles: ``,
  template: ` <div pkPageContent>TODO</div> `,
})
export class PracticeComponent {
  constructor(private appBarService: AppBarService) {
    this.appBarService.setTitle('pages.practice');
    this.appBarService.setBackRoute(['/']);
  }
}
