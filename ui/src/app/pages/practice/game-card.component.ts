import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'pk-game-card',
  imports: [NgClass],
  providers: [],
  styles: `
    button {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-default);
      padding: 1.5rem 1rem;
      background: none;
      width: 100%;
      font-size: 1.2rem;

      &.success {
        border-color: var(--color-success);
        color: var(--color-success);
        box-shadow: 0 0 3px 2px var(--color-success);
      }

      &.miss {
        border-color: var(--color-error);
        color: var(--color-error);
        box-shadow: 0 0 3px 2px var(--color-error);
      }

      &.info {
        border-color: var(--color-info);
        color: var(--color-info);
        box-shadow: 0 0 3px 2px var(--color-info);
      }

      &.selected {
        border-color: var(--color-border);
        color: var(--color-text-stronger);
        box-shadow: 0 0 3px 2px var(--color-border);
      }
    }
  `,
  template: `
    <button
      [ngClass]="{ success: success(), miss: miss(), info: info(), selected: selected() }"
      (click)="clicked.emit()">
      {{ text() }}
    </button>
  `,
})
export class GameCardComponent {
  public lang = input.required<string>();
  public text = input.required<string>();
  public altText = input<string>();
  public success = input.required<boolean>();
  public miss = input.required<boolean>();
  public info = input.required<boolean>();
  public selected = input<boolean>();
  public clicked = output<void>();
}
