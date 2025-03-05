import { Component } from '@angular/core';
import { PkButtonComponent } from '../../common/components/pk-button.component';
import { PkCardDirective } from '../../common/directives/pk-card.directive';
import { PkIconButtonComponent } from '../../common/components/pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PkInputComponent } from '../../common/components/pk-input.component';
import { PkInputDirective } from '../../common/directives/pk-input.directive';
import { PkPageContentDirective } from '../../common/directives/pk-page-content.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { AppBarService } from '../../common/services/app-bar.service';

@Component({
  selector: 'pk-home',
  imports: [
    PkButtonComponent,
    PkCardDirective,
    PkIconButtonComponent,
    NgIcon,
    NgTemplateOutlet,
    FormsModule,
    PkInputComponent,
    PkInputDirective,
    PkPageContentDirective,
    TranslatePipe,
  ],
  providers: [],
  styles: ``,
  template: `
    <div pkPageContent>
      <h2>Home</h2>
      <div
        [style]="{
          width: '100%',
          backgroundColor: 'var(--color-bg)',
          padding: '0.5rem 1rem',
          margin: '2rem 0',
        }">
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <div [style]="{ width: '100%', padding: '2rem 0' }">
          <div pkCard>
            <h3>Hello from heading 3</h3>

            <p>
              <b>This is a card with bold</b>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor labore laudantium nam
              perspiciatis recusandae. Cumque dignissimos dolore, dolores doloribus facilis hic illo
              iusto magni possimus praesentium, provident, vitae. Ab animi deleniti excepturi,
              minima provident quaerat saepe tempore velit vitae voluptatum. A culpa cupiditate
              deleniti dolorem ea enim facere ipsa ipsam itaque necessitatibus nemo odio
              perferendis, porro quia recusandae rerum similique suscipit vel vero voluptatum.
              <a href="/decks">A link to decks</a>
            </p>
            <hr />
            <ng-container *ngTemplateOutlet="buttonsAndInputs"></ng-container>
          </div>
        </div>

        <h3>Background 2</h3>
        <hr />
        <ng-container *ngTemplateOutlet="buttonsAndInputs"></ng-container>
      </div>

      <ng-container *ngTemplateOutlet="buttonsAndInputs"></ng-container>
    </div>

    <ng-template #buttonsAndInputs>
      <div [style]="{ display: 'flex', gap: '1rem', marginBottom: '1rem', marginTop: '1rem' }">
        <pk-button variant="default">Default</pk-button>
        <pk-button variant="filled">Filled</pk-button>
        <pk-button variant="link">Link</pk-button>
        <pk-button variant="outline">Outline</pk-button>
        <pk-button variant="subtle">Subtle</pk-button>
      </div>
      <div [style]="{ display: 'flex', gap: '1rem', marginBottom: '1rem' }">
        <pk-button variant="default" [disabled]="true">Default</pk-button>
        <pk-button variant="filled" [disabled]="true">Filled</pk-button>
        <pk-button variant="link" [disabled]="true">Link</pk-button>
        <pk-button variant="outline" [disabled]="true">Outline</pk-button>
        <pk-button variant="subtle" [disabled]="true">Subtle</pk-button>
      </div>
      <div [style]="{ display: 'flex', gap: '1rem', marginBottom: '1rem' }">
        <pk-icon-button variant="default"><ng-icon name="tablerHash" size="1rem" /></pk-icon-button>
        <pk-icon-button variant="filled"><ng-icon name="tablerHash" size="1rem" /></pk-icon-button>
        <pk-icon-button variant="outline"><ng-icon name="tablerHash" size="1rem" /></pk-icon-button>
        <pk-icon-button variant="subtle"><ng-icon name="tablerHash" size="1rem" /></pk-icon-button>
        <pk-icon-button variant="ghost"><ng-icon name="tablerHash" size="1rem" /></pk-icon-button>
      </div>
      <div [style]="{ display: 'flex', gap: '1rem', marginBottom: '1rem' }">
        <pk-icon-button variant="default" [accent]="true"
          ><ng-icon name="tablerHash" size="1rem"
        /></pk-icon-button>
        <pk-icon-button variant="filled" [accent]="true"
          ><ng-icon name="tablerHash" size="1rem"
        /></pk-icon-button>
        <pk-icon-button variant="outline" [accent]="true"
          ><ng-icon name="tablerHash" size="1rem"
        /></pk-icon-button>
        <pk-icon-button variant="subtle" [accent]="true"
          ><ng-icon name="tablerHash" size="1rem"
        /></pk-icon-button>
        <pk-icon-button variant="ghost" [accent]="true"
          ><ng-icon name="tablerHash" size="1rem"
        /></pk-icon-button>
      </div>
      <div [style]="{ display: 'flex', gap: '1rem', marginBottom: '1rem' }">
        <pk-icon-button variant="default" [disabled]="true"
          ><ng-icon name="tablerHash" size="1rem"
        /></pk-icon-button>
        <pk-icon-button variant="filled" [disabled]="true"
          ><ng-icon name="tablerHash" size="1rem"
        /></pk-icon-button>
        <pk-icon-button variant="outline" [disabled]="true"
          ><ng-icon name="tablerHash" size="1rem"
        /></pk-icon-button>
        <pk-icon-button variant="subtle" [disabled]="true"
          ><ng-icon name="tablerHash" size="1rem"
        /></pk-icon-button>
        <pk-icon-button variant="ghost" [disabled]="true"
          ><ng-icon name="tablerHash" size="1rem"
        /></pk-icon-button>
      </div>
      <pk-input label="With label" [withAsterisk]="true" width="250px">
        <input pkInput type="text" value="hello" />
      </pk-input>
      <pk-input width="250px">
        <input pkInput type="text" placeholder="with placeholder" />
      </pk-input>
      <pk-input width="250px" [disabled]="true">
        <input pkInput type="text" placeholder="disabled" value="disabled" />
      </pk-input>
      <pk-input width="250px" [error]="'and one with error'">
        <input pkInput type="text" placeholder="disabled" value="value" />
      </pk-input>
      <pk-input label="Select" width="250px" type="select">
        <select pkInput name="category">
          <option [value]="1">Something</option>
          <option [value]="2">Something else</option>
          <option [value]="3">Something other</option>
          <option [value]="4">Something more</option>
        </select>
      </pk-input>
      <p [style]="{ fontWeight: 'bold' }">
        <span [style]="{ color: 'var(--color-info)' }">Info color </span>
        <span [style]="{ color: 'var(--color-success)' }">Success color </span>
        <span [style]="{ color: 'var(--color-warning)' }">Warning color </span>
        <span [style]="{ color: 'var(--color-error)' }">Error color </span>
      </p>
    </ng-template>
  `,
})
export class HomeComponent {
  constructor(private appBarService: AppBarService) {
    this.appBarService.setTitle('FrazeWise');
    this.appBarService.clearBackRoute();
  }
}
