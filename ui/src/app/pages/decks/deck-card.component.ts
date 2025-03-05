import { Component, input, output, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { PkCardDirective } from '../../common/directives/pk-card.directive';
import { PkIconButtonComponent } from '../../common/components/pk-icon-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Deck } from '../../../../../common/types/decks';
import { UUID } from '../../../../../common/types/misc';

@Component({
  selector: 'pk-deck-card',
  imports: [NgIcon, PkCardDirective, PkIconButtonComponent, TranslatePipe],
  providers: [],
  styles: `
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }
  `,
  template: `
    <div pkCard>
      <header>
        <h2>{{ deck().name }}</h2>
        <div class="actions">
          @if (isConfirmMode()) {
            <pk-icon-button
              variant="default"
              (clicked)="onCancelDelete()"
              [tooltip]="'common.cancel' | translate">
              <ng-icon name="tablerX" size="1.2rem" />
            </pk-icon-button>
            <pk-icon-button
              variant="outline"
              (clicked)="onConfirmDelete()"
              [tooltip]="'common.confirm' | translate">
              <ng-icon name="tablerCheck" size="1.2rem" />
            </pk-icon-button>
          } @else {
            <pk-icon-button
              variant="default"
              (clicked)="onDelete()"
              [tooltip]="'decks.deleteThis' | translate">
              <ng-icon name="tablerTrash" size="1.2rem" />
            </pk-icon-button>
            <pk-icon-button
              variant="default"
              [tooltip]="'decks.editThis' | translate"
              (clicked)="onEdit()">
              <ng-icon name="tablerEdit" size="1.2rem" />
            </pk-icon-button>
          }
        </div>
      </header>
    </div>
  `,
})
export class DeckCardComponent {
  public deck = input.required<Deck>();
  public delete = output<UUID>();
  public edit = output<UUID>();
  public isConfirmMode = signal<boolean>(false);

  public onEdit(): void {
    this.edit.emit(this.deck().id);
  }

  public onDelete(): void {
    this.isConfirmMode.set(true);
  }

  public onCancelDelete(): void {
    this.isConfirmMode.set(false);
  }

  public onConfirmDelete(): void {
    this.delete.emit(this.deck().id);
  }
}
