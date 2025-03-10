import { Component, input, output, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { PkCardDirective } from '../../common/directives/pk-card.directive';
import { PkIconButtonComponent } from '../../common/components/pk-icon-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Deck } from '../../../../../common/types/decks';
import { UUID } from '../../../../../common/types/misc';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { InfoMessageComponent } from '../../common/components/info-message.component';

@Component({
  selector: 'pk-deck-card',
  imports: [
    NgIcon,
    PkCardDirective,
    PkIconButtonComponent,
    TranslatePipe,
    DatePipe,
    InfoMessageComponent,
  ],
  providers: [],
  styles: `
    .card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1.5rem;
      gap: 0.5rem;
    }

    .title {
      display: flex;
      align-items: center;
      gap: 1rem;
      height: 2.5rem;

      h2 {
        margin: 0;
        color: var(--color-text-accent);
        cursor: pointer;
      }

      .actions {
        display: flex;
        gap: 0.2rem;
      }
    }

    .stats {
      padding: 1rem 0;
    }

    .right {
      padding-right: 0;

      @media (min-width: 600px) {
        padding-right: 1rem;
      }
    }

    .flag {
      width: 40px;
      height: 40px;
    }
  `,
  template: `
    <div pkCard class="card">
      <div class="left">
        <div class="title">
          <img
            class="flag"
            [src]="'assets/' + deck().targetLang + '.png'"
            [alt]="'supportedLanguages.' + deck().targetLang | translate" />
          <h2 class="name" (click)="onEdit()">
            {{ deck().name }}
          </h2>
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
        </div>
        <div class="stats">
          @if (deck().cardCount < 10) {
            <pk-info-message
              type="warning"
              [message]="'decks.needTenCardsToPractice' | translate" />
          }
          <p>
            <span>{{ 'decks.numberOfCards' | translate: { count: deck().cardCount } }}, </span>
            <span>{{ 'decks.lastPracticed' | translate }}: </span>
            <span>{{ deck().lastPracticed ? (deck().lastPracticed | date) : '-' }}</span>
          </p>
        </div>
      </div>
      <div class="right">
        <pk-icon-button
          variant="filled"
          [tooltip]="'pages.practice' | translate"
          [disabled]="deck().cardCount < 10"
          (clicked)="onPractice()">
          <ng-icon name="tablerPlayerPlay" size="2rem" />
        </pk-icon-button>
      </div>
    </div>
  `,
})
export class DeckCardComponent {
  public deck = input.required<Deck>();
  public delete = output<UUID>();
  public edit = output<UUID>();
  public isConfirmMode = signal<boolean>(false);
  public date = new Date();

  constructor(private router: Router) {}

  public onPractice(): void {
    this.router.navigate(['/practice', this.deck().id]);
  }

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
